"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface ScatterPieceData {
  id: number;
  src: string;
  alt: string;
  desktop: { x: number; y: number; rotate: number; scale: number };
  mobile: { x: number; y: number; rotate: number; scale: number };
  size: string;
  floatClass?: string;
  delay?: string;
}

interface InteractiveScatterLayerProps {
  pieces: ScatterPieceData[];
  isMobile: boolean;
  isScattered: boolean;
  activeFlavourId: string;
  onResetTrigger?: number; // increments when packet is clicked to spring back
}

interface PiecePhysicsState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  scale: number;
  isDragging: boolean;
  isThrown: boolean;
  originX: number;
  originY: number;
  originRot: number;
  baseScale: number;
}

interface PointerRecord {
  x: number;
  y: number;
  time: number;
}

export default function InteractiveScatterLayer({
  pieces,
  isMobile,
  isScattered,
  activeFlavourId,
  onResetTrigger = 0,
}: InteractiveScatterLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Maintain physics state in a ref to avoid React render lag during 60fps animations
  const physicsRef = useRef<Map<number, PiecePhysicsState>>(new Map());
  // Render state triggers UI updates
  const [renderPositions, setRenderPositions] = useState<{
    [id: number]: { x: number; y: number; rotation: number; scale: number; isDragging: boolean };
  }>({});

  const pointerHistoryRef = useRef<Map<number, PointerRecord[]>>(new Map());
  const activePointerIdRef = useRef<Map<number, number>>(new Map());
  const animFrameRef = useRef<number | null>(null);
  const isResettingRef = useRef<boolean>(false);
  const resetProgressRef = useRef<number>(1);
  const prevFlavourRef = useRef<string>(activeFlavourId);
  const prevIsMobileRef = useRef<boolean>(isMobile);
  const [isBursting, setIsBursting] = useState<boolean>(false);
  const isBurstingRef = useRef<boolean>(false);
  const isScatteredRef = useRef<boolean>(isScattered);

  useEffect(() => {
    isScatteredRef.current = isScattered;
  }, [isScattered]);

  // Manage burst-out state when scattering starts
  useEffect(() => {
    if (isScattered) {
      setIsBursting(true);
      isBurstingRef.current = true;
      const timer = setTimeout(() => {
        setIsBursting(false);
        isBurstingRef.current = false;
      }, 550);
      return () => clearTimeout(timer);
    } else {
      setIsBursting(false);
      isBurstingRef.current = false;
    }
  }, [isScattered]);

  // Initialize or re-anchor positions
  // resetToOrigin: true when switching flavours or first mount; false to keep pieces wherever user left them
  // smooth: true when clicking packet to trigger spring recall
  const initPositions = useCallback(
    (resetToOrigin = true, smooth = false) => {
      if (resetToOrigin) {
        physicsRef.current.clear();
      }
      const newMap = new Map<number, PiecePhysicsState>();
      const newRenderState: {
        [id: number]: { x: number; y: number; rotation: number; scale: number; isDragging: boolean };
      } = {};

      pieces.forEach((piece) => {
        const coords = isMobile ? piece.mobile : piece.desktop;
        const current = physicsRef.current.get(piece.id);

        const originX = coords.x;
        const originY = coords.y;
        const originRot = coords.rotate;
        const baseScale = coords.scale;

        // Preserve current user-dragged position unless switching flavours or explicitly resetting
        const startX = resetToOrigin ? originX : (current ? current.x : originX);
        const startY = resetToOrigin ? originY : (current ? current.y : originY);
        const startRot = resetToOrigin ? originRot : (current ? current.rotation : originRot);

        newMap.set(piece.id, {
          id: piece.id,
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          rotation: startRot,
          vRot: 0,
          scale: baseScale,
          isDragging: false,
          isThrown: false,
          originX,
          originY,
          originRot,
          baseScale,
        });

        newRenderState[piece.id] = {
          x: startX,
          y: startY,
          rotation: startRot,
          scale: baseScale,
          isDragging: false,
        };
      });

      physicsRef.current = newMap;
      setRenderPositions(newRenderState);

      if (smooth) {
        isResettingRef.current = true;
        resetProgressRef.current = 0;
      }
    },
    [pieces, isMobile]
  );

  // Initial load
  useEffect(() => {
    initPositions(true, false);
  }, []);

  // ONLY reset positions when the flavour genuinely changes or screen mode flips
  useEffect(() => {
    if (prevFlavourRef.current !== activeFlavourId || prevIsMobileRef.current !== isMobile) {
      prevFlavourRef.current = activeFlavourId;
      prevIsMobileRef.current = isMobile;
      initPositions(true, false);
    }
  }, [activeFlavourId, isMobile, initPositions]);

  // Smooth spring back to default constellation when user clicks the packet
  useEffect(() => {
    if (onResetTrigger > 0) {
      initPositions(false, true);
    }
  }, [onResetTrigger, initPositions]);

  // Main 60fps Physics & Float Loop across entire #flavours section
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap delta time to 50ms
      lastTime = currentTime;

      const container = containerRef.current;
      const section = container
        ? (container.closest<HTMLElement>("#flavours") || document.getElementById("flavours"))
        : null;

      // Dynamic Section-Wide Boundaries relative to packet center
      let minX = -600;
      let maxX = 600;
      let minY = -360;
      let maxY = 380;

      if (container && section) {
        const cRect = container.getBoundingClientRect();
        const sRect = section.getBoundingClientRect();
        const cX = cRect.left + cRect.width / 2;
        const cY = cRect.top + cRect.height / 2;

        const padX = 35;
        const padY = 35;
        minX = (sRect.left - cX) + padX;
        maxX = (sRect.right - cX) - padX;
        minY = (sRect.top - cY) + padY;
        maxY = (sRect.bottom - cY) - padY;
      }

      let hasChanges = false;
      const nextRender: {
        [id: number]: { x: number; y: number; rotation: number; scale: number; isDragging: boolean };
      } = {};

      const map = physicsRef.current;

      // While smoothly retracting behind packet (!isScatteredRef.current) or bursting outward (isBurstingRef.current),
      // allow GPU-accelerated CSS transitions to run uninterrupted at native refresh rate
      if (!isScatteredRef.current || isBurstingRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      // Handle resetting spring back to origin
      if (isResettingRef.current) {
        resetProgressRef.current += dt * 3.5;
        const t = Math.min(resetProgressRef.current, 1);

        map.forEach((state) => {
          state.x = state.x + (state.originX - state.x) * Math.min(dt * 8, 0.35);
          state.y = state.y + (state.originY - state.y) * Math.min(dt * 8, 0.35);
          state.rotation = state.rotation + (state.originRot - state.rotation) * Math.min(dt * 8, 0.35);
          state.scale = state.baseScale;
          state.vx = 0;
          state.vy = 0;
          state.vRot = 0;
          state.isThrown = false;

          nextRender[state.id] = {
            x: state.x,
            y: state.y,
            rotation: state.rotation,
            scale: state.scale,
            isDragging: false,
          };
        });

        if (t >= 1) {
          isResettingRef.current = false;
        }
        hasChanges = true;
      } else {
        // Standard Physics & Ambient Zero-G Float
        map.forEach((state) => {
          if (state.isDragging) {
            // Dragging is updated directly in pointermove for 0-latency tracking
            nextRender[state.id] = {
              x: state.x,
              y: state.y,
              rotation: state.rotation,
              scale: state.baseScale * 1.15,
              isDragging: true,
            };
            hasChanges = true;
            return;
          }

          if (state.isThrown) {
            // Apply velocity & angular momentum
            state.x += state.vx;
            state.y += state.vy;
            state.rotation += state.vRot;

            // Air friction damping
            state.vx *= 0.94;
            state.vy *= 0.94;
            state.vRot *= 0.95;

            // Bounce off section boundary walls with restitution
            if (state.x < minX) {
              state.x = minX;
              state.vx = -state.vx * 0.65;
              state.vRot *= -0.7;
            } else if (state.x > maxX) {
              state.x = maxX;
              state.vx = -state.vx * 0.65;
              state.vRot *= -0.7;
            }

            if (state.y < minY) {
              state.y = minY;
              state.vy = -state.vy * 0.65;
              state.vRot *= -0.7;
            } else if (state.y > maxY) {
              state.y = maxY;
              state.vy = -state.vy * 0.65;
              state.vRot *= -0.7;
            }

            // If speed has dissipated, stop throw and smoothly enter ambient floating where it landed
            if (Math.hypot(state.vx, state.vy) < 0.22) {
              state.isThrown = false;
              state.vx = 0;
              state.vy = 0;
              state.vRot = 0;
            }

            nextRender[state.id] = {
              x: state.x,
              y: state.y,
              rotation: state.rotation,
              scale: state.baseScale,
              isDragging: false,
            };
            hasChanges = true;
          } else {
            // Ambient organic zero-gravity drift around its current resting spot
            const timeSec = currentTime * 0.001;
            const seed = state.id * 1.618;
            const driftVx = Math.sin(timeSec * 1.1 + seed) * 0.35;
            const driftVy = Math.cos(timeSec * 0.85 + seed * 1.3) * 0.35;
            const driftVRot = Math.sin(timeSec * 0.75 + seed) * 0.12;

            state.x += driftVx;
            state.y += driftVy;
            state.rotation += driftVRot;

            // Contain within full section boundaries
            if (state.x < minX) state.x = minX;
            if (state.x > maxX) state.x = maxX;
            if (state.y < minY) state.y = minY;
            if (state.y > maxY) state.y = maxY;

            nextRender[state.id] = {
              x: state.x,
              y: state.y,
              rotation: state.rotation,
              scale: state.baseScale,
              isDragging: false,
            };
            hasChanges = true;
          }
        });
      }

      if (hasChanges) {
        setRenderPositions(nextRender);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Pointer Down (Mouse click or finger touch)
  const handlePointerDown = (e: React.PointerEvent, pieceId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const targetEl = e.currentTarget as HTMLElement;
    targetEl.setPointerCapture(e.pointerId);

    activePointerIdRef.current.set(pieceId, e.pointerId);

    const state = physicsRef.current.get(pieceId);
    if (!state) return;

    state.isDragging = true;
    state.isThrown = false;
    state.vx = 0;
    state.vy = 0;
    state.vRot = 0;

    pointerHistoryRef.current.set(pieceId, [
      { x: e.clientX, y: e.clientY, time: performance.now() },
    ]);
  };

  // Pointer Move (Mouse drag or finger movement)
  const handlePointerMove = (e: React.PointerEvent, pieceId: number) => {
    e.stopPropagation();
    const currentPointerId = activePointerIdRef.current.get(pieceId);
    if (currentPointerId !== e.pointerId) return;

    const state = physicsRef.current.get(pieceId);
    if (!state || !state.isDragging) return;

    const history = pointerHistoryRef.current.get(pieceId) || [];
    const lastPoint = history[history.length - 1];

    if (lastPoint) {
      const dx = e.clientX - lastPoint.x;
      const dy = e.clientY - lastPoint.y;

      state.x += dx;
      state.y += dy;
      // Slight interactive tilt during drag
      state.rotation += dx * 0.15;
    }

    const now = performance.now();
    history.push({ x: e.clientX, y: e.clientY, time: now });
    // Keep last 5 points within ~100ms
    const recent = history.filter((p) => now - p.time < 120);
    pointerHistoryRef.current.set(pieceId, recent.slice(-5));
  };

  // Pointer Up / Cancel (Throwing release)
  const handlePointerUp = (e: React.PointerEvent, pieceId: number) => {
    e.stopPropagation();
    const targetEl = e.currentTarget as HTMLElement;
    try {
      if (targetEl.hasPointerCapture(e.pointerId)) {
        targetEl.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if pointer capture already ended
    }

    activePointerIdRef.current.delete(pieceId);

    const state = physicsRef.current.get(pieceId);
    if (!state) return;

    state.isDragging = false;

    // Calculate throw velocity from pointer history
    const history = pointerHistoryRef.current.get(pieceId) || [];
    pointerHistoryRef.current.delete(pieceId);

    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = newest.time - oldest.time;

      if (dt > 12) {
        // Convert to px per frame (~16ms)
        const frameMultiplier = 16.67 / dt;
        let vx = (newest.x - oldest.x) * frameMultiplier;
        let vy = (newest.y - oldest.y) * frameMultiplier;

        // Cap maximum throw speed
        const maxThrowSpeed = 38;
        vx = Math.max(-maxThrowSpeed, Math.min(maxThrowSpeed, vx));
        vy = Math.max(-maxThrowSpeed, Math.min(maxThrowSpeed, vy));

        const speed = Math.hypot(vx, vy);

        if (speed > 1.2) {
          state.vx = vx;
          state.vy = vy;
          state.vRot = vx * 0.45 + (Math.random() - 0.5) * 4;
          state.isThrown = true;
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ perspective: "1000px" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-visible select-none"
    >
      {pieces.map((piece) => {
        const render = renderPositions[piece.id];
        const x = render ? render.x : isMobile ? piece.mobile.x : piece.desktop.x;
        const y = render ? render.y : isMobile ? piece.mobile.y : piece.desktop.y;
        const rot = render ? render.rotation : isMobile ? piece.mobile.rotate : piece.desktop.rotate;
        const scale = render ? render.scale : isMobile ? piece.mobile.scale : piece.desktop.scale;
        const isDragging = render ? render.isDragging : false;

        return (
          <div
            key={`${activeFlavourId}-${piece.id}`}
            data-scatter-piece="true"
            onPointerDown={(e) => handlePointerDown(e, piece.id)}
            onPointerMove={(e) => handlePointerMove(e, piece.id)}
            onPointerUp={(e) => handlePointerUp(e, piece.id)}
            onPointerCancel={(e) => handlePointerUp(e, piece.id)}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onTouchCancel={(e) => e.stopPropagation()}
            className={`absolute left-1/2 top-1/2 ${piece.size} ${
              isScattered ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"
            } select-none touch-none transition-shadow duration-200 group ${
              isDragging ? "z-50" : "z-20"
            }`}
            style={{
              transform: isScattered
                ? `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0px) rotate(${rot}deg) scale(${scale})`
                : `translate(-50%, -50%) translate3d(0px, 0px, -140px) rotate(0deg) scale(0.22)`,
              opacity: isScattered ? 1 : 0.85,
              transition: isDragging
                ? "none"
                : isBursting
                ? `transform 450ms cubic-bezier(0.175, 0.885, 0.32, 1.25) ${piece.delay || "0s"}, opacity 80ms ease-out`
                : isScattered
                ? "none"
                : `transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease-in`,
            }}
            title="Grab & throw me!"
          >
            <div
              className={`w-full h-full flex items-center justify-center transition-transform duration-150 ${
                isDragging ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              <img
                key={`${activeFlavourId}-${piece.id}-img`}
                src={piece.src}
                alt={piece.alt}
                loading="eager"
                decoding="sync"
                draggable={false}
                className={`w-full h-full object-contain pointer-events-none select-none filter contrast-105 transition-all duration-200 ${
                  isDragging
                    ? "drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)]"
                    : "drop-shadow-[0_10px_20px_rgba(180,40,0,0.35)] group-hover:drop-shadow-[0_16px_28px_rgba(180,40,0,0.45)]"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
