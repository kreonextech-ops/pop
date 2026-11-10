"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface FoxRunnerProps {
  initialSpeed?: number;
}

export default function FoxRunnerSection({ initialSpeed = 120 }: FoxRunnerProps) {
  // 4 running frames from your Downloads folder
  const runFrames = [
    "/fox/fox-run-1.png",
    "/fox/fox-run-2.png",
    "/fox/fox-run-3.png",
    "/fox/fox-run-4.png",
  ];

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [speedMs, setSpeedMs] = useState(initialSpeed); // milliseconds per frame (lower = faster)
  const [groundOffset, setGroundOffset] = useState(0);

  // Animation cycle for the running frames
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % runFrames.length);
    }, speedMs);

    return () => clearInterval(interval);
  }, [isRunning, speedMs, runFrames.length]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-4 border-[#522C28] bg-gradient-to-b from-[#87CEEB]/20 via-[#FFF8EE] to-[#F9EAD4] shadow-2xl p-6 sm:p-10 my-8">
      {/* Top Banner & Info Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-10 relative">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-[#D73B3A] animate-ping" />
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-[#522C28]">
            Fox Running Test Stage
          </h2>
        </div>
        
        {/* Interactive Speed & State Controls */}
        <div className="flex items-center gap-3 bg-[#FFF8EE] px-4 py-2 rounded-2xl border-2 border-[#522C28]/20 shadow-sm text-sm font-display text-[#522C28]">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1 rounded-xl transition-all ${
              isRunning ? "bg-[#D73B3A] text-white" : "bg-[#FFCD3C] text-[#522C28]"
            }`}
          >
            {isRunning ? "Pause" : "Play"}
          </button>

          <label className="flex items-center gap-2">
            <span>Speed:</span>
            <input
              type="range"
              min="50"
              max="240"
              step="10"
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="w-24 accent-[#D73B3A] cursor-pointer"
            />
            <span className="w-12 text-xs font-mono">{speedMs}ms</span>
          </label>
        </div>
      </div>

      {/* Main Runner Stage */}
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#F2F7F2] to-[#E3EFE3] border-2 border-[#522C28]/15 flex items-end justify-center select-none">
        
        {/* Drifting Clouds in Background */}
        <div className="absolute top-6 left-10 w-24 h-8 bg-white/70 rounded-full blur-[1px] animate-pulse pointer-events-none" />
        <div className="absolute top-14 right-20 w-36 h-10 bg-white/60 rounded-full blur-[1px] pointer-events-none" />

        {/* Endless Moving Ground Strip */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-[#432320] overflow-hidden flex z-0">
          <div className="w-[200%] h-full flex animate-wave-drift">
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

        {/* The Running Fox */}
        <div className="relative z-10 mb-8 sm:mb-10 w-[180px] sm:w-[220px] h-[180px] sm:h-[220px] flex items-center justify-center">
          <img
            src={runFrames[currentFrameIndex]}
            alt={`Fox Run Frame ${currentFrameIndex + 1}`}
            className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(82,44,40,0.15)]"
          />
        </div>

        {/* Small subtle ground shadow directly beneath fox */}
        <div className="absolute bottom-16 sm:bottom-18 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#522C28]/25 rounded-full blur-[3px] z-0 animate-pulse" />
      </div>

      {/* Frame Inspector Strip */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="text-xs uppercase font-display text-[#522C28]/70 mr-2">
          Frames Preview:
        </span>
        {runFrames.map((frame, idx) => (
          <button
            key={frame}
            onClick={() => {
              setIsRunning(false);
              setCurrentFrameIndex(idx);
            }}
            className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
              currentFrameIndex === idx
                ? "border-[#D73B3A] bg-[#D73B3A]/10 scale-105 shadow-md"
                : "border-[#522C28]/15 bg-white/70 hover:border-[#522C28]/40"
            }`}
          >
            <div className="w-12 h-12 relative">
              <img src={frame} alt={`Frame ${idx + 1}`} className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] font-display mt-1 text-[#522C28]">
              Frame {idx + 1}
            </span>
          </button>
        ))}
        <button
          onClick={() => {
            setIsRunning(true);
          }}
          className="ml-2 text-xs bg-[#92C358] hover:bg-[#4AAC31] text-white px-3 py-2 rounded-xl font-display uppercase tracking-wider transition-all"
        >
          Resume Loop
        </button>
      </div>
    </div>
  );
}
