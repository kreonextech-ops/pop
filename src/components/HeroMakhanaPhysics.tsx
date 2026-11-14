"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface HeroMakhanaPhysicsProps {
  /** Ref to the hero stage container whose bottom edge acts as the floor above the marquee */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface MakhanaSpriteDef {
  id: number;
  src: string;
  alt: string;
  sizeDesktop: number;
  sizeMobile: number;
  xRatio: number;
  dropHeightPx: number;
  floorOffset: number;
  initialVx: number;
  initialAngle: number;
  showOnMobile: boolean;
}

interface BodyState {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  radius: number;
  floorOffset: number;
  angle: number;
  vAngle: number;
  dragging: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  lastPointerX: number;
  lastPointerY: number;
  lastPointerTime: number;
}

const MAKHANA_ASSETS = [
  "/scatter/plain/01_single_makhana.png",
  "/scatter/plain/02_three_makhana_cluster.png",
  "/scatter/plain/03_cracked_makhana.png",
  "/scatter/plain/06_large_makhana_with_crumbs.png",
  "/scatter/plain/07_small_makhana_cluster.png",
  "/scatter/plain/09_large_single_makhana.png",
];

// 18 balanced makhana spread equally left, center & right (12 on mobile) — crisp zero-lag 60fps+ physics
const HERO_MAKHANA_SPRITES: MakhanaSpriteDef[] = [
  { id: 1, src: MAKHANA_ASSETS[0], alt: "Roasted Makhana", sizeDesktop: 52, sizeMobile: 34, xRatio: 0.04, dropHeightPx: 14, floorOffset: 2, initialVx: 5, initialAngle: -16, showOnMobile: true },
  { id: 2, src: MAKHANA_ASSETS[2], alt: "Cracked Crunchy Makhana", sizeDesktop: 64, sizeMobile: 42, xRatio: 0.09, dropHeightPx: 26, floorOffset: 10, initialVx: -4, initialAngle: 22, showOnMobile: true },
  { id: 3, src: MAKHANA_ASSETS[4], alt: "Mini Makhana Cluster", sizeDesktop: 68, sizeMobile: 44, xRatio: 0.15, dropHeightPx: 10, floorOffset: 1, initialVx: 6, initialAngle: -8, showOnMobile: true },
  { id: 4, src: MAKHANA_ASSETS[3], alt: "Crunchy Makhana with Crumbs", sizeDesktop: 54, sizeMobile: 36, xRatio: 0.21, dropHeightPx: 22, floorOffset: 8, initialVx: -5, initialAngle: 18, showOnMobile: false },
  { id: 5, src: MAKHANA_ASSETS[5], alt: "Large Popped Makhana", sizeDesktop: 58, sizeMobile: 38, xRatio: 0.27, dropHeightPx: 12, floorOffset: 3, initialVx: 4, initialAngle: -22, showOnMobile: true },
  { id: 6, src: MAKHANA_ASSETS[1], alt: "Three Makhana Cluster", sizeDesktop: 70, sizeMobile: 44, xRatio: 0.34, dropHeightPx: 24, floorOffset: 6, initialVx: -6, initialAngle: 12, showOnMobile: true },
  { id: 7, src: MAKHANA_ASSETS[0], alt: "Single Pop Makhana", sizeDesktop: 48, sizeMobile: 32, xRatio: 0.40, dropHeightPx: 16, floorOffset: 12, initialVx: 5, initialAngle: -28, showOnMobile: false },
  { id: 8, src: MAKHANA_ASSETS[2], alt: "Golden Cracked Makhana", sizeDesktop: 58, sizeMobile: 38, xRatio: 0.46, dropHeightPx: 10, floorOffset: 1, initialVx: -4, initialAngle: 15, showOnMobile: true },
  { id: 9, src: MAKHANA_ASSETS[4], alt: "Makhana Cluster", sizeDesktop: 66, sizeMobile: 42, xRatio: 0.53, dropHeightPx: 22, floorOffset: 9, initialVx: 5, initialAngle: -14, showOnMobile: true },
  { id: 10, src: MAKHANA_ASSETS[3], alt: "Roasted Makhana Crumbs", sizeDesktop: 54, sizeMobile: 36, xRatio: 0.59, dropHeightPx: 12, floorOffset: 2, initialVx: -6, initialAngle: 24, showOnMobile: false },
  { id: 11, src: MAKHANA_ASSETS[1], alt: "Triple Roasted Makhana", sizeDesktop: 68, sizeMobile: 44, xRatio: 0.65, dropHeightPx: 26, floorOffset: 6, initialVx: 4, initialAngle: -10, showOnMobile: true },
  { id: 12, src: MAKHANA_ASSETS[0], alt: "Light Roasted Makhana", sizeDesktop: 48, sizeMobile: 32, xRatio: 0.71, dropHeightPx: 14, floorOffset: 11, initialVx: -5, initialAngle: 29, showOnMobile: false },
  { id: 13, src: MAKHANA_ASSETS[5], alt: "Big Popped Makhana", sizeDesktop: 58, sizeMobile: 38, xRatio: 0.77, dropHeightPx: 10, floorOffset: 1, initialVx: 6, initialAngle: -19, showOnMobile: true },
  { id: 14, src: MAKHANA_ASSETS[2], alt: "Split Roasted Makhana", sizeDesktop: 56, sizeMobile: 36, xRatio: 0.82, dropHeightPx: 24, floorOffset: 8, initialVx: -4, initialAngle: 16, showOnMobile: true },
  { id: 15, src: MAKHANA_ASSETS[4], alt: "Clustered Roasted Makhana", sizeDesktop: 66, sizeMobile: 42, xRatio: 0.88, dropHeightPx: 12, floorOffset: 3, initialVx: -6, initialAngle: -12, showOnMobile: true },
  { id: 16, src: MAKHANA_ASSETS[0], alt: "Golden Makhana", sizeDesktop: 48, sizeMobile: 32, xRatio: 0.92, dropHeightPx: 20, floorOffset: 10, initialVx: -3, initialAngle: 21, showOnMobile: false },
  { id: 17, src: MAKHANA_ASSETS[5], alt: "Lotus Seed Puff", sizeDesktop: 56, sizeMobile: 36, xRatio: 0.96, dropHeightPx: 12, floorOffset: 0, initialVx: -6, initialAngle: -15, showOnMobile: true },
  { id: 18, src: MAKHANA_ASSETS[3], alt: "Makhana Bite", sizeDesktop: 52, sizeMobile: 34, xRatio: 0.18, dropHeightPx: 28, floorOffset: 13, initialVx: 3, initialAngle: 31, showOnMobile: false },
];

type DeviceOrientationCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export default React.memo(function HeroMakhanaPhysics({ containerRef }: HeroMakhanaPhysicsProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodiesRef = useRef<BodyState[]>([]);
  const boundsRef = useRef({ width: 0, height: 0 });
  const gravityRef = useRef({ gx: 0, gy: 2600 });
  const activeDragRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const isAwakeRef = useRef(true);
  const lastFrameRef = useRef<number>(0);
  const startLoopRef = useRef<(() => void) | null>(null);

  const wakePhysics = () => {
    isAwakeRef.current = true;
    lastFrameRef.current = performance.now();
    startLoopRef.current?.();
  };

  useIsomorphicLayoutEffect(() => {
    const container = layerRef.current?.parentElement || containerRef.current;
    if (!container) return;

    const initOrResizeBounds = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(280, rect.width);
      const height = Math.max(240, rect.height);
      const prev = boundsRef.current;
      // Ignore tiny height-only shifts caused by mobile URL bars hiding/showing while scrolling
      if (prev.width > 0 && Math.abs(width - prev.width) < 2 && Math.abs(height - prev.height) < 85) {
        return;
      }
      const isMobile = width < 640;
      boundsRef.current = { width, height };

      if (bodiesRef.current.length === 0) {
        bodiesRef.current = HERO_MAKHANA_SPRITES.map((sprite) => {
          const active = !isMobile || sprite.showOnMobile;
          const size = isMobile ? sprite.sizeMobile : sprite.sizeDesktop;
          const radius = size * 0.36;
          const floorOffset = isMobile ? Math.round(sprite.floorOffset * 0.65) : sprite.floorOffset;
          const restY = Math.max(radius, height - radius - floorOffset);
          const startY = Math.max(radius + 4, restY - sprite.dropHeightPx);
          return {
            active,
            x: Math.max(radius + 4, Math.min(width - radius - 4, width * sprite.xRatio)),
            y: startY,
            vx: sprite.initialVx,
            vy: 90,
            size,
            radius,
            floorOffset,
            angle: sprite.initialAngle,
            vAngle: sprite.initialVx * 0.5,
            dragging: false,
            dragOffsetX: 0,
            dragOffsetY: 0,
            lastPointerX: 0,
            lastPointerY: 0,
            lastPointerTime: 0,
          };
        });
      } else {
        bodiesRef.current.forEach((b, idx) => {
          const sprite = HERO_MAKHANA_SPRITES[idx];
          b.active = !isMobile || sprite.showOnMobile;
          const size = isMobile ? sprite.sizeMobile : sprite.sizeDesktop;
          b.size = size;
          b.radius = size * 0.36;
          b.floorOffset = isMobile ? Math.round(sprite.floorOffset * 0.65) : sprite.floorOffset;
          b.x = Math.max(b.radius, Math.min(width - b.radius, b.x));
          b.y = Math.max(b.radius, Math.min(height - b.radius - b.floorOffset, b.y));
        });
      }

      bodiesRef.current.forEach((b, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        el.style.display = b.active ? "block" : "none";
        el.style.width = `${b.size}px`;
        el.style.height = `${b.size}px`;
        el.style.transform = `translate3d(${(b.x - b.size / 2).toFixed(1)}px, ${(b.y - b.size / 2).toFixed(1)}px, 0) rotate(${b.angle.toFixed(1)}deg)`;
      });
      wakePhysics();
    };

    initOrResizeBounds();

    const ro = new ResizeObserver(initOrResizeBounds);
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && isAwakeRef.current) {
          lastFrameRef.current = performance.now();
          startLoopRef.current?.();
        }
      },
      { threshold: 0.02 }
    );
    io.observe(container);

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null && event.beta === null) return;
      const angle =
        typeof window.screen?.orientation?.angle === "number"
          ? window.screen.orientation.angle
          : typeof (window as Window & { orientation?: number }).orientation === "number"
          ? ((window as Window & { orientation?: number }).orientation ?? 0)
          : 0;

      const rawGamma = event.gamma ?? 0;
      const rawBeta = event.beta ?? 45;

      let tiltX = rawGamma;
      if (angle === 90) tiltX = rawBeta;
      else if (angle === -90 || angle === 270) tiltX = -rawBeta;
      else if (angle === 180) tiltX = -rawGamma;

      const adjustedTilt = Math.abs(tiltX) < 4 ? 0 : tiltX - Math.sign(tiltX) * 4;
      const targetGx = Math.max(-1600, Math.min(1600, (adjustedTilt / 32) * 1450));

      const betaDelta = Math.max(-45, Math.min(45, rawBeta - 42));
      const targetGy = Math.max(700, Math.min(1850, 1480 + betaDelta * 8));

      const prevGx = gravityRef.current.gx;
      gravityRef.current.gx = prevGx * 0.65 + targetGx * 0.35;
      gravityRef.current.gy = gravityRef.current.gy * 0.65 + targetGy * 0.35;

      if (Math.abs(gravityRef.current.gx) > 35 || Math.abs(gravityRef.current.gx - prevGx) > 12) {
        wakePhysics();
      }
    };

    const devOrientCtor =
      typeof window !== "undefined"
        ? (window.DeviceOrientationEvent as DeviceOrientationCtor | undefined)
        : undefined;

    if (devOrientCtor && typeof devOrientCtor.requestPermission !== "function") {
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
    }

    const unlockIosOnFirstTap = async () => {
      if (!devOrientCtor || typeof devOrientCtor.requestPermission !== "function") return;
      try {
        const result = await devOrientCtor.requestPermission();
        if (result === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, { passive: true });
          wakePhysics();
        }
      } catch {
        // Ignore denied tilt permission
      } finally {
        window.removeEventListener("touchstart", unlockIosOnFirstTap);
      }
    };

    if (devOrientCtor && typeof devOrientCtor.requestPermission === "function") {
      window.addEventListener("touchstart", unlockIosOnFirstTap, { passive: true, once: true });
    }

    lastFrameRef.current = performance.now();

    const step = (now: number) => {
      rafRef.current = null;
      if (!isVisibleRef.current || !isAwakeRef.current) {
        return;
      }

      const dt = Math.min(0.025, Math.max(0.004, (now - lastFrameRef.current) / 1000));
      lastFrameRef.current = now;

      const bodies = bodiesRef.current;
      const { width, height } = boundsRef.current;
      const { gx, gy } = gravityRef.current;
      const floorFriction = 0.82;
      const airDrag = 0.996;
      const bounce = 0.28;

      let totalMotion = Math.abs(gx) > 35 ? 10 : 0;

      // 1. Integrate motion
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (!b.active) continue;
        if (b.dragging) {
          totalMotion += 100;
          continue;
        }

        b.vx = (b.vx + gx * dt) * airDrag;
        b.vy = (b.vy + gy * dt) * airDrag;

        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += b.vAngle * dt;

        const maxY = height - b.radius - b.floorOffset;
        if (b.y >= maxY) {
          b.y = maxY;
          if (Math.abs(b.vy) > 55) {
            b.vy = -b.vy * bounce;
            b.vAngle += (Math.random() - 0.5) * 30;
          } else {
            b.vy = 0;
            b.vx *= floorFriction;
            b.vAngle = (b.vx / Math.max(12, b.radius)) * (180 / Math.PI) * 0.5;
            if (Math.abs(b.vx) < 3 && Math.abs(gx) < 30) {
              b.vx = 0;
              b.vAngle = 0;
            }
          }
        } else {
          b.vAngle *= 0.985;
        }

        if (b.y < b.radius) {
          b.y = b.radius;
          if (b.vy < 0) b.vy = -b.vy * bounce;
        }

        if (b.x < b.radius) {
          b.x = b.radius;
          if (b.vx < 0) b.vx = -b.vx * 0.45;
        } else if (b.x > width - b.radius) {
          b.x = width - b.radius;
          if (b.vx > 0) b.vx = -b.vx * 0.45;
        }

        totalMotion += Math.abs(b.vx) + Math.abs(b.vy);
      }

      // 2. Soft circle-to-circle collisions
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i];
        if (!a.active) continue;
        for (let j = i + 1; j < bodies.length; j++) {
          const b = bodies[j];
          if (!b.active) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minDist = (a.radius + b.radius) * 0.78;
          const distSq = dx * dx + dy * dy;

          if (distSq > 0.001 && distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            if (!a.dragging && !b.dragging) {
              a.x -= nx * overlap * 0.45;
              a.y -= ny * overlap * 0.55;
              b.x += nx * overlap * 0.45;
              b.y += ny * overlap * 0.55;
            } else if (a.dragging && !b.dragging) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            } else if (b.dragging && !a.dragging) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }

            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            if (velAlongNormal < 0) {
              const restitution = 0.36;
              const impulse = (-(1 + restitution) * velAlongNormal) * 0.5;
              if (!a.dragging) {
                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
              }
              if (!b.dragging) {
                b.vx += impulse * nx;
                b.vy += impulse * ny;
              }
              totalMotion += Math.abs(impulse) * 2;
            }

            const aMaxY = height - a.radius - a.floorOffset;
            const bMaxY = height - b.radius - b.floorOffset;
            if (a.y > aMaxY) a.y = aMaxY;
            if (b.y > bMaxY) b.y = bMaxY;
            if (a.x < a.radius) a.x = a.radius;
            if (a.x > width - a.radius) a.x = width - a.radius;
            if (b.x < b.radius) b.x = b.radius;
            if (b.x > width - b.radius) b.x = width - b.radius;
          }
        }
      }

      // 3. Apply GPU transforms
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (!b.active) continue;
        const el = itemRefs.current[i];
        if (!el) continue;
        el.style.transform = `translate3d(${(b.x - b.size / 2).toFixed(2)}px, ${(b.y - b.size / 2).toFixed(2)}px, 0) rotate(${b.angle.toFixed(2)}deg)`;
      }

      if (totalMotion < 3) {
        isAwakeRef.current = false;
      } else if (isVisibleRef.current) {
        rafRef.current = window.requestAnimationFrame(step);
      }
    };

    const ensureLoop = () => {
      if (rafRef.current === null && isVisibleRef.current && isAwakeRef.current) {
        lastFrameRef.current = performance.now();
        rafRef.current = window.requestAnimationFrame(step);
      }
    };
    startLoopRef.current = ensureLoop;
    ensureLoop();

    const handleGlobalMove = (e: PointerEvent) => {
      const idx = activeDragRef.current;
      if (idx === null) return;
      const stageEl = layerRef.current?.parentElement || containerRef.current;
      const b = bodiesRef.current[idx];
      if (!b || !stageEl) return;
      const rect = stageEl.getBoundingClientRect();

      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max(0.008, (now - b.lastPointerTime) / 1000);

      const newX = Math.max(b.radius, Math.min(rect.width - b.radius, localX - b.dragOffsetX));
      const newY = Math.max(b.radius, Math.min(rect.height - b.radius - b.floorOffset, localY - b.dragOffsetY));

      const instVx = (localX - b.lastPointerX) / dt;
      const instVy = (localY - b.lastPointerY) / dt;
      b.vx = Math.max(-1400, Math.min(1400, b.vx * 0.4 + instVx * 0.6));
      b.vy = Math.max(-1400, Math.min(1400, b.vy * 0.4 + instVy * 0.6));
      b.vAngle = b.vx * 0.35;

      b.x = newX;
      b.y = newY;
      b.lastPointerX = localX;
      b.lastPointerY = localY;
      b.lastPointerTime = now;
      wakePhysics();
    };

    const handleGlobalUp = () => {
      const idx = activeDragRef.current;
      if (idx === null) return;
      const b = bodiesRef.current[idx];
      if (b) b.dragging = false;
      activeDragRef.current = null;
      wakePhysics();
    };

    window.addEventListener("pointermove", handleGlobalMove, { passive: true });
    window.addEventListener("pointerup", handleGlobalUp, { passive: true });
    window.addEventListener("pointercancel", handleGlobalUp, { passive: true });

    return () => {
      startLoopRef.current = null;
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("pointermove", handleGlobalMove);
      window.removeEventListener("pointerup", handleGlobalUp);
      window.removeEventListener("pointercancel", handleGlobalUp);
      window.removeEventListener("touchstart", unlockIosOnFirstTap);
    };
  }, [containerRef]);

  const handlePiecePointerDown = (idx: number, e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const container = layerRef.current?.parentElement || containerRef.current;
    const b = bodiesRef.current[idx];
    if (!container || !b) return;

    const rect = container.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    b.dragging = true;
    b.dragOffsetX = localX - b.x;
    b.dragOffsetY = localY - b.y;
    b.lastPointerX = localX;
    b.lastPointerY = localY;
    b.lastPointerTime = performance.now();
    b.vx = 0;
    b.vy = 0;

    activeDragRef.current = idx;
    wakePhysics();
  };

  return (
    <div
      ref={layerRef}
      aria-label="Interactive Roasted Makhana Gravity Layer"
      style={{ zIndex: 35, contain: "layout style paint" }}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
    >
      {HERO_MAKHANA_SPRITES.map((sprite, idx) => (
        <div
          key={sprite.id}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          style={{
            width: `${sprite.sizeDesktop}px`,
            height: `${sprite.sizeDesktop}px`,
            transform: "translate3d(-9999px, 0, 0)",
          }}
          onPointerDown={(e) => handlePiecePointerDown(idx, e)}
          className="absolute top-0 left-0 pointer-events-auto cursor-grab active:cursor-grabbing touch-none will-change-transform group"
          title="Drag or toss the roasted makhana — or tilt your phone!"
        >
          <img
            src={sprite.src}
            alt={sprite.alt}
            loading="eager"
            decoding="async"
            draggable={false}
            className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-150 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
});
