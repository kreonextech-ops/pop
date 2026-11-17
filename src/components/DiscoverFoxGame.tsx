"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  highScore: number;
  totalRuns: number;
}

interface ObstacleData {
  id: number;
  type: "samosa" | "jalebi";
  x: number;
  slotIndex: number;
  cleared?: boolean;
}

// Complete 16-frame pre-rendered sprite deck (ZERO runtime .src mutations)
const ALL_SPRITES = [
  { id: "run-0", src: "/fox/fox-run-1.png" },
  { id: "run-1", src: "/fox/fox-run-2.png" },
  { id: "run-2", src: "/fox/fox-run-3.png" },
  { id: "run-3", src: "/fox/fox-run-4.png" },
  { id: "jump-0", src: "/fox/jump/1.png" },
  { id: "jump-1", src: "/fox/jump/2.png" },
  { id: "jump-2", src: "/fox/jump/3.png" },
  { id: "jump-3", src: "/fox/jump/4.png" },
  { id: "slide-0", src: "/fox/slide/1.png" },
  { id: "slide-1", src: "/fox/slide/2.png" },
  { id: "slide-2", src: "/fox/slide/3.png" },
  { id: "crash-0", src: "/fox/crash/1.png" },
  { id: "crash-1", src: "/fox/crash/2.png" },
  { id: "crash-2", src: "/fox/crash/3.png" },
  { id: "crash-3", src: "/fox/crash/4.png" },
  { id: "crash-4", src: "/fox/crash/5.png" },
];

