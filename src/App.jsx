import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Zap,
  Flame,
  Eye,
  EyeOff,
  RotateCcw,
  Send,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Palette,
  Maximize2,
  Wind,
  Hand
} from 'lucide-react';

// ============================================================================
// STRICT BRAND CONSTANTS (NEVER ALTERED DURING COLOR CYCLING)
// ============================================================================
const BRAND_LOGO_RED = '#B3281E';
const BRAND_CREAM_DETAIL = '#FDF8E2';
const BRAND_NOSE_BLACK = '#000000';
const BRAND_SUBTITLE_GREEN = '#062E16';

// ============================================================================
// FLAVOR & POP-ART COLOR PALETTES (FOR BACKGROUND & CLOUD COLOUR ANIMATION)
// Note: Logo & "MAKHANA SNACKS" colors are strictly locked to brand constants!
// ============================================================================
const POP_PALETTES = [
  {
    id: 'original',
    name: 'Original Pop',
    flavorTag: 'Classic Roasted Masala',
    pink: '#FF007F',
    yellow: '#FFE600',
    orange: '#FF6B00',
    green: '#005A2B',
    darkGreen: '#003B1B',
    cream: '#FDF8E2',
    comingFill: '#FF148A',
    soonFill: '#FF6B00',
    cloudFill: '#FFE600',
    spiceColor: '#9E1B12',
  },
  {
    id: 'periperi',
    name: 'Peri-Peri Blaze',
    flavorTag: 'Fiery African Bird’s Eye Chili',
    pink: '#FF1E42',
    yellow: '#FFCC00',
    orange: '#FF4500',
    green: '#4A0E2E',
    darkGreen: '#2C071B',
    cream: '#FFF5E4',
    comingFill: '#FF1E42',
    soonFill: '#FF7700',
    cloudFill: '#FFCC00',
    spiceColor: '#D91B00',
  },
  {
    id: 'mint',
    name: 'Mint Masala Blast',
    flavorTag: 'Zesty Pudina & Black Salt',
    pink: '#00D285',
    yellow: '#E8FF00',
    orange: '#00A896',
    green: '#004B38',
    darkGreen: '#002E22',
    cream: '#F4FFF8',
    comingFill: '#00C97B',
    soonFill: '#FF7B00',
    cloudFill: '#E8FF00',
    spiceColor: '#115E38',
  },
  {
    id: 'cheese',
    name: 'Tangy Cheese Pop',
    flavorTag: 'Aged Cheddar & Jalapeño',
    pink: '#9B2CFF',
    yellow: '#FFD900',
    orange: '#FF8800',
    green: '#1D2F6F',
    darkGreen: '#101B42',
    cream: '#FFFDF0',
    comingFill: '#A22BFF',
    soonFill: '#FF8800',
    cloudFill: '#FFD900',
    spiceColor: '#CC5500',
  },
  {
    id: 'cyberpop',
    name: 'Electric Berry Tang',
    flavorTag: 'Amchur & Tangy Cranberry',
    pink: '#FF00A0',
    yellow: '#00F5D4',
    orange: '#FF5400',
    green: '#240046',
    darkGreen: '#10002B',
    cream: '#FFF8FC',
    comingFill: '#FF00A0',
    soonFill: '#FF5400',
    cloudFill: '#00F5D4',
    spiceColor: '#8A0047',
  },
];

// ============================================================================
// STATIC ANCHORED MAKHANA POSITIONS (MATCHING THE UPLOADED REFERENCE POSTER)
// ============================================================================
const POSTER_MAKHANAS = [
  // Giant Blurred Foreground Puffs (Left edge & Bottom corners)
  { id: 'fg-1', x: 3.5, y: 17, size: 175, layer: 'foreground', variant: 0, rot: -15, blur: 3.5 },
  { id: 'fg-2', x: 2.5, y: 65, size: 165, layer: 'foreground', variant: 1, rot: 25, blur: 3.5 },
  { id: 'fg-3', x: 10.5, y: 92, size: 225, layer: 'foreground', variant: 2, rot: 12, blur: 5 },
  { id: 'fg-4', x: 84, y: 96, size: 140, layer: 'foreground', variant: 0, rot: -28, blur: 4 },
  { id: 'fg-5', x: 98, y: 48, size: 145, layer: 'foreground', variant: 1, rot: 40, blur: 3.5 },
  { id: 'fg-6', x: 89.5, y: 15, size: 185, layer: 'foreground', variant: 2, rot: -18, blur: 1.5 },

  // Comic-Illustrated 2D Vector Makhana (Top Left, faithful to reference!)
  { id: 'comic-1', x: 30.8, y: 11.5, size: 108, layer: 'comic', variant: 0, rot: -12, blur: 0 },

  // Midground Crisp Roasted Makhanas (Left cluster, Top-Right, and Bucket stream)
  { id: 'mg-1', x: 18.5, y: 27.5, size: 86, layer: 'midground', variant: 1, rot: 18, blur: 0 },
  { id: 'mg-2', x: 23.6, y: 24.2, size: 42, layer: 'midground', variant: 2, rot: -35, blur: 0 },
  { id: 'mg-3', x: 7.8, y: 44.5, size: 54, layer: 'midground', variant: 0, rot: 42, blur: 0 },
  { id: 'mg-4', x: 19.2, y: 47.8, size: 82, layer: 'midground', variant: 2, rot: -22, blur: 0 },
  { id: 'mg-5', x: 17.3, y: 81.2, size: 96, layer: 'midground', variant: 1, rot: 15, blur: 0 },
  { id: 'mg-6', x: 34.2, y: 91.5, size: 92, layer: 'midground', variant: 0, rot: -19, blur: 0 },
  { id: 'mg-7', x: 64.0, y: 17.0, size: 112, layer: 'midground', variant: 1, rot: 28, blur: 0 },
  { id: 'mg-8', x: 79.5, y: 43.8, size: 98, layer: 'midground', variant: 0, rot: -14, blur: 0 },
  { id: 'mg-9', x: 74.8, y: 52.5, size: 48, layer: 'midground', variant: 2, rot: 33, blur: 0 },
  { id: 'mg-10', x: 83.8, y: 59.5, size: 64, layer: 'midground', variant: 1, rot: -25, blur: 0 },
  { id: 'mg-11', x: 75.5, y: 70.2, size: 42, layer: 'midground', variant: 0, rot: 50, blur: 0 },
  { id: 'mg-12', x: 76.0, y: 83.4, size: 52, layer: 'midground', variant: 2, rot: -40, blur: 0 },
  { id: 'mg-13', x: 96.8, y: 91.5, size: 98, layer: 'midground', variant: 1, rot: 22, blur: 0 },
  { id: 'mg-14', x: 51.5, y: 92.2, size: 36, layer: 'midground', variant: 0, rot: 65, blur: 0 },

  // Broken Crunchy Makhana Chunks & Half-Puffs
  { id: 'ch-1', x: 79.0, y: 21.8, size: 78, layer: 'chunk', variant: 0, rot: 12, blur: 0 },
  { id: 'ch-2', x: 85.5, y: 31.5, size: 46, layer: 'chunk', variant: 1, rot: -28, blur: 0 },
  { id: 'ch-3', x: 86.2, y: 47.2, size: 52, layer: 'chunk', variant: 2, rot: 45, blur: 0 },
  { id: 'ch-4', x: 92.8, y: 87.2, size: 56, layer: 'chunk', variant: 1, rot: -15, blur: 0 },
  { id: 'ch-5', x: 23.2, y: 56.2, size: 48, layer: 'chunk', variant: 0, rot: 30, blur: 0 },
  { id: 'ch-6', x: 12.2, y: 52.0, size: 44, layer: 'chunk', variant: 2, rot: -38, blur: 0 },
  { id: 'ch-7', x: 20.8, y: 64.5, size: 38, layer: 'chunk', variant: 1, rot: 72, blur: 0 },
  { id: 'ch-8', x: 27.0, y: 86.5, size: 52, layer: 'chunk', variant: 2, rot: -20, blur: 0 },
];

// ============================================================================
// WEB AUDIO SYNTHESIZER FOR CRUNCH & POP SOUND EFFECTS
// ============================================================================
function playComicSound(type = 'pop') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'crunch') {
      // Crispy noise burst + low pop
      const bufferSize = ctx.sampleRate * 0.14;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.045));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (type === 'whoosh') {
      // Comic throwing whoosh sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (type === 'boing') {
      // Elastic comic bounce sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'color') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.16);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    }
  } catch (e) {
    // Ignore audio context restrictions if not interacted yet
  }
}

