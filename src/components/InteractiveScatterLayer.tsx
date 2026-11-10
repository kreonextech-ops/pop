"use client";

import React, { useEffect, useRef, useCallback } from "react";

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
  onResetTrigger?: number;
}

interface PiecePhysics {
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
  const pieceRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const physicsRef = useRef<Map<number, PiecePhysics>>(new Map());
  const pointerHistoryRef = useRef<Map<number, PointerRecord[]>>(new Map());
  const activePointerIdRef = useRef<Map<number, number>>(new Map());
  const animFrameRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const boundsRef = useRef<{ minX: number; maxX: number; minY: number; maxY: number }>({
    minX: -550,
    maxX: 550,
    minY: -320,
    maxY: 340,
  });

  // Measure bounds once or on resize (ZERO layout thrashing in 60fps loop)
  const updateBounds = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const section = container.closest<HTMLElement>("#flavours") || document.getElementById("flavours");
    if (!section) return;

    const cRect = container.getBoundingClientRect();
    const sRect = section.getBoundingClientRect();
    const cX = cRect.left + cRect.width / 2;
    const cY = cRect.top + cRect.height / 2;
    const pad = 35;

    boundsRef.current = {
      minX: sRect.left - cX + pad,
      maxX: sRect.right - cX - pad,
      minY: sRect.top - cY + pad,
      maxY: sRect.bottom - cY - pad,
    };
  }, []);

  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds, { passive: true });
    return () => window.removeEventListener("resize", updateBounds);
  }, [updateBounds]);

  // Apply transform directly to DOM element (0 React re-renders)
  const applyTransform = useCallback((state: PiecePhysics, isBursting = false, delay = "0s") => {
    const el = pieceRefs.current.get(state.id);
    if (!el) return;

    if (!isScattered) {
      el.style.transform = `translate(-50%, -50%) translate3d(0px, 0px, -140px) rotate(0deg) scale(0.22)`;
      el.style.opacity = "0.85";
      el.style.transition = "transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease-in";
    } else {
      el.style.transform = `translate(-50%, -50%) translate3d(${state.x}px, ${state.y}px, 0px) rotate(${state.rotation}deg) scale(${state.scale})`;
      el.style.opacity = "1";
      if (state.isDragging) {
        el.style.transition = "none";
      } else if (isBursting) {
        el.style.transition = `transform 450ms cubic-bezier(0.175, 0.885, 0.32, 1.25) ${delay}, opacity 80ms ease-out`;
      } else if (state.isThrown) {
        el.style.transition = "none";
      } else {
        el.style.transition = "transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      }
    }
  }, [isScattered]);

  // Initialize piece coordinates
  const initPositions = useCallback((burst = false) => {
    physicsRef.current.clear();
    pieces.forEach((piece) => {
      const coords = isMobile ? piece.mobile : piece.desktop;
      const state: PiecePhysics = {
        id: piece.id,
        x: coords.x,
        y: coords.y,
        vx: 0,
        vy: 0,
        rotation: coords.rotate,
        vRot: 0,
        scale: coords.scale,
        isDragging: false,
        isThrown: false,
        originX: coords.x,
        originY: coords.y,
        originRot: coords.rotate,
        baseScale: coords.scale,
      };
      physicsRef.current.set(piece.id, state);
      applyTransform(state, burst, piece.delay || "0s");
    });
  }, [pieces, isMobile, applyTransform]);

  // Sync positions when props change
  useEffect(() => {
    initPositions(true);
  }, [pieces, isMobile, activeFlavourId, initPositions]);

  // When isScattered changes (retract or burst)
  useEffect(() => {
    physicsRef.current.forEach((state) => {
      const piece = pieces.find((p) => p.id === state.id);
      applyTransform(state, isScattered, piece?.delay || "0s");
    });
  }, [isScattered, pieces, applyTransform]);

  // Spring back when packet is clicked directly
  useEffect(() => {
    if (onResetTrigger > 0) {
      physicsRef.current.forEach((state) => {
        state.x = state.originX;
        state.y = state.originY;
        state.rotation = state.originRot;
        state.scale = state.baseScale;
        state.vx = 0;
        state.vy = 0;
        state.vRot = 0;
        state.isThrown = false;
        state.isDragging = false;
        applyTransform(state, false);
      });
    }
  }, [onResetTrigger, applyTransform]);

  // Stop the physics loop when not needed
  const stopLoop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    isLoopRunningRef.current = false;
  }, []);

  // Lightweight physics loop that ONLY runs while pieces are actively flying through the air
  const runPhysicsLoop = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const tick = () => {
      let anyThrown = false;
      const { minX, maxX, minY, maxY } = boundsRef.current;

      physicsRef.current.forEach((state) => {
        if (!state.isThrown) return;
        anyThrown = true;

        state.x += state.vx;
        state.y += state.vy;
        state.rotation += state.vRot;

        state.vx *= 0.94;
        state.vy *= 0.94;
        state.vRot *= 0.95;

        // Bounce off section walls with restitution
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

        // Rest once dissipated
        if (Math.hypot(state.vx, state.vy) < 0.22) {
          state.isThrown = false;
          state.vx = 0;
          state.vy = 0;
          state.vRot = 0;
        }

        applyTransform(state, false);
      });

      if (anyThrown) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        stopLoop();
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [applyTransform, stopLoop]);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  // Pointer Down
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

    const el = pieceRefs.current.get(pieceId);
    if (el) {
      el.style.zIndex = "50";
      el.style.cursor = "grabbing";
    }
  };

  // Pointer Move (Zero-latency direct DOM update)
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
      state.rotation += dx * 0.15;
      applyTransform(state, false);
    }

    const now = performance.now();
    history.push({ x: e.clientX, y: e.clientY, time: now });
    const recent = history.filter((p) => now - p.time < 120);
    pointerHistoryRef.current.set(pieceId, recent.slice(-5));
  };

  // Pointer Up / Fling Release
  const handlePointerUp = (e: React.PointerEvent, pieceId: number) => {
    e.stopPropagation();
    const targetEl = e.currentTarget as HTMLElement;
    try {
      if (targetEl.hasPointerCapture(e.pointerId)) {
        targetEl.releasePointerCapture(e.pointerId);
      }
    } catch {}

    activePointerIdRef.current.delete(pieceId);
    const state = physicsRef.current.get(pieceId);
    if (!state) return;

    state.isDragging = false;
    const el = pieceRefs.current.get(pieceId);
    if (el) {
      el.style.zIndex = "20";
      el.style.cursor = "grab";
    }

    const history = pointerHistoryRef.current.get(pieceId) || [];
    pointerHistoryRef.current.delete(pieceId);

    if (history.length >= 2) {
      const oldest = history[0];
      const newest = history[history.length - 1];
      const dt = newest.time - oldest.time;

      if (dt > 12) {
        const frameMultiplier = 16.67 / dt;
        let vx = (newest.x - oldest.x) * frameMultiplier;
        let vy = (newest.y - oldest.y) * frameMultiplier;

        const maxThrowSpeed = 36;
        vx = Math.max(-maxThrowSpeed, Math.min(maxThrowSpeed, vx));
        vy = Math.max(-maxThrowSpeed, Math.min(maxThrowSpeed, vy));

        if (Math.hypot(vx, vy) > 1.2) {
          state.vx = vx;
          state.vy = vy;
          state.vRot = vx * 0.45 + (Math.random() - 0.5) * 3;
          state.isThrown = true;
          runPhysicsLoop();
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
        const coords = isMobile ? piece.mobile : piece.desktop;
        return (
          <div
            key={`${activeFlavourId}-${piece.id}`}
            ref={(el) => {
              if (el) pieceRefs.current.set(piece.id, el);
              else pieceRefs.current.delete(piece.id);
            }}
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
            } select-none touch-none transition-shadow duration-200 group z-20`}
            style={{
              transform: isScattered
                ? `translate(-50%, -50%) translate3d(${coords.x}px, ${coords.y}px, 0px) rotate(${coords.rotate}deg) scale(${coords.scale})`
                : `translate(-50%, -50%) translate3d(0px, 0px, -140px) rotate(0deg) scale(0.22)`,
              opacity: isScattered ? 1 : 0.85,
              willChange: "transform",
            }}
            title="Grab & throw me!"
          >
            {/* GPU-accelerated CSS float animation runs at 120fps with 0% CPU */}
            <div
              className={`w-full h-full flex items-center justify-center transition-transform duration-150 group-hover:scale-105 ${
                piece.floatClass || "animate-float-gentle"
              }`}
            >
              <img
                key={`${activeFlavourId}-${piece.id}-img`}
                src={piece.src}
                alt={piece.alt}
                loading="eager"
                decoding="sync"
                draggable={false}
                className="w-full h-full object-contain pointer-events-none select-none filter contrast-105 transition-all duration-200 drop-shadow-[0_10px_20px_rgba(180,40,0,0.35)] group-hover:drop-shadow-[0_16px_28px_rgba(180,40,0,0.45)]"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