export default function DiscoverFoxGame() {
  const { user, refreshUser } = useAuth();
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Sky Theme State
  type SkyTheme = "day" | "sunset" | "night";
  const [skyTheme, setSkyTheme] = useState<SkyTheme>("day");

  // Game UI State (Idle / Playing / Game Over)
  type Mode = "idle" | "run" | "jump" | "slide" | "crash";
  const [currentMode, setCurrentMode] = useState<Mode>("idle");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [savingScore, setSavingScore] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const scoreLoadedRef = useRef(false);

  useEffect(() => {
    const loadScore = () => {
      scoreLoadedRef.current = true;
      fetch("/api/game/score")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.leaderboard)) setLeaderboard(d.leaderboard);
          if (d.user?.gameHighScore) {
            setHighScore((prev) => Math.max(prev, Number(d.user.gameHighScore) || 0));
          }
        })
        .catch(() => {});
    };

    if (scoreLoadedRef.current) {
      loadScore();
      return;
    }

    const arenaEl = arenaRef.current;
    if (!arenaEl || typeof IntersectionObserver === "undefined") {
      const t = setTimeout(loadScore, 2200);
      return () => clearTimeout(t);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          loadScore();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(arenaEl);
    return () => io.disconnect();
  }, [user?.id]);

  // Landscape Arcade Mobile Mode
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);
  const [isDevicePortrait, setIsDevicePortrait] = useState(true);
  const [isDesktopScreen, setIsDesktopScreen] = useState(true);
  const isDesktopRef = useRef(true);

  // Core DOM References
  const arenaRef = useRef<HTMLDivElement>(null);
  const foxContainerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const groundStripRef = useRef<HTMLDivElement>(null);

  // Pre-rendered sprite elements map (id -> HTMLImageElement)
  const spriteElementsRef = useRef<{ [key: string]: HTMLImageElement | null }>({});
  const activeSpriteIdRef = useRef<string>("run-0");

  // HUD Text Refs (Updated directly via textContent, ZERO React re-renders)
  const scoreTextRef = useRef<HTMLSpanElement>(null);
  const bestTextRef = useRef<HTMLSpanElement>(null);
  const speedTextRef = useRef<HTMLSpanElement>(null);

  // Pooled Obstacle Slots (6 pre-allocated DOM elements)
  const POOL_SIZE = 6;
  const obstacleSlotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const obstacleSamosaImgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const obstacleJalebiImgsRef = useRef<(HTMLImageElement | null)[]>([]);
  const obstacleBadgesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const activeObstaclesRef = useRef<ObstacleData[]>([]);

  // PURE PHYSICS & MECHANISM REFS
  const modeRef = useRef<Mode>("idle");
  const gameStartedRef = useRef(false);

  // Physics Variables
  const foxYRef = useRef(0);
  const velocityYRef = useRef(0);
  const isGroundedRef = useRef(true);

  // Slide Mechanism
  const slideTimerRef = useRef(0);
  const pendingSlideRef = useRef(false);
  const SLIDE_DURATION_FRAMES = 36;

  // Crash Mechanism
  const crashTimerRef = useRef(0);

  // Stride Animation
  const runFrameIdxRef = useRef(0);
  const lastRunFrameTimeRef = useRef(0);

  // Live Metrics
  const nextObstacleIdRef = useRef(1);
  const spawnCooldownRef = useRef(180);
  const gameSpeedRef = useRef(6.2);
  const distanceRef = useRef(0);
  const groundXRef = useRef(0);
  const arenaWidthRef = useRef(1200);

  // Instant Sprite Switcher
  const switchSprite = useCallback((newId: string) => {
    if (activeSpriteIdRef.current === newId) return;
    const oldEl = spriteElementsRef.current[activeSpriteIdRef.current];
    const newEl = spriteElementsRef.current[newId];
    if (oldEl) oldEl.style.display = "none";
    if (newEl) newEl.style.display = "block";
    activeSpriteIdRef.current = newId;
  }, []);

  // Load High Score on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bitedash_high_score");
      if (saved) {
        const val = parseInt(saved, 10) || 0;
        setHighScore(val);
        if (bestTextRef.current) bestTextRef.current.textContent = `${val}m`;
      }
    } catch {}
  }, []);

  // Orientation & Resize Listener
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isPortrait = h > w;
      setIsDevicePortrait(isPortrait);

      // Desktop: screen width >= 768 and height >= 480 (mobile phones in landscape have height < 450)
      const isTouchPhone = typeof navigator !== "undefined" && navigator.maxTouchPoints > 1 && (h < 480 || w < 600);
      const isDesktop = w >= 768 && h >= 480 && !isTouchPhone;
      setIsDesktopScreen(isDesktop);
      isDesktopRef.current = isDesktop;

      // Auto-switch to landscape mode if the user physically turns their phone sideways
      if (!isDesktop && !isPortrait) {
        setIsLandscapeMode(true);
      }

      if (arenaRef.current) {
        arenaWidthRef.current = arenaRef.current.clientWidth;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Track software rotated portrait mode for touch gesture remapping
  const isRotatedPortrait = isLandscapeMode && isDevicePortrait;
  const isRotatedPortraitRef = useRef(false);
  useEffect(() => {
    isRotatedPortraitRef.current = isRotatedPortrait;
  }, [isRotatedPortrait]);

  // Lock body scroll when in Landscape Fullscreen Mode
  useEffect(() => {
    if (isLandscapeMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLandscapeMode]);

  // Enter Fullscreen Landscape Mode
  const enterLandscape = useCallback(async () => {
    setIsLandscapeMode(true);
    try {
      const docEl = document.documentElement as any;
      const reqFs =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen;
      if (reqFs && !document.fullscreenElement) {
        await reqFs.call(docEl);
      }
    } catch {}
    try {
      if (screen.orientation && "lock" in screen.orientation) {
        await (screen.orientation as any).lock("landscape");
      }
    } catch {}
    setTimeout(() => {
      if (arenaRef.current) {
        arenaWidthRef.current = arenaRef.current.clientWidth;
      }
    }, 150);
  }, []);

  // Exit Fullscreen Landscape Mode
  const exitLandscape = useCallback(async () => {
    setIsLandscapeMode(false);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      if (screen.orientation && "unlock" in screen.orientation) {
        (screen.orientation as any).unlock();
      }
    } catch {}
    setTimeout(() => {
      if (arenaRef.current) {
        arenaWidthRef.current = arenaRef.current.clientWidth;
      }
    }, 150);
  }, []);

  // =========================================================================
  // JUMP MECHANISM
  // =========================================================================
  const triggerJump = useCallback(() => {
    if (modeRef.current === "crash") return;

    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      setGameStarted(true);
      modeRef.current = "run";
      setCurrentMode("run");
      spawnCooldownRef.current = 150;
    }

    if (modeRef.current === "slide") {
      slideTimerRef.current = 0;
    }

    pendingSlideRef.current = false;

    if (isGroundedRef.current) {
      isGroundedRef.current = false;
      const isDesktop = isDesktopRef.current;
      velocityYRef.current = isDesktop ? -15.2 : -10.6;
      modeRef.current = "jump";
      setCurrentMode("jump");
      switchSprite("jump-0");
    }
  }, [switchSprite]);

  // =========================================================================
  // SLIDE MECHANISM
  // =========================================================================
  const triggerSlide = useCallback(() => {
    if (modeRef.current === "crash") return;

    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      setGameStarted(true);
      modeRef.current = "run";
      setCurrentMode("run");
      spawnCooldownRef.current = 150;
    }

    if (!isGroundedRef.current) {
      velocityYRef.current = Math.max(velocityYRef.current, 14.0);
      pendingSlideRef.current = true;
      return;
    }

    // Refresh slide timer even if already sliding to allow continuous sliding
    pendingSlideRef.current = false;
    modeRef.current = "slide";
    setCurrentMode("slide");
    slideTimerRef.current = SLIDE_DURATION_FRAMES;
    switchSprite("slide-0");
  }, [switchSprite]);

  // =========================================================================
  // TOUCH SWIPE GESTURES FOR MOBILE (Supports physical landscape & 90deg rotation)
  // =========================================================================
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const getGameDelta = useCallback((startX: number, startY: number, currentX: number, currentY: number) => {
    const rawDx = currentX - startX;
    const rawDy = currentY - startY;
    if (isRotatedPortraitRef.current) {
      // 90deg clockwise software rotation:
      // Visual ground is screen RIGHT (+rawDx), visual sky is screen LEFT (-rawDx)
      // Visual forward run is screen BOTTOM (+rawDy), visual backward is screen TOP (-rawDy)
      return {
        dx: rawDy,
        dy: rawDx,
      };
    }
    return {
      dx: rawDx,
      dy: rawDy,
    };
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest("button, a, input, select")) return;
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY, time: performance.now() };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.touches[0];
    const { dx, dy } = getGameDelta(touchStartRef.current.x, touchStartRef.current.y, t.clientX, t.clientY);

    // Responsive downward swipe -> Slide immediately
    if (dy > 14 && dy > Math.abs(dx) * 0.75) {
      triggerSlide();
      touchStartRef.current = null; // consume gesture
    } else if (dy < -14 && Math.abs(dy) > Math.abs(dx) * 0.75) {
      // Responsive upward swipe -> Jump immediately
      triggerJump();
      touchStartRef.current = null; // consume gesture
    }
  }, [triggerSlide, triggerJump, getGameDelta]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement)?.closest("button, a, input, select")) return;
    if (!touchStartRef.current) return;
    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (!gameStartedRef.current) {
      triggerJump();
      return;
    }

    const end = e.changedTouches[0];
    if (!end) return;

    const { dx, dy } = getGameDelta(start.x, start.y, end.clientX, end.clientY);

    // Downward swipe triggers slide; all other taps, upward flicks and touches trigger JUMP
    if (dy > 14 && dy > Math.abs(dx) * 0.75) {
      triggerSlide();
    } else {
      triggerJump();
    }
  }, [triggerJump, triggerSlide, getGameDelta]);

  const handleArenaClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.closest("button, a, input, select")) return;
    triggerJump();
  }, [triggerJump]);

  // =========================================================================
  // CRASH / GAME OVER
  // =========================================================================
  const triggerCrash = useCallback(() => {
    if (modeRef.current === "crash") return;

    modeRef.current = "crash";
    setCurrentMode("crash");
    crashTimerRef.current = 0;
    switchSprite("crash-0");

    const foxContainer = foxContainerRef.current;
    if (foxContainer) {
      foxContainer.style.transform = `translate3d(0, 0, 0) rotate(-14deg)`;
    }
  }, [switchSprite]);

  // =========================================================================
  // RESET / REPLAY
  // =========================================================================
  const resetToRun = useCallback(() => {
    gameStartedRef.current = true;
    setGameStarted(true);
    modeRef.current = "run";
    setCurrentMode("run");
    setGameOver(false);

    foxYRef.current = 0;
    velocityYRef.current = 0;
    isGroundedRef.current = true;
    slideTimerRef.current = 0;
    pendingSlideRef.current = false;
    crashTimerRef.current = 0;
    runFrameIdxRef.current = 0;
    distanceRef.current = 0;
    gameSpeedRef.current = 6.2;
    spawnCooldownRef.current = 150;
    activeObstaclesRef.current = [];

    if (foxContainerRef.current) {
      foxContainerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    if (shadowRef.current) {
      shadowRef.current.style.transform = "scaleX(1.0)";
      shadowRef.current.style.opacity = "0.35";
    }

    for (let i = 0; i < POOL_SIZE; i++) {
      const slot = obstacleSlotsRef.current[i];
      if (slot) {
        slot.style.display = "none";
        slot.style.transform = "translate3d(-999px, 0, 0)";
      }
    }

    if (scoreTextRef.current) scoreTextRef.current.textContent = "0m";
    if (speedTextRef.current) speedTextRef.current.textContent = "1.0x";

    switchSprite("run-0");
  }, [switchSprite]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (modeRef.current === "crash") {
          resetToRun();
        } else {
          triggerJump();
        }
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        if (modeRef.current !== "crash") {
          triggerSlide();
        }
      } else if (e.code === "KeyC") {
        triggerCrash();
      } else if (e.code === "KeyR") {
        resetToRun();
      } else if (e.code === "Escape" && isLandscapeMode) {
        exitLandscape();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerJump, triggerSlide, triggerCrash, resetToRun, isLandscapeMode, exitLandscape]);

  // =========================================================================
  // 60FPS RUNNER ENGINE
  // =========================================================================
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let lastHudUpdateTime = performance.now();

    const loop = (now: number) => {
      try {
        const delta = Math.min(now - lastTime, 40);
        lastTime = now;
        const timeFactor = delta / 16.67;

        const isDesktop = isDesktopRef.current;
        const arenaW = arenaRef.current?.clientWidth || arenaWidthRef.current || (isDesktop ? 1200 : 400);
        arenaWidthRef.current = arenaW;
        const GRAVITY = isDesktop ? 0.74 : 0.66;

        if (modeRef.current !== "crash") {
          // Ground motion
          groundXRef.current = (groundXRef.current + gameSpeedRef.current * timeFactor) % 240;
          if (groundStripRef.current) {
            groundStripRef.current.style.transform = `translate3d(-${groundXRef.current}px, 0, 0)`;
          }

          // Distance & Speed
          if (gameStartedRef.current) {
            distanceRef.current += gameSpeedRef.current * timeFactor;
            const baseSpeed = isDesktop ? 6.2 : 4.8;
            const dynamicSpeed = Math.min(
              isDesktop ? 13.5 : 9.8,
              baseSpeed + (distanceRef.current / 3600) * (isDesktop ? 2.2 : 1.5)
            );
            gameSpeedRef.current = dynamicSpeed;

            if (now - lastHudUpdateTime >= 100) {
              const currentMeters = Math.floor(distanceRef.current / 8);
              if (scoreTextRef.current) scoreTextRef.current.textContent = `${currentMeters}m`;
              if (speedTextRef.current) speedTextRef.current.textContent = `${(dynamicSpeed / baseSpeed).toFixed(1)}x`;
              lastHudUpdateTime = now;
            }
          }

          // Jump Physics
          if (!isGroundedRef.current) {
            velocityYRef.current += GRAVITY * timeFactor;
            foxYRef.current += velocityYRef.current * timeFactor;

            if (foxYRef.current >= 0) {
              foxYRef.current = 0;
              velocityYRef.current = 0;
              isGroundedRef.current = true;
              if (pendingSlideRef.current) {
                pendingSlideRef.current = false;
                modeRef.current = "slide";
                setCurrentMode("slide");
                slideTimerRef.current = SLIDE_DURATION_FRAMES;
                switchSprite("slide-0");
              } else {
                modeRef.current = "run";
                setCurrentMode("run");
                switchSprite("run-0");
              }
            } else {
              const vy = velocityYRef.current;
              if (vy < -7) {
                switchSprite("jump-1");
              } else if (vy >= -7 && vy <= 4) {
                switchSprite("jump-2");
              } else {
                switchSprite("jump-3");
              }
            }

            if (foxContainerRef.current) {
              foxContainerRef.current.style.transform = `translate3d(0, ${foxYRef.current}px, 0)`;
            }
            if (shadowRef.current) {
              const shadowScale = Math.max(0.35, 1 - Math.abs(foxYRef.current) / 200);
              const shadowOpacity = Math.max(0.12, 0.35 - Math.abs(foxYRef.current) / 450);
              shadowRef.current.style.transform = `scaleX(${shadowScale})`;
              shadowRef.current.style.opacity = `${shadowOpacity}`;
            }
          }

          // Slide Mechanism
          if (modeRef.current === "slide") {
            slideTimerRef.current -= timeFactor;
            const progress = 1 - slideTimerRef.current / SLIDE_DURATION_FRAMES;
            if (progress < 0.15) {
              switchSprite("slide-0");
            } else if (progress < 0.85) {
              switchSprite("slide-1");
            } else if (progress < 1.0) {
              switchSprite("slide-2");
            } else {
              modeRef.current = "run";
              setCurrentMode("run");
              switchSprite("run-0");
            }

            if (shadowRef.current) {
              shadowRef.current.style.transform = "scaleX(1.4)";
              shadowRef.current.style.opacity = "0.45";
            }
          }

          // Run Stride Animation
          if (modeRef.current === "run" || modeRef.current === "idle") {
            const runInterval = Math.max(65, 105 - (gameSpeedRef.current - 6.2) * 4);
            if (now - lastRunFrameTimeRef.current >= runInterval) {
              runFrameIdxRef.current = (runFrameIdxRef.current + 1) % 4;
              switchSprite(`run-${runFrameIdxRef.current}`);
              lastRunFrameTimeRef.current = now;
            }

            if (shadowRef.current && isGroundedRef.current) {
              shadowRef.current.style.transform = "scaleX(1.0)";
              shadowRef.current.style.opacity = "0.35";
            }
          }

          // Obstacle Spawner
          if (gameStartedRef.current) {
            spawnCooldownRef.current -= timeFactor;

            if (spawnCooldownRef.current <= 0) {
              if (activeObstaclesRef.current.length < POOL_SIZE) {
                const usedSlots = new Set(activeObstaclesRef.current.map((o) => o.slotIndex));
                let freeSlot = -1;
                for (let i = 0; i < POOL_SIZE; i++) {
                  if (!usedSlots.has(i)) {
                    freeSlot = i;
                    break;
                  }
                }

                if (freeSlot !== -1) {
                  const type: "samosa" | "jalebi" = Math.random() < 0.52 ? "samosa" : "jalebi";
                  const newObs: ObstacleData = {
                    id: nextObstacleIdRef.current++,
                    type,
                    x: arenaW + 35,
                    slotIndex: freeSlot,
                  };
                  activeObstaclesRef.current.push(newObs);

                  const slot = obstacleSlotsRef.current[freeSlot];
                  const samosaImg = obstacleSamosaImgsRef.current[freeSlot];
                  const jalebiImg = obstacleJalebiImgsRef.current[freeSlot];
                  const badge = obstacleBadgesRef.current[freeSlot];

                  if (slot && samosaImg && jalebiImg && badge) {
                    slot.style.display = "flex";
                    slot.style.transform = `translate3d(${newObs.x}px, 0, 0)`;

                    const groundBaseline = isDesktop ? 48 : (isLandscapeMode ? 58 : 32);
                    if (type === "samosa") {
                      slot.style.bottom = `${groundBaseline}px`;
                      samosaImg.style.display = "block";
                      jalebiImg.style.display = "none";
                      badge.textContent = "JUMP!";
                      badge.style.background = "#FFCD3C";
                      badge.style.color = "#522C28";
                    } else {
                      slot.style.bottom = `${groundBaseline + (isDesktop ? 70 : 36)}px`;
                      samosaImg.style.display = "none";
                      jalebiImg.style.display = "block";
                      badge.textContent = "SLIDE!";
                      badge.style.background = "#F37D20";
                      badge.style.color = "#FFFFFF";
                    }
                  }

                  const baseCooldown = isDesktop ? 130 : 135;
                  const speedScale = (isDesktop ? 6.2 : 4.8) / gameSpeedRef.current;
                  spawnCooldownRef.current = Math.floor(baseCooldown * speedScale + Math.random() * 40);
                }
              }
            }
          }

          // Obstacle Translation & Hitbox Collision (Tight, fair core hitboxes)
          const foxX = arenaW * (isDesktop ? 0.17 : 0.22);
          const foxHitboxLeft = foxX + (isDesktop ? 45 : 24);
          const foxHitboxRight = foxX + (isDesktop ? 115 : 60);

          let collision = false;
          const survivingObstacles: ObstacleData[] = [];

          for (let i = 0; i < activeObstaclesRef.current.length; i++) {
            const obs = activeObstaclesRef.current[i];
            obs.x -= gameSpeedRef.current * timeFactor;

            const slot = obstacleSlotsRef.current[obs.slotIndex];
            if (slot) {
              slot.style.transform = `translate3d(${obs.x}px, 0, 0)`;
            }

            const obsHitboxLeft = obs.x + (isDesktop ? 16 : 8);
            const obsHitboxRight = obs.x + (isDesktop ? 64 : 36);

            if (foxHitboxRight > obsHitboxLeft && foxHitboxLeft < obsHitboxRight) {
              if (obs.cleared) {
                // Successfully cleared earlier in this dodge - immune to landing or slide ending
              } else if (obs.type === "samosa") {
                const jumpSafeThreshold = isDesktop ? -28 : -10;
                if (!isGroundedRef.current && (foxYRef.current < jumpSafeThreshold || velocityYRef.current < -3)) {
                  // Active jump clears the samosa! Mark cleared immediately so landing never crashes
                  obs.cleared = true;
                } else {
                  collision = true;
                }
              } else if (obs.type === "jalebi") {
                if (modeRef.current === "slide") {
                  // Active slide ducks under the jalebi! Mark cleared immediately so exiting slide never crashes
                  obs.cleared = true;
                } else {
                  collision = true;
                }
              }
            }

            if (obs.x > -120) {
              survivingObstacles.push(obs);
            } else if (slot) {
              slot.style.display = "none";
            }
          }

          activeObstaclesRef.current = survivingObstacles;

          if (collision) {
            triggerCrash();
          }
        } else {
          // Crash Animation
          crashTimerRef.current += timeFactor;
          const crashIdx = Math.min(4, Math.floor(crashTimerRef.current / 7));
          switchSprite(`crash-${crashIdx}`);

          if (crashTimerRef.current > 38 && !gameOver) {
            setGameOver(true);
            const finalDist = Math.floor(distanceRef.current / 8);
            setFinalScore(finalDist);
            setEarnedPoints(null);
            setHighScore((prev) => {
              const best = Math.max(prev, finalDist);
              try {
                localStorage.setItem("bitedash_high_score", best.toString());
              } catch {}
              if (bestTextRef.current) bestTextRef.current.textContent = `${best}m`;
              return best;
            });

            if (userRef.current) {
              setSavingScore(true);
              fetch("/api/game/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ distance: finalDist }),
              })
                .then((r) => r.json())
                .then((d) => {
                  if (d.ok) {
                    setEarnedPoints(d.pointsEarned ?? 0);
                    if (Array.isArray(d.leaderboard)) setLeaderboard(d.leaderboard);
                    if (d.user?.gameHighScore) {
                      setHighScore((p) => Math.max(p, d.user.gameHighScore));
                    }
                    void refreshUser();
                  }
                })
                .catch(() => {})
                .finally(() => setSavingScore(false));
            }
          }
        }
      } catch (err) {
        console.error("[LOOP ERROR]", err);
      }

      if (isVisible) {
        animId = requestAnimationFrame(loop);
      }
    };

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const nowVisible = entry.isIntersecting || isLandscapeMode;
        if (nowVisible && !isVisible) {
          isVisible = true;
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        } else if (!nowVisible && isVisible && !isLandscapeMode) {
          isVisible = false;
          cancelAnimationFrame(animId);
        }
      },
      { threshold: 0.05 }
    );

    if (arenaRef.current) {
      observer.observe(arenaRef.current);
    }

    if (isLandscapeMode) {
      isVisible = true;
      lastTime = performance.now();
      animId = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, [switchSprite, triggerCrash, isLandscapeMode, gameOver]);

  // Sky Theme Gradients
  const skyThemeClasses = {
    day: "from-[#4EA8DE] via-[#85B6FF] to-[#D67AC6]",
    sunset: "from-[#F3705A] via-[#FF9F68] to-[#D67AC6]",
    night: "from-[#1B1A47] via-[#482868] to-[#8C3E7B]",
  };

  return (
    <div
      ref={arenaRef}
      onClick={handleArenaClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`${
        isLandscapeMode
          ? "fixed z-[9999] inset-0 w-full h-full flex flex-col justify-between select-none cursor-pointer overflow-hidden touch-none"
          : "relative w-full min-h-[440px] sm:min-h-[580px] flex flex-col justify-between select-none cursor-pointer overflow-hidden [contain:layout_paint]"
      } bg-gradient-to-b ${skyThemeClasses[skyTheme]} transition-colors duration-700`}
      style={
        isRotatedPortrait
          ? {
              position: "fixed",
              top: 0,
              left: "100vw",
              width: "100dvh",
              height: "100dvw",
              transform: "rotate(90deg)",
              transformOrigin: "top left",
              zIndex: 9999,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              paddingLeft: "env(safe-area-inset-left, 0px)",
              paddingRight: "env(safe-area-inset-right, 0px)",
            }
          : isLandscapeMode
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              zIndex: 9999,
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              paddingLeft: "env(safe-area-inset-left, 0px)",
              paddingRight: "env(safe-area-inset-right, 0px)",
            }
          : {}
      }
      title="Click anywhere to Jump!"
    >
      {/* =========================================================================
          TOP GAME HEADER & HUD
          ========================================================================= */}
      <div className={`w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 relative z-30 shrink-0 ${isLandscapeMode ? "pt-1.5 pb-0.5 max-w-5xl" : "pt-3 sm:pt-5"}`}>
        {!gameStarted && !gameOver ? (
          /* =========================================================================
             IDLE / LANDING TOP CTA BADGE (Decluttered, minimal, engaging)
             ========================================================================= */
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={triggerJump}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-white shadow-xl hover:bg-black/55 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-base sm:text-lg animate-bounce">🎮</span>
              <span className="font-display font-black text-xs sm:text-sm tracking-widest uppercase text-white group-hover:text-[#FFCD3C] transition-colors">
                Sprint &amp; Win • Tap to Play Game
              </span>
              <span className="text-sm sm:text-base">🍿</span>
            </button>
          </div>
        ) : (
          /* =========================================================================
             ACTIVE GAMEPLAY SCOREBOARD & HUD (Rendered only during active run)
             ========================================================================= */
          <>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center justify-between gap-1.5 sm:gap-3 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-white shadow-xl ${
                isLandscapeMode ? "flex-nowrap px-2.5 py-1 text-xs" : "flex-wrap px-3 sm:px-4 py-2 sm:py-2.5"
              }`}
            >
              {/* Live Score & Speed Indicator */}
              <div className="flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-display tracking-wide flex-nowrap">
                <div className="flex items-center gap-1">
                  <span className="text-white/70 uppercase text-[10px] sm:text-xs">Score:</span>
                  <span ref={scoreTextRef} className="font-mono text-xs sm:text-base font-bold text-[#FFCD3C]">
                    0m
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white/70 uppercase text-[10px] sm:text-xs">Best:</span>
                  <span ref={bestTextRef} className="font-mono text-[11px] sm:text-sm text-white/90">
                    {highScore}m
                  </span>
                </div>
                <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-md bg-white/15 border border-white/10">
                  <span className="text-[9px] sm:text-[11px] text-white/80">⚡</span>
                  <span ref={speedTextRef} className="font-mono text-[10px] sm:text-xs font-bold text-[#FFCD3C]">
                    1.0x
                  </span>
                </div>
                {user ? (
                  <Link
                    href="/account"
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAC537] text-[#522C28] text-[11px] font-black shadow-xs hover:scale-105 transition-transform"
                  >
                    <span>🪙 {user.loyaltyPoints} pts</span>
                  </Link>
                ) : (
                  <Link
                    href="/login?next=/#discover"
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold border border-white/20"
                  >
                    <span>Sign in to Earn Pts</span>
                  </Link>
                )}
              </div>

              {/* Action Hints & Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap shrink-0">
              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wide cursor-pointer"
              >
                🏆 Top Runs
              </button>
              {/* Landscape Toggle Button */}
              {!isLandscapeMode ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    enterLandscape();
                  }}
                  className="flex lg:hidden items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFCD3C] to-[#F37D20] text-[#522C28] font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
                  title="Play in Wide Landscape Mode"
                >
                  <span>🎮 Landscape</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exitLandscape();
                  }}
                  className="flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-red-600/90 active:bg-red-700 text-white font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
                  title="Exit Landscape Mode"
                >
                  <span>✕ Exit</span>
                </button>
              )}

              {/* Sky Mood Toggles (Hidden in mobile landscape to save precious vertical space) */}
              {!isLandscapeMode && (
                <div className="hidden sm:flex items-center bg-black/30 rounded-full p-0.5 border border-white/15">
                  <button
                    onClick={() => setSkyTheme("day")}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-display transition-all ${
                      skyTheme === "day" ? "bg-white text-[#4EA8DE] shadow-md font-bold" : "text-white/80 hover:text-white"
                    }`}
                    title="Sunny Day Sky"
                  >
                    ☀️ Day
                  </button>
                  <button
                    onClick={() => setSkyTheme("sunset")}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-display transition-all ${
                      skyTheme === "sunset" ? "bg-white text-[#F3705A] shadow-md font-bold" : "text-white/80 hover:text-white"
                    }`}
                    title="Sunset Sky"
                  >
                    🌅 Sunset
                  </button>
                  <button
                    onClick={() => setSkyTheme("night")}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-display transition-all ${
                      skyTheme === "night" ? "bg-white text-[#1B1A47] shadow-md font-bold" : "text-white/80 hover:text-white"
                    }`}
                    title="Night Sky"
                  >
                    🌙 Night
                  </button>
                </div>
              )}

              {/* Desktop Control Buttons (Hidden in mobile landscape) */}
              {!isLandscapeMode && (
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={resetToRun}
                    className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider transition-all shadow-sm ${
                      currentMode === "run"
                        ? "bg-white text-[#522C28] font-bold shadow-md ring-2 ring-white"
                        : "bg-white/20 text-white hover:bg-white/35"
                    }`}
                  >
                    🏃 Run
                  </button>
                  <button
                    onClick={triggerJump}
                    className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider transition-all shadow-sm ${
                      currentMode === "jump"
                        ? "bg-[#FFCD3C] text-[#522C28] font-bold shadow-md ring-2 ring-white"
                        : "bg-white/20 text-white hover:bg-white/35"
                    }`}
                  >
                    🦘 Jump
                  </button>
                  <button
                    onClick={triggerSlide}
                    className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider transition-all shadow-sm ${
                      currentMode === "slide"
                        ? "bg-[#F37D20] text-white font-bold shadow-md ring-2 ring-white"
                        : "bg-white/20 text-white hover:bg-white/35"
                    }`}
                  >
                    🛹 Slide
                  </button>
                </div>
              )}
            </div>
            </div>

            {/* Mobile Touch Instructions Dropdown Pill */}
            {!isDesktopScreen && (
              <div className="flex justify-center mt-1 sm:mt-1.5 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-md animate-pulse">
                  <span className="text-[#FFCD3C]">↑ Tap / Swipe Up to Jump</span>
                  <span className="text-white/40">•</span>
                  <span className="text-[#F37D20]">↓ Swipe Down to Slide</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================================================================
          OPEN CARTOON RUNNER ARENA
          ========================================================================= */}
      <div className={`relative w-full ${isLandscapeMode ? "flex-1 min-h-0" : "h-[340px] sm:h-[460px]"} flex items-end overflow-hidden`}>

        {/* PARALLAX SKY ATMOSPHERE */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* CELESTIAL */}
          {skyTheme !== "night" ? (
            <div className="absolute top-4 sm:top-6 right-8 sm:right-28 z-1 flex items-center justify-center pointer-events-none">
              <div className="absolute w-24 sm:w-36 h-24 sm:h-36 rounded-full bg-[radial-gradient(circle,rgba(255,205,60,0.45)_0%,rgba(255,205,60,0.16)_50%,transparent_72%)] pointer-events-none" />
              <svg viewBox="0 0 100 100" className="w-16 sm:w-28 h-16 sm:h-28 animate-sun-spin opacity-85" fill="none">
                <circle cx="50" cy="50" r="22" fill="#FFCD3C" />
                <circle cx="50" cy="50" r="18" fill="#FFE072" />
                {[...Array(12)].map((_, i) => (
                  <path key={i} d="M 50 18 L 47 4 L 53 4 Z" fill="#FFCD3C" transform={`rotate(${i * 30} 50 50)`} />
                ))}
              </svg>
            </div>
          ) : (
            <div className="absolute top-4 sm:top-6 right-10 sm:right-32 z-1 flex items-center justify-center pointer-events-none">
              <div className="absolute w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-[radial-gradient(circle,rgba(255,234,167,0.38)_0%,rgba(255,234,167,0.12)_50%,transparent_72%)] pointer-events-none" />
              <svg viewBox="0 0 100 100" className="w-14 sm:w-20 h-14 sm:h-20 text-[#FFEAA7]" fill="currentColor">
                <path d="M 50 15 A 35 35 0 1 0 85 50 A 28 28 0 1 1 50 15 Z" />
              </svg>
            </div>
          )}

          {/* FLYING BIRDS */}
          <div className="absolute top-8 left-0 w-full pointer-events-none animate-bird-glide opacity-70">
            <svg viewBox="0 0 120 40" className="w-12 sm:w-16 h-5 sm:h-6 text-white/80" fill="currentColor">
              <path d="M 0 15 Q 15 0 30 15 Q 45 0 60 15 Q 45 8 30 18 Q 15 8 0 15 Z" />
            </svg>
          </div>

          {/* CLOUDS */}
          <div className="w-[200%] absolute top-2 sm:top-4 left-0 flex animate-cloud-drift-slow opacity-65">
            <div className="w-1/2 flex justify-around items-center px-6 sm:px-10">
              <svg viewBox="0 0 200 90" className="w-24 sm:w-36 h-12 sm:h-16">
                <path d="M 40 70 A 25 25 0 0 1 65 35 A 30 30 0 0 1 125 30 A 25 25 0 0 1 165 50 A 22 22 0 0 1 155 70 Z" fill="white" />
              </svg>
              <svg viewBox="0 0 240 100" className="w-32 sm:w-44 h-14 sm:h-20">
                <path d="M 45 75 A 25 25 0 0 1 70 40 A 35 35 0 0 1 140 32 A 30 30 0 0 1 190 48 A 24 24 0 0 1 195 75 Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SOLID GROUND BASELINE LINE (Single shared baseline for EVERYTHING)
            ========================================================================= */}
        <div
          className={`absolute left-0 w-full bg-white border-b-2 border-[#522C28]/25 z-15 shadow-sm ${
            isDesktopScreen
              ? "bottom-[48px] h-[6px]"
              : isLandscapeMode
              ? "bottom-[58px] h-[5px]"
              : "bottom-[32px] h-[4px]"
          }`}
        />

        {/* RUNNING TRACK GROUND TURF */}
        <div
          className={`absolute bottom-0 left-0 w-full overflow-hidden z-10 bg-gradient-to-t from-black/20 to-transparent ${
            isDesktopScreen ? "h-[48px]" : isLandscapeMode ? "h-[58px]" : "h-[32px]"
          }`}
        >
          <div ref={groundStripRef} className="w-[2400px] h-full flex will-change-transform">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-[120px] h-full flex items-center justify-around px-2">
                <span className="w-8 sm:w-10 h-1 sm:h-1.5 bg-white/60 rounded-full" />
                <span className="w-4 sm:w-6 h-1 sm:h-1.5 bg-white/40 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PRE-ALLOCATED POOLED OBSTACLE SLOTS (Scaled up for crisp mobile visibility)
            ========================================================================= */}
        {[...Array(POOL_SIZE)].map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              obstacleSlotsRef.current[i] = el;
            }}
            className="absolute z-20 left-0 pointer-events-none will-change-transform flex-col items-center justify-end"
            style={{ display: "none", transform: "translate3d(-999px, 0, 0)" }}
          >
            {/* Samosa */}
            <img
              ref={(el) => {
                obstacleSamosaImgsRef.current[i] = el;
              }}
              src="/fox/obstacles/samosa.png"
              alt="Samosa"
              loading="eager"
              decoding="async"
              className={`object-contain object-bottom pointer-events-none ${
                isDesktopScreen
                  ? "w-20 h-20"
                  : "w-11 h-11"
              }`}
              style={{ display: "none" }}
            />

            {/* Jalebi */}
            <img
              ref={(el) => {
                obstacleJalebiImgsRef.current[i] = el;
              }}
              src="/fox/obstacles/jalebi.png"
              alt="Jalebi"
              loading="eager"
              decoding="async"
              className={`object-contain object-bottom pointer-events-none ${
                isDesktopScreen
                  ? "w-20 h-20"
                  : "w-11 h-11"
              }`}
              style={{ display: "none" }}
            />

            {/* Badge Indicator */}
            <span
              ref={(el) => {
                obstacleBadgesRef.current[i] = el;
              }}
              className={`absolute rounded-full font-black uppercase shadow-sm tracking-wider ${
                isDesktopScreen
                  ? "-top-3 text-[9px] px-2 py-0.5"
                  : "-top-2.5 text-[8px] px-1.5 py-0.5"
              }`}
            >
              JUMP!
            </span>
          </div>
        ))}

        {/* =========================================================================
            COMPLETE 16-FRAME SPRITE DECK
            ========================================================================= */}
        <div
          ref={foxContainerRef}
          className={`absolute z-25 flex items-end justify-center pointer-events-none will-change-transform ${
            isDesktopScreen
              ? "bottom-[48px] left-[17%] w-[190px] h-[190px]"
              : isLandscapeMode
              ? "bottom-[58px] left-[22%] w-[92px] h-[92px]"
              : "bottom-[32px] left-[22%] w-[86px] h-[86px]"
          }`}
        >
          {ALL_SPRITES.map((sprite) => (
            <img
              key={sprite.id}
              ref={(el) => {
                spriteElementsRef.current[sprite.id] = el;
              }}
              src={sprite.src}
              alt={sprite.id}
              loading="eager"
              decoding="async"
              className="absolute bottom-0 w-full h-full object-contain object-bottom will-change-transform"
              style={{ display: sprite.id === "run-0" ? "block" : "none" }}
            />
          ))}
        </div>

        {/* Dynamic Ground Shadow */}
        <div
          ref={shadowRef}
          className={`absolute z-10 bg-black/35 rounded-full blur-[2px] pointer-events-none will-change-transform ${
            isDesktopScreen
              ? "bottom-[44px] left-[17%] translate-x-[45px] w-32 h-3.5"
              : isLandscapeMode
              ? "bottom-[54px] left-[22%] translate-x-[10px] w-18 h-3"
              : "bottom-[28px] left-[22%] translate-x-[10px] w-16 h-2.5"
          }`}
        />

        {/* =========================================================================
            READY TO PLAY OVERLAY (Minimal, focused on conversion)
            ========================================================================= */}
        {!gameStarted && !gameOver && (
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement)?.closest("button, a")) return;
              triggerJump();
            }}
            className="absolute inset-0 z-35 flex items-center justify-center cursor-pointer pointer-events-auto px-4"
          >
            <div className="px-5 sm:px-7 py-3 sm:py-4 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[#522C28]/15 flex flex-col items-center gap-2 sm:gap-3 text-center max-w-sm sm:max-w-md hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl animate-float-gentle">🏃</span>
                <span className="font-display text-sm sm:text-base text-[#522C28] uppercase tracking-wide block font-black">
                  Tap anywhere to Play!
                </span>
              </div>

              {!isDesktopScreen && (
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-[#522C28]/80 bg-[#FFF8EE] px-3 py-1 rounded-full border border-[#522C28]/10">
                  <span className="text-[#D73B3A]">↑ Swipe Up / Tap: Jump</span>
                  <span>•</span>
                  <span className="text-[#F37D20]">↓ Swipe Down: Slide</span>
                </div>
              )}

              {!isDesktopScreen && !isLandscapeMode && (
                <button
                  type="button"
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    enterLandscape();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    enterLandscape();
                  }}
                  className="w-full sm:w-auto mt-1 sm:mt-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFCD3C] to-[#F37D20] text-[#522C28] font-display text-[11px] uppercase tracking-wider shadow-sm font-black flex items-center justify-center gap-1 active:scale-95 cursor-pointer z-50 relative pointer-events-auto"
                >
                  <span>🎮 Play Landscape</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            GAME OVER MODAL
            ========================================================================= */}
        {gameOver && (
          <div className="animate-panel-pop absolute inset-0 bg-black/45 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-3 sm:gap-4 border-2 border-[#522C28]/10 max-w-xs sm:max-w-sm mx-auto">
              <span className="text-4xl sm:text-5xl animate-float-gentle">💥</span>
              <div>
                <h4 className="font-display text-xl sm:text-2xl text-[#D73B3A] uppercase tracking-wide font-black">
                  Game Over!
                </h4>
                <p className="text-[11px] sm:text-xs text-[#522C28]/80 font-sans mt-0.5">
                  You tripped over a snack!
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-4 sm:gap-5 py-2 px-5 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10">
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#522C28]/60 block">Distance</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-[#522C28]">{finalScore}m</span>
                  </div>
                  <div className="w-[1px] h-7 bg-[#522C28]/15" />
                  <div className="text-center">
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#522C28]/60 block">Best</span>
                    <span className="font-mono text-lg sm:text-xl font-black text-[#FFCD3C]">{highScore}m</span>
                  </div>
                </div>

                {user ? (
                  <div className="mt-2.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black">
                    {savingScore
                      ? "Saving score & Crunch Points..."
                      : earnedPoints !== null
                      ? `+${earnedPoints} Crunch Points Earned! (Total: ${user.loyaltyPoints} pts)`
                      : `Signed in as ${user.fullName} — Run saved!`}
                  </div>
                ) : (
                  <Link
                    href="/login?next=/#discover"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2.5 block px-3 py-2 rounded-xl bg-[#FAC537]/30 border border-[#FAC537] text-[#522C28] text-[11px] font-black hover:bg-[#FAC537]/50 transition-colors"
                  >
                    Sign in to save high scores & earn Crunch Points (₹ discount) →
                  </Link>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full mt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEarnedPoints(null);
                    resetToRun();
                  }}
                  className="w-full py-2.5 sm:py-3 rounded-2xl bg-[#D73B3A] hover:bg-[#FB0008] active:scale-95 text-white font-display text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all"
                >
                  Sprint Again
                </button>
                {isLandscapeMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exitLandscape();
                    }}
                    className="w-full py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 text-[#522C28] font-display text-xs uppercase tracking-wider"
                  >
                    Exit Landscape
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LEADERBOARD MODAL
            ========================================================================= */}
        {showLeaderboard && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowLeaderboard(false);
            }}
            className="animate-panel-pop absolute inset-0 bg-black/55 backdrop-blur-xs z-45 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl border-2 border-[#FAC537] text-[#522C28]"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-xl uppercase text-[#25100E]">
                  🏆 Fox Runner Hall of Fame
                </h4>
                <button
                  type="button"
                  onClick={() => setShowLeaderboard(false)}
                  className="text-xs font-black px-2 py-1 rounded-full bg-[#FFF8EE]"
                >
                  ✕
                </button>
              </div>
              {leaderboard.length === 0 ? (
                <p className="text-xs font-semibold text-[#522C28]/70 py-6 text-center">
                  No logged-in scores recorded yet. Sign in and set the first record!
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-bold ${
                        user?.id === entry.id
                          ? "bg-[#FFF8EE] border-[#D73B3A] text-[#D73B3A]"
                          : "bg-[#FFF8EE]/50 border-[#522C28]/10"
                      }`}
                    >
                      <span>
                        #{entry.rank} {entry.name}
                      </span>
                      <span className="font-mono font-black">{entry.highScore}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