// ============================================================================
// CUSTOM SVG: REALISTIC 3D ROASTED SPICED MAKHANA PUFF
// ============================================================================
const RealisticMakhanaSVG = React.memo(({ variant = 0, spiceColor = '#9E1B12', idSuffix = '0' }) => {
  const gradId = `makhana-grad-${idSuffix}-${variant}`;
  const lobeGradId = `makhana-lobe-${idSuffix}-${variant}`;
  const craterGradId = `makhana-crater-${idSuffix}-${variant}`;

  // 3 distinct organic puffed lotus seed silhouettes & crater maps
  const paths = [
    // Variant 0: Classic plump multi-lobed roasted makhana
    "M 50,6 C 64,4 78,10 86,21 C 95,30 97,46 94,60 C 92,75 82,88 68,93 C 55,97 39,96 26,90 C 13,83 5,70 5,54 C 4,38 11,23 23,14 C 32,7 41,7 50,6 Z",
    // Variant 1: Slightly asymmetric extra-puffy makhana
    "M 47,5 C 62,3 79,11 88,24 C 96,36 96,53 91,67 C 86,81 74,92 59,95 C 43,97 26,93 15,82 C 5,71 3,54 7,39 C 11,24 22,12 36,7 C 40,6 44,5 47,5 Z",
    // Variant 2: Round nodular roasted fox nut
    "M 52,5 C 68,6 83,14 90,28 C 97,42 95,60 87,74 C 79,88 64,95 48,95 C 32,95 17,87 10,73 C 3,59 4,41 12,27 C 20,13 36,4 52,5 Z"
  ];

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <defs>
        <radialGradient id={gradId} cx="36%" cy="30%" r="68%" fx="32%" fy="25%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="28%" stopColor="#FCECD2" />
          <stop offset="62%" stopColor="#F2CB96" />
          <stop offset="86%" stopColor="#D99B52" />
          <stop offset="100%" stopColor="#A66523" />
        </radialGradient>
        <radialGradient id={lobeGradId} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFDF9" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#F7D9AC" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C47D34" stopOpacity="0.65" />
        </radialGradient>
        <radialGradient id={craterGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1F0B04" />
          <stop offset="60%" stopColor="#4A1E0B" />
          <stop offset="85%" stopColor="#8C471B" />
          <stop offset="100%" stopColor="#D99B52" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base Puffed Sphere */}
      <path d={paths[variant % 3]} fill={`url(#${gradId})`} />

      {/* Organic Puffy Lobes / Creases that give Makhana its cauliflower-like puff texture */}
      <circle cx="34" cy="30" r="18" fill={`url(#${lobeGradId})`} />
      <circle cx="62" cy="28" r="16" fill={`url(#${lobeGradId})`} />
      <circle cx="28" cy="58" r="19" fill={`url(#${lobeGradId})`} />
      <circle cx="56" cy="55" r="21" fill={`url(#${lobeGradId})`} />
      <circle cx="74" cy="56" r="15" fill={`url(#${lobeGradId})`} />
      <circle cx="46" cy="76" r="16" fill={`url(#${lobeGradId})`} />

      {/* Subtle Crease Lines Between Puff Lobes */}
      <path
        d="M 46,12 Q 49,32 42,46 M 20,40 Q 38,44 52,38 M 68,20 Q 60,38 72,48 M 32,74 Q 48,62 66,74 M 15,62 Q 32,58 42,72"
        stroke="#B56E29"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.48"
      />

      {/* Roasted Seed Coat Indentation Craters ("Eyes" of the Lotus Seed) */}
      <g>
        <ellipse cx="44" cy="26" rx="5.5" ry="4.2" transform="rotate(-15 44 26)" fill={`url(#${craterGradId})`} />
        <ellipse cx="69" cy="35" rx="6.2" ry="4.8" transform="rotate(25 69 35)" fill={`url(#${craterGradId})`} />
        <ellipse cx="25" cy="44" rx="5.0" ry="4.0" transform="rotate(-30 25 44)" fill={`url(#${craterGradId})`} />
        <ellipse cx="52" cy="52" rx="6.8" ry="5.2" transform="rotate(10 52 52)" fill={`url(#${craterGradId})`} />
        <ellipse cx="34" cy="71" rx="5.8" ry="4.4" transform="rotate(18 34 71)" fill={`url(#${craterGradId})`} />
        <ellipse cx="67" cy="68" rx="6.4" ry="4.6" transform="rotate(-22 67 68)" fill={`url(#${craterGradId})`} />
        <ellipse cx="81" cy="53" rx="4.2" ry="3.2" transform="rotate(40 81 53)" fill={`url(#${craterGradId})`} />
        <ellipse cx="22" cy="24" rx="4.0" ry="3.0" transform="rotate(-40 22 24)" fill={`url(#${craterGradId})`} />
      </g>

      {/* Roasted Masala / Chili & Herb Specks */}
      <g fill={spiceColor} opacity="0.82">
        <circle cx="36" cy="20" r="1.4" />
        <circle cx="55" cy="18" r="1.1" />
        <circle cx="60" cy="36" r="1.6" />
        <circle cx="38" cy="42" r="1.3" />
        <circle cx="42" cy="60" r="1.7" />
        <circle cx="61" cy="62" r="1.2" />
        <circle cx="75" cy="44" r="1.5" />
        <circle cx="29" cy="56" r="1.3" />
        <circle cx="52" cy="78" r="1.6" />
        <circle cx="72" cy="76" r="1.1" />
        <circle cx="19" cy="36" r="1.2" />
      </g>

      {/* Dark Roasted Black Pepper / Char Flecks */}
      <g fill="#2B1004" opacity="0.75">
        <circle cx="49" cy="33" r="1.1" />
        <circle cx="31" cy="32" r="0.9" />
        <circle cx="64" cy="49" r="1.2" />
        <circle cx="45" cy="68" r="1.0" />
        <circle cx="58" cy="24" r="0.9" />
        <circle cx="24" cy="63" r="1.1" />
      </g>

      {/* Soft Specular Top-Left Highlight for 3D Pop */}
      <ellipse cx="33" cy="24" rx="14" ry="8" transform="rotate(-25 33 24)" fill="#FFFFFF" opacity="0.35" />
    </svg>
  );
});

// ============================================================================
// CUSTOM SVG: COMIC-ILLUSTRATED 2D VECTOR MAKHANA (TOP-LEFT OF REFERENCE)
// ============================================================================
const ComicIllustratedMakhanaSVG = React.memo(() => (
  <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible select-none pointer-events-none">
    {/* Thick Black Comic Ink Outline */}
    <path
      d="M 58,8 C 75,6 92,15 101,29 C 111,42 113,60 107,76 C 101,93 87,106 70,110 C 52,114 33,110 20,98 C 8,86 5,67 9,50 C 12,34 22,20 36,13 C 43,9 51,9 58,8 Z"
      fill="#FDF3C7"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    {/* Warm Tan Comic Shading Crescent */}
    <path
      d="M 88,22 C 99,36 102,57 95,74 C 87,91 69,102 49,102 C 36,102 24,96 16,87 C 28,103 50,111 70,106 C 87,102 100,89 105,73 C 110,56 106,35 88,22 Z"
      fill="#F3C969"
    />
    {/* Internal Comic Lobe Ink Lines */}
    <path
      d="M 42,12 C 46,20 55,22 62,16 M 16,42 C 26,44 33,52 30,62 M 86,34 C 78,42 80,55 90,60 M 45,88 C 52,80 65,82 70,92"
      fill="none"
      stroke="#000000"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Comic Illustrated Dark Craters */}
    <g fill="#231F20" stroke="#000000" strokeWidth="1.5">
      <path d="M 40,28 C 44,25 49,28 47,33 C 45,37 38,36 37,32 Z" />
      <path d="M 73,33 C 78,31 82,36 79,41 C 75,45 69,41 71,36 Z" />
      <path d="M 55,52 C 60,49 65,54 62,59 C 58,64 51,60 52,55 Z" />
      <path d="M 27,68 C 32,65 37,70 34,76 C 30,80 24,76 25,71 Z" />
      <path d="M 76,69 C 81,67 86,72 82,78 C 78,82 72,78 73,72 Z" />
      <path d="M 52,88 C 56,86 60,90 57,95 C 54,98 49,95 50,90 Z" />
    </g>
    {/* White Sparkle Highlights inside craters */}
    <g fill="#FFFFFF">
      <circle cx="42" cy="30" r="1.8" />
      <circle cx="75" cy="36" r="1.8" />
      <circle cx="57" cy="55" r="2.0" />
      <circle cx="29" cy="71" r="1.7" />
      <circle cx="78" cy="72" r="1.8" />
    </g>
  </svg>
));

// ============================================================================
// CUSTOM SVG: BROKEN CRUNCHY MAKHANA CHUNK / HALF-PUFF
// ============================================================================
const CrunchyChunkSVG = React.memo(({ variant = 0, spiceColor = '#9E1B12' }) => {
  if (variant % 3 === 0) {
    // C-shaped broken roasted makhana half (like top-right of reference)
    return (
      <svg viewBox="0 0 90 90" className="w-full h-full overflow-visible select-none pointer-events-none">
        <path
          d="M 28,12 C 52,6 76,20 82,44 C 87,66 70,84 48,84 C 32,84 20,74 22,62 C 24,52 38,54 42,44 C 45,35 30,34 24,25 C 20,19 22,14 28,12 Z"
          fill="#F4CA8E"
          stroke="#C27D38"
          strokeWidth="1.5"
        />
        <path
          d="M 24,22 C 34,28 46,35 43,46 C 40,56 25,54 24,64 C 23,72 34,80 46,79"
          fill="#FFFDF7"
        />
        <circle cx="58" cy="28" r="4" fill="#3B1707" />
        <circle cx="68" cy="52" r="4.5" fill="#3B1707" />
        <circle cx="54" cy="70" r="3.8" fill="#3B1707" />
        <circle cx="62" cy="40" r="1.5" fill={spiceColor} />
        <circle cx="48" cy="58" r="1.4" fill={spiceColor} />
      </svg>
    );
  }
  // Crispy white/golden polygonal popcorn-like flake chunk
  return (
    <svg viewBox="0 0 70 70" className="w-full h-full overflow-visible select-none pointer-events-none">
      <polygon
        points="14,22 36,8 58,18 64,42 46,62 18,56 8,38"
        fill="#FFFDF5"
        stroke="#D99B52"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon points="36,8 58,18 64,42 46,62 34,38" fill="#F3C78B" />
      <circle cx="48" cy="28" r="3.2" fill="#3B1707" />
      <circle cx="28" cy="36" r="1.5" fill={spiceColor} />
      <circle cx="42" cy="46" r="1.3" fill={spiceColor} />
    </svg>
  );
});

