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
  const SLIDE_DURATION_FRAMES = 32;

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
      setIsDevicePortrait(window.innerHeight > window.innerWidth);
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
  }, [isLandscapeMode]);

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
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (screen.orientation && "lock" in screen.orientation) {
        await (screen.orientation as any).lock("landscape");
      }
    } catch {}
    setTimeout(() => {
      if (arenaRef.current) {
        arenaWidthRef.current = arenaRef.current.clientWidth;
      }
    }, 120);
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
    }, 120);
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

    if (isGroundedRef.current) {
      isGroundedRef.current = false;
      velocityYRef.current = -15.2;
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
      velocityYRef.current = Math.max(velocityYRef.current, 13.5);
      return;
    }

    if (modeRef.current !== "slide") {
      modeRef.current = "slide";
      setCurrentMode("slide");
      slideTimerRef.current = SLIDE_DURATION_FRAMES;
      switchSprite("slide-0");
    }
  }, [switchSprite]);

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

    const GRAVITY = 0.74;

    const loop = (now: number) => {
      try {
        const delta = Math.min(now - lastTime, 40);
        lastTime = now;
        const timeFactor = delta / 16.67;

        const arenaW = arenaWidthRef.current || 1200;
        const isMobilePortrait = !isLandscapeMode && arenaW < 640;

        if (modeRef.current !== "crash") {
          // Ground motion
          groundXRef.current = (groundXRef.current + gameSpeedRef.current * timeFactor) % 240;
          if (groundStripRef.current) {
            groundStripRef.current.style.transform = `translate3d(-${groundXRef.current}px, 0, 0)`;
          }

          // Distance & Speed
          if (gameStartedRef.current) {
            distanceRef.current += gameSpeedRef.current * timeFactor;
            const dynamicSpeed = Math.min(13.5, 6.2 + (distanceRef.current / 3600) * 2.2);
            gameSpeedRef.current = dynamicSpeed;

            if (now - lastHudUpdateTime >= 100) {
              const currentMeters = Math.floor(distanceRef.current / 8);
              if (scoreTextRef.current) scoreTextRef.current.textContent = `${currentMeters}m`;
              if (speedTextRef.current) speedTextRef.current.textContent = `${(dynamicSpeed / 6.2).toFixed(1)}x`;
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
              modeRef.current = "run";
              setCurrentMode("run");
              switchSprite("run-0");
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

                    if (type === "samosa") {
                      slot.style.bottom = isMobilePortrait ? "34px" : "48px";
                      samosaImg.style.display = "block";
                      jalebiImg.style.display = "none";
                      badge.textContent = "JUMP!";
                      badge.style.background = "#FFCD3C";
                      badge.style.color = "#522C28";
                    } else {
                      slot.style.bottom = isMobilePortrait ? "84px" : "128px";
                      samosaImg.style.display = "none";
                      jalebiImg.style.display = "block";
                      badge.textContent = "SLIDE!";
                      badge.style.background = "#F37D20";
                      badge.style.color = "#FFFFFF";
                    }
                  }

                  const baseCooldown = isMobilePortrait ? 150 : 130;
                  const speedScale = 6.2 / gameSpeedRef.current;
                  spawnCooldownRef.current = Math.floor(baseCooldown * speedScale + Math.random() * 45);
                }
              }
            }
          }

          // Obstacle Translation & Hitbox Collision
          const foxX = arenaW * (isMobilePortrait ? 0.10 : 0.17);
          const foxHitboxLeft = foxX + (isMobilePortrait ? 16 : 38);
          const foxHitboxRight = foxX + (isMobilePortrait ? 72 : 125);

          let collision = false;
          const survivingObstacles: ObstacleData[] = [];

          for (let i = 0; i < activeObstaclesRef.current.length; i++) {
            const obs = activeObstaclesRef.current[i];
            obs.x -= gameSpeedRef.current * timeFactor;

            const slot = obstacleSlotsRef.current[obs.slotIndex];
            if (slot) {
              slot.style.transform = `translate3d(${obs.x}px, 0, 0)`;
            }

            const obsHitboxLeft = obs.x + (isMobilePortrait ? 8 : 18);
            const obsHitboxRight = obs.x + (obs.type === "samosa" ? (isMobilePortrait ? 34 : 64) : (isMobilePortrait ? 30 : 58));

            if (foxHitboxRight > obsHitboxLeft && foxHitboxLeft < obsHitboxRight) {
              if (obs.type === "samosa") {
                const jumpSafeThreshold = isMobilePortrait ? -28 : -48;
                const safe = !isGroundedRef.current && foxYRef.current < jumpSafeThreshold;
                if (!safe) collision = true;
              } else if (obs.type === "jalebi") {
                const safe = modeRef.current === "slide";
                if (!safe) collision = true;
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

  const isRotatedPortrait = isLandscapeMode && isDevicePortrait;

  return (
    <div
      ref={arenaRef}
      onClick={triggerJump}
      className={`${
        isLandscapeMode
          ? "fixed z-[9999] inset-0 w-screen h-screen flex flex-col justify-between select-none cursor-pointer overflow-hidden touch-none"
          : "relative w-full min-h-[440px] sm:min-h-[580px] flex flex-col justify-between select-none cursor-pointer overflow-hidden [contain:layout_paint]"
      } bg-gradient-to-b ${skyThemeClasses[skyTheme]} transition-colors duration-700`}
      style={
        isRotatedPortrait
          ? {
              position: "fixed",
              top: 0,
              left: "100vw",
              width: "100vh",
              height: "100vw",
              transform: "rotate(90deg)",
              transformOrigin: "top left",
              zIndex: 9999,
            }
          : isLandscapeMode
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
            }
          : {}
      }
      title="Click anywhere to Jump!"
    >
      {/* =========================================================================
          TOP GAME HEADER & HUD
          ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 relative z-30">
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-xl"
        >
          {/* Live Score & Speed Indicator */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-display tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="text-white/70 uppercase">Score:</span>
              <span ref={scoreTextRef} className="font-mono text-sm sm:text-base font-bold text-[#FFCD3C]">
                0m
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white/70 uppercase">Best:</span>
              <span ref={bestTextRef} className="font-mono text-xs sm:text-sm text-white/90">
                {highScore}m
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-md bg-white/15 border border-white/10">
              <span className="text-[10px] sm:text-[11px] text-white/80">⚡ Speed:</span>
              <span ref={speedTextRef} className="font-mono text-[11px] sm:text-xs font-bold text-[#FFCD3C]">
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
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowLeaderboard(true)}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-black uppercase tracking-wide cursor-pointer"
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
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600/90 active:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
                title="Exit Landscape Mode"
              >
                <span>✕ Exit</span>
              </button>
            )}

            {/* Sky Mood Toggles */}
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

            {/* Desktop Control Buttons */}
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
          </div>
        </div>
      </div>

      {/* =========================================================================
          OPEN CARTOON RUNNER ARENA
          ========================================================================= */}
      <div className={`relative w-full ${isLandscapeMode ? "h-full my-auto" : "h-[340px] sm:h-[460px]"} flex items-end overflow-visible`}>

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
            isLandscapeMode ? "bottom-[48px] h-[6px]" : "bottom-[34px] sm:bottom-[48px] h-[4px] sm:h-[6px]"
          }`}
        />

        {/* RUNNING TRACK GROUND TURF */}
        <div
          className={`absolute bottom-0 left-0 w-full overflow-hidden z-10 bg-gradient-to-t from-black/20 to-transparent ${
            isLandscapeMode ? "h-[48px]" : "h-[34px] sm:h-[48px]"
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
            PRE-ALLOCATED POOLED OBSTACLE SLOTS (Scaled down gracefully on portrait mobile)
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
            {/* Samosa: scaled to w-10 h-10 on portrait mobile */}
            <img
              ref={(el) => {
                obstacleSamosaImgsRef.current[i] = el;
              }}
              src="/fox/obstacles/samosa.png"
              alt="Samosa"
              loading="lazy"
              decoding="async"
              className={`object-contain object-bottom pointer-events-none ${
                isLandscapeMode
                  ? "w-16 sm:w-20 h-16 sm:h-20"
                  : "w-10 sm:w-20 h-10 sm:h-20"
              }`}
              style={{ display: "none" }}
            />

            {/* Jalebi: scaled to w-10 h-10 on portrait mobile */}
            <img
              ref={(el) => {
                obstacleJalebiImgsRef.current[i] = el;
              }}
              src="/fox/obstacles/jalebi.png"
              alt="Jalebi"
              loading="lazy"
              decoding="async"
              className={`object-contain object-bottom pointer-events-none ${
                isLandscapeMode
                  ? "w-16 sm:w-20 h-16 sm:h-20"
                  : "w-10 sm:w-20 h-10 sm:h-20"
              }`}
              style={{ display: "none" }}
            />

            {/* Badge Indicator */}
            <span
              ref={(el) => {
                obstacleBadgesRef.current[i] = el;
              }}
              className="absolute -top-3 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase shadow-sm tracking-wider"
            >
              JUMP!
            </span>
          </div>
        ))}

        {/* =========================================================================
            COMPLETE 16-FRAME SPRITE DECK: Scaled down gracefully on portrait mobile
            ========================================================================= */}
        <div
          ref={foxContainerRef}
          className={`absolute z-25 flex items-end justify-center pointer-events-none will-change-transform ${
            isLandscapeMode
              ? "bottom-[48px] left-[14%] sm:left-[17%] w-[160px] sm:w-[190px] h-[160px] sm:h-[190px]"
              : "bottom-[34px] sm:bottom-[48px] left-[10%] sm:left-[17%] w-[95px] sm:w-[190px] h-[95px] sm:h-[190px]"
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
              loading="lazy"
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
            isLandscapeMode
              ? "bottom-[44px] left-[14%] sm:left-[17%] translate-x-[35px] sm:translate-x-[45px] w-28 sm:w-32 h-3.5"
              : "bottom-[30px] sm:bottom-[44px] left-[10%] sm:left-[17%] translate-x-[18px] sm:translate-x-[45px] w-18 sm:w-32 h-2 sm:h-3.5"
          }`}
        />

        {/* =========================================================================
            LANDSCAPE MODE DUAL THUMB ARCADE CONTROLS
            ========================================================================= */}
        {isLandscapeMode && (
          <>
            {/* Left Thumb: SLIDE Button */}
            <div className="absolute bottom-4 left-6 z-40 pointer-events-auto flex items-center">
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  triggerSlide();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerSlide();
                }}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#F37D20]/90 active:bg-[#D8661E] text-white font-display text-xs uppercase shadow-[0_6px_20px_rgba(243,125,32,0.5)] border-2 border-white/60 active:scale-90 transition-transform backdrop-blur-md flex flex-col items-center justify-center cursor-pointer select-none"
              >
                <span className="text-xl">🛹</span>
                <span className="font-bold text-[10px] sm:text-[11px] mt-0.5">SLIDE</span>
              </button>
            </div>

            {/* Right Thumb: JUMP Button */}
            <div className="absolute bottom-4 right-6 z-40 pointer-events-auto flex items-center">
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  triggerJump();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerJump();
                }}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#FFCD3C]/95 active:bg-[#FCC434] text-[#522C28] font-display text-xs uppercase shadow-[0_6px_20px_rgba(255,205,60,0.5)] border-2 border-white/70 active:scale-90 transition-transform backdrop-blur-md flex flex-col items-center justify-center cursor-pointer select-none"
              >
                <span className="text-xl">🦘</span>
                <span className="font-bold text-[10px] sm:text-[11px] mt-0.5">JUMP</span>
              </button>
            </div>
          </>
        )}

        {/* =========================================================================
            READY TO PLAY OVERLAY
            ========================================================================= */}
        {!gameStarted && !gameOver && (
          <div
            onClick={triggerJump}
            className="absolute inset-0 z-35 flex items-center justify-center cursor-pointer pointer-events-auto px-4"
          >
            <div className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[#522C28]/15 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 hover:scale-105 transition-all text-center sm:text-left max-w-sm sm:max-w-md">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl animate-bounce">🏃</span>
                <div>
                  <span className="font-display text-xs sm:text-base text-[#522C28] uppercase tracking-wide block font-black">
                    Tap anywhere to Play!
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#522C28]/70 font-sans block">
                    🥟 Jump Samosas &nbsp;•&nbsp; 🌀 Slide Jalebis
                  </span>
                </div>
              </div>

              {!isLandscapeMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    enterLandscape();
                  }}
                  className="w-full sm:w-auto mt-1 sm:mt-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFCD3C] to-[#F37D20] text-[#522C28] font-display text-[11px] uppercase tracking-wider shadow-sm font-black flex items-center justify-center gap-1 active:scale-95"
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
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center animate-fade-in p-4">
            <div className="bg-white rounded-3xl p-5 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-3 sm:gap-4 border-2 border-[#522C28]/10 max-w-xs sm:max-w-sm mx-auto">
              <span className="text-4xl sm:text-5xl animate-bounce">💥</span>
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
            className="absolute inset-0 bg-black/55 backdrop-blur-xs z-45 flex items-center justify-center p-4"
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
