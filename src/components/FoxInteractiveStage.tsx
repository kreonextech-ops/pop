"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function FoxInteractiveStage() {
  // Preloaded frame asset arrays
  const runFrames = [
    "/fox/fox-run-1.png",
    "/fox/fox-run-2.png",
    "/fox/fox-run-3.png",
    "/fox/fox-run-4.png",
  ];

  const jumpFrames = [
    "/fox/jump/1.png", // Crouch anticipation
    "/fox/jump/2.png", // Rocket launch ascent
    "/fox/jump/3.png", // Apex float / tuck
    "/fox/jump/4.png", // Descent & landing reach
  ];

  const slideFrames = [
    "/fox/slide/1.png", // Drop-in crouch
    "/fox/slide/2.png", // Flat ground slide hold
    "/fox/slide/3.png", // Pop up recovery
  ];

  const crashFrames = [
    "/fox/crash/1.png",
    "/fox/crash/2.png",
    "/fox/crash/3.png",
    "/fox/crash/4.png",
    "/fox/crash/5.png",
  ];

  // DOM Refs for direct, buttery-smooth GSAP hardware acceleration
  const foxSpriteRef = useRef<HTMLImageElement>(null);
  const foxContainerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const jumpTweenRef = useRef<gsap.core.Timeline | null>(null);
  const slideTweenRef = useRef<gsap.core.Timeline | null>(null);

  type Mode = "run" | "jump" | "slide" | "crash";
  const [currentMode, setCurrentMode] = useState<Mode>("run");
  const [crashEnded, setCrashEnded] = useState(false);
  const [activeFrameDisplay, setActiveFrameDisplay] = useState("Run F1");

  // State refs to keep loop running smoothly without stale closures
  const modeRef = useRef<Mode>("run");
  const runFrameIdxRef = useRef(0);
  const isJumpingRef = useRef(false);
  const isSlidingRef = useRef(false);

  // 1. Preload all images in browser cache
  useEffect(() => {
    [...runFrames, ...jumpFrames, ...slideFrames, ...crashFrames].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // 2. High-performance Run Loop (60fps requestAnimationFrame)
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;
    const frameInterval = 100; // ms per run frame

    const loop = (now: number) => {
      if (modeRef.current === "run") {
        if (now - lastTime >= frameInterval) {
          runFrameIdxRef.current = (runFrameIdxRef.current + 1) % runFrames.length;
          const nextSrc = runFrames[runFrameIdxRef.current];
          if (foxSpriteRef.current && modeRef.current === "run") {
            foxSpriteRef.current.src = nextSrc;
          }
          setActiveFrameDisplay(`Run F${runFrameIdxRef.current + 1}`);
          lastTime = now;
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3. BUTTERY-SMOOTH GSAP JUMP PHYSICS
  const triggerJump = () => {
    if (modeRef.current === "jump" || modeRef.current === "crash") return;

    modeRef.current = "jump";
    setCurrentMode("jump");

    const foxContainer = foxContainerRef.current;
    const foxSprite = foxSpriteRef.current;
    const shadow = shadowRef.current;
    if (!foxContainer || !foxSprite || !shadow) return;

    if (jumpTweenRef.current) jumpTweenRef.current.kill();
    if (slideTweenRef.current) slideTweenRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        isJumpingRef.current = false;
        modeRef.current = "run";
        setCurrentMode("run");
        runFrameIdxRef.current = 0;
        if (foxSpriteRef.current) {
          foxSpriteRef.current.src = runFrames[0];
        }
      },
    });
    jumpTweenRef.current = tl;

    // PHASE 0: Crouch Anticipation (0.00s - 0.08s) -> Jump Frame 1
    tl.to(foxSprite, {
      duration: 0.08,
      scaleX: 1.15,
      scaleY: 0.85,
      ease: "power1.out",
      onStart: () => {
        foxSprite.src = jumpFrames[0];
        setActiveFrameDisplay("Jump F1 (Spring)");
      },
    });

    // PHASE 1: Rocket Launch Ascent (0.08s - 0.38s) -> Jump Frame 2
    tl.to(
      foxContainer,
      {
        y: -150,
        duration: 0.38,
        ease: "power2.out",
      },
      "takeoff"
    );

    tl.to(
      foxSprite,
      {
        duration: 0.38,
        scaleX: 0.95,
        scaleY: 1.1,
        ease: "power1.out",
        onStart: () => {
          foxSprite.src = jumpFrames[1];
          setActiveFrameDisplay("Jump F2 (Ascent)");
        },
      },
      "takeoff"
    );

    tl.to(
      shadow,
      {
        scaleX: 0.35,
        opacity: 0.15,
        duration: 0.38,
        ease: "power2.out",
      },
      "takeoff"
    );

    // PHASE 2: Apex Float & Tuck (0.38s - 0.50s) -> Jump Frame 3
    tl.to(
      foxSprite,
      {
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 0.14,
        ease: "sine.inOut",
        onStart: () => {
          foxSprite.src = jumpFrames[2];
          setActiveFrameDisplay("Jump F3 (Apex Tuck)");
        },
      },
      "-=0.08"
    );

    // PHASE 3: Gravity Descent (0.50s - 0.82s) -> Jump Frame 4
    tl.to(
      foxContainer,
      {
        y: 0,
        duration: 0.34,
        ease: "power2.in",
        onStart: () => {
          foxSprite.src = jumpFrames[3];
          setActiveFrameDisplay("Jump F4 (Descent)");
        },
      },
      "fall"
    );

    tl.to(
      shadow,
      {
        scaleX: 1.0,
        opacity: 0.35,
        duration: 0.34,
        ease: "power2.in",
      },
      "fall"
    );

    // PHASE 4: Impact Landing Squash & Recovery
    tl.to(foxSprite, {
      duration: 0.08,
      scaleX: 1.18,
      scaleY: 0.82,
      ease: "power2.out",
    });

    tl.to(foxSprite, {
      duration: 0.12,
      scaleX: 1.0,
      scaleY: 1.0,
      ease: "elastic.out(1.2, 0.4)",
    });
  };

  // 4. BUTTERY-SMOOTH GSAP SLIDE / DUCK PHYSICS
  const triggerSlide = (durationMs = 600) => {
    if (modeRef.current === "slide" || modeRef.current === "crash") return;

    modeRef.current = "slide";
    setCurrentMode("slide");

    const foxContainer = foxContainerRef.current;
    const foxSprite = foxSpriteRef.current;
    const shadow = shadowRef.current;
    if (!foxContainer || !foxSprite || !shadow) return;

    if (slideTweenRef.current) slideTweenRef.current.kill();
    if (jumpTweenRef.current) jumpTweenRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        modeRef.current = "run";
        setCurrentMode("run");
        runFrameIdxRef.current = 0;
        if (foxSpriteRef.current) {
          foxSpriteRef.current.src = runFrames[0];
        }
      },
    });
    slideTweenRef.current = tl;

    // Phase 1: Drop-in (Slide Frame 1)
    tl.to(foxContainer, {
      y: 18,
      duration: 0.08,
      ease: "power2.out",
      onStart: () => {
        if (foxSpriteRef.current) foxSpriteRef.current.src = slideFrames[0];
        setActiveFrameDisplay("Slide F1 (Drop-In)");
      },
    });

    // Phase 2: Flat Slide Hold with Dust Skid (Slide Frame 2) - Goes further down to hug the dirt
    tl.to(foxContainer, {
      y: 34,
      duration: 0.45,
      ease: "none",
      onStart: () => {
        if (foxSpriteRef.current) foxSpriteRef.current.src = slideFrames[1];
        setActiveFrameDisplay("Slide F2 (Flat Skid)");
      },
    });

    tl.to(
      shadow,
      {
        scaleX: 1.45,
        opacity: 0.55,
        duration: 0.45,
      },
      "<"
    );

    // Phase 3: Pop up recovery (Slide Frame 3)
    tl.to(foxContainer, {
      y: 0,
      duration: 0.12,
      ease: "power2.out",
      onStart: () => {
        if (foxSpriteRef.current) foxSpriteRef.current.src = slideFrames[2];
        setActiveFrameDisplay("Slide F3 (Pop Up)");
      },
    });

    tl.to(
      shadow,
      {
        scaleX: 1.0,
        opacity: 0.35,
        duration: 0.12,
      },
      "<"
    );
  };

  // 5. CRASH & GAME OVER SEQUENCE
  const triggerCrash = () => {
    isJumpingRef.current = false;
    isSlidingRef.current = false;
    modeRef.current = "crash";
    setCurrentMode("crash");
    setCrashEnded(false);

    if (jumpTweenRef.current) jumpTweenRef.current.kill();
    if (slideTweenRef.current) slideTweenRef.current.kill();

    const foxContainer = foxContainerRef.current;
    const foxSprite = foxSpriteRef.current;
    const shadow = shadowRef.current;
    if (!foxContainer || !foxSprite || !shadow) return;

    gsap.set(foxContainer, { y: 0 });
    gsap.set(shadow, { scaleX: 1.0, opacity: 0.35 });

    let current = 0;
    const crashInterval = setInterval(() => {
      current += 1;
      if (current < crashFrames.length) {
        if (foxSpriteRef.current) {
          foxSpriteRef.current.src = crashFrames[current];
        }
        setActiveFrameDisplay(`Crash F${current + 1}`);
      } else {
        clearInterval(crashInterval);
        setCrashEnded(true);
      }
    }, 110);

    gsap.fromTo(
      foxSprite,
      { rotation: 0, scale: 1 },
      {
        rotation: -18,
        scale: 0.95,
        duration: 0.25,
        ease: "back.out(2)",
      }
    );
  };

  // 6. RESET TO RUN
  const resetToRun = () => {
    if (jumpTweenRef.current) jumpTweenRef.current.kill();
    if (slideTweenRef.current) slideTweenRef.current.kill();
    isJumpingRef.current = false;
    isSlidingRef.current = false;
    modeRef.current = "run";
    setCurrentMode("run");
    setCrashEnded(false);
    runFrameIdxRef.current = 0;

    if (foxContainerRef.current) gsap.set(foxContainerRef.current, { y: 0 });
    if (foxSpriteRef.current) {
      gsap.set(foxSpriteRef.current, { rotation: 0, scaleX: 1, scaleY: 1, scale: 1 });
      foxSpriteRef.current.src = runFrames[0];
    }
    if (shadowRef.current) gsap.set(shadowRef.current, { scaleX: 1.0, opacity: 0.35 });
    setActiveFrameDisplay("Run F1");
  };

  // 7. Keyboard shortcuts (Space/Up = Jump, Down/S = Slide, C = Crash, R = Run)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        triggerJump();
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        triggerSlide();
      } else if (e.code === "KeyC") {
        triggerCrash();
      } else if (e.code === "KeyR") {
        resetToRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-[#522C28] bg-gradient-to-b from-[#87CEEB]/25 via-[#FFF8EE] to-[#F9EAD4] shadow-2xl p-6 sm:p-10 my-8">
      {/* Top Header & Interactive State HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-10 relative">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-[#D73B3A] animate-ping" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-[#522C28]">
              Fox Actions Simulator
            </h2>
            <p className="text-xs text-[#522C28]/70 font-sans">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#522C28]/30 font-mono font-bold text-[10px]">SPACE / ↑</kbd> to Jump, <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#522C28]/30 font-mono font-bold text-[10px]">↓ / S</kbd> to Slide!
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 bg-[#FFF8EE] p-2 rounded-2xl border-2 border-[#522C28]/20 shadow-sm text-sm font-display">
          <button
            onClick={resetToRun}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              currentMode === "run"
                ? "bg-[#92C358] text-white shadow-sm scale-105"
                : "bg-white text-[#522C28] hover:bg-[#92C358]/20"
            }`}
          >
            🏃 Run
          </button>

          <button
            onClick={triggerJump}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              currentMode === "jump"
                ? "bg-[#FFCD3C] text-[#522C28] shadow-sm scale-105"
                : "bg-white text-[#522C28] hover:bg-[#FFCD3C]/30"
            }`}
          >
            🦘 Jump (↑)
          </button>

          <button
            onClick={() => triggerSlide()}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              currentMode === "slide"
                ? "bg-[#F37D20] text-white shadow-sm scale-105"
                : "bg-white text-[#522C28] hover:bg-[#F37D20]/20"
            }`}
          >
            🛹 Slide (↓)
          </button>

          <button
            onClick={() => {
              if (jumpTweenRef.current) jumpTweenRef.current.kill();
              if (slideTweenRef.current) slideTweenRef.current.kill();
              modeRef.current = "slide";
              setCurrentMode("slide");
              if (foxSpriteRef.current) foxSpriteRef.current.src = slideFrames[1];
              if (foxContainerRef.current) gsap.set(foxContainerRef.current, { y: 34 });
              if (shadowRef.current) gsap.set(shadowRef.current, { scaleX: 1.45, opacity: 0.55 });
              setActiveFrameDisplay("Slide F2 (Hold Pose)");
            }}
            className="px-3 py-1.5 rounded-xl bg-white text-[#522C28] hover:bg-orange-100 border border-orange-200 transition-all text-xs"
          >
            🔍 Hold Slide Pose
          </button>

          <button
            onClick={triggerCrash}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              currentMode === "crash"
                ? "bg-[#D73B3A] text-white shadow-sm scale-105"
                : "bg-white text-[#522C28] hover:bg-[#D73B3A]/20"
            }`}
          >
            💥 Crash
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      <div
        onClick={triggerJump}
        className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#EDF5FF] via-[#F4F9F2] to-[#E3EFE3] border-2 border-[#522C28]/15 flex items-end justify-center select-none cursor-pointer"
        title="Click to Jump, or press Down arrow to Slide!"
      >
        {/* Floating Clouds */}
        <div className="absolute top-6 left-12 w-28 h-8 bg-white/70 rounded-full blur-[1px] pointer-events-none" />
        <div className="absolute top-16 right-20 w-36 h-10 bg-white/60 rounded-full blur-[1px] pointer-events-none" />

        {/* High / Overhead Obstacle (Flying bird / snack) to demonstrate sliding under */}
        <div className="absolute top-36 sm:top-40 left-10 z-10 flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-[#522C28]/20 shadow-sm text-xs font-display text-[#522C28] pointer-events-none">
          <span>🕊️ High Obstacle (Duck under!)</span>
        </div>

        {/* Endless Moving Ground Strip */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-[#432320] overflow-hidden flex z-0">
          <div className={`w-[200%] h-full flex ${currentMode !== "crash" ? "animate-wave-drift" : ""}`}>
            <div className="w-1/2 h-full border-t-8 border-[#92C358] bg-[#432320] flex items-center justify-around">
              <span className="w-8 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-14 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-6 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-16 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-10 h-1.5 bg-[#92C358]/40 rounded-full" />
            </div>
            <div className="w-1/2 h-full border-t-8 border-[#92C358] bg-[#432320] flex items-center justify-around">
              <span className="w-8 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-14 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-6 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-16 h-1.5 bg-[#92C358]/40 rounded-full" />
              <span className="w-10 h-1.5 bg-[#92C358]/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Obstacle on crash */}
        {currentMode === "crash" && (
          <div className="absolute bottom-16 left-1/2 translate-x-16 z-10 animate-bounce">
            <div className="w-12 h-12 rounded-xl bg-[#D73B3A] border-2 border-[#522C28] flex items-center justify-center text-xl shadow-md">
              📦
            </div>
          </div>
        )}

        {/* Dynamic Fox Sprite Container (Target for 60fps GPU translations) */}
        <div
          ref={foxContainerRef}
          className="relative z-20 mb-8 sm:mb-10 w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] flex items-center justify-center pointer-events-none"
        >
          <img
            ref={foxSpriteRef}
            src="/fox/fox-run-1.png"
            alt="Fox"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(82,44,40,0.18)] will-change-transform"
          />
        </div>

        {/* Dynamic Ground Shadow */}
        <div
          ref={shadowRef}
          className="absolute bottom-16 sm:bottom-18 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#522C28]/35 rounded-full blur-[3px] z-0 pointer-events-none will-change-transform"
        />

        {/* Game Over Modal */}
        {currentMode === "crash" && crashEnded && (
          <div className="absolute inset-0 bg-[#522C28]/40 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center animate-fade-in">
            <div className="bg-[#FFF8EE] border-4 border-[#D73B3A] rounded-3xl p-6 text-center shadow-2xl scale-105">
              <span className="text-4xl">💥</span>
              <h3 className="text-2xl sm:text-3xl font-display text-[#D73B3A] uppercase tracking-wider mt-1">
                Game Over!
              </h3>
              <p className="text-sm font-sans text-[#522C28]/80 mt-1">
                The fox bumped into an obstacle!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetToRun();
                }}
                className="mt-4 px-5 py-2.5 rounded-2xl bg-[#D73B3A] hover:bg-[#FB0008] text-white font-display uppercase tracking-wider text-sm shadow-md transition-all hover:scale-105"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Frame Inspector Bar */}
      <div className="mt-5 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs uppercase font-display text-[#522C28]/70">
          <span>Active State:</span>
          <span className="font-bold text-[#D73B3A] text-sm uppercase">
            {activeFrameDisplay}
          </span>
        </div>

        <div className="text-xs text-[#522C28]/60 font-mono">
          Powered by GSAP Hardware Acceleration
        </div>
      </div>
    </div>
  );
}