// ============================================================================
// CUSTOM SVG: EXACT "POP CULTURE" SECONDARY LOGO WITH FOX MASCOT
// STRICTLY LOCKED TO BRAND_LOGO_RED (#B3281E), BLACK NOSE (#000000), & CREAM (#FDF8E2)
// ============================================================================
const PopCultureLogoSVG = React.memo(({ pulseScale = 1, hoveredLetter, setHoveredLetter, onFoxThrow }) => {
  return (
    <div
      className="relative w-full max-w-[760px] mx-auto select-none transition-transform duration-300"
      style={{ transform: `scale(${pulseScale})` }}
    >
      <svg
        viewBox="0 0 920 210"
        className="w-full h-auto overflow-visible drop-shadow-[0_3px_0_rgba(0,0,0,0.08)]"
      >
        {/* ==================== STYLIZED SITTING FOX MASCOT ==================== */}
        <g
          onClick={onFoxThrow}
          className="origin-bottom transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <title>Click the Fox to toss a handful of Makhanas!</title>
          {/* Bushy S-Curved Fox Tail (Left) */}
          <path
            d="M 68,185 C 34,185 16,162 21,126 C 25,98 34,76 18,65 C 8,58 3,66 2,71 C 0,48 22,38 42,50 C 60,62 62,92 56,122 C 51,146 58,165 73,172 Z"
            fill={BRAND_LOGO_RED}
          />

          {/* Fox Torso & Sitting Haunches */}
          <path
            d="M 65,186 C 58,155 66,105 78,68 L 122,74 C 118,112 124,152 125,186 Z"
            fill={BRAND_LOGO_RED}
          />

          {/* Left Back Ear */}
          <path
            d="M 80,55 L 62,22 L 94,36 Z"
            fill={BRAND_LOGO_RED}
          />
          <path d="M 80,50 L 70,30 L 88,39 Z" fill={BRAND_CREAM_DETAIL} />

          {/* Right/Top Pointed Ear */}
          <path
            d="M 106,36 L 130,3 L 136,42 Z"
            fill={BRAND_LOGO_RED}
          />
          <path d="M 120,34 L 128,14 L 131,36 Z" fill={BRAND_CREAM_DETAIL} />

          {/* Fox Head & Long Pointed Snout */}
          <path
            d="M 76,56 C 84,34 112,26 135,36 C 154,44 166,46 178,42 C 182,54 170,68 152,72 C 160,78 150,86 132,84 C 118,82 108,76 100,82 Z"
            fill={BRAND_LOGO_RED}
          />

          {/* Black Round Nose Tip on Snout */}
          <ellipse cx="180" cy="40" rx="6.5" ry="5.5" transform="rotate(-15 180 40)" fill={BRAND_NOSE_BLACK} />

          {/* Happy Closed Smiling Eyes (Warm Cream Arcs) */}
          <path
            d="M 105,52 Q 111,44 117,50"
            fill="none"
            stroke={BRAND_CREAM_DETAIL}
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path
            d="M 129,43 Q 135,36 140,43"
            fill="none"
            stroke={BRAND_CREAM_DETAIL}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Smiling Mouth / Cheek Line */}
          <path
            d="M 120,66 Q 138,76 156,68"
            fill="none"
            stroke={BRAND_CREAM_DETAIL}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Fox Left Arm & Cream Contour Line Reaching onto First 'P' */}
          <path
            d="M 88,116 C 95,94 114,82 134,84 C 142,85 145,94 136,99 C 122,106 112,118 92,120"
            fill={BRAND_LOGO_RED}
            stroke={BRAND_CREAM_DETAIL}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Lower Haunch / Belly White Curve */}
          <path
            d="M 110,136 C 124,148 124,174 114,185"
            fill="none"
            stroke={BRAND_CREAM_DETAIL}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Bottom Foot Paws Detail */}
          <path
            d="M 112,184 L 126,184 M 115,178 L 125,178"
            stroke={BRAND_CREAM_DETAIL}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>

        {/* ==================== BLOCKY CONDENSED "POP CULTURE" TEXT (LOCKED #B3281E) ==================== */}
        <g
          fill={BRAND_LOGO_RED}
          style={{
            fontFamily: "'Impact', 'Anton', 'Bebas Neue', 'Arial Black', sans-serif",
            fontWeight: 900,
            letterSpacing: '0.01em',
          }}
        >
          {/* First 'P' tucked under the fox's front paws */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 0 ? 'translateY(-8px) scale(1.05)' : 'none',
              transformOrigin: '165px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(0)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 126,82 L 172,82 C 198,82 212,98 212,122 C 212,146 196,162 170,162 L 160,162 L 160,196 L 126,196 Z M 160,108 L 160,138 C 172,138 178,132 178,123 C 178,113 172,108 160,108 Z" />
          </g>

          {/* Fox's Cute Paws Resting Over the Top-Left of First 'P' */}
          <g className="pointer-events-none">
            {/* Upper Right Paw Resting on Top of 'P' */}
            <ellipse cx="174" cy="77" rx="15" ry="10" fill={BRAND_LOGO_RED} stroke={BRAND_CREAM_DETAIL} strokeWidth="4" />
            <line x1="168" y1="73" x2="168" y2="83" stroke={BRAND_CREAM_DETAIL} strokeWidth="3" strokeLinecap="round" />
            <line x1="175" y1="72" x2="175" y2="83" stroke={BRAND_CREAM_DETAIL} strokeWidth="3" strokeLinecap="round" />
            <line x1="182" y1="74" x2="182" y2="83" stroke={BRAND_CREAM_DETAIL} strokeWidth="3" strokeLinecap="round" />

            {/* Lower Left Paw Gripping Side of 'P' */}
            <ellipse cx="133" cy="95" rx="11" ry="9" transform="rotate(20 133 95)" fill={BRAND_LOGO_RED} stroke={BRAND_CREAM_DETAIL} strokeWidth="4" />
            <line x1="129" y1="91" x2="136" y2="98" stroke={BRAND_CREAM_DETAIL} strokeWidth="2.8" strokeLinecap="round" />
            <line x1="134" y1="88" x2="140" y2="95" stroke={BRAND_CREAM_DETAIL} strokeWidth="2.8" strokeLinecap="round" />
          </g>

          {/* Letter 'O' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 1 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '260px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(1)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 260,72 C 292,72 308,96 308,136 C 308,176 292,200 260,200 C 228,200 214,176 214,136 C 214,96 228,72 260,72 Z M 260,104 C 250,104 247,115 247,136 C 247,157 250,168 260,168 C 270,168 273,157 273,136 C 273,115 270,104 260,104 Z" />
          </g>

          {/* Second Letter 'P' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 2 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '355px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(2)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 314,75 L 358,75 C 386,75 400,92 400,118 C 400,144 384,160 356,160 L 348,160 L 348,196 L 314,196 Z M 348,104 L 348,134 C 360,134 366,128 366,119 C 366,109 360,104 348,104 Z" />
          </g>

          {/* Letter 'C' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 3 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '458px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(3)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 494,124 L 463,124 L 463,107 C 463,100 460,96 456,96 C 451,96 449,101 449,110 L 449,162 C 449,171 451,175 456,175 C 461,175 463,171 463,162 L 463,146 L 494,146 L 494,160 C 494,186 480,200 455,200 C 429,200 416,184 416,156 L 416,116 C 416,88 430,72 456,72 C 481,72 494,87 494,114 Z" />
          </g>

          {/* Letter 'U' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 4 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '544px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(4)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 504,76 L 536,76 L 536,164 C 536,171 538,175 543,175 C 548,175 550,171 550,164 L 550,76 L 582,76 L 582,160 C 582,186 569,200 543,200 C 517,200 504,186 504,160 Z" />
          </g>

          {/* Letter 'L' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 5 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '616px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(5)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 592,76 L 624,76 L 624,170 L 644,170 L 644,197 L 592,197 Z" />
          </g>

          {/* Letter 'T' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 6 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '672px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(6)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 640,78 L 706,78 L 706,105 L 688,105 L 688,197 L 656,197 L 656,105 L 640,105 Z" />
          </g>

          {/* Second Letter 'U' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 7 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '752px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(7)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 713,76 L 745,76 L 745,164 C 745,171 747,175 752,175 C 757,175 759,171 759,164 L 759,76 L 791,76 L 791,160 C 791,186 778,200 752,200 C 726,200 713,186 713,160 Z" />
          </g>

          {/* Letter 'R' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 8 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '832px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(8)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 800,76 L 838,76 C 860,76 870,89 870,111 C 870,126 864,136 852,141 L 870,197 L 838,197 L 825,146 L 830,146 L 830,197 L 800,197 Z M 830,102 L 830,126 C 838,126 842,121 842,114 C 842,106 838,102 830,102 Z" />
          </g>

          {/* Letter 'E' */}
          <g
            className="cursor-pointer transition-transform duration-200"
            style={{
              transform: hoveredLetter === 9 ? 'translateY(-8px) scale(1.06)' : 'none',
              transformOrigin: '896px 135px',
            }}
            onMouseEnter={() => setHoveredLetter(9)}
            onMouseLeave={() => setHoveredLetter(null)}
            onClick={onFoxThrow}
          >
            <path d="M 874,80 L 918,80 L 918,107 L 902,107 L 902,126 L 916,126 L 916,151 L 902,151 L 902,171 L 918,171 L 918,197 L 874,197 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// CUSTOM SVG: "COMING SOON" 3D EXTRUDED COMIC CLOUD BADGE
// ============================================================================
const ComingSoonCloudSVG = React.memo(({
  palette,
  beatScale = 1,
  onTriggerPop
}) => {
  return (
    <div
      onClick={onTriggerPop}
      className="relative w-full max-w-[710px] mx-auto cursor-pointer select-none group"
      style={{
        transform: `scale(${beatScale})`,
        transition: 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg viewBox="0 0 800 325" className="w-full h-auto overflow-visible">
        {/* ==================== SIDE COMIC SPLASH DROPLETS ==================== */}
        {/* Left Splash Droplets (Pink, Orange, Dark Green) */}
        <g className="origin-right transition-transform duration-300 group-hover:scale-110">
          <path
            d="M 52,108 C 20,90 8,92 10,102 C 12,112 32,115 52,114 Z"
            fill={palette.pink}
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M 46,130 C 10,128 2,138 8,148 C 14,158 36,144 48,136 Z"
            fill={palette.orange}
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M 54,152 C 32,164 24,176 32,182 C 40,188 50,168 56,156 Z"
            fill={palette.green}
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>

        {/* Right Splash Droplets (Pink & Green) */}
        <g className="origin-left transition-transform duration-300 group-hover:scale-110">
          <path
            d="M 730,78 C 756,56 768,58 766,68 C 764,78 744,82 732,84 Z"
            fill={palette.pink}
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M 736,102 C 764,96 774,104 768,114 C 762,122 744,112 734,106 Z"
            fill={palette.green}
            stroke="#000"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>

        {/* ==================== YELLOW PUFFY SCALLOPED CLOUD BASE ==================== */}
        {/* Black Drop Shadow of Cloud */}
        <path
          d="M 142,40 C 175,18 228,22 256,42 C 292,16 364,18 396,42 C 436,18 502,22 532,44 C 568,20 628,26 650,52 C 692,42 730,76 716,118 C 750,136 762,182 746,225 C 764,264 736,304 686,298 C 656,316 604,312 582,296 C 546,316 490,316 462,296 C 428,316 368,314 342,290 C 298,298 268,266 280,226 C 242,232 204,220 186,198 C 142,216 88,196 74,154 C 54,106 86,46 142,40 Z"
          fill="#000000"
          transform="translate(4, 5)"
        />
        {/* Main Bright Yellow Cloud */}
        <path
          d="M 142,40 C 175,18 228,22 256,42 C 292,16 364,18 396,42 C 436,18 502,22 532,44 C 568,20 628,26 650,52 C 692,42 730,76 716,118 C 750,136 762,182 746,225 C 764,264 736,304 686,298 C 656,316 604,312 582,296 C 546,316 490,316 462,296 C 428,316 368,314 342,290 C 298,298 268,266 280,226 C 242,232 204,220 186,198 C 142,216 88,196 74,154 C 54,106 86,46 142,40 Z"
          fill={palette.cloudFill}
          stroke="#000000"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* ==================== "COMING" 3D EXTRUDED BUBBLE LETTERS ==================== */}
        <g
          style={{
            fontFamily: "'Fredoka', 'Lilita One', 'Rubik Bubbles', 'Arial Rounded MT Bold', 'Impact', sans-serif",
            fontWeight: 900,
          }}
        >
          {/* Deep 3D Extrusion Layers for "COMING" */}
          {[14, 11, 8, 5].map((offset) => (
            <text
              key={`c-ext-${offset}`}
              x="92"
              y="164"
              fontSize="126"
              letterSpacing="3"
              fill="#000000"
              stroke="#000000"
              strokeWidth="18"
              strokeLinejoin="round"
              transform={`translate(${-offset * 0.45}, ${offset})`}
            >
              COMING
            </text>
          ))}

          {/* Main Hot-Pink Fill + Thick Black Outline for "COMING" */}
          <text
            x="92"
            y="164"
            fontSize="126"
            letterSpacing="3"
            fill={palette.comingFill}
            stroke="#000000"
            strokeWidth="15"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            COMING
          </text>

          {/* Crisp Inner Fill Pass so Pink stays super punchy */}
          <text
            x="92"
            y="164"
            fontSize="126"
            letterSpacing="3"
            fill={palette.comingFill}
          >
            COMING
          </text>

          {/* Glossy White Comic Highlights on "COMING" Letters */}
          <g fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.92">
            {/* C highlight */}
            <path d="M 112,102 C 116,86 130,78 144,80" />
            {/* O highlight */}
            <path d="M 196,104 C 200,88 214,80 228,82" />
            {/* M highlight */}
            <path d="M 294,108 L 294,86" />
            {/* I highlight */}
            <path d="M 418,106 L 418,84" />
            {/* N highlight */}
            <path d="M 464,108 L 464,86" />
            {/* G highlight */}
            <path d="M 568,104 C 574,88 588,80 604,82" />
          </g>

          {/* Orange Comic Jelly Bean / Exclamation Accent to the right of 'COMING' */}
          <g transform="translate(658, 86) rotate(22)">
            <ellipse cx="22" cy="36" rx="22" ry="34" fill="#000000" transform="translate(-4, 7)" />
            <ellipse
              cx="22"
              cy="36"
              rx="22"
              ry="34"
              fill={palette.soonFill}
              stroke="#000000"
              strokeWidth="6"
            />
            <path
              d="M 14,18 C 18,12 26,12 30,18"
              stroke="#FFF3B0"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* ==================== "SOON" 3D EXTRUDED BUBBLE LETTERS ==================== */}
          {[14, 11, 8, 5].map((offset) => (
            <text
              key={`s-ext-${offset}`}
              x="306"
              y="268"
              fontSize="124"
              letterSpacing="4"
              fill="#000000"
              stroke="#000000"
              strokeWidth="18"
              strokeLinejoin="round"
              transform={`translate(${-offset * 0.45}, ${offset})`}
            >
              SOON
            </text>
          ))}

          <text
            x="306"
            y="268"
            fontSize="124"
            letterSpacing="4"
            fill={palette.soonFill}
            stroke="#000000"
            strokeWidth="15"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            SOON
          </text>

          <text
            x="306"
            y="268"
            fontSize="124"
            letterSpacing="4"
            fill={palette.soonFill}
          >
            SOON
          </text>

          {/* Glossy White Highlights on "SOON" */}
          <g fill="none" stroke="#FFF8D6" strokeWidth="4.5" strokeLinecap="round" opacity="0.9">
            {/* S highlight */}
            <path d="M 326,204 C 332,190 346,186 358,190" />
            {/* O highlight */}
            <path d="M 412,208 C 416,192 430,186 444,188" />
            {/* O highlight */}
            <path d="M 514,208 C 518,192 532,186 546,188" />
            {/* N highlight */}
            <path d="M 612,212 L 612,188" />
          </g>
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// CUSTOM SVG: STRIPED GREEN & YELLOW MAKHANA TUB IN BOTTOM-RIGHT CORNER
// ============================================================================
const MakhanaBucketSVG = React.memo(({ palette, onEruptClick }) => {
  return (
    <div
      onClick={onEruptClick}
      title="Click bucket to launch a Makhana Super Eruption!"
      className="relative w-full h-full cursor-pointer group select-none"
    >
      <svg viewBox="0 0 440 360" className="w-full h-full overflow-visible">
        <defs>
          <clipPath id="bucket-body-clip">
            <path d="M 34,195 L 435,95 L 455,365 L 95,365 Z" />
          </clipPath>
        </defs>

        {/* Dark Interior of the Tilted Bucket Rim */}
        <ellipse
          cx="235"
          cy="145"
          rx="212"
          ry="56"
          transform="rotate(-14 235 145)"
          fill="#1B2A18"
          stroke="#000000"
          strokeWidth="6"
        />

        {/* Dense Pile of Roasted Makhanas Nestled Inside the Bucket Mouth */}
        <g>
          {[
            { x: 140, y: 120, s: 76, v: 0 },
            { x: 205, y: 98, s: 84, v: 1 },
            { x: 275, y: 78, s: 88, v: 2 },
            { x: 345, y: 75, s: 86, v: 0 },
            { x: 75, y: 145, s: 72, v: 2 },
            { x: 118, y: 152, s: 86, v: 1 },
            { x: 185, y: 138, s: 92, v: 0 },
            { x: 255, y: 126, s: 84, v: 1 },
            { x: 318, y: 112, s: 88, v: 2 },
            { x: 375, y: 108, s: 78, v: 0 },
            { x: 52, y: 175, s: 66, v: 1 },
          ].map((m, idx) => (
            <g
              key={idx}
              transform={`translate(${m.x - m.s / 2}, ${m.y - m.s / 2})`}
              className="transition-transform duration-300 group-hover:-translate-y-2"
            >
              <svg width={m.s} height={m.s} viewBox="0 0 100 100">
                <RealisticMakhanaSVG variant={m.v} spiceColor={palette.spiceColor} idSuffix={`bucket-${idx}`} />
              </svg>
            </g>
          ))}
        </g>

        {/* Bucket Striped Lower Body (Green, White, Yellow Stripes) */}
        <g clipPath="url(#bucket-body-clip)">
          <rect x="0" y="70" width="460" height="310" fill={palette.green} />
          {/* White & Yellow Angled Stripes Matching Reference */}
          <polygon points="88,180 106,175 152,370 132,370" fill="#FFFFFF" />
          <polygon points="106,175 186,155 235,370 152,370" fill={palette.yellow} />
          <polygon points="186,155 255,138 308,370 235,370" fill={palette.green} />
          <polygon points="255,138 345,115 398,370 308,370" fill="#CEAB00" />
          <polygon points="345,115 445,90 465,370 398,370" fill="#9E8200" />
          {/* Subtle Inner Bucket Shading */}
          <rect x="0" y="70" width="460" height="310" fill="url(#bucket-shadow)" opacity="0.25" />
        </g>

        {/* Bucket Outer Black Ink Borders */}
        <path
          d="M 34,195 L 95,365 M 435,95 L 455,365"
          stroke="#000000"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Thick White & Black Comic Bucket Lip / Rim */}
        <path
          d="M 28,186 C 34,218 148,214 258,186 C 368,158 446,120 438,88 C 435,76 418,74 410,76 C 418,102 346,142 248,168 C 150,194 52,198 42,172 C 34,170 26,176 28,186 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // --- Animation & Theme Controls State ---
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [autoColorFlow, setAutoColorFlow] = useState(true);
  const [colorCycleHue, setColorCycleHue] = useState(0);
  const [colorSpeed, setColorSpeed] = useState(1);

  const [sizePulseEnabled, setSizePulseEnabled] = useState(true);
  const [sizeIntensity, setSizeIntensity] = useState(1);

  // Throw modes: 'cross-throw' (Throw Here & There) | 'ricochet' (Bouncy Ricochet) | 'catapult' (Bucket Catapult) | 'float' (Pop & Float)
  const [throwMode, setThrowMode] = useState('cross-throw');
  const [flowSpeed, setFlowSpeed] = useState(1);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHud, setShowHud] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState(null);

  // --- Interactive Counters & Pop FX ---
  const [poppedCount, setPoppedCount] = useState(0);
  const [popEffects, setPopEffects] = useState([]); // [{ id, x, y, word, color }]
  const [poppedMakhanaIds, setPoppedMakhanaIds] = useState({});
  const [posterMakhanas, setPosterMakhanas] = useState(POSTER_MAKHANAS);
  const [badgeHitRecoil, setBadgeHitRecoil] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // --- 60FPS Thrown Makhana Physics Particles State & Refs ---
  const [thrownPuffs, setThrownPuffs] = useState([]);
  const thrownPuffsRef = useRef([]);
  const [dragAimLine, setDragAimLine] = useState(null); // { x1, y1, x2, y2 }
  const dragStateRef = useRef({
    isDragging: false,
    grabbedPuffId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    lastTime: 0,
  });

  const [beatPhase, setBeatPhase] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerRef = useRef(null);
  const activePalette = POP_PALETTES[paletteIndex];

  // Helper to spawn a thrown makhana with realistic cross-screen or custom velocity
  const createThrownMakhana = useCallback((id, mode = 'cross-throw', customSpawn = null) => {
    const styleRoll = Math.random();
    const renderStyle = styleRoll < 0.14 ? 'comic' : styleRoll < 0.34 ? 'chunk' : 'realistic';
    const mobileScale = isMobile ? 0.68 : 1;
    const baseSize = (styleRoll > 0.84 ? 132 : styleRoll > 0.45 ? 84 : 58) * mobileScale;
    const variant = Math.floor(Math.random() * 3);

    if (customSpawn) {
      return {
        id,
        x: customSpawn.x,
        y: customSpawn.y,
        vx: customSpawn.vx,
        vy: customSpawn.vy,
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 520,
        scale: customSpawn.scale || 0.95,
        vScale: customSpawn.vScale || (Math.random() - 0.42) * 0.35,
        squashX: 1,
        squashY: 1,
        baseSize: customSpawn.baseSize || baseSize,
        variant,
        renderStyle: customSpawn.renderStyle || renderStyle,
        trail: [],
        bounces: 0,
      };
    }

    let x = 86;
    let y = 78;
    let vx = -55;
    let vy = -75;
    let scale = 0.65;
    let vScale = 0.32;

    if (mode === 'catapult') {
      // Catapulted in high parabolic arcs from the bottom-right striped bucket across the screen
      x = 82 + Math.random() * 10;
      y = 74 + Math.random() * 10;
      vx = -(38 + Math.random() * 68);
      vy = -(62 + Math.random() * 65);
      scale = 0.45;
      vScale = 0.45 + Math.random() * 0.35;
    } else if (mode === 'ricochet') {
      // High-energy cross-screen throws that bounce off screen borders & center badge
      const side = Math.floor(Math.random() * 4);
      if (side === 0) {
        x = 6; y = 20 + Math.random() * 60;
        vx = 45 + Math.random() * 45; vy = -35 + Math.random() * 50;
      } else if (side === 1) {
        x = 94; y = 20 + Math.random() * 60;
        vx = -(45 + Math.random() * 45); vy = -35 + Math.random() * 50;
      } else if (side === 2) {
        x = 85; y = 78;
        vx = -(50 + Math.random() * 45); vy = -(55 + Math.random() * 45);
      } else {
        x = 20 + Math.random() * 60; y = 92;
        vx = (Math.random() - 0.5) * 85; vy = -(65 + Math.random() * 40);
      }
      scale = 0.8 + Math.random() * 0.35;
      vScale = 0;
    } else if (mode === 'float') {
      // Gentle anti-gravity upward pop & float
      x = 8 + Math.random() * 84;
      y = 106 + Math.random() * 15;
      vx = (Math.random() - 0.5) * 16;
      vy = -(18 + Math.random() * 20);
      scale = 0.75 + Math.random() * 0.45;
      vScale = 0;
    } else {
      // DEFAULT 'cross-throw' ("Throw Here & There"):
      // Mix of Left->Right tosses, Right->Left tosses, Bucket->TopLeft catapults, and Corner->Corner throws!
      const pattern = Math.floor(Math.random() * 5);
      if (pattern === 0) {
        // Thrown from Left side across to Right
        x = -6;
        y = 22 + Math.random() * 58;
        vx = 52 + Math.random() * 52;
        vy = -(38 + Math.random() * 48);
        scale = 0.65;
        vScale = 0.28;
      } else if (pattern === 1) {
        // Thrown from Right side across to Left
        x = 106;
        y = 18 + Math.random() * 55;
        vx = -(52 + Math.random() * 52);
        vy = -(35 + Math.random() * 48);
        scale = 0.7;
        vScale = 0.25;
      } else if (pattern === 2) {
        // Catapulted out of the Bottom-Right Striped Bucket across to Left/Top
        x = 84 + Math.random() * 8;
        y = 76 + Math.random() * 8;
        vx = -(42 + Math.random() * 65);
        vy = -(64 + Math.random() * 58);
        scale = 0.45;
        vScale = 0.48;
      } else if (pattern === 3) {
        // Thrown from Bottom-Left corner diagonally up-right
        x = 6 + Math.random() * 18;
        y = 106;
        vx = 36 + Math.random() * 52;
        vy = -(72 + Math.random() * 48);
        scale = 0.55;
        vScale = 0.38;
      } else {
        // High lob across the top & center
        x = Math.random() < 0.5 ? -5 : 105;
        y = 12 + Math.random() * 28;
        vx = x < 50 ? (48 + Math.random() * 45) : -(48 + Math.random() * 45);
        vy = -(22 + Math.random() * 32);
        scale = 0.85;
        vScale = (Math.random() - 0.3) * 0.35;
      }
    }

    return {
      id,
      x,
      y,
      vx,
      vy,
      rot: Math.random() * 360,
      vRot: (Math.random() > 0.5 ? 1 : -1) * (160 + Math.random() * 280),
      scale,
      vScale,
      squashX: 1,
      squashY: 1,
      baseSize,
      variant,
      renderStyle,
      trail: [],
      bounces: 0,
    };
  }, [isMobile]);

  // Initialize 16 actively thrown makhana particles
  useEffect(() => {
    const initial = Array.from({ length: 16 }, (_, i) => {
      const p = createThrownMakhana(`throw-${i}`, throwMode);
      // Stagger initial positions mid-flight so the screen is immediately alive with flying makhanas
      p.x = 12 + ((i * 19) % 78);
      p.y = 14 + ((i * 23) % 72);
      return p;
    });
    thrownPuffsRef.current = initial;
    setThrownPuffs(initial);
  }, [createThrownMakhana, throwMode]);

  // Spawns a brand new makhana visibly arriving from somewhere else on screen
  const spawnArrivalMakhana = useCallback((excludeSide = null) => {
    const sides = ['left', 'right', 'bottom', 'bucket', 'top'].filter((s) => s !== excludeSide);
    const chosenSide = sides[Math.floor(Math.random() * sides.length)];

    let x, y, vx, vy, scale, vScale;
    const styleRoll = Math.random();
    const renderStyle = styleRoll < 0.15 ? 'comic' : styleRoll < 0.35 ? 'chunk' : 'realistic';
    const mobileScale = isMobile ? 0.68 : 1;
    const baseSize = (styleRoll > 0.85 ? 125 : styleRoll > 0.45 ? 85 : 60) * mobileScale;
    const variant = Math.floor(Math.random() * 3);

    if (chosenSide === 'left') {
      x = -8;
      y = 15 + Math.random() * 60;
      vx = 55 + Math.random() * 45;
      vy = -(30 + Math.random() * 45);
      scale = 0.7;
      vScale = 0.25;
    } else if (chosenSide === 'right') {
      x = 108;
      y = 15 + Math.random() * 55;
      vx = -(55 + Math.random() * 45);
      vy = -(30 + Math.random() * 45);
      scale = 0.7;
      vScale = 0.25;
    } else if (chosenSide === 'bucket') {
      x = 84 + Math.random() * 8;
      y = 76 + Math.random() * 8;
      vx = -(45 + Math.random() * 55);
      vy = -(65 + Math.random() * 55);
      scale = 0.5;
      vScale = 0.45;
    } else if (chosenSide === 'top') {
      x = 15 + Math.random() * 70;
      y = -10;
      vx = (Math.random() - 0.5) * 45;
      vy = 25 + Math.random() * 35;
      scale = 0.75;
      vScale = 0.15;
    } else {
      // bottom
      x = 10 + Math.random() * 70;
      y = 108;
      vx = (Math.random() - 0.5) * 60;
      vy = -(65 + Math.random() * 45);
      scale = 0.6;
      vScale = 0.35;
    }

    const newId = `arrival-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return {
      id: newId,
      x,
      y,
      vx,
      vy,
      rot: Math.random() * 360,
      vRot: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 260),
      scale,
      vScale,
      squashX: 1,
      squashY: 1,
      baseSize,
      variant,
      renderStyle,
      trail: [],
      bounces: 0,
    };
  }, [isMobile]);

  // Generates a new position far away from the old one so makhanas NEVER reappear in the same spot!
  const pickNewRandomPosition = useCallback((oldX, oldY, isForeground = false) => {
    let newX, newY, dist;
    let attempts = 0;
    do {
      if (isForeground) {
        // Foreground puffs stay around outer margins/corners for nice depth
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
          newX = 2 + Math.random() * 12;
          newY = 15 + Math.random() * 75;
        } else if (edge === 1) {
          newX = 86 + Math.random() * 12;
          newY = 15 + Math.random() * 75;
        } else if (edge === 2) {
          newX = 10 + Math.random() * 80;
          newY = 88 + Math.random() * 8;
        } else {
          newX = Math.random() < 0.5 ? 4 + Math.random() * 12 : 84 + Math.random() * 12;
          newY = 8 + Math.random() * 15;
        }
      } else {
        // Midground & chunks appear dynamically across the canvas, avoiding direct center
        newX = 6 + Math.random() * 88;
        newY = 10 + Math.random() * 82;
        const inCenterBadge = newX > 25 && newX < 75 && newY > 40 && newY < 72;
        if (inCenterBadge) {
          newX = newX < 50 ? 8 + Math.random() * 18 : 74 + Math.random() * 18;
        }
      }
      const dx = newX - oldX;
      const dy = newY - oldY;
      dist = Math.hypot(dx, dy);
      attempts++;
    } while (dist < 30 && attempts < 25);

    return { x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)) };
  }, []);

  // ONLY INCREMENTED AND POPPED WHEN AN ACTUAL MAKHANA IS CLICKED!
  const popMakhana = useCallback(
    (e, makhanaId, isStatic = false) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      if (soundEnabled) {
        playComicSound('crunch');
      }

      // 1. STRICTLY COUNT ONLY ON MAKHANA CLICK!
      setPoppedCount((c) => c + 1);

      // 2. Comic Pop/Crunch Onomatopoeia Burst
      const words = ['POP!', 'CRUNCH!', 'CRISPY!', 'KRAKOOM!', 'SNAP!', 'ZAP!'];
      const colors = [activePalette.pink, activePalette.yellow, activePalette.orange, '#00F5D4'];
      const word = words[Math.floor(Math.random() * words.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const rect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const clientX = e?.clientX ?? (window.innerWidth / 2);
      const clientY = e?.clientY ?? (window.innerHeight / 2);
      const xPct = ((clientX - rect.left) / rect.width) * 100;
      const yPct = ((clientY - rect.top) / rect.height) * 100;

      const fxId = Date.now() + Math.random();
      setPopEffects((prev) => [...prev.slice(-9), { id: fxId, x: xPct, y: yPct, word, color }]);
      setTimeout(() => {
        setPopEffects((prev) => prev.filter((item) => item.id !== fxId));
      }, 850);

      // 3. Mark popped animation on the makhana
      setPoppedMakhanaIds((prev) => ({ ...prev, [makhanaId]: true }));

      if (isStatic) {
        // Move popped makhana to a COMPLETELY DIFFERENT location on screen!
        setPosterMakhanas((prev) => {
          const target = prev.find((m) => m.id === makhanaId);
          const oldX = target ? target.x : xPct;
          const oldY = target ? target.y : yPct;
          const isFg = target?.layer === 'foreground';
          const newPos = pickNewRandomPosition(oldX, oldY, isFg);

          return prev.map((m) =>
            m.id === makhanaId
              ? {
                  ...m,
                  x: newPos.x,
                  y: newPos.y,
                  rot: Math.floor(Math.random() * 360),
                  variant: (m.variant + 1) % 3,
                }
              : m
          );
        });

        // After pop burst, unhide it so it pops into view at the NEW place!
        setTimeout(() => {
          setPoppedMakhanaIds((prev) => {
            const copy = { ...prev };
            delete copy[makhanaId];
            return copy;
          });
        }, 280);
      } else {
        // For thrown puffs: remove the popped puff and spawn a newly arriving makhana somewhere else!
        const clickedSide = xPct < 50 ? 'left' : 'right';
        const newArrival = spawnArrivalMakhana(clickedSide);
        const updated = thrownPuffsRef.current.filter((p) => p.id !== makhanaId);
        updated.push(newArrival);
        thrownPuffsRef.current = updated;
        setThrownPuffs(updated);

        setTimeout(() => {
          setPoppedMakhanaIds((prev) => {
            const copy = { ...prev };
            delete copy[makhanaId];
            return copy;
          });
        }, 280);
      }
    },
    [soundEnabled, activePalette, pickNewRandomPosition, spawnArrivalMakhana]
  );

  // Purely visual effect for volleys/swipes (DOES NOT INCREMENT SCORE!)
  const triggerVisualEffect = useCallback(
    (clientX, clientY, customWord = null) => {
      if (soundEnabled) {
        playComicSound(customWord === 'BOING!' ? 'boing' : customWord === 'WHOOSH!' ? 'whoosh' : 'crunch');
      }

      const words = ['TOSS!', 'WHOOSH!', 'ZAP!'];
      const colors = [activePalette.pink, activePalette.yellow, activePalette.orange, '#00F5D4'];
      const word = customWord || words[Math.floor(Math.random() * words.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const rect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const xPct = ((clientX - rect.left) / rect.width) * 100;
      const yPct = ((clientY - rect.top) / rect.height) * 100;

      const fxId = Date.now() + Math.random();
      setPopEffects((prev) => [...prev.slice(-9), { id: fxId, x: xPct, y: yPct, word, color }]);

      setTimeout(() => {
        setPopEffects((prev) => prev.filter((item) => item.id !== fxId));
      }, 850);
    },
    [soundEnabled, activePalette]
  );

  // Master 60FPS Animation Loop: Handles Background Color Cycle, Size Beats, and 2D Physics Throwing
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.06);
      lastTime = now;

      // 1. Update Beat Phase for Size & Scale Animations
      if (sizePulseEnabled) {
        setBeatPhase((prev) => (prev + dt * 3.2 * sizeIntensity) % (Math.PI * 200));
      }

      // 2. Smooth Continuous Hue Cycle for Background Comic Panels if Auto Color Flow is active
      if (autoColorFlow) {
        setColorCycleHue((prev) => (prev + dt * 18 * colorSpeed) % 360);
      }

      // 3. Step 2D Rigid-Body Parabolic Throwing & Ricochet Physics
      if (flowSpeed > 0) {
        const simDt = dt * flowSpeed;
        const gravity = throwMode === 'float' ? 0 : throwMode === 'ricochet' ? 42 : 58;
        const grabbedId = dragStateRef.current.isDragging ? dragStateRef.current.grabbedPuffId : null;

        const updated = thrownPuffsRef.current.map((p) => {
          // If currently held by user cursor/finger, follow pointer directly
          if (p.id === grabbedId) {
            return {
              ...p,
              squashX: 1.12,
              squashY: 0.9,
              trail: [...p.trail.slice(-5), { x: p.x, y: p.y }],
            };
          }

          let nextVx = p.vx;
          let nextVy = p.vy + gravity * simDt;
          let nextX = p.x + nextVx * simDt;
          let nextY = p.y + nextVy * simDt;
          let nextRot = p.rot + p.vRot * simDt;
          let nextScale = Math.max(0.32, Math.min(1.85, p.scale + p.vScale * simDt));
          let nextSquashX = p.squashX + (1 - p.squashX) * Math.min(1, simDt * 12);
          let nextSquashY = p.squashY + (1 - p.squashY) * Math.min(1, simDt * 12);
          let nextBounces = p.bounces;

          // Record motion trail for comic speed arcs
          const shouldRecordTrail = Math.hypot(nextVx, nextVy) > 28;
          const nextTrail = shouldRecordTrail
            ? [...p.trail.slice(-5), { x: p.x, y: p.y }]
            : p.trail.slice(1);

          // Bouncy Ricochet Mode OR occasional playful bounce off the "COMING SOON" cloud badge
          if (throwMode === 'ricochet') {
            // Bounce off Left / Right screen edges
            if (nextX < 4 && nextVx < 0) {
              nextX = 4;
              nextVx = -nextVx * 0.88;
              nextSquashX = 0.72;
              nextSquashY = 1.28;
              nextBounces += 1;
            } else if (nextX > 96 && nextVx > 0) {
              nextX = 96;
              nextVx = -nextVx * 0.88;
              nextSquashX = 0.72;
              nextSquashY = 1.28;
              nextBounces += 1;
            }
            // Bounce off Top / Bottom screen edges
            if (nextY < 5 && nextVy < 0) {
              nextY = 5;
              nextVy = -nextVy * 0.85;
              nextSquashX = 1.28;
              nextSquashY = 0.72;
              nextBounces += 1;
            } else if (nextY > 94 && nextVy > 0) {
              nextY = 94;
              nextVy = -Math.max(Math.abs(nextVy) * 0.88, 52);
              nextSquashX = 1.32;
              nextSquashY = 0.68;
              nextBounces += 1;
            }

            // Ricochet off the central "COMING SOON" comic cloud ellipse (center ~50%, 63%)
            const dxBadge = nextX - 50;
            const dyBadge = nextY - 63;
            if (Math.abs(dxBadge) < 20 && Math.abs(dyBadge) < 12 && nextBounces < 6) {
              const norm = Math.hypot(dxBadge, dyBadge) || 1;
              const speed = Math.max(Math.hypot(nextVx, nextVy), 55);
              nextVx = (dxBadge / norm) * speed * 0.95;
              nextVy = (dyBadge / norm) * speed * 0.95;
              nextSquashX = 1.35;
              nextSquashY = 0.68;
              nextBounces += 1;
              setBadgeHitRecoil(1.06);
              setTimeout(() => setBadgeHitRecoil(0), 140);
            }

            // Respawn fresh after several bounces so energy stays high
            if (nextBounces > 7) {
              return createThrownMakhana(p.id, throwMode);
            }
          } else {
            // In 'cross-throw', 'catapult', or 'float': Respawn when flying off-screen
            const outOfBounds =
              nextX < -16 ||
              nextX > 116 ||
              nextY > 118 ||
              (throwMode === 'float' && nextY < -14);

            if (outOfBounds) {
              return createThrownMakhana(p.id, throwMode);
            }
          }

          return {
            ...p,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
            rot: nextRot,
            scale: nextScale,
            squashX: nextSquashX,
            squashY: nextSquashY,
            trail: nextTrail,
            bounces: nextBounces,
          };
        });

        thrownPuffsRef.current = updated;
        setThrownPuffs(updated);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoColorFlow, colorSpeed, sizePulseEnabled, sizeIntensity, flowSpeed, throwMode, createThrownMakhana]);

  // Auto-cycle discrete Flavor Palettes every 6.5 seconds when Auto Color Flow is on
  useEffect(() => {
    if (!autoColorFlow) return;
    const interval = setInterval(() => {
      setPaletteIndex((prev) => (prev + 1) % POP_PALETTES.length);
    }, 6500 / Math.max(0.4, colorSpeed));
    return () => clearInterval(interval);
  }, [autoColorFlow, colorSpeed]);

  // Launch a Volley of Makhanas ("THROW HANDFUL!" button, Fox click, or Bucket click)
  const launchMakhanaVolley = useCallback(
    (originX = 86, originY = 78, count = 10, burstWord = 'TOSS!') => {
      if (soundEnabled) playComicSound('whoosh');
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        triggerVisualEffect(
          rect.left + (originX / 100) * rect.width,
          rect.top + (originY / 100) * rect.height,
          burstWord
        );
      }

      const volley = Array.from({ length: count }, (_, idx) => {
        // Fan out in all directions ("here and there")
        const angle =
          originX > 70
            ? -Math.PI * (0.52 + Math.random() * 0.42) // From bottom-right bucket toward top/left
            : -Math.PI * (0.15 + Math.random() * 0.7); // Upward wide fan from fox/center
        const speed = 58 + Math.random() * 68;
        return createThrownMakhana(`volley-${Date.now()}-${idx}`, throwMode, {
          x: originX + (Math.random() - 0.5) * 6,
          y: originY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 35,
          vy: Math.sin(angle) * speed,
          scale: 0.55 + Math.random() * 0.4,
          vScale: 0.35 + Math.random() * 0.35,
        });
      });

      const merged = [...thrownPuffsRef.current.slice(-14), ...volley];
      thrownPuffsRef.current = merged;
      setThrownPuffs(merged);
    },
    [soundEnabled, triggerVisualEffect, createThrownMakhana, throwMode]
  );

  // Pointer Down: Grab an existing Makhana OR start a Slingshot Swipe-Throw on empty space
  const handlePointerDown = useCallback((e, puffId = null) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    dragStateRef.current = {
      isDragging: true,
      grabbedPuffId: puffId,
      startX: xPct,
      startY: yPct,
      lastX: xPct,
      lastY: yPct,
      vx: 0,
      vy: 0,
      lastTime: performance.now(),
    };

    if (puffId && soundEnabled) {
      playComicSound('boing');
    }
  }, [soundEnabled]);

  // Pointer Move: Update Parallax, Move Grabbed Makhana, or Draw Slingshot Aim Line
  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x: nx, y: ny });

    if (!dragStateRef.current.isDragging) return;

    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const now = performance.now();
    const dt = Math.max((now - dragStateRef.current.lastTime) / 1000, 0.008);

    const vx = (xPct - dragStateRef.current.lastX) / dt;
    const vy = (yPct - dragStateRef.current.lastY) / dt;

    dragStateRef.current.vx = vx * 0.65 + dragStateRef.current.vx * 0.35;
    dragStateRef.current.vy = vy * 0.65 + dragStateRef.current.vy * 0.35;
    dragStateRef.current.lastX = xPct;
    dragStateRef.current.lastY = yPct;
    dragStateRef.current.lastTime = now;

    if (dragStateRef.current.grabbedPuffId) {
      // Move the grabbed makhana directly with the cursor
      thrownPuffsRef.current = thrownPuffsRef.current.map((p) =>
        p.id === dragStateRef.current.grabbedPuffId ? { ...p, x: xPct, y: yPct, vx: 0, vy: 0 } : p
      );
    } else {
      // Show comic dashed aim line when swiping on empty canvas
      const dist = Math.hypot(xPct - dragStateRef.current.startX, yPct - dragStateRef.current.startY);
      if (dist > 2.5) {
        setDragAimLine({
          x1: dragStateRef.current.startX,
          y1: dragStateRef.current.startY,
          x2: xPct,
          y2: yPct,
        });
      }
    }
  }, []);

  // Pointer Up: Fling the Grabbed Makhana OR Throw New Makhanas along the Swipe Vector!
  const handlePointerUp = useCallback(
    (e) => {
      if (!dragStateRef.current.isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const endX = ((e.clientX - rect.left) / rect.width) * 100;
      const endY = ((e.clientY - rect.top) / rect.height) * 100;

      const { grabbedPuffId, startX, startY, vx, vy } = dragStateRef.current;
      dragStateRef.current.isDragging = false;
      dragStateRef.current.grabbedPuffId = null;
      setDragAimLine(null);

      if (grabbedPuffId) {
        const dist = Math.hypot(endX - startX, endY - startY);
        // If the user tapped/clicked without dragging, pop this makhana!
        if (dist < 1.8) {
          popMakhana(e, grabbedPuffId, false);
          return;
        }

        // Release & fling the grabbed makhana with pointer velocity
        const flingVx = Math.max(-135, Math.min(135, vx * 0.55 || (Math.random() - 0.5) * 80));
        const flingVy = Math.max(-135, Math.min(135, vy * 0.55 || -65));
        thrownPuffsRef.current = thrownPuffsRef.current.map((p) =>
          p.id === grabbedPuffId
            ? {
                ...p,
                vx: flingVx,
                vy: flingVy,
                vRot: ( flingVx > 0 ? 1 : -1 ) * 420,
                squashX: 1.25,
                squashY: 0.78,
              }
            : p
        );
        triggerVisualEffect(e.clientX, e.clientY, 'FLING!');
      } else {
        const swipeDx = endX - startX;
        const swipeDy = endY - startY;
        const swipeDist = Math.hypot(swipeDx, swipeDy);

        if (swipeDist > 3.5) {
          // User swiped across the screen -> Throw 3 makhanas along their swipe trajectory!
          const newSwipePuffs = [0, 1, 2].map((i) =>
            createThrownMakhana(`swipe-${Date.now()}-${i}`, throwMode, {
              x: startX + (Math.random() - 0.5) * 3,
              y: startY + (Math.random() - 0.5) * 3,
              vx: swipeDx * (2.2 + i * 0.35) + (Math.random() - 0.5) * 18,
              vy: swipeDy * (2.2 + i * 0.35) - 15,
              scale: 0.8 + i * 0.12,
              vScale: 0.25,
            })
          );
          const merged = [...thrownPuffsRef.current.slice(-18), ...newSwipePuffs];
          thrownPuffsRef.current = merged;
          setThrownPuffs(merged);
          triggerVisualEffect(e.clientX, e.clientY, 'WHOOSH!');
        } else {
          // Click on empty space: does NOT count as a pop!
          // We do not increment poppedCount or pop any makhana here.
        }
      }
    },
    [createThrownMakhana, throwMode, triggerVisualEffect, popMakhana]
  );

  // Trigger Super Bucket Eruption
  const handleBucketEruption = useCallback(
    (e) => {
      e.stopPropagation();
      launchMakhanaVolley(85, 76, 12, 'KABOOM!');
    },
    [launchMakhanaVolley]
  );

  // Dynamic Scale Pulses for Centerpiece Elements
  const logoScale = useMemo(() => {
    if (!sizePulseEnabled) return 1;
    return 1 + Math.sin(beatPhase) * 0.032 * sizeIntensity;
  }, [beatPhase, sizePulseEnabled, sizeIntensity]);

  const badgeScale = useMemo(() => {
    const base = sizePulseEnabled ? 1 + Math.cos(beatPhase * 1.15) * 0.042 * sizeIntensity : 1;
    return badgeHitRecoil ? base * badgeHitRecoil : base;
  }, [beatPhase, sizePulseEnabled, sizeIntensity, badgeHitRecoil]);

  const burstScale = useMemo(() => {
    if (!sizePulseEnabled) return 1;
    return 1 + Math.sin(beatPhase * 0.5) * 0.018 * sizeIntensity;
  }, [beatPhase, sizePulseEnabled, sizeIntensity]);

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => handlePointerDown(e, null)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-[100dvh] min-h-[520px] overflow-hidden select-none cursor-grab active:cursor-grabbing font-sans touch-none"
      style={{
        backgroundColor: activePalette.pink,
        transition: 'background-color 700ms ease',
      }}
    >
      {/* Google Fonts for Authentic Pop Art & Bubble Comic Typography */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Fredoka:wght@700;800;900&family=Lilita+One&family=Rubik:ital,wght@0,800;0,900;1,900&display=swap');

        @keyframes starPop {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.28) rotate(12deg); }
        }
        @keyframes crunchPopBurst {
          0% { transform: translate(-50%, -50%) scale(0.2) rotate(-12deg); opacity: 1; }
          60% { transform: translate(-50%, -65%) scale(1.25) rotate(6deg); opacity: 1; }
          100% { transform: translate(-50%, -85%) scale(1.45) rotate(-4deg); opacity: 0; }
        }
      `}</style>

      {/* ====================================================================
          LAYER 2: ANCHORED REFERENCE MAKHANAS (CLICK OR DRAG TO THROW!)
      ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {posterMakhanas.filter((m) => m.layer !== 'foreground').map((m, idx) => {
          const isPopped = poppedMakhanaIds[m.id];
          const individualPulse = sizePulseEnabled
            ? 1 + Math.sin(beatPhase * 0.85 + idx * 0.9) * 0.08 * sizeIntensity
            : 1;
          const floatOffsetY = Math.sin(beatPhase * 0.45 + idx * 1.3) * 8;
          const floatRot = m.rot + Math.cos(beatPhase * 0.35 + idx) * 9;
          const responsiveSize = m.size * (isMobile ? 0.68 : 1);

          return (
            <div
              key={m.id}
              onClick={(e) => {
                popMakhana(e, m.id, true);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handlePointerDown(e, null);
              }}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: `${responsiveSize}px`,
                height: `${responsiveSize}px`,
                transform: `translate3d(calc(-50% + ${mousePos.x * -18}px), calc(-50% + ${
                  mousePos.y * -18 + floatOffsetY
                }px), 0) scale(${isPopped ? 0.01 : individualPulse}) rotate(${floatRot}deg)`,
                transition: isPopped
                  ? 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'transform 90ms linear',
              }}
              className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-90 hover:brightness-110 transition-transform"
            >
              {m.layer === 'comic' ? (
                <ComicIllustratedMakhanaSVG />
              ) : m.layer === 'chunk' ? (
                <CrunchyChunkSVG variant={m.variant} spiceColor={activePalette.spiceColor} />
              ) : (
                <RealisticMakhanaSVG
                  variant={m.variant}
                  spiceColor={activePalette.spiceColor}
                  idSuffix={m.id}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ====================================================================
          LAYER 3: COMIC MOTION TRAILS & THROWN MAKHANA PHYSICS ENGINE
          (Makhanas actively thrown "Here & There" across the screen!)
      ==================================================================== */}
      {/* SVG Comic Dashed Motion Arcs & Slingshot Aim Line */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible"
      >
        {thrownPuffs.map((puff) => {
          if (!puff.trail || puff.trail.length < 2) return null;
          const pts = [...puff.trail, { x: puff.x, y: puff.y }]
            .map((pt) => `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`)
            .join(' ');
          return (
            <polyline
              key={`trail-${puff.id}`}
              points={pts}
              fill="none"
              stroke="#000000"
              strokeWidth="0.28"
              strokeDasharray="0.9 0.7"
              strokeLinecap="round"
              opacity="0.38"
            />
          );
        })}

        {/* Live Slingshot Swipe Aim Vector when user drags on canvas */}
        {dragAimLine && (
          <g>
            <line
              x1={dragAimLine.x1}
              y1={dragAimLine.y1}
              x2={dragAimLine.x2}
              y2={dragAimLine.y2}
              stroke="#000000"
              strokeWidth="0.6"
              strokeDasharray="1.2 0.8"
              strokeLinecap="round"
            />
            <line
              x1={dragAimLine.x1}
              y1={dragAimLine.y1}
              x2={dragAimLine.x2}
              y2={dragAimLine.y2}
              stroke="#FFE600"
              strokeWidth="0.35"
              strokeDasharray="1.2 0.8"
              strokeLinecap="round"
            />
            <circle cx={dragAimLine.x2} cy={dragAimLine.y2} r="1.2" fill="#FF007F" stroke="#000" strokeWidth="0.25" />
          </g>
        )}
      </svg>

      {/* Active Thrown Makhana Puffs */}
      <div className="absolute inset-0 pointer-events-none z-15">
        {thrownPuffs.map((puff) => {
          const isPopped = poppedMakhanaIds[puff.id];
          const pulseBoost = sizePulseEnabled ? 1 + Math.sin(beatPhase + puff.variant) * 0.06 * sizeIntensity : 1;
          const finalScaleX = (isPopped ? 0 : puff.scale * pulseBoost) * (puff.squashX || 1);
          const finalScaleY = (isPopped ? 0 : puff.scale * pulseBoost) * (puff.squashY || 1);
          const blur = puff.scale > 1.32 ? (puff.scale - 1.32) * 3.8 : 0;

          return (
            <div
              key={puff.id}
              onClick={(e) => {
                popMakhana(e, puff.id, false);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                handlePointerDown(e, puff.id);
              }}
              style={{
                left: `${puff.x}%`,
                top: `${puff.y}%`,
                width: `${puff.baseSize}px`,
                height: `${puff.baseSize}px`,
                filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none',
                transform: `translate3d(-50%, -50%, 0) rotate(${puff.rot}deg) scale(${finalScaleX.toFixed(3)}, ${finalScaleY.toFixed(3)})`,
                transition: isPopped ? 'transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
              className="absolute pointer-events-auto cursor-pointer hover:scale-110 active:scale-90 hover:brightness-110"
            >
              {puff.renderStyle === 'comic' ? (
                <ComicIllustratedMakhanaSVG />
              ) : puff.renderStyle === 'chunk' ? (
                <CrunchyChunkSVG variant={puff.variant} spiceColor={activePalette.spiceColor} />
              ) : (
                <RealisticMakhanaSVG
                  variant={puff.variant}
                  spiceColor={activePalette.spiceColor}
                  idSuffix={puff.id}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ====================================================================
          LAYER 4: CENTERPIECE BRAND LOGO, "MAKHANA SNACKS" & "COMING SOON"
          NOTE: "POP CULTURE" (#B3281E) and "MAKHANA SNACKS" (#062E16)
          are 100% colour-locked to the original reference brand colours!
      ==================================================================== */}
      <main
        className="relative z-20 flex flex-col items-center justify-center w-full h-full px-2 sm:px-4 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)`,
        }}
      >
        <div className="w-full max-w-[820px] flex flex-col items-center justify-center -mt-4 sm:-mt-2 pointer-events-auto">
          {/* 1. POP CULTURE LOGO WITH FOX MASCOT (STRICTLY LOCKED TO #B3281E) */}
          <div className="w-[90%] sm:w-[76%] md:w-[72%] max-w-[580px] mb-0 sm:mb-1">
            <PopCultureLogoSVG
              pulseScale={logoScale}
              hoveredLetter={hoveredLetter}
              setHoveredLetter={setHoveredLetter}
              onFoxThrow={(e) => {
                e.stopPropagation();
                launchMakhanaVolley(36, 32, 9, 'FOX TOSS!');
              }}
            />
          </div>

          {/* 3. "COMING SOON" 3D EXTRUDED COMIC CLOUD */}
          <div className="w-[98%] sm:w-[85%] md:w-[80%] max-w-[660px] -mt-1 sm:-mt-2">
            <ComingSoonCloudSVG
              palette={activePalette}
              beatScale={badgeScale}
              onTriggerPop={(e) => {
                e.stopPropagation();
                launchMakhanaVolley(50, 62, 10, 'POP!');
              }}
            />
          </div>
        </div>
      </main>

      {/* ====================================================================
          LAYER 5: STRIPED MAKHANA BUCKET (BOTTOM-RIGHT) & GIANT BLURRED FOREGROUND PUFFS
      ==================================================================== */}
      {/* Striped Bucket in Bottom-Right Corner */}
      <div
        className="absolute -right-[6%] -bottom-[3%] sm:-right-[4%] sm:-bottom-[5%] w-[185px] h-[155px] sm:w-[320px] sm:h-[260px] md:w-[420px] md:h-[340px] z-25 pointer-events-auto"
        style={{
          transform: `translate3d(${mousePos.x * -22}px, ${mousePos.y * -16}px, 0) scale(${
            sizePulseEnabled ? 1 + Math.sin(beatPhase * 0.9) * 0.025 * sizeIntensity : 1
          })`,
        }}
      >
        <MakhanaBucketSVG palette={activePalette} onEruptClick={handleBucketEruption} />
      </div>

      {/* Giant Out-of-Focus Foreground Makhana Puffs (Depth of Field Layer) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {posterMakhanas.filter((m) => m.layer === 'foreground').map((m, idx) => {
          const isPopped = poppedMakhanaIds[m.id];
          const fgScale = sizePulseEnabled
            ? 1 + Math.cos(beatPhase * 0.7 + idx * 1.4) * 0.07 * sizeIntensity
            : 1;
          const fgY = Math.sin(beatPhase * 0.5 + idx) * 14;
          const fgRot = m.rot + Math.sin(beatPhase * 0.3 + idx) * 8;
          const responsiveFgSize = m.size * (isMobile ? 0.58 : 1);

          return (
            <div
              key={m.id}
              onClick={(e) => {
                popMakhana(e, m.id, true);
              }}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: `${responsiveFgSize}px`,
                height: `${responsiveFgSize}px`,
                filter: `blur(${m.blur}px)`,
                transform: `translate3d(calc(-50% + ${mousePos.x * -38}px), calc(-50% + ${
                  mousePos.y * -38 + fgY
                }px), 0) scale(${isPopped ? 0.01 : fgScale}) rotate(${fgRot}deg)`,
                transition: isPopped
                  ? 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'none',
              }}
              className="absolute pointer-events-auto cursor-pointer hover:brightness-110 active:scale-95 transition-transform"
            >
              <RealisticMakhanaSVG
                variant={m.variant}
                spiceColor={activePalette.spiceColor}
                idSuffix={m.id}
              />
            </div>
          );
        })}
      </div>

      {/* ====================================================================
          LAYER 6: CLICK-TO-POP COMIC SOUND-EFFECT BURSTS ("CRUNCH!", "POP!")
      ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {popEffects.map((fx) => (
          <div
            key={fx.id}
            style={{
              left: `${fx.x}%`,
              top: `${fx.y}%`,
              animation: 'crunchPopBurst 820ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            className="absolute pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              {/* Jagged Comic Burst Behind Word */}
              <svg viewBox="0 0 160 110" className="w-36 h-24 overflow-visible drop-shadow-[4px_4px_0_#000]">
                <polygon
                  points="80,4 98,26 132,12 122,42 156,55 124,72 138,100 100,88 80,108 60,88 22,100 36,72 4,55 38,42 28,12 62,26"
                  fill={fx.color}
                  stroke="#000000"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="absolute text-xl sm:text-2xl font-black italic tracking-wider text-white"
                style={{
                  fontFamily: "'Fredoka', 'Impact', sans-serif",
                  WebkitTextStroke: '4px #000',
                  paintOrder: 'stroke fill',
                }}
              >
                {fx.word}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          LAYER 7: INTERACTIVE POP-ART ANIMATION STUDIO HUD (THROW / COLOUR / SIZE)
      ==================================================================== */}
      {/* Top-Right Quick Toggle Bar */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="fixed top-2 right-2 sm:top-3 sm:right-3 z-50 flex items-center gap-1.5 sm:gap-2"
      >
        {/* Interactive Hint Pill */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/95 text-black font-black text-xs px-3 py-1.5 rounded-full border-[3px] border-black shadow-[3px_3px_0_#000]">
          <Hand className="w-3.5 h-3.5 text-[#B3281E]" />
          <span>CLICK ANY MAKHANA TO POP IT!</span>
        </div>

        {/* Crunch Score Pill (visible on mobile too) */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-[#FFE600] text-black font-black text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000]">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
          <span>POPPED: {poppedCount}</span>
        </div>

        {/* Sound FX Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Pop Sound FX' : 'Enable Pop Sound FX'}
          className="bg-white hover:bg-[#FFE600] text-black p-1.5 sm:p-2 rounded-full border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* Show/Hide Controls Toggle */}
        <button
          onClick={() => setShowHud(!showHud)}
          className="flex items-center gap-1 sm:gap-1.5 bg-white hover:bg-[#FFE600] text-black font-black text-[11px] sm:text-xs px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all"
        >
          {showHud ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          <span className="hidden sm:inline">{showHud ? 'Poster Only' : 'Anim Controls'}</span>
          <span className="sm:hidden">{showHud ? 'Hide' : 'Controls'}</span>
        </button>
      </div>

      {/* Bottom Interactive Dock: Throw Here & There Modes, Handful Volley, BG Colour & Size */}
      {showHud && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[960px] pointer-events-auto"
        >
          <div className="bg-[#FDF8E2]/95 backdrop-blur-md border-[3px] sm:border-[4px] border-black rounded-2xl shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] px-2.5 py-2 sm:px-4 sm:py-3 flex items-center justify-start sm:justify-between gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
            {/* 1. THROWING MODE CONTROLS ("THROW HERE & THERE" / "RICOCHET" / "CATAPULT") */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  const modes = ['cross-throw', 'ricochet', 'catapult', 'float'];
                  const nextMode = modes[(modes.indexOf(throwMode) + 1) % modes.length];
                  setThrowMode(nextMode);
                  if (soundEnabled) playComicSound('whoosh');
                }}
                className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#ff8024] text-white font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all uppercase"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>
                  {throwMode === 'cross-throw'
                    ? 'THROW HERE & THERE'
                    : throwMode === 'ricochet'
                    ? 'BOUNCY RICOCHET'
                    : throwMode === 'catapult'
                    ? 'BUCKET CATAPULT'
                    : 'POP & FLOAT'}
                </span>
              </button>

              {/* THROW HANDFUL VOLLEY BUTTON */}
              <button
                onClick={() => launchMakhanaVolley(84, 76, 12, 'THROW!')}
                className="flex items-center gap-1 bg-[#B3281E] hover:bg-[#cc2f24] text-white font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" />
                <span>HANDFUL!</span>
              </button>

              <button
                onClick={() => setFlowSpeed((s) => (s === 0 ? 1 : s === 1 ? 1.8 : 0))}
                title="Cycle Throw Speed (1x / 1.8x / Pause)"
                className="bg-white hover:bg-gray-100 text-black font-black text-xs px-2 sm:px-2.5 py-1.5 rounded-xl border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000]"
              >
                {flowSpeed === 0 ? 'PAUSED' : `${flowSpeed}X`}
              </button>
            </div>

            {/* 2. BACKGROUND COLOUR CHANGE CONTROLS (LOGO COLOUR REMAINS LOCKED!) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  if (soundEnabled) playComicSound('color');
                  setAutoColorFlow(!autoColorFlow);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 sm:border-[3px] border-black font-black text-xs shadow-[2px_2px_0_#000] transition-all ${
                  autoColorFlow ? 'bg-[#FF007F] text-white' : 'bg-white text-black'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{autoColorFlow ? 'BG: AUTO' : 'BG: LOCKED'}</span>
              </button>

              {/* Flavor Palette Swatches */}
              <div className="flex items-center gap-1 bg-black/10 p-1 rounded-xl border-2 border-black">
                {POP_PALETTES.map((pal, idx) => (
                  <button
                    key={pal.id}
                    onClick={() => {
                      if (soundEnabled) playComicSound('color');
                      setPaletteIndex(idx);
                      setAutoColorFlow(false);
                    }}
                    title={`${pal.name} (${pal.flavorTag}) — Logo stays original red!`}
                    style={{ backgroundColor: pal.pink }}
                    className={`w-5 h-5 rounded-lg border-2 border-black transition-transform ${
                      paletteIndex === idx ? 'scale-125 ring-2 ring-black z-10' : 'opacity-80 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 3. SIZE PULSE CONTROLS */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  const next = sizeIntensity >= 1.8 ? 0.5 : sizeIntensity + 0.65;
                  setSizeIntensity(next);
                  setSizePulseEnabled(true);
                }}
                className="flex items-center gap-1.5 bg-[#FFE600] hover:bg-[#ffd000] text-black font-black text-xs px-2.5 py-1.5 rounded-xl border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>
                  SIZE: {sizeIntensity < 0.8 ? 'CHILL' : sizeIntensity < 1.4 ? 'POP' : 'HYPER'}
                </span>
              </button>
            </div>

            {/* 4. EARLY ACCESS / FLAVOR DRAWER CTA */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="ml-auto shrink-0 flex items-center gap-1.5 bg-[#005A2B] hover:bg-[#007538] text-white font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-xl border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] active:translate-y-0.5 transition-all"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFE600] fill-[#FFE600]" />
              <span>VIP DROP</span>
              <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          LAYER 8: VIP LAUNCH & FLAVOR EXPLORER MODAL DRAWER
      ==================================================================== */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#FDF8E2] border-[3px] sm:border-[5px] border-black rounded-2xl sm:rounded-3xl shadow-[6px_6px_0_#000] sm:shadow-[12px_12px_0_#000] p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#FF007F] text-white font-black text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 sm:border-[3px] border-black shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] hover:scale-105 transition-transform"
            >
              CLOSE ✕
            </button>

            <div className="inline-block bg-[#FFE600] text-black font-black text-[11px] sm:text-xs uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border-2 border-black mb-2 sm:mb-3">
              First Batch Dropping Soon
            </div>

            <h3
              className="text-2xl sm:text-4xl font-black uppercase tracking-wide text-[#B3281E] mb-1.5 sm:mb-2 pr-12"
              style={{ fontFamily: "'Fredoka', 'Impact', sans-serif" }}
            >
              JOIN THE POP CULTURE CLUB!
            </h3>
            <p className="text-xs sm:text-base font-bold text-black/80 mb-3 sm:mb-5">
              Zero trans-fat, slow-roasted Himalayan Fox Nuts tumbled in bold, comic-book punchy spices. Click a flavor below to morph the live poster theme:
            </p>

            {/* Interactive Flavor Cards that also change the live theme */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {POP_PALETTES.slice(0, 3).map((pal, i) => (
                <button
                  key={pal.id}
                  onClick={() => {
                    setPaletteIndex(i);
                    setAutoColorFlow(false);
                    if (soundEnabled) playComicSound('color');
                  }}
                  style={{ backgroundColor: pal.pink }}
                  className="text-left p-3.5 rounded-2xl border-[3px] border-black shadow-[4px_4px_0_#000] text-white hover:-translate-y-1 transition-transform"
                >
                  <div className="text-xs font-black uppercase bg-black/30 inline-block px-2 py-0.5 rounded-md mb-1">
                    {pal.name}
                  </div>
                  <div className="font-extrabold text-sm leading-tight drop-shadow-[1px_1px_0_#000]">
                    {pal.flavorTag}
                  </div>
                </button>
              ))}
            </div>

            {/* VIP Notify Form */}
            {subscribed ? (
              <div className="bg-[#005A2B] text-white p-4 rounded-2xl border-[3px] border-black shadow-[4px_4px_0_#000] flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-[#FFE600] shrink-0" />
                <div>
                  <div className="font-black text-base">YOU’RE ON THE VIP CRUNCH LIST!</div>
                  <div className="text-xs text-white/90">
                    We’ll send your secret 25% Launch Box code the second we pop!
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (emailInput.trim()) {
                    setSubscribed(true);
                    if (soundEnabled) playComicSound('crunch');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email for early flavor drop..."
                  className="flex-1 bg-white text-black font-bold px-4 py-3 rounded-xl border-[3px] border-black shadow-[4px_4px_0_#000] focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                />
                <button
                  type="submit"
                  className="bg-[#FF6B00] hover:bg-[#ff7b1c] text-white font-black px-6 py-3 rounded-xl border-[3px] border-black shadow-[4px_4px_0_#000] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>NOTIFY ME!</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
