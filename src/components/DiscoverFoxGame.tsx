"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

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

  // PURE PHYSICS & MECHANISM REFS (No GSAP fighting rAF, pure velocity & gravity)
  const modeRef = useRef<Mode>("idle");
  const gameStartedRef = useRef(false);

  // Physics Variables
  const foxYRef = useRef(0); // 0 = ground baseline (bottom: 48px), negative = airborne
  const velocityYRef = useRef(0); // vertical speed (pixels/frame)
  const isGroundedRef = useRef(true);

  // Slide Mechanism
  const slideTimerRef = useRef(0); // frames remaining in slide
  const SLIDE_DURATION_FRAMES = 32; // ~530ms at 60fps

  // Crash Mechanism
  const crashTimerRef = useRef(0);

  // Stride Animation
  const runFrameIdxRef = useRef(0);
  const lastRunFrameTimeRef = useRef(0);

  // Live Metrics
  const nextObstacleIdRef = useRef(1);
  const spawnCooldownRef = useRef(180); // ~3s initial runway before first snack
  const gameSpeedRef = useRef(6.2); // Base speed
  const distanceRef = useRef(0);
  const groundXRef = useRef(0);
  const arenaWidthRef = useRef(1200);

  // Instant Sprite Switcher (0ms decode, 0ms style recalculation)
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

  // Resize Listener (caches arena width to avoid getBoundingClientRect in loop)
  useEffect(() => {
    const updateWidth = () => {
      if (arenaRef.current) {
        arenaWidthRef.current = arenaRef.current.clientWidth;
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // =========================================================================
  // PURE JUMP MECHANISM (Springy, Punchy Arcade Velocity)
  // =========================================================================
  const triggerJump = useCallback(() => {
    if (modeRef.current === "crash") return;

    // Start game on first input
    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      setGameStarted(true);
      modeRef.current = "run";
      setCurrentMode("run");
      spawnCooldownRef.current = 150;
    }

    // If currently sliding: JUMP CANCELS SLIDE IMMEDIATELY!
    if (modeRef.current === "slide") {
      slideTimerRef.current = 0;
    }

    // Can only jump if grounded
    if (isGroundedRef.current) {
      isGroundedRef.current = false;
      velocityYRef.current = -15.2; // Explosive upward impulse
      modeRef.current = "jump";
      setCurrentMode("jump");
      switchSprite("jump-0");
    }
  }, [switchSprite]);

  // =========================================================================
  // PURE SLIDE MECHANISM (Low Belly Skid, Fast-Fall in Air)
  // =========================================================================
  const triggerSlide = useCallback(() => {
    if (modeRef.current === "crash") return;

    // Start game on first input
    if (!gameStartedRef.current) {
      gameStartedRef.current = true;
      setGameStarted(true);
      modeRef.current = "run";
      setCurrentMode("run");
      spawnCooldownRef.current = 150;
    }

    // AIR-SLIDE FAST FALL: If user presses Slide while airborne, slam down fast!
    if (!isGroundedRef.current) {
      velocityYRef.current = Math.max(velocityYRef.current, 13.5);
      return;
    }

    // Enter Slide mode on ground
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

    // Reset Container & Shadow
    if (foxContainerRef.current) {
      foxContainerRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    if (shadowRef.current) {
      shadowRef.current.style.transform = "scaleX(1.0)";
      shadowRef.current.style.opacity = "0.35";
    }

    // Hide all pooled obstacle slots
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

  // Keyboard controls listener (Prevents key-repeat lockout)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Prevent OS key-repeat stutter

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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerJump, triggerSlide, triggerCrash, resetToRun]);

  // =========================================================================
  // 60FPS PURE MECHANISM ENGINE
  // Velocity, Gravity, Direct Transforms, Zero Style Thrashing
  // =========================================================================
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let lastHudUpdateTime = performance.now();

    const GRAVITY = 0.74; // Downward acceleration per tick

    const loop = (now: number) => {
      try {
        const delta = Math.min(now - lastTime, 40); // Cap delta to prevent frame spikes
        lastTime = now;
        const timeFactor = delta / 16.67;
        const arenaW = arenaWidthRef.current || 1200;

      // -----------------------------------------------------------------------
      // 1. RUNNER & TRACK MOVEMENT
      // -----------------------------------------------------------------------
      if (modeRef.current !== "crash") {
        // Continuous Ground Line Motion
        groundXRef.current = (groundXRef.current + gameSpeedRef.current * timeFactor) % 240;
        if (groundStripRef.current) {
          groundStripRef.current.style.transform = `translate3d(-${groundXRef.current}px, 0, 0)`;
        }

        // Distance & Speed Progression
        if (gameStartedRef.current) {
          distanceRef.current += gameSpeedRef.current * timeFactor;
          const dynamicSpeed = Math.min(13.5, 6.2 + (distanceRef.current / 3600) * 2.2);
          gameSpeedRef.current = dynamicSpeed;

          // Update HUD directly in DOM every 100ms
          if (now - lastHudUpdateTime >= 100) {
            const currentMeters = Math.floor(distanceRef.current / 8);
            if (scoreTextRef.current) scoreTextRef.current.textContent = `${currentMeters}m`;
            if (speedTextRef.current) speedTextRef.current.textContent = `${(dynamicSpeed / 6.2).toFixed(1)}x`;
            lastHudUpdateTime = now;
          }
        }

        // ---------------------------------------------------------------------
        // 2. JUMP PHYSICS (Parabolic Gravity & Direct Transform)
        // ---------------------------------------------------------------------
        if (!isGroundedRef.current) {
          velocityYRef.current += GRAVITY * timeFactor;
          foxYRef.current += velocityYRef.current * timeFactor;

          // Touchdown on Ground Baseline (bottom: 48px)
          if (foxYRef.current >= 0) {
            foxYRef.current = 0;
            velocityYRef.current = 0;
            isGroundedRef.current = true;
            modeRef.current = "run";
            setCurrentMode("run");
            switchSprite("run-0");
          } else {
            // Jump Stride Progression mapped strictly to vertical velocity
            const vy = velocityYRef.current;
            if (vy < -7) {
              switchSprite("jump-1"); // Powerful ascent
            } else if (vy >= -7 && vy <= 4) {
              switchSprite("jump-2"); // Weightless apex glide
            } else {
              switchSprite("jump-3"); // Descending landing prep
            }
          }

          // Apply Position & Shadow directly
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

        // ---------------------------------------------------------------------
        // 3. SLIDE MECHANISM (Low Belly Glide & Frame Progression)
        // ---------------------------------------------------------------------
        if (modeRef.current === "slide") {
          slideTimerRef.current -= timeFactor;

          const progress = 1 - slideTimerRef.current / SLIDE_DURATION_FRAMES;
          if (progress < 0.15) {
            switchSprite("slide-0"); // Drop into skid
          } else if (progress < 0.85) {
            switchSprite("slide-1"); // Flat belly glide on ground line
          } else if (progress < 1.0) {
            switchSprite("slide-2"); // Push back up
          } else {
            // Slide completed: return smoothly to run
            modeRef.current = "run";
            setCurrentMode("run");
            switchSprite("run-0");
          }

          if (shadowRef.current) {
            shadowRef.current.style.transform = "scaleX(1.4)";
            shadowRef.current.style.opacity = "0.45";
          }
        }

        // ---------------------------------------------------------------------
        // 4. RUN STRIDE ANIMATION (Zero lag frame cycling)
        // ---------------------------------------------------------------------
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

        // ---------------------------------------------------------------------
        // 5. OBSTACLE SPAWNER (Allocates to pre-rendered slots)
        // ---------------------------------------------------------------------
        if (gameStartedRef.current) {
          spawnCooldownRef.current -= timeFactor;

          if (spawnCooldownRef.current <= 0) {
            if (activeObstaclesRef.current.length < POOL_SIZE) {
              // Find first available unused slot
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
                  x: arenaW + 40,
                  slotIndex: freeSlot,
                };
                activeObstaclesRef.current.push(newObs);

                // Configure Slot Appearance ONCE upon spawn (No style thrashing in tick!)
                const slot = obstacleSlotsRef.current[freeSlot];
                const samosaImg = obstacleSamosaImgsRef.current[freeSlot];
                const jalebiImg = obstacleJalebiImgsRef.current[freeSlot];
                const badge = obstacleBadgesRef.current[freeSlot];

                if (slot && samosaImg && jalebiImg && badge) {
                  slot.style.display = "flex";
                  slot.style.transform = `translate3d(${newObs.x}px, 0, 0)`;

                  if (type === "samosa") {
                    slot.style.bottom = "48px"; // Sits flat on white ground line
                    samosaImg.style.display = "block";
                    jalebiImg.style.display = "none";
                    badge.textContent = "JUMP!";
                    badge.style.background = "#FFCD3C";
                    badge.style.color = "#522C28";
                  } else {
                    slot.style.bottom = "128px"; // Floats in mid-air at head height
                    samosaImg.style.display = "none";
                    jalebiImg.style.display = "block";
                    badge.textContent = "SLIDE!";
                    badge.style.background = "#F37D20";
                    badge.style.color = "#FFFFFF";
                  }
                }

                // Cooldown scales inversely with speed
                const baseCooldown = 130;
                const speedScale = 6.2 / gameSpeedRef.current;
                spawnCooldownRef.current = Math.floor(baseCooldown * speedScale + Math.random() * 45);
              }
            }
          }
        }

        // ---------------------------------------------------------------------
        // 6. OBSTACLE TRANSLATION & PRECISE HITBOX COLLISION
        // Fox is anchored at left-[17%] (approx 0.17 * arenaW)
        // ---------------------------------------------------------------------
        const foxX = arenaW * 0.17;
        const foxHitboxLeft = foxX + 38;
        const foxHitboxRight = foxX + 125;

        let collision = false;
        const survivingObstacles: ObstacleData[] = [];

        for (let i = 0; i < activeObstaclesRef.current.length; i++) {
          const obs = activeObstaclesRef.current[i];
          obs.x -= gameSpeedRef.current * timeFactor;

          const slot = obstacleSlotsRef.current[obs.slotIndex];
          if (slot) {
            // ONLY 1 GPU property updated per active obstacle!
            slot.style.transform = `translate3d(${obs.x}px, 0, 0)`;
          }

          // Hitbox Detection
          const obsHitboxLeft = obs.x + 18;
          const obsHitboxRight = obs.x + (obs.type === "samosa" ? 64 : 58);

          if (foxHitboxRight > obsHitboxLeft && foxHitboxLeft < obsHitboxRight) {
            if (obs.type === "samosa") {
              // SAMOSA (Ground): Cleared if jumping in air (foxY < -48px)
              const safe = !isGroundedRef.current && foxYRef.current < -48;
              if (!safe) collision = true;
            } else if (obs.type === "jalebi") {
              // JALEBI (Floating Head-Height): Cleared if sliding on ground
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
        // ---------------------------------------------------------------------
        // 7. CRASH PROGRESSION (Frame-by-frame tumble)
        // ---------------------------------------------------------------------
        crashTimerRef.current += timeFactor;
        const crashIdx = Math.min(4, Math.floor(crashTimerRef.current / 7));
        switchSprite(`crash-${crashIdx}`);

        if (crashTimerRef.current >= 38) {
          const finalDist = Math.floor(distanceRef.current / 8);
          setFinalScore(finalDist);
          setGameOver(true);

          setHighScore((prev) => {
            const best = Math.max(prev, finalDist);
            try {
              localStorage.setItem("bitedash_high_score", best.toString());
            } catch {}
            return best;
          });
        }
      } // closes else
    } catch (err) {
      console.error("[LOOP ERROR]", err);
    }

    animId = requestAnimationFrame(loop);
  };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [switchSprite, triggerCrash]);

  // Sky Theme Gradients
  const skyThemeClasses = {
    day: "from-[#4EA8DE] via-[#85B6FF] to-[#D67AC6]",
    sunset: "from-[#F3705A] via-[#FF9F68] to-[#D67AC6]",
    night: "from-[#1B1A47] via-[#482868] to-[#8C3E7B]",
  };

  return (
    <div
      ref={arenaRef}
      onClick={triggerJump}
      className={`relative w-full min-h-[520px] sm:min-h-[580px] flex flex-col justify-between select-none cursor-pointer overflow-hidden bg-gradient-to-b ${skyThemeClasses[skyTheme]} transition-colors duration-700`}
      title="Click anywhere to Jump!"
    >
      {/* =========================================================================
          TOP GAME HEADER & HUD
          ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 relative z-30">
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xl"
        >
          {/* Live Score & Speed Indicator */}
          <div className="flex items-center gap-4 text-xs sm:text-sm font-display tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="text-white/70 uppercase">Score:</span>
              <span ref={scoreTextRef} className="font-mono text-base font-bold text-[#FFCD3C]">
                0m
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-white/70 uppercase">Best:</span>
              <span ref={bestTextRef} className="font-mono text-sm text-white/90">
                {highScore}m
              </span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/15 border border-white/10">
              <span className="text-[11px] text-white/80">⚡ Speed:</span>
              <span ref={speedTextRef} className="font-mono text-xs font-bold text-[#FFCD3C]">
                1.0x
              </span>
            </div>
          </div>

          {/* Action Hints & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="hidden lg:flex items-center gap-2.5 text-xs font-display text-white/90 mr-1">
              <span>🥟 Samosa: <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">SPACE / JUMP</kbd></span>
              <span>🌀 Jalebi: <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">S / SLIDE</kbd></span>
            </div>

            {/* Sky Mood Toggles */}
            <div className="flex items-center bg-black/30 rounded-full p-0.5 border border-white/15 mr-1">
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
            <button
              onClick={triggerCrash}
              className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider transition-all shadow-sm ${
                currentMode === "crash"
                  ? "bg-[#D73B3A] text-white font-bold shadow-md ring-2 ring-white"
                  : "bg-white/20 text-white hover:bg-white/35"
              }`}
            >
              💥 Crash
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          OPEN CARTOON RUNNER ARENA
          ========================================================================= */}
      <div className="relative w-full h-[400px] sm:h-[460px] flex items-end overflow-visible">

        {/* PARALLAX SKY ATMOSPHERE */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">

          {/* CELESTIAL: Sun / Moon */}
          {skyTheme !== "night" ? (
            <div className="absolute top-6 right-12 sm:right-28 z-1 flex items-center justify-center pointer-events-none">
              <div className="absolute w-36 h-36 rounded-full bg-[#FFCD3C]/35 blur-2xl animate-pulse" />
              <svg
                viewBox="0 0 100 100"
                className="w-24 h-24 sm:w-28 sm:h-28 animate-sun-spin opacity-85"
                fill="none"
              >
                <circle cx="50" cy="50" r="22" fill="#FFCD3C" />
                <circle cx="50" cy="50" r="18" fill="#FFE072" />
                {[...Array(12)].map((_, i) => (
                  <path
                    key={i}
                    d="M 50 18 L 47 4 L 53 4 Z"
                    fill="#FFCD3C"
                    transform={`rotate(${i * 30} 50 50)`}
                  />
                ))}
              </svg>
            </div>
          ) : (
            <div className="absolute top-6 right-16 sm:right-32 z-1 flex items-center justify-center pointer-events-none">
              <div className="absolute w-28 h-28 rounded-full bg-[#FFEAA7]/25 blur-xl" />
              <svg viewBox="0 0 100 100" className="w-20 h-20 text-[#FFEAA7]" fill="currentColor">
                <path d="M 50 15 A 35 35 0 1 0 85 50 A 28 28 0 1 1 50 15 Z" />
              </svg>
            </div>
          )}

          {/* FLYING BIRDS */}
          <div className="absolute top-10 left-0 w-full pointer-events-none animate-bird-glide opacity-70">
            <svg viewBox="0 0 120 40" className="w-16 h-6 text-white/80" fill="currentColor">
              <path d="M 0 15 Q 15 0 30 15 Q 45 0 60 15 Q 45 8 30 18 Q 15 8 0 15 Z" />
              <path d="M 50 22 Q 62 10 74 22 Q 86 10 98 22 Q 86 16 74 24 Q 62 16 50 22 Z" opacity="0.7" />
            </svg>
          </div>

          {/* TWINKLING STARS */}
          <span className="absolute top-8 left-[10%] text-white/70 text-lg animate-pulse" style={{ animationDuration: "3s" }}>✦</span>
          <span className="absolute top-20 left-[26%] text-[#FFCD3C]/80 text-xs animate-ping" style={{ animationDuration: "4s" }}>★</span>
          <span className="absolute top-12 left-[48%] text-white/60 text-sm animate-pulse" style={{ animationDuration: "2.5s" }}>✦</span>
          <span className="absolute top-22 right-[36%] text-[#FFCD3C]/70 text-xs animate-ping" style={{ animationDuration: "5s" }}>★</span>
          <span className="absolute top-10 right-[14%] text-white/80 text-base animate-pulse" style={{ animationDuration: "3.5s" }}>✦</span>

          {/* PARALLAX VECTOR CLOUDS (Zero software filter overhead) */}
          <div className="w-[200%] absolute top-4 left-0 flex animate-cloud-drift-slow opacity-65">
            <div className="w-1/2 flex justify-around items-center px-10">
              <svg viewBox="0 0 200 90" className="w-36 h-16">
                <path d="M 40 70 A 25 25 0 0 1 65 35 A 30 30 0 0 1 125 30 A 25 25 0 0 1 165 50 A 22 22 0 0 1 155 70 Z" fill="white" />
              </svg>
              <svg viewBox="0 0 240 100" className="w-44 h-20">
                <path d="M 45 75 A 25 25 0 0 1 70 40 A 35 35 0 0 1 140 32 A 30 30 0 0 1 190 48 A 24 24 0 0 1 195 75 Z" fill="white" fillOpacity="0.9" />
              </svg>
              <svg viewBox="0 0 140 70" className="w-24 h-12">
                <path d="M 30 50 A 18 18 0 0 1 50 25 A 22 22 0 0 1 90 25 A 18 18 0 0 1 110 50 Z" fill="white" fillOpacity="0.8" />
              </svg>
            </div>
            <div className="w-1/2 flex justify-around items-center px-10">
              <svg viewBox="0 0 200 90" className="w-36 h-16">
                <path d="M 40 70 A 25 25 0 0 1 65 35 A 30 30 0 0 1 125 30 A 25 25 0 0 1 165 50 A 22 22 0 0 1 155 70 Z" fill="white" />
              </svg>
              <svg viewBox="0 0 240 100" className="w-44 h-20">
                <path d="M 45 75 A 25 25 0 0 1 70 40 A 35 35 0 0 1 140 32 A 30 30 0 0 1 190 48 A 24 24 0 0 1 195 75 Z" fill="white" fillOpacity="0.9" />
              </svg>
              <svg viewBox="0 0 140 70" className="w-24 h-12">
                <path d="M 30 50 A 18 18 0 0 1 50 25 A 22 22 0 0 1 90 25 A 18 18 0 0 1 110 50 Z" fill="white" fillOpacity="0.8" />
              </svg>
            </div>
          </div>

          <div className="w-[200%] absolute top-16 sm:top-20 left-0 flex animate-cloud-drift-mid opacity-85 z-2">
            <div className="w-1/2 flex justify-between items-center px-14">
              <svg viewBox="0 0 320 120" className="w-56 sm:w-68 h-24 sm:h-28">
                <path d="M 50 90 A 32 32 0 0 1 80 50 A 46 46 0 0 1 175 40 A 40 40 0 0 1 245 52 A 32 32 0 0 1 270 90 Z" fill="#EFE8F5" />
                <path d="M 50 85 A 30 30 0 0 1 80 48 A 44 44 0 0 1 172 38 A 38 38 0 0 1 242 50 A 30 30 0 0 1 268 85 Z" fill="#FFFFFF" />
              </svg>
              <svg viewBox="0 0 280 110" className="w-48 sm:w-56 h-20 sm:h-24">
                <path d="M 40 80 A 28 28 0 0 1 70 45 A 40 40 0 0 1 150 35 A 36 36 0 0 1 215 48 A 28 28 0 0 1 238 80 Z" fill="#EFE8F5" />
                <path d="M 40 76 A 26 26 0 0 1 70 43 A 38 38 0 0 1 148 33 A 34 34 0 0 1 212 46 A 26 26 0 0 1 235 76 Z" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="w-1/2 flex justify-between items-center px-14">
              <svg viewBox="0 0 320 120" className="w-56 sm:w-68 h-24 sm:h-28">
                <path d="M 50 90 A 32 32 0 0 1 80 50 A 46 46 0 0 1 175 40 A 40 40 0 0 1 245 52 A 32 32 0 0 1 270 90 Z" fill="#EFE8F5" />
                <path d="M 50 85 A 30 30 0 0 1 80 48 A 44 44 0 0 1 172 38 A 38 38 0 0 1 242 50 A 30 30 0 0 1 268 85 Z" fill="#FFFFFF" />
              </svg>
              <svg viewBox="0 0 280 110" className="w-48 sm:w-56 h-20 sm:h-24">
                <path d="M 40 80 A 28 28 0 0 1 70 45 A 40 40 0 0 1 150 35 A 36 36 0 0 1 215 48 A 28 28 0 0 1 238 80 Z" fill="#EFE8F5" />
                <path d="M 40 76 A 26 26 0 0 1 70 43 A 38 38 0 0 1 148 33 A 34 34 0 0 1 212 46 A 26 26 0 0 1 235 76 Z" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* HORIZON CANDY ROLLING HILLS */}
          <div className="w-[200%] absolute bottom-10 left-0 flex animate-cloud-drift-slow opacity-30 z-4">
            <svg viewBox="0 0 1440 90" fill="none" className="w-1/2 h-18 block flex-shrink-0" preserveAspectRatio="none">
              <path d="M 0 60 Q 240 15 480 50 Q 720 10 960 45 Q 1200 15 1440 60 L 1440 90 L 0 90 Z" fill="white" />
            </svg>
            <svg viewBox="0 0 1440 90" fill="none" className="w-1/2 h-18 block flex-shrink-0" preserveAspectRatio="none">
              <path d="M 0 60 Q 240 15 480 50 Q 720 10 960 45 Q 1200 15 1440 60 L 1440 90 L 0 90 Z" fill="white" />
            </svg>
          </div>

          <div className="w-[200%] absolute bottom-6 left-0 flex animate-cloud-drift-mid opacity-45 z-5">
            <svg viewBox="0 0 1440 80" fill="none" className="w-1/2 h-16 block flex-shrink-0" preserveAspectRatio="none">
              <path d="M 0 45 Q 180 10 360 40 Q 540 5 720 35 Q 900 10 1080 30 Q 1260 5 1440 45 L 1440 80 L 0 80 Z" fill="#522C28" fillOpacity="0.25" />
            </svg>
            <svg viewBox="0 0 1440 80" fill="none" className="w-1/2 h-16 block flex-shrink-0" preserveAspectRatio="none">
              <path d="M 0 45 Q 180 10 360 40 Q 540 5 720 35 Q 900 10 1080 30 Q 1260 5 1440 45 L 1440 80 L 0 80 Z" fill="#522C28" fillOpacity="0.25" />
            </svg>
          </div>

        </div>

        {/* =========================================================================
            SOLID GROUND BASELINE LINE (Single shared baseline for EVERYTHING)
            ========================================================================= */}
        <div className="absolute bottom-[48px] left-0 w-full h-[6px] bg-white border-b-2 border-[#522C28]/25 z-15 shadow-sm" />

        {/* RUNNING TRACK GROUND TURF (Moves in 1:1 mathematical sync with fox speed) */}
        <div className="absolute bottom-0 left-0 w-full h-[48px] overflow-hidden z-10 bg-gradient-to-t from-black/20 to-transparent">
          <div ref={groundStripRef} className="w-[2400px] h-full flex will-change-transform">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-[120px] h-full flex items-center justify-around px-2">
                <span className="w-10 h-1.5 bg-white/60 rounded-full" />
                <span className="w-6 h-1.5 bg-white/40 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PRE-ALLOCATED POOLED OBSTACLE SLOTS (Zero style recalculations in tick)
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
            {/* Pre-mounted Samosa Element */}
            <img
              ref={(el) => {
                obstacleSamosaImgsRef.current[i] = el;
              }}
              src="/fox/obstacles/samosa.png"
              alt="Samosa"
              className="w-16 sm:w-20 h-16 sm:h-20 object-contain object-bottom pointer-events-none"
              style={{ display: "none" }}
            />

            {/* Pre-mounted Jalebi Element */}
            <img
              ref={(el) => {
                obstacleJalebiImgsRef.current[i] = el;
              }}
              src="/fox/obstacles/jalebi.png"
              alt="Jalebi"
              className="w-16 sm:w-20 h-16 sm:h-20 object-contain object-bottom pointer-events-none"
              style={{ display: "none" }}
            />

            {/* Badge Indicator */}
            <span
              ref={(el) => {
                obstacleBadgesRef.current[i] = el;
              }}
              className="absolute -top-3.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase shadow-sm tracking-wider"
            >
              JUMP!
            </span>
          </div>
        ))}

        {/* =========================================================================
            COMPLETE 16-FRAME SPRITE DECK: Pre-decoded in DOM, ZERO .src mutations!
            ========================================================================= */}
        <div
          ref={foxContainerRef}
          className="absolute z-25 bottom-[48px] left-[14%] sm:left-[17%] w-[160px] sm:w-[190px] h-[160px] sm:h-[190px] flex items-end justify-center pointer-events-none will-change-transform"
        >
          {ALL_SPRITES.map((sprite) => (
            <img
              key={sprite.id}
              ref={(el) => {
                spriteElementsRef.current[sprite.id] = el;
              }}
              src={sprite.src}
              alt={sprite.id}
              className="absolute bottom-0 w-full h-full object-contain object-bottom will-change-transform"
              style={{ display: sprite.id === "run-0" ? "block" : "none" }}
            />
          ))}
        </div>

        {/* Dynamic Ground Shadow (Rests on the ground line at bottom: 44px) */}
        <div
          ref={shadowRef}
          className="absolute bottom-[44px] left-[14%] sm:left-[17%] translate-x-[35px] sm:translate-x-[45px] w-28 sm:w-32 h-3.5 bg-black/35 rounded-full blur-[2px] z-10 pointer-events-none will-change-transform"
        />

        {/* =========================================================================
            READY TO PLAY OVERLAY (Pulsing prompt)
            ========================================================================= */}
        {!gameStarted && !gameOver && (
          <div
            onClick={triggerJump}
            className="absolute inset-0 z-35 flex items-center justify-center cursor-pointer pointer-events-auto"
          >
            <div className="px-6 py-3.5 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-[#522C28]/15 flex items-center gap-3.5 hover:scale-105 transition-all">
              <span className="text-3xl animate-bounce">🏃</span>
              <div className="text-left">
                <span className="font-display text-sm sm:text-base text-[#522C28] uppercase tracking-wide block">
                  Click or Press SPACE to Play!
                </span>
                <span className="text-[11px] text-[#522C28]/70 font-sans block">
                  🥟 Jump over Samosas &nbsp;•&nbsp; 🌀 Slide under Jalebis
                </span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-[#D73B3A] text-white font-display text-xs uppercase shadow-sm">
                Start
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            GAME OVER MODAL (Only mounts on crash end)
            ========================================================================= */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-4 border-2 border-[#522C28]/10 max-w-sm mx-4">
              <span className="text-5xl animate-bounce">💥</span>
              <div>
                <h4 className="font-display text-2xl text-[#D73B3A] uppercase tracking-wide">
                  Game Over!
                </h4>
                <p className="text-xs text-[#522C28]/80 font-sans mt-1">
                  You tripped over a snack!
                </p>
                <div className="mt-3 flex items-center justify-center gap-5 py-2.5 px-6 rounded-2xl bg-[#FFF8EE] border border-[#522C28]/10">
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#522C28]/60 block">Distance</span>
                    <span className="font-mono text-xl font-black text-[#522C28]">{finalScore}m</span>
                  </div>
                  <div className="w-[1px] h-8 bg-[#522C28]/15" />
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-[#522C28]/60 block">Best</span>
                    <span className="font-mono text-xl font-black text-[#FFCD3C]">{highScore}m</span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetToRun();
                }}
                className="w-full py-3 rounded-2xl bg-[#D73B3A] hover:bg-[#FB0008] text-white font-display text-sm uppercase tracking-wider shadow-lg hover:scale-102 transition-all mt-1"
              >
                Sprint Again (Press Space / R)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
