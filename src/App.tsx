import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Heart,
  Flame,
  Zap,
  Gamepad2,
  Image as ImageIcon,
  Crosshair,
  Wind,
  ChefHat,
  Target,
  Swords,
  CheckCircle2
} from 'lucide-react';

// ============================================================================
// STRICT BRAND CONSTANTS (MATCHING REFERENCE LOGO & POSTER)
// ============================================================================
const BRAND_LOGO_RED = '#B3281E';
const BRAND_CREAM_BG = '#FDF8E2';
const BRAND_SUBTITLE_GREEN = '#062E16';
const POP_PINK = '#FF007F';
const POP_COMING_PINK = '#FF148A';
const POP_ORANGE = '#FF6B00';
const POP_YELLOW = '#FFE600';
const POP_GREEN = '#005A2B';
const POP_DARK_GREEN = '#003819';

// ============================================================================
// THE 6 OFFICIAL POP CULTURE MAKHANA FLAVORS (USED IN GAMES & PROPS)
// ============================================================================
const FLAVORS = [
  {
    id: 'periperi',
    name: 'Peri Peri',
    tagline: 'Fiery African Bird’s Eye Chili Kick!',
    color: '#EF4444',
    accent: '#FCA5A5',
    bgLight: '#FEE2E2',
    spiceColor: '#B91C1C',
  },
  {
    id: 'cheese',
    name: 'Cheese',
    tagline: 'Bold Melt-In-Mouth Cheddar Pop!',
    color: '#F59E0B',
    accent: '#FDE047',
    bgLight: '#FEF3C7',
    spiceColor: '#D97706',
  },
  {
    id: 'saltpepper',
    name: 'Salt & Pepper',
    tagline: 'Cracked Black Pepper & Sea Salt!',
    color: '#334155',
    accent: '#94A3B8',
    bgLight: '#F1F5F9',
    spiceColor: '#1E293B',
  },
  {
    id: 'creamonion',
    name: 'Cream & Onion',
    tagline: 'Smooth Sour Cream & Spring Chives!',
    color: '#10B981',
    accent: '#6EE7B7',
    bgLight: '#D1FAE5',
    spiceColor: '#047857',
  },
  {
    id: 'limechilli',
    name: 'Lime Chilli',
    tagline: 'Zesty Tangy Lime Meets Spicy Chili!',
    color: '#84CC16',
    accent: '#BEF264',
    bgLight: '#ECFCCB',
    spiceColor: '#15803D',
  },
  {
    id: 'chaatmasala',
    name: 'Chaat Masala',
    tagline: 'Street-Style Tangy Amchur & Black Salt!',
    color: '#9333EA',
    accent: '#D8B4FE',
    bgLight: '#F3E8FF',
    spiceColor: '#6B21A8',
  },
];

// ============================================================================
// CURATED PERIMETER-ONLY MAKHANAS FOR POSTER VIEW (CLEAN, NO COLLISION)
// ============================================================================
const CURATED_POSTER_MAKHANAS = [
  // Left Perimeter Blurred Foreground Puffs
  { id: 'p-fg-1', x: 6.5, y: 18.5, px: 9.0, py: 15.0, size: 165, psize: 100, type: 'realistic', variant: 0, rot: -15, blur: 3.0, phase: 0.2 },
  { id: 'p-fg-2', x: 5.5, y: 64.0, px: 8.0, py: 62.0, size: 158, psize: 95, type: 'realistic', variant: 1, rot: 24, blur: 3.0, phase: 1.1 },
  { id: 'p-fg-3', x: 12.0, y: 90.0, px: 14.0, py: 86.0, size: 190, psize: 105, type: 'realistic', variant: 2, rot: 10, blur: 3.5, phase: 2.0 },

  // Top-Left Flat Comic-Illustrated Makhana (From Reference Poster)
  { id: 'p-comic-1', x: 30.8, y: 11.2, px: 28.0, py: 10.5, size: 102, psize: 72, type: 'comic', variant: 0, rot: -12, blur: 0, phase: 0.6 },

  // Left Outer Border Midground Makhanas
  { id: 'p-mg-1', x: 18.2, y: 27.5, px: 15.0, py: 26.0, size: 82, psize: 62, type: 'realistic', variant: 1, rot: 18, blur: 0, phase: 1.4 },
  { id: 'p-mg-2', x: 8.5, y: 45.0, px: 9.0, py: 44.0, size: 52, psize: 44, type: 'realistic', variant: 0, rot: 40, blur: 0, phase: 2.3 },
  { id: 'p-mg-3', x: 18.8, y: 47.5, px: 14.0, py: 52.0, size: 76, psize: 58, type: 'realistic', variant: 2, rot: -20, blur: 0, phase: 0.9 },
  { id: 'p-mg-4', x: 17.0, y: 80.5, px: 16.0, py: 75.0, size: 90, psize: 66, type: 'realistic', variant: 1, rot: 14, blur: 0, phase: 1.8 },
  { id: 'p-mg-5', x: 34.0, y: 91.5, px: 35.0, py: 91.0, size: 86, psize: 64, type: 'realistic', variant: 0, rot: -18, blur: 0, phase: 2.7 },

  // Top-Right & Right Outer Border Makhanas
  { id: 'p-mg-6', x: 64.2, y: 16.5, px: 72.0, py: 12.0, size: 104, psize: 72, type: 'realistic', variant: 1, rot: 26, blur: 0, phase: 0.4 },
  { id: 'p-fg-4', x: 87.5, y: 15.0, px: 89.0, py: 16.0, size: 170, psize: 105, type: 'realistic', variant: 2, rot: -18, blur: 1.2, phase: 1.5 },
  { id: 'p-ch-1', x: 78.5, y: 22.0, px: 80.0, py: 25.0, size: 72, psize: 54, type: 'chunk', variant: 0, rot: 15, blur: 0, phase: 2.1 },
  { id: 'p-mg-7', x: 79.5, y: 43.5, px: 87.0, py: 42.0, size: 92, psize: 66, type: 'realistic', variant: 0, rot: -14, blur: 0, phase: 0.8 },
  { id: 'p-fg-5', x: 92.0, y: 48.0, px: 90.0, py: 57.0, size: 130, psize: 85, type: 'realistic', variant: 1, rot: 38, blur: 2.5, phase: 1.9 },
  { id: 'p-mg-8', x: 83.8, y: 60.0, px: 84.0, py: 71.0, size: 62, psize: 52, type: 'realistic', variant: 2, rot: -25, blur: 0, phase: 2.5 },
];

// ============================================================================
// SUBTLE VISUAL INGREDIENT PROPS ON THE POSTER PERIMETER (NO FLAVOR TEXT!)
// Strictly positioned in the outer comic panels away from the center text
// ============================================================================
const POSTER_INGREDIENT_PROPS = [
  // 1. Peri-Peri Red Chili Pod (Upper-left perimeter near yellow ray)
  { id: 'prop-chili', flavor: 'periperi', x: 22.5, y: 15.0, px: 18.0, py: 12.0, size: 68, psize: 50, rot: -24, phase: 0.3 },
  // 2. Golden Cheddar Cheese Wedge (Upper-right perimeter near green panel)
  { id: 'prop-cheese', flavor: 'cheese', x: 73.5, y: 11.5, px: 82.0, py: 10.5, size: 66, psize: 48, rot: 18, phase: 1.2 },
  // 3. Zesty Green Lime Wedge (Lower-left perimeter near orange wave)
  { id: 'prop-lime', flavor: 'limechilli', x: 13.5, y: 69.5, px: 11.0, py: 69.0, size: 64, psize: 46, rot: -15, phase: 2.1 },
  // 4. Cream & Onion Rings + Chive Sprig (Mid-right perimeter above bucket)
  { id: 'prop-onion', flavor: 'creamonion', x: 86.5, y: 34.5, px: 89.0, py: 32.0, size: 66, psize: 50, rot: 22, phase: 0.9 },
  // 5. Cracked Black Peppercorns & Sea Salt Crystals (Lower-left-center perimeter)
  { id: 'prop-pepper', flavor: 'saltpepper', x: 25.0, y: 86.5, px: 24.0, py: 85.0, size: 58, psize: 44, rot: 10, phase: 1.7 },
  // 6. Chaat Masala Star Anise & Tangy Spice Pod (Lower-center-right perimeter)
  { id: 'prop-chaat', flavor: 'chaatmasala', x: 68.5, y: 89.5, px: 56.0, py: 91.0, size: 60, psize: 46, rot: -18, phase: 2.6 },
];

// ============================================================================
// WEB AUDIO SYNTHESIZER FOR ARCADE GAME & INTERACTION SOUNDS
// ============================================================================
function playSoundFX(type = 'pop') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'catch' || type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.11);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'golden' || type === 'combo') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.16, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.17);
      });
    } else if (type === 'slash') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'bomb') {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    }
  } catch (e) {
    // Ignore audio context restrictions before user interaction
  }
}

// ============================================================================
// CUSTOM SVG: COMIC-ILLUSTRATED FLAVOR INGREDIENT PROPS (6 FLAVORS)
// ============================================================================
const FlavorPropSVG = React.memo(({ flavor = 'periperi' }: any) => {
  switch (flavor) {
    case 'periperi':
      // Fiery Red Curved Peri-Peri Chili Pepper with Green Calyx & Comic Shine
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
          {/* Stem & Calyx */}
          <path
            d="M 28,24 C 18,14 22,6 32,8 C 36,12 36,20 34,26"
            fill="none"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 24,28 C 28,20 42,20 46,28 C 40,34 30,34 24,28 Z"
            fill="#16A34A"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Chili Body */}
          <path
            d="M 26,28 C 22,52 38,82 78,90 C 88,92 92,86 86,78 C 62,62 52,44 45,26 Z"
            fill="#EF4444"
            stroke="#000000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Glossy Comic Highlight */}
          <path
            d="M 33,36 C 34,52 46,68 66,78"
            fill="none"
            stroke="#FECACA"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'cheese':
      // Golden Cheddar / Swiss Cheese Wedge with Comic Holes
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
          {/* Top Slanted Cheese Face */}
          <polygon
            points="14,52 68,18 88,46 24,58"
            fill="#FDE047"
            stroke="#000000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Front Cheese Block Face */}
          <polygon
            points="14,52 88,46 84,82 14,84"
            fill="#F59E0B"
            stroke="#000000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Cheese Holes */}
          <circle cx="34" cy="68" r="7" fill="#D97706" stroke="#000000" strokeWidth="3.5" />
          <circle cx="64" cy="64" r="8.5" fill="#D97706" stroke="#000000" strokeWidth="3.5" />
          <circle cx="52" cy="40" r="5.5" fill="#F59E0B" stroke="#000000" strokeWidth="3" />
          <path d="M 22,58 L 44,56" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'limechilli':
      // Zesty Green Lime Wedge + Chili Spark
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
          {/* Outer Green Rind */}
          <path
            d="M 16,36 A 38,38 0 0 0 86,68 L 16,36 Z"
            fill="#15803D"
            stroke="#000000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Inner Pith & Juicy Segments */}
          <path
            d="M 22,39 A 31,31 0 0 0 79,65 L 22,39 Z"
            fill="#ECFCCB"
            stroke="#000000"
            strokeWidth="3.5"
          />
          <path
            d="M 27,42 A 25,25 0 0 0 73,62 L 27,42 Z"
            fill="#84CC16"
          />
          {/* Segment Divider Lines */}
          <line x1="50" y1="52" x2="36" y2="68" stroke="#ECFCCB" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="52" x2="54" y2="72" stroke="#ECFCCB" strokeWidth="3.5" strokeLinecap="round" />
          {/* Tiny Red Chili Flake Accent */}
          <circle cx="72" cy="30" r="6" fill="#EF4444" stroke="#000000" strokeWidth="3" />
        </svg>
      );

    case 'creamonion':
      // Crisp Purple/White Onion Rings + Fresh Green Chive Sprig
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
          {/* Green Herb Chive Sprigs */}
          <path
            d="M 18,78 Q 48,42 84,22 M 26,84 Q 58,56 88,42"
            fill="none"
            stroke="#10B981"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 18,78 Q 48,42 84,22 M 26,84 Q 58,56 88,42"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Outer Onion Ring */}
          <circle
            cx="46"
            cy="48"
            r="26"
            fill="none"
            stroke="#000000"
            strokeWidth="12"
          />
          <circle
            cx="46"
            cy="48"
            r="26"
            fill="none"
            stroke="#FDF8E2"
            strokeWidth="6"
          />
          {/* Second Overlapping Onion Ring */}
          <circle
            cx="64"
            cy="60"
            r="18"
            fill="none"
            stroke="#000000"
            strokeWidth="10"
          />
          <circle
            cx="64"
            cy="60"
            r="18"
            fill="none"
            stroke="#E9D5FF"
            strokeWidth="5"
          />
        </svg>
      );

    case 'saltpepper':
      // Cracked Black Peppercorns & Sparkling Sea Salt Cubes
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
          {/* Sea Salt Crystal Cube 1 */}
          <polygon
            points="22,32 46,24 54,48 30,56"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Sea Salt Crystal Cube 2 */}
          <polygon
            points="54,54 76,48 82,70 60,76"
            fill="#E2E8F0"
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Cracked Black Peppercorns */}
          <circle cx="68" cy="30" r="12" fill="#1E293B" stroke="#000000" strokeWidth="4.5" />
          <path d="M 63,25 A 5,5 0 0 1 71,25" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="34" cy="72" r="10" fill="#334155" stroke="#000000" strokeWidth="4.5" />
          <circle cx="50" cy="40" r="5" fill="#0F172A" />
        </svg>
      );

    case 'chaatmasala':
    default:
      // Tangy Chaat Masala 6-Point Star Pod & Chatpata Swirl
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
          <polygon
            points="50,10 61,34 88,30 70,52 86,74 59,70 50,94 41,70 14,74 30,52 12,30 39,34"
            fill="#9333EA"
            stroke="#000000"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="52" r="13" fill="#FDE047" stroke="#000000" strokeWidth="4" />
          <circle cx="50" cy="52" r="5" fill="#EF4444" />
        </svg>
      );
  }
});

// ============================================================================
// CUSTOM SVG: REALISTIC 3D ROASTED SPICED MAKHANA PUFF (SUPPORTS FLAVOR COATING)
// ============================================================================
const RealisticMakhanaSVG = React.memo(({ variant = 0, spiceColor = '#9E1B12', idSuffix = '', glowColor = null }: any) => {
  const v = variant % 3;
  const gradId = idSuffix ? `makhana-grad-${idSuffix}-${v}` : `makhana-grad-${v}${glowColor ? '-gold' : ''}`;
  const lobeGradId = idSuffix ? `makhana-lobe-${idSuffix}` : 'makhana-lobe-shared';
  const craterGradId = idSuffix ? `makhana-crater-${idSuffix}` : 'makhana-crater-shared';

  const paths = [
    "M 50,6 C 64,4 78,10 86,21 C 95,30 97,46 94,60 C 92,75 82,88 68,93 C 55,97 39,96 26,90 C 13,83 5,70 5,54 C 4,38 11,23 23,14 C 32,7 41,7 50,6 Z",
    "M 47,5 C 62,3 79,11 88,24 C 96,36 96,53 91,67 C 86,81 74,92 59,95 C 43,97 26,93 15,82 C 5,71 3,54 7,39 C 11,24 22,12 36,7 C 40,6 44,5 47,5 Z",
    "M 52,5 C 68,6 83,14 90,28 C 97,42 95,60 87,74 C 79,88 64,95 48,95 C 32,95 17,87 10,73 C 3,59 4,41 12,27 C 20,13 36,4 52,5 Z"
  ];

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
      <defs>
        <radialGradient id={gradId} cx="36%" cy="30%" r="68%" fx="32%" fy="25%">
          <stop offset="0%" stopColor={glowColor === 'gold' ? '#FFFFE0' : '#FFFDF7'} />
          <stop offset="28%" stopColor={glowColor === 'gold' ? '#FFE866' : '#FCECD2'} />
          <stop offset="62%" stopColor={glowColor === 'gold' ? '#F5B700' : '#F2CB96'} />
          <stop offset="86%" stopColor={glowColor === 'gold' ? '#C98A00' : '#D99B52'} />
          <stop offset="100%" stopColor={glowColor === 'gold' ? '#7A4F00' : '#A66523'} />
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

      <path d={paths[variant % 3]} fill={`url(#${gradId})`} />

      <circle cx="34" cy="30" r="18" fill={`url(#${lobeGradId})`} />
      <circle cx="62" cy="28" r="16" fill={`url(#${lobeGradId})`} />
      <circle cx="28" cy="58" r="19" fill={`url(#${lobeGradId})`} />
      <circle cx="56" cy="55" r="21" fill={`url(#${lobeGradId})`} />
      <circle cx="74" cy="56" r="15" fill={`url(#${lobeGradId})`} />
      <circle cx="46" cy="76" r="16" fill={`url(#${lobeGradId})`} />

      <path
        d="M 46,12 Q 49,32 42,46 M 20,40 Q 38,44 52,38 M 68,20 Q 60,38 72,48 M 32,74 Q 48,62 66,74 M 15,62 Q 32,58 42,72"
        stroke="#B56E29"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.48"
      />

      <g>
        <ellipse cx="44" cy="26" rx="5.5" ry="4.2" transform="rotate(-15 44 26)" fill={`url(#${craterGradId})`} />
        <ellipse cx="69" cy="35" rx="6.2" ry="4.8" transform="rotate(25 69 35)" fill={`url(#${craterGradId})`} />
        <ellipse cx="25" cy="44" rx="5.0" ry="4.0" transform="rotate(-30 25 44)" fill={`url(#${craterGradId})`} />
        <ellipse cx="52" cy="52" rx="6.8" ry="5.2" transform="rotate(10 52 52)" fill={`url(#${craterGradId})`} />
        <ellipse cx="34" cy="71" rx="5.8" ry="4.4" transform="rotate(18 34 71)" fill={`url(#${craterGradId})`} />
        <ellipse cx="67" cy="68" rx="6.4" ry="4.6" transform="rotate(-22 67 68)" fill={`url(#${craterGradId})`} />
      </g>

      {/* Flavor Seasoning Specks */}
      <g fill={spiceColor} opacity="0.9">
        <circle cx="36" cy="20" r="2.2" />
        <circle cx="55" cy="18" r="1.9" />
        <circle cx="60" cy="36" r="2.4" />
        <circle cx="38" cy="42" r="2.1" />
        <circle cx="42" cy="60" r="2.5" />
        <circle cx="61" cy="62" r="2.0" />
        <circle cx="75" cy="44" r="2.2" />
        <circle cx="29" cy="56" r="2.1" />
      </g>

      <ellipse cx="33" cy="24" rx="14" ry="8" transform="rotate(-25 33 24)" fill="#FFFFFF" opacity="0.38" />
    </svg>
  );
});

// ============================================================================
// CUSTOM SVG: COMIC-ILLUSTRATED 2D VECTOR MAKHANA (TOP-LEFT OF POSTER)
// ============================================================================
const ComicIllustratedMakhanaSVG = React.memo(() => (
  <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible select-none pointer-events-none">
    <path
      d="M 58,8 C 75,6 92,15 101,29 C 111,42 113,60 107,76 C 101,93 87,106 70,110 C 52,114 33,110 20,98 C 8,86 5,67 9,50 C 12,34 22,20 36,13 C 43,9 51,9 58,8 Z"
      fill="#FDF3C7"
      stroke="#000000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
    <path
      d="M 88,22 C 99,36 102,57 95,74 C 87,91 69,102 49,102 C 36,102 24,96 16,87 C 28,103 50,111 70,106 C 87,102 100,89 105,73 C 110,56 106,35 88,22 Z"
      fill="#F3C969"
    />
    <path
      d="M 42,12 C 46,20 55,22 62,16 M 16,42 C 26,44 33,52 30,62 M 86,34 C 78,42 80,55 90,60 M 45,88 C 52,80 65,82 70,92"
      fill="none"
      stroke="#000000"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <g fill="#231F20" stroke="#000000" strokeWidth="1.5">
      <path d="M 40,28 C 44,25 49,28 47,33 C 45,37 38,36 37,32 Z" />
      <path d="M 73,33 C 78,31 82,36 79,41 C 75,45 69,41 71,36 Z" />
      <path d="M 55,52 C 60,49 65,54 62,59 C 58,64 51,60 52,55 Z" />
      <path d="M 27,68 C 32,65 37,70 34,76 C 30,80 24,76 25,71 Z" />
      <path d="M 76,69 C 81,67 86,72 82,78 C 78,82 72,78 73,72 Z" />
      <path d="M 52,88 C 56,86 60,90 57,95 C 54,98 49,95 50,90 Z" />
    </g>
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
// CUSTOM SVG: BROKEN CRUNCHY MAKHANA CHUNK
// ============================================================================
const CrunchyChunkSVG = React.memo(() => (
  <svg viewBox="0 0 90 90" className="w-full h-full overflow-visible select-none pointer-events-none">
    <path
      d="M 28,12 C 52,6 76,20 82,44 C 87,66 70,84 48,84 C 32,84 20,74 22,62 C 24,52 38,54 42,44 C 45,35 30,34 24,25 C 20,19 22,14 28,12 Z"
      fill="#F4CA8E"
      stroke="#C27D38"
      strokeWidth="1.5"
    />
    <path d="M 24,22 C 34,28 46,35 43,46 C 40,56 25,54 24,64 C 23,72 34,80 46,79" fill="#FFFDF7" />
    <circle cx="58" cy="28" r="4" fill="#3B1707" />
    <circle cx="68" cy="52" r="4.5" fill="#3B1707" />
    <circle cx="54" cy="70" r="3.8" fill="#3B1707" />
  </svg>
));

// ============================================================================
// CUSTOM SVG: BURNT KERNEL / CHARCOAL BOMB HAZARD
// ============================================================================
const HazardBombSVG = React.memo(({ showLabel = false }: any) => (
  <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible select-none pointer-events-none">
    <circle cx="50" cy="54" r="40" fill="#FF1E00" opacity="0.22" />
    <path d="M 52,18 Q 62,4 76,10" fill="none" stroke="#8C6239" strokeWidth="5" strokeLinecap="round" />
    <polygon
      points="76,2 80,8 88,6 83,12 88,18 80,16 76,22 72,16 64,18 69,12 64,6 72,8"
      fill="#FFE600"
      stroke="#FF0000"
      strokeWidth="1.5"
    />
    <path
      d="M 50,18 C 70,18 86,34 86,54 C 86,74 70,90 50,90 C 30,90 14,74 14,54 C 14,34 30,18 50,18 Z"
      fill="#1E1B18"
      stroke="#000000"
      strokeWidth="5"
    />
    <path
      d="M 32,44 L 44,56 M 44,44 L 32,56 M 56,44 L 68,56 M 68,44 L 56,56"
      stroke="#FF2A00"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M 34,70 L 42,64 L 50,70 L 58,64 L 66,70"
      fill="none"
      stroke="#FFE600"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {showLabel && (
      <text
        x="50"
        y="86"
        textAnchor="middle"
        fontSize="11"
        fontWeight="900"
        fill="#FFE600"
        style={{ fontFamily: "'Impact', sans-serif" }}
      >
        BURNT!
      </text>
    )}
  </svg>
));

// ============================================================================
// LOTTIE-STYLE MULTI-PART ARTICULATED FOX MASCOT ("FOX FROM THE FOXNUT")
// Rigged SVG character with independent keyframe animations for:
// - Bushy S-curve tail wagging
// - Articulated ears twitching
// - Expressive eyes (idle blink, happy cheer, focused aim, ouch wince)
// - Breathing torso & bouncing paws
// - Role outfits: 'catcher', 'slingshot', 'chef', 'ninja'
// ============================================================================
const FoxLottieMascot = React.memo(({ mood = 'idle', role = 'catcher', className = 'w-28 h-28' }: any) => {
  const tailSpeed = mood === 'happy' ? '0.42s' : mood === 'focus' ? '1.1s' : '0.85s';
  const bodyBounce = mood === 'happy' ? '0.38s' : '1.4s';

  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
        {/* Soft Ground Shadow */}
        <ellipse cx="115" cy="202" rx="56" ry="11" fill="#000000" opacity="0.22" />

        {/* 1. ARTICULATED BUSHY FOX TAIL (Wags from base pivot) */}
        <g
          style={{
            transformOrigin: '88px 175px',
            animation: `foxTailWag ${tailSpeed} ease-in-out infinite alternate`,
          }}
        >
          <path
            d="M 88,182 C 40,184 14,154 22,110 C 28,76 40,52 18,38 C 6,30 2,40 2,48 C -2,20 26,6 54,22 C 78,36 82,74 74,112 C 68,140 76,162 94,170 Z"
            fill={BRAND_LOGO_RED}
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Cream Tip of Fox Tail */}
          <path
            d="M 18,38 C 6,30 2,40 2,48 C -2,20 26,6 46,18 C 34,24 26,32 18,38 Z"
            fill={BRAND_CREAM_BG}
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </g>

        {/* 2. BREATHING / BOUNCING FOX TORSO & HEAD GROUP */}
        <g
          style={{
            transformOrigin: '115px 185px',
            animation: `foxBodyBreathe ${bodyBounce} ease-in-out infinite alternate`,
          }}
        >
          {/* Sitting Haunches & Torso */}
          <path
            d="M 78,192 C 68,154 78,98 94,58 L 146,66 C 142,110 150,154 152,192 Z"
            fill={BRAND_LOGO_RED}
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Cream Belly Patch */}
          <path
            d="M 102,96 C 126,96 138,132 134,186 L 94,186 C 90,144 92,96 102,96 Z"
            fill={BRAND_CREAM_BG}
          />

          {/* 3. ARTICULATED EARS */}
          <g
            style={{
              transformOrigin: '96px 52px',
              animation: 'foxEarTwitch 2.2s ease-in-out infinite',
            }}
          >
            <path d="M 94,52 L 72,12 L 112,30 Z" fill={BRAND_LOGO_RED} stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M 94,46 L 82,22 L 104,33 Z" fill={BRAND_CREAM_BG} />
          </g>
          <g
            style={{
              transformOrigin: '132px 38px',
              animation: 'foxEarTwitch 2.2s ease-in-out 0.3s infinite',
            }}
          >
            <path d="M 122,34 L 148,-2 L 156,42 Z" fill={BRAND_LOGO_RED} stroke="#000000" strokeWidth="4.5" strokeLinejoin="round" />
            <path d="M 136,32 L 146,10 L 150,36 Z" fill={BRAND_CREAM_BG} />
          </g>

          {/* 4. FOX HEAD & POINTED SNOUT */}
          <path
            d="M 88,54 C 98,28 132,18 158,30 C 180,40 194,42 208,38 C 212,52 198,68 178,74 C 186,80 174,90 154,88 C 136,86 124,78 114,86 Z"
            fill={BRAND_LOGO_RED}
            stroke="#000000"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Black Round Fox Nose Tip */}
          <ellipse
            cx="210"
            cy="36"
            rx="7.5"
            ry="6.5"
            transform="rotate(-15 210 36)"
            fill="#000000"
          />
          <ellipse cx="208" cy="34" rx="2.5" ry="1.8" fill="#FFFFFF" />

          {/* 5. EXPRESSIVE EYES & MOUTH (Reacts to mood: idle, happy, focus, ouch) */}
          {mood === 'ouch' ? (
            <g stroke={BRAND_CREAM_BG} strokeWidth="4" strokeLinecap="round">
              <path d="M 118,40 L 130,52 M 130,40 L 118,52" />
              <path d="M 146,34 L 158,46 M 158,34 L 146,46" />
              <path d="M 138,74 Q 154,62 170,74" fill="none" />
            </g>
          ) : mood === 'focus' ? (
            <g>
              <circle cx="126" cy="46" r="5.5" fill={BRAND_CREAM_BG} />
              <circle cx="128" cy="46" r="2.8" fill="#000000" />
              <circle cx="152" cy="39" r="5.5" fill={BRAND_CREAM_BG} />
              <circle cx="154" cy="39" r="2.8" fill="#000000" />
              <line x1="116" y1="36" x2="134" y2="41" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
              <line x1="144" y1="34" x2="162" y2="31" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
              <path d="M 138,68 Q 158,76 176,66" fill="none" stroke={BRAND_CREAM_BG} strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : (
            /* Happy Smiling Arc Eyes (Matches Secondary Logo!) */
            <g fill="none" stroke={BRAND_CREAM_BG} strokeWidth="4.2" strokeLinecap="round">
              <path d="M 120,50 Q 127,40 134,48" />
              <path d="M 148,40 Q 155,31 161,40" />
              <path d="M 136,66 Q 158,78 180,68" />
            </g>
          )}

          {/* 6. ROLE-SPECIFIC HEADGEAR & PROPS */}
          {role === 'chef' && (
            /* Tall Puffy White Chef Toque Hat */
            <g transform="translate(76, -34) rotate(-8)">
              <path
                d="M 18,52 C 4,44 6,22 24,20 C 30,6 54,6 62,18 C 78,16 86,36 72,48 L 68,64 L 22,64 Z"
                fill="#FFFFFF"
                stroke="#000000"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              <rect x="20" y="54" width="50" height="12" rx="3" fill={POP_YELLOW} stroke="#000000" strokeWidth="3.5" />
            </g>
          )}

          {role === 'ninja' && (
            /* Sensei Red & Yellow Headband with Flowing Tails */
            <g>
              <path
                d="M 88,36 Q 128,24 166,32"
                fill="none"
                stroke={POP_YELLOW}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 88,36 Q 128,24 166,32"
                fill="none"
                stroke="#000000"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="2 120"
              />
              <path
                d="M 86,36 C 62,28 46,38 34,26 M 86,40 C 64,44 50,56 38,50"
                fill="none"
                stroke={POP_YELLOW}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="132" cy="30" r="6" fill={POP_PINK} stroke="#000000" strokeWidth="3" />
            </g>
          )}

          {role === 'slingshot' && (
            /* Pop-Art Aviator Goggles on Forehead */
            <g transform="translate(92, 14) rotate(-10)">
              <rect x="6" y="4" width="26" height="18" rx="7" fill="#00F5D4" stroke="#000000" strokeWidth="3.5" />
              <rect x="36" y="2" width="26" height="18" rx="7" fill="#00F5D4" stroke="#000000" strokeWidth="3.5" />
              <line x1="32" y1="11" x2="36" y2="11" stroke="#000000" strokeWidth="4" />
            </g>
          )}

          {/* 7. ANIMATED PAWS & HELD PROPS */}
          <g
            style={{
              transformOrigin: '115px 110px',
              animation: 'foxPawWave 0.9s ease-in-out infinite alternate',
            }}
          >
            <path
              d="M 102,114 C 112,92 134,82 158,86 C 168,88 170,98 158,104 C 142,112 130,124 108,126"
              fill={BRAND_LOGO_RED}
              stroke={BRAND_CREAM_BG}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Front Paw */}
            <ellipse
              cx="164"
              cy="94"
              rx="14"
              ry="10"
              fill={BRAND_LOGO_RED}
              stroke="#000000"
              strokeWidth="4"
            />
            {role === 'chef' && (
              /* Wooden Mixing Spoon in Paw */
              <g transform="translate(160, 52) rotate(25)">
                <rect x="4" y="16" width="7" height="48" rx="3" fill="#D97706" stroke="#000000" strokeWidth="3" />
                <ellipse cx="7.5" cy="10" rx="11" ry="14" fill="#F59E0B" stroke="#000000" strokeWidth="3.5" />
              </g>
            )}
            {role === 'ninja' && (
              /* Comic Spice Katana in Paw */
              <g transform="translate(166, 36) rotate(32)">
                <polygon points="0,45 6,0 12,45" fill="#E2E8F0" stroke="#000000" strokeWidth="3" />
                <rect x="-4" y="45" width="20" height="6" rx="2" fill={POP_YELLOW} stroke="#000000" strokeWidth="2.5" />
                <rect x="2" y="51" width="8" height="18" rx="2" fill={POP_PINK} stroke="#000000" strokeWidth="2.5" />
              </g>
            )}
          </g>

          {/* Sitting Hind Paws */}
          <ellipse cx="142" cy="190" rx="14" ry="8" fill={BRAND_LOGO_RED} stroke="#000000" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// CUSTOM SVG: EXACT "POP CULTURE" SECONDARY LOGO WITH SITTING FOX MASCOT
// When isAnimated is true on the Poster, the Fox subtly wags its tail & twitches its ear!
// ============================================================================
const PopCultureLogoSVG = React.memo(({ isAnimated = true }: any) => {
  return (
    <div className="relative w-full select-none flex items-center justify-center">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 635.25 133.42"
        className="w-full h-auto overflow-visible drop-shadow-[0_4px_0_rgba(0,0,0,0.18)]"
      >
        <defs>
          <style>{`
            .pc-logo-black { fill: #030303; }
            .pc-logo-orange { fill: #ef6223; }
            .pc-logo-white { fill: #ffffff; }
            .pc-logo-red { fill: #b02a26; }
            .pc-logo-cream { fill: #f7efe0; }
          `}</style>
        </defs>

        {/* Letters "P O P   C U L T U R E" */}
        <path className="pc-logo-red" d="M145.16,80.93c1.24-48.77-57.16-30.75-57.16-30.75v79.53h27.34v-23.3c32.31-1.3,29.84-20.61,29.82-25.47h0ZM115.32,90.75v-25.55s13.79,16.5,0,25.55Z"/>
        <path className="pc-logo-red" d="M271.41,80.93c1.24-48.77-57.16-30.75-57.16-30.75v79.53h27.34v-23.3c32.31-1.86,29.82-25.47,29.82-25.47h0ZM241.58,90.75v-25.55s13.79,16.5,0,25.55Z"/>
        <path className="pc-logo-red" d="M179.72,44.81c-16.81,0-30.43,19.48-30.43,43.51s13.63,43.51,30.43,43.51,30.43-19.48,30.43-43.51-13.63-43.51-30.43-43.51h0ZM179.71,113.25c-2.73,0-4.95-11.38-4.95-25.42s2.22-25.42,4.95-25.42,4.95,11.38,4.95,25.42-2.22,25.42-4.95,25.42Z"/>
        <path className="pc-logo-red" d="M329.61,94.63c5.19,0,9.1,4.76,8.03,9.84-3.52,16.85-13.18,28.95-24.54,28.95-13.48,0-24.56-17.01-25.84-38.79-.09-1.4-.13-2.83-.13-4.27,0-3.33.23-6.58.66-9.7,2.65-19.11,12.98-33.36,25.31-33.36,10.28,0,19.17,9.91,23.38,24.28,1.33,4.53-2.05,9.07-6.77,9.07h-8.15c-1.48,0-2.68-1.2-2.68-2.68v-12.65c0-1.48-1.2-2.68-2.68-2.68h0c-1.48,0-2.68,1.2-2.68,2.68v44.06c0,1.48,1.2,2.68,2.68,2.68h0c1.48,0,2.68-1.2,2.68-2.68v-12.07c0-1.48,1.2-2.68,2.68-2.68h8.06,0Z"/>
        <path className="pc-logo-red" d="M394.34,51.61v57.92c0,13.19-10.69,23.89-23.89,23.89h0c-13.19,0-23.89-10.69-23.89-23.89v-57.92h20.79v59.6c0,1.51,1.23,2.74,2.74,2.74h0c1.51,0,2.74-1.23,2.74-2.74v-59.6h21.51,0Z"/>
        <path className="pc-logo-red" d="M537.48,51.61v57.92c0,13.19-10.69,23.89-23.89,23.89h0c-13.19,0-23.89-10.69-23.89-23.89v-57.92h20.79v59.6c0,1.51,1.23,2.74,2.74,2.74h0c1.51,0,2.74-1.23,2.74-2.74v-59.6h21.51,0Z"/>
        <path className="pc-logo-red" d="M407.19,51.91h19.95v54.73c0,2.42,1.96,4.39,4.39,4.39h8.75v22.39h-37.47l4.38-81.51h0Z"/>
        <path className="pc-logo-red" d="M440.28,53.94h43.13v17.61h-3.88c-3.22,0-5.83,2.61-5.83,5.83v56.04h-23.26v-54.68c0-3.22-2.61-5.83-5.83-5.83h-5.01l.68-18.97h0Z"/>
        <path className="pc-logo-red" d="M582.47,99.76c-1.51-1.13-2.8-1.71-3.68-2.19-2.96-1.59,29.03-8.08,9.89-33.67-.39-.52-.76-1.06-1.12-1.61-1.83-2.82-11.1-13.86-42.55-10.15v81.27h20.26s4.36-59.81,8.06-.87h19.83l-3.25-19.11c-.89-5.26-3.18-10.47-7.45-13.67h0ZM565.86,90.15v-20.47c9.6,11.8,0,20.47,0,20.47Z"/>
        <polygon className="pc-logo-red" points="600.24 55.96 632.71 55.96 632.71 75.27 619.98 75.27 619.98 87.79 632.92 87.79 632.92 101.38 621.25 101.38 621.25 118.35 635.25 118.35 635.25 133.42 601.72 133.42 600.24 55.96"/>

        {/* Sitting Fox Mascot inside the first 'P' */}
        <g>
          <path className="pc-logo-white" d="M118.48,39.11c1.64-1.63,2.93-3.15,3.93-5,.16-.3.4-.55.67-.75,1.5-1.1,2.42-2.83,2.49-4.63,0-.11,0-.22-.01-.32-.18-1.7-1.11-2.94-2.74-3.44-1.86-.69-3.83-.38-5.62.52-.34.17-.72.26-1.1.25-5.95-.22-12.02-2.18-15.75-6.74-.43-.53-.61-1.22-.49-1.89,1.02-5.45.82-10.92-.24-16.33-.27-1.36-2.11-.68-3.73.37-.55.37-1.08.76-1.6,1.16-2.12,1.62-3.88,3.65-5.25,5.93l-1.08,1.8c-.43.72-1.21,1.15-2.05,1.12-3.29-.08-9.2.34-15.01,4.01-2.56,1.37-2.99,1.85-4.3,2.57-1.95,1.07-3.95,1.55-5.97.62l-7.88-2.68c-1.6-.53-3.07-.81-4.62-.75-1.28.05-2.19.35-2.1,1.55.44,5.71,4.2,13.12,7.74,17.69.26.33.83.61.87,1.11.45,5.91.28,11.68-.3,17.64-.78,7.96-2.4,15.52-4.28,23.26l-2.89,11.89s-.02.07-.02.1c-.6,2.52-4.24,2.33-4.54-.24-.3-2.56-.3-5.11-.11-7.26.9-10.3.28-20.89-5.55-29.64-2.45-3.68-5.53-6.79-9.52-8.79-8.17-4.1-19.5-2.19-24.47,5.56C.03,52.33-.69,57.87.65,63.04c.18.71,1.1.99,1.59.95.63-.06.95-.49,1.26-1.09.72-1.41,2.03-2.56,3.4-2.86,4.02-.88,6.22,2.24,7.08,6.27.54,2.54.37,5.07-.04,7.65l-1.37,8.48c-.69,4.25-.41,8.35.46,12.58,3.91,19.01,20.96,26.77,39.11,22.55.77-.18,1.58.05,2.15.61,3.41,3.36,7.44,4.69,12.43,4.91l16.76.73c.48.02.87.03,1.19.04,1.85,0,3.35-1.48,3.36-3.33l.12-48.53c0-1.25,1-2.26,2.25-2.3,1.43-.04,3.01-.26,3.91-.81.27-.16.57-.29.88-.33,1.47-.18,2.64-1.16,3.16-2.55.11-.29.27-.56.48-.78.91-1,1.37-2.26,1.39-3.66-.02-1.43-.37-2.74-1.03-3.96-.71-1.31-.01-2.95,1.43-3.33l7.02-1.87c1.05-.28,2.13.22,2.65,1.18.28.52.62.98,1.06,1.39,1.44,1.36,3.48,1.64,5.17.76.67-.35,1.47-.33,2.15.01,1.51.76,3.29.69,4.67-.33.41-.3.9-.47,1.42-.47,1.91.03,3.24-.79,4.28-2.36.4-.6,1.03-1.01,1.75-1.04.63-.03,1.15-.26,1.57-.53.76-.5,1.13-1.43.96-2.32-1.3-6.78-8.07-10.38-14.82-9.59h0Z"/>
          <path className="pc-logo-red" d="M94.05,18.48l-.23-.56c.16-.4.41-6.83.07-6.76-.64.14-3.46,3.74-3.61,4.7l-.71.34-4.05-1.33c2.91-5.14,6.8-9.21,11.8-12.41.96,6.03,1.08,11.99-.02,18.13l-3.26-2.1Z"/>
          <path className="pc-logo-white" d="M94.05,18.48l-4.47-2.28c.47-1.63,1.48-3.08,2.76-4.33l2.23-2.16v7.5c0,.5-.14.96-.52,1.27Z"/>
          <path className="pc-logo-red" d="M51.36,114.89c-6.15,1.68-12.47,1.52-18.74-.53-12.2-3.98-18.01-15.7-17.66-28.2.08-2.91.59-5.58,1.03-8.43l.94-6.14c.43-2.82-.02-5.6-.98-8.26-.71-1.76-1.61-3.39-3.12-4.57-2.53-1.99-5.91-2.09-8.61-.56-.66.38-1.49-.14-1.46-.9.2-6.17,3.62-11.48,9.63-13.55,8.01-2.63,15.38-.01,20.65,6.44,6.39,7.81,6.87,19.2,6.04,29.13-1.34,13.13.8,17.28,7.34,22.85.13.11.22.27.25.44.72,4.39,2.14,8.5,4.71,12.28h0Z"/>
          <path className="pc-logo-red" d="M119.62,53.22c-2.06-1.5-.29-4.86-2.4-5.03-.71-.06-1.52.49-1.45,1.36l.2,2.34c.04.54-.13,1.02-.42,1.29-.36.34-1.04.51-1.58.3-2.34-.89-1.75-4.24-2.42-4.62-.32-.18-.7-.08-1.07.05-.29.1-.57-.17-.48-.46,1.35-4.47,6.71-7.16,11.27-6.83,3.87.28,8.04,2.68,9.15,6.65.06.21-.15.4-.35.31-.67-.3-.88-1.4-1.99-.81-.92.48-.18,2.99-2.09,4.17-.42.26-.96-.03-1-.51l-.28-3.18c-.05-.57-.74-.73-1.18-.74-.44-.02-1.2.26-1.2.89,0,1.68.42,4.49-.88,5.03-.59.24-1.28.21-1.84-.2h0Z"/>
          <path className="pc-logo-orange" d="M122.75,27.43c-.51,1.19-2.05,1.26-2.86.47-.16-.31-.14-.57-.04-.77.14-.27.4-.46.75-.53.8-.22,1.71-.14,2.15.82h0Z"/>
          <path className="pc-logo-white" d="M87.61,69.35v21.29c-8.45-4.02-7.69-15.88-2.56-22.65.91.32,1.79.81,2.56,1.36Z"/>
          <path className="pc-logo-red" d="M85.05,68v.66s0,0,0,0c-4.42,6.22-5.49,17.11,2.15,21.28h0s-.07.19-.07.19c0-.1-.02-.14.07-.19l.3.15c.14.07.17.09.24.12l.02.08-.05,21.42h0c-1.87-.77-3.54-1.02-5.55-.97,0,0,0,0,0,0,1.81-2.63,3.03-5.33,3.48-8.46.54-4.45-.81-8.84-3.67-12.25-.52-.62-1.44-.61-1.94-.14-.52.49-.61,1.33-.07,1.96,3.03,3.57,4.01,8.44,2.39,12.87-.99,2.69-2.54,5.07-4.78,6.82-.68.53-.96,1.19-.6,1.94.33.69,1.13.81,1.87.56,2.99-.99,6.13-.85,8.87.8l.03,5.76c0,.36-.3.39-.48.45-1.06.24-1.07-.18-.99-1.1h0c-.14-1.45-1.12-3.53-2.78-3.64-1.54-.1.14,1.59.54,1.95.48.72,1.28,2.26.42,2.82l-11.6-.61-7.04-.12c-6.33-.11-11.54-4.69-14.12-10.3-4.08-8.88-3.09-17.31-.77-26.53l3.05-12.12c1.95-8.54,3.22-17.01,3.53-25.78.14-3.99.15-7.72-.36-11.64h0c-2.44-2.87-4.36-5.9-5.9-9.31-1.05-2.32-1.96-4.61-2.35-7.12,0,0,0,0,0,0,5.36.38,10.21,2.19,14.61,4.88.58.35,1.18.46,1.74.01,4.98-3.94,9.66-6.76,16.05-7.96,5.6-1.05,11.13.58,15.17,4.53l2.59,2.53c1.4,1.36,2.8,2.59,4.53,3.55,3.5,1.94,7.3,2.94,11.38,3.2.01,0,.02.01.02.02-.45,2.99,1.66,5.39,4.1,5.78-2.02,3.36-6.19,6.23-9.73,7.69-5.65,2.34-11.95,2.82-17.86,1.34-1.64-.41-2.89-1.23-3.96-2.36-.54-.57-1.41-.31-1.73.17-.39.57-.24,1.18.26,1.67,2.77,2.69,6.34,3.26,10.31,3.61h0c-2.67,1.14-5.15,2.42-6.04,5.25,0,0,0,0,0,0-3.09-.52-6.04.13-8.87,1.39-5.24,2.33-8.93,6.5-12.49,7.96-.68.28-1.49.18-1.72,1.1-.16.64.23,1.22.67,1.52.56.38,1.12.28,1.73.02,5.24-2.16,8.88-7.31,15.82-9.21,4.37-1.19,9.04.64,11.32,4.57.29.49.51,1,.61,1.53.08.42-.46.66-.71.32-1.2-1.62-2.91-2.8-3.56-1.6-.17.31-.26,1,.16,1.33,1.39,1.08,2.5,2.59,2.5,4.46,0,.09-.03.19-.07.28-.32.65-1.27.57-1.55-.09-1.01-2.41-3.51-4.52-4.33-3.12-.88,1.5,2.39,2.28,2.22,4.95l-.09.21c-.56.54-1.8.36-2.46.03l-4.08-2.02c-1.1-.54-2.09-.21-2.83.73l-4.52,5.69c-1.66,2.09-3.85,3.68-6.31,4.67-2.2.89-4.42.88-6.64.4-.75-.16-1.2.69-1.22,1.19-.03.73.38,1.23,1.13,1.41.87.21,1.73.48,2.68.46,7.81-.18,12.16-5.66,16.38-11.56.15-.21.4-.47.56-.36l.38.26h0Z"/>
          <path className="pc-logo-white" d="M87.27,121.04c-.91.31-1.89.08-2.82.03.15-3.09-2.51-3.53-1.94-4.62.15-.29.69-.65,1.21-.52,2.04.53,3.21,2.77,2.92,4.89-.03.26.53.27.64.22h0Z"/>
          <path className="pc-logo-white" d="M61.44,25.19c-1.59,1.34-2.51,3.03-3.22,5.12-2.09-2.48-3.83-5.07-4.96-8.14,1.22-.14,2.28,0,3.37.25,1.72.65,3.22,1.45,4.81,2.77h0Z"/>
          <path className="pc-logo-white" d="M80.81,29.27c-1.79.1-3.02,1.33-3.55,2.85-.2.57-.97.6-1.44.36-1.31-.65-.07-3.06,1.74-4.42,2.13-1.61,5.09-1.39,6.88.58.41.45.23,1.2-.15,1.5-1.13.87-1.87-.96-3.47-.87h0Z"/>
          <path className="pc-logo-white" d="M97.47,24.64c-.8,1.08-2.65-1.32-4.49.79-.4.46-.7.9-1.34.7-.57-.17-.92-.75-.72-1.4.26-.86.91-1.33,1.62-1.79,1.61-1.03,3.72-.99,5.04.47.28.31.07.99-.11,1.23h0Z"/>
          <path className="pc-logo-black" d="M124.83,29.98c-.72,2.43-2.43,3.79-3.81,4.21-2.98.91-6.34-1.96-6.22-4.92.13-3.32,3.27-4.36,6.16-4.36s4.44,3.19,3.87,5.07Z"/>
          <ellipse className="pc-logo-cream" cx="122.75" cy="27.78" rx=".64" ry="1.03" transform="translate(-3.01 32.73) rotate(-15.01)"/>
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// CUSTOM SVG: "COMING SOON" 3D EXTRUDED COMIC CLOUD BADGE
// ============================================================================
const ComingSoonCloudSVG = React.memo(({ isAnimated = true }: any) => {
  return (
    <div className="relative w-full select-none">
      <svg viewBox="0 0 800 320" className="w-full h-auto overflow-visible">
        {/* Side Comic Splash Droplets */}
        <g
          style={{
            transformOrigin: '400px 150px',
            animation: isAnimated ? 'splashPulse 3.4s ease-in-out infinite alternate' : 'none',
          }}
        >
          <path d="M 52,108 C 20,90 8,92 10,102 C 12,112 32,115 52,114 Z" fill={POP_PINK} stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 46,130 C 10,128 2,138 8,148 C 14,158 36,144 48,136 Z" fill={POP_ORANGE} stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 54,152 C 32,164 24,176 32,182 C 40,188 50,168 56,156 Z" fill={POP_GREEN} stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 730,78 C 756,56 768,58 766,68 C 764,78 744,82 732,84 Z" fill={POP_PINK} stroke="#000" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 736,102 C 764,96 774,104 768,114 C 762,122 744,112 734,106 Z" fill={POP_GREEN} stroke="#000" strokeWidth="4" strokeLinejoin="round" />
        </g>

        {/* Yellow Puffy Scalloped Cloud Base */}
        <path
          d="M 142,40 C 175,18 228,22 256,42 C 292,16 364,18 396,42 C 436,18 502,22 532,44 C 568,20 628,26 650,52 C 692,42 730,76 716,118 C 750,136 762,182 746,225 C 764,264 736,304 686,298 C 656,316 604,312 582,296 C 546,316 490,316 462,296 C 428,316 368,314 342,290 C 298,298 268,266 280,226 C 242,232 204,220 186,198 C 142,216 88,196 74,154 C 54,106 86,46 142,40 Z"
          fill="#000000"
          transform="translate(4, 6)"
        />
        <path
          d="M 142,40 C 175,18 228,22 256,42 C 292,16 364,18 396,42 C 436,18 502,22 532,44 C 568,20 628,26 650,52 C 692,42 730,76 716,118 C 750,136 762,182 746,225 C 764,264 736,304 686,298 C 656,316 604,312 582,296 C 546,316 490,316 462,296 C 428,316 368,314 342,290 C 298,298 268,266 280,226 C 242,232 204,220 186,198 C 142,216 88,196 74,154 C 54,106 86,46 142,40 Z"
          fill={POP_YELLOW}
          stroke="#000000"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* "COMING SOON" 3D Extruded Bubble Letters */}
        <g
          style={{
            fontFamily: "'Fredoka', 'Lilita One', 'Arial Rounded MT Bold', 'Impact', sans-serif",
            fontWeight: 900,
          }}
        >
          {[14, 11, 8, 5].map((offset) => (
            <text
              key={`c-ext-${offset}`}
              x="92"
              y="162"
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

          <text
            x="92"
            y="162"
            fontSize="126"
            letterSpacing="3"
            fill={POP_COMING_PINK}
            stroke="#000000"
            strokeWidth="15"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            COMING
          </text>
          <text x="92" y="162" fontSize="126" letterSpacing="3" fill={POP_COMING_PINK}>
            COMING
          </text>

          {/* Glossy White Highlights on "COMING" */}
          <g fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.92">
            <path d="M 112,100 C 116,84 130,76 144,78" />
            <path d="M 196,102 C 200,86 214,78 228,80" />
            <path d="M 294,106 L 294,84" />
            <path d="M 418,104 L 418,82" />
            <path d="M 464,106 L 464,84" />
            <path d="M 568,102 C 574,86 588,78 604,80" />
          </g>

          {/* Orange Comic Jelly Bean Accent */}
          <g transform="translate(658, 84) rotate(22)">
            <ellipse cx="22" cy="36" rx="22" ry="34" fill="#000000" transform="translate(-4, 7)" />
            <ellipse cx="22" cy="36" rx="22" ry="34" fill={POP_ORANGE} stroke="#000000" strokeWidth="6" />
            <path d="M 14,18 C 18,12 26,12 30,18" stroke="#FFF3B0" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>

          {[14, 11, 8, 5].map((offset) => (
            <text
              key={`s-ext-${offset}`}
              x="306"
              y="266"
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
            y="266"
            fontSize="124"
            letterSpacing="4"
            fill={POP_ORANGE}
            stroke="#000000"
            strokeWidth="15"
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            SOON
          </text>
          <text x="306" y="266" fontSize="124" letterSpacing="4" fill={POP_ORANGE}>
            SOON
          </text>

          {/* Glossy White Highlights on "SOON" */}
          <g fill="none" stroke="#FFF8D6" strokeWidth="4.5" strokeLinecap="round" opacity="0.9">
            <path d="M 326,202 C 332,188 346,184 358,188" />
            <path d="M 412,206 C 416,190 430,184 444,186" />
            <path d="M 514,206 C 518,190 532,184 546,186" />
            <path d="M 612,210 L 612,186" />
          </g>
        </g>
      </svg>
    </div>
  );
});

// ============================================================================
// CUSTOM SVG: STRIPED GREEN & YELLOW MAKHANA TUB
// ============================================================================
const MakhanaBucketSVG = React.memo(({ tilted = true, accentColor = null }: any) => {
  return (
    <svg viewBox="0 0 465 375" className="w-full h-full overflow-visible select-none pointer-events-none">
      <defs>
        <clipPath id={tilted ? 'bucket-clip-tilt' : 'bucket-clip-game'}>
          {tilted ? (
            <path d="M 34,195 L 435,95 L 455,365 L 95,365 Z" />
          ) : (
            <path d="M 45,130 L 395,130 L 355,345 L 85,345 Z" />
          )}
        </clipPath>
      </defs>

      <ellipse
        cx={tilted ? '235' : '220'}
        cy={tilted ? '145' : '130'}
        rx={tilted ? '212' : '180'}
        ry={tilted ? '56' : '38'}
        transform={tilted ? 'rotate(-14 235 145)' : undefined}
        fill="#1B2A18"
        stroke="#000000"
        strokeWidth="6"
      />

      <g transform={tilted ? undefined : 'translate(-15, -18) scale(0.95)'}>
        {[
          { x: 140, y: 120, s: 74, v: 0 },
          { x: 205, y: 102, s: 82, v: 1 },
          { x: 275, y: 86, s: 84, v: 2 },
          { x: 335, y: 85, s: 80, v: 0 },
          { x: 88, y: 145, s: 70, v: 2 },
          { x: 185, y: 138, s: 88, v: 0 },
          { x: 255, y: 126, s: 82, v: 1 },
          { x: 318, y: 116, s: 84, v: 2 },
        ].map((m, idx) => (
          <g key={idx} transform={`translate(${m.x - m.s / 2}, ${m.y - m.s / 2})`}>
            <svg width={m.s} height={m.s} viewBox="0 0 100 100">
              <RealisticMakhanaSVG variant={m.v} idSuffix={`tub-${tilted ? 'p' : 'g'}-${idx}`} />
            </svg>
          </g>
        ))}
      </g>

      <g clipPath={`url(#${tilted ? 'bucket-clip-tilt' : 'bucket-clip-game'})`}>
        <rect x="0" y="70" width="460" height="310" fill={accentColor || POP_GREEN} />
        <polygon points="88,120 112,120 152,370 128,370" fill="#FFFFFF" />
        <polygon points="112,120 190,120 235,370 152,370" fill={POP_YELLOW} />
        <polygon points="190,120 260,120 308,370 235,370" fill={accentColor || POP_GREEN} />
        <polygon points="260,120 345,115 398,370 308,370" fill="#CEAB00" />
        <polygon points="345,115 445,90 465,370 398,370" fill="#9E8200" />
      </g>

      {tilted ? (
        <path d="M 34,195 L 95,365 M 435,95 L 455,365" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
      ) : (
        <path d="M 45,130 L 85,345 L 355,345 L 395,130" fill="none" stroke="#000000" strokeWidth="7" strokeLinejoin="round" />
      )}

      {tilted ? (
        <path
          d="M 28,186 C 34,218 148,214 258,186 C 368,158 446,120 438,88 C 435,76 418,74 410,76 C 418,102 346,142 248,168 C 150,194 52,198 42,172 C 34,170 26,176 28,186 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M 35,126 C 35,152 118,166 220,166 C 322,166 405,152 405,126 C 405,116 392,114 385,118 C 380,138 308,148 220,148 C 132,148 60,138 55,118 C 48,114 35,116 35,126 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
});

// ============================================================================
// SEGMENT 1: POSTER VIEW (CONTINUOUS SORTED POP-ART LOOP + SUBTLE PROPS + STOP BUTTON)
// - No replay button required! Runs in a smooth, continuous, sorted comic wave loop.
// - Single STOP / START ANIMATION button in the bottom-left corner.
// - Includes subtle visual ingredient props around the outer perimeter (no flavor text).
// ============================================================================
// ============================================================================
// SEGMENT 1: POSTER VIEW (CONTINUOUS SORTED POP-ART LOOP + AUTO-ADJUSTING SCREEN FIT)
// - Adapts fluidly to ANY screen size, window snap, tablet, and mobile device
// - ZERO clipping: the entire poster, starburst, mascot logo, subtitle, cloud,
//   floating makhanas, and overflowing makhana bucket stay 100% visible!
// - Full-bleed energetic Pop-Art comic borders with pure buttery smoothness
// ============================================================================
function PosterSegment({ soundEnabled }: { soundEnabled: boolean }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = viewport;
  const aspectRatio = width / Math.max(1, height);
  // Auto-switch between Landscape (> 1.12) and Portrait (<= 1.12)
  const isLandscape = aspectRatio >= 1.12;

  // Proportional scale factor for perimeter items on smaller viewports
  const scaleFactor = isLandscape
    ? Math.min(1.0, Math.max(0.46, Math.min(width / 1200, height / 800)))
    : Math.min(0.92, Math.max(0.40, Math.min(width / 500, height / 800)));

  // Centerpiece responsive bounds — rigorously clamped to fit inside the cream starburst with ZERO clipping
  const maxCenterWidth = isLandscape
    ? Math.min(520, Math.round(width * 0.46), Math.round((height - 110) * 0.86))
    : Math.min(420, Math.round(width * 0.82), Math.round((height - 150) * 0.48));

  const centerScale = Math.max(0.50, Math.min(1.0, maxCenterWidth / 520));
  const subtitleFontSize = Math.max(10, Math.min(22, Math.round(20 * centerScale)));
  const subtitleGap = Math.max(6, Math.min(16, Math.round(15 * centerScale)));
  const arrowWidth = Math.max(14, Math.min(28, Math.round(26 * centerScale)));
  const arrowHeight = Math.max(11, Math.min(24, Math.round(22 * centerScale)));

  // Responsive Bucket Sizing — firmly anchored to bottom-right corner, 100% visible, never cut
  const bucketWidth = isLandscape
    ? Math.min(330, Math.max(130, Math.round(width * 0.20)), Math.round((height - 100) * 0.32))
    : Math.min(180, Math.max(100, Math.round(width * 0.28)), Math.round((height - 130) * 0.18));
  const bucketHeight = Math.round(bucketWidth * (375 / 465));
  const bucketRight = Math.max(10, isLandscape ? Math.round(width * 0.018) : 10);
  const bucketBottom = Math.max(8, isLandscape ? Math.round(height * 0.014) : 8);

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${
        isAnimating ? 'poster-anim-running' : 'poster-anim-paused'
      }`}
      style={{ backgroundColor: POP_PINK }}
    >
      {/* ====================================================================
          1. FULL-BLEED POP-ART COMIC VECTOR BACKGROUND
          Fills 100% of viewport edge-to-edge — ZERO LETTERBOX BARS!
      ==================================================================== */}
      {isLandscape ? (
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <pattern id="dots-black-md-ls" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <circle cx="13" cy="13" r="5.5" fill="#000000" />
            </pattern>
            <pattern id="dots-orange-md-ls" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
              <circle cx="11" cy="11" r="5.2" fill={POP_ORANGE} />
            </pattern>
            <pattern id="dots-yellow-sm-ls" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
              <circle cx="10" cy="10" r="4.5" fill={POP_YELLOW} />
            </pattern>
            <pattern id="dots-white-sm-ls" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(22)">
              <circle cx="10" cy="10" r="4" fill="#FFFFFF" />
            </pattern>
          </defs>
          {/* Outer Comic Panels */}
          <g>
            <path d="M 155,410 C 120,255 150,115 245,85 C 330,60 445,195 535,345 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '300px 220px' }} />
            <path d="M 295,120 L 585,435 L 495,525 L 255,180 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '420px 320px' }} />
            <path d="M 760,-20 L 1280,-20 L 1165,335 L 795,295 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '1020px 150px' }} />
            <path d="M 855,270 C 875,115 975,55 1035,145 C 1075,85 1145,105 1135,195 C 1185,155 1235,195 1205,285 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" strokeLinejoin="round" className="pop-panel-wave-1" style={{ transformOrigin: '1030px 190px' }} />
            <polygon points="1265,-20 1940,-20 1760,390 1175,315" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '1550px 180px' }} />
            <path d="M 1255,255 C 1320,95 1415,45 1425,165 C 1495,135 1615,175 1535,295 L 1365,335 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" strokeLinejoin="round" className="pop-panel-wave-3" style={{ transformOrigin: '1420px 200px' }} />
            <path d="M -30,275 C 185,225 405,345 535,595 L -30,695 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '220px 480px' }} />
            <path d="M -20,465 C 85,395 235,445 230,555 C 225,625 95,605 -20,575 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '110px 520px' }} />
            <path d="M -30,585 C 175,545 295,625 275,715 C 365,695 425,775 345,875 L -30,965 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '180px 760px' }} />
            <path d="M -30,680 C 165,670 305,795 265,1095 L -30,1095 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '120px 890px' }} />
            <path d="M 335,1095 C 375,895 515,745 555,835 C 605,765 655,825 605,945 L 545,1095 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '480px 920px' }} />
            <path d="M 465,1095 L 805,805 L 745,1095 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '640px 950px' }} />
            <path d="M 735,1095 C 745,885 935,885 995,1095 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '865px 980px' }} />
            <path d="M 1185,1095 C 1325,925 1485,895 1495,1095 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '1340px 990px' }} />
            <path d="M 1505,465 C 1655,225 1865,195 1950,245 L 1950,645 C 1795,515 1625,525 1505,465 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '1720px 420px' }} />
            <path d="M 1515,575 C 1555,405 1675,315 1735,365 C 1795,415 1665,575 1515,575 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '1640px 460px' }} />
            <path d="M 1395,590 C 1585,555 1805,635 1945,765 L 1945,1095 L 1385,1095 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '1660px 840px' }} />
          </g>

          {/* Halftone Dots */}
          <g className="pop-halftone-wave">
            <path d="M 300,130 L 490,350 L 420,420 L 260,180 Z" fill="url(#dots-orange-md-ls)" />
            <polygon points="780,-10 990,-10 890,260 760,240" fill="url(#dots-orange-md-ls)" />
            <polygon points="990,-10 1260,-10 1160,280 960,240" fill="url(#dots-black-md-ls)" />
            <polygon points="1460,-10 1760,-10 1620,280 1380,220" fill="url(#dots-black-md-ls)" opacity="0.55" />
            <path d="M 10,300 C 170,260 350,360 450,540 L 10,480 Z" fill="url(#dots-yellow-sm-ls)" />
            <path d="M -10,720 C 130,720 240,820 220,1060 L -10,1060 Z" fill="url(#dots-black-md-ls)" />
            <polygon points="480,1080 780,820 840,1080" fill="url(#dots-yellow-sm-ls)" />
            <path d="M 1640,560 C 1750,460 1880,460 1930,550 L 1720,680 Z" fill="url(#dots-black-md-ls)" />
            <path d="M 1220,960 C 1270,890 1350,920 1380,1020 L 1200,1040 Z" fill="url(#dots-white-sm-ls)" />
          </g>

          {/* Speed Lines */}
          <g stroke="#000000" strokeLinecap="round" className="pop-speedlines-wave">
            <line x1="255" y1="-15" x2="465" y2="185" strokeWidth="14" />
            <line x1="355" y1="-15" x2="505" y2="155" strokeWidth="10" />
            <line x1="425" y1="-15" x2="535" y2="135" strokeWidth="6" />
            <line x1="655" y1="65" x2="625" y2="165" strokeWidth="9" />
            <line x1="685" y1="75" x2="645" y2="175" strokeWidth="6" />
            <line x1="1425" y1="-10" x2="1355" y2="95" strokeWidth="6" stroke="#FFFFFF" />
            <line x1="1465" y1="-10" x2="1375" y2="115" strokeWidth="9" />
            <line x1="965" y1="955" x2="1125" y2="1085" strokeWidth="12" />
            <line x1="1015" y1="945" x2="1185" y2="1085" strokeWidth="10" />
            <line x1="1065" y1="945" x2="1225" y2="1075" strokeWidth="7" />
          </g>

          {/* Central Landscape Cream Starburst */}
          <path
            d="M 430,440 L 370,230 L 580,365 C 610,225 735,175 815,285 L 865,165 L 925,245 L 1015,155 L 1115,245 L 1315,115 L 1255,295 L 1425,225 L 1375,340 L 1545,280 L 1475,455 C 1565,445 1560,545 1495,620 L 1550,660 L 1445,735 C 1515,805 1495,895 1395,930 L 1325,875 L 1185,975 L 995,905 L 945,1015 L 815,835 L 665,975 L 725,815 L 525,935 L 595,775 L 395,865 L 475,695 L 375,675 L 450,565 L 370,475 Z"
            fill={BRAND_CREAM_BG}
            stroke="#000000"
            strokeWidth="9"
            strokeLinejoin="round"
          />

          {/* Twinkle Sparkle Stars */}
          <g>
            {[
              { cx: 770, cy: 92, r: 58, delay: '0s' },
              { cx: 245, cy: 405, r: 62, delay: '0.6s' },
              { cx: 305, cy: 610, r: 64, delay: '1.2s' },
              { cx: 1392, cy: 192, r: 50, delay: '0.4s' },
              { cx: 1445, cy: 915, r: 58, delay: '0.9s' },
            ].map((st, i) => (
              <g key={i} className="pop-star-twinkle" style={{ transformOrigin: `${st.cx}px ${st.cy}px`, animationDelay: st.delay }}>
                <path
                  d={`M ${st.cx},${st.cy - st.r} Q ${st.cx},${st.cy} ${st.cx + st.r},${st.cy} Q ${st.cx},${st.cy} ${st.cx},${st.cy + st.r} Q ${st.cx},${st.cy} ${st.cx - st.r},${st.cy} Q ${st.cx},${st.cy} ${st.cx},${st.cy - st.r} Z`}
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="7"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>
        </svg>
      ) : (
        <svg
          viewBox="0 0 1080 1440"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <pattern id="dots-black-md-pt" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <circle cx="13" cy="13" r="5.5" fill="#000000" />
            </pattern>
            <pattern id="dots-orange-md-pt" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
              <circle cx="11" cy="11" r="5.2" fill={POP_ORANGE} />
            </pattern>
            <pattern id="dots-yellow-sm-pt" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
              <circle cx="10" cy="10" r="4.5" fill={POP_YELLOW} />
            </pattern>
            <pattern id="dots-white-sm-pt" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(22)">
              <circle cx="10" cy="10" r="4" fill="#FFFFFF" />
            </pattern>
          </defs>
          {/* Outer Comic Panels - Portrait Geometry */}
          <g>
            <path d="M -20,240 C 60,110 180,40 280,110 C 350,160 380,290 320,410 L -20,340 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '150px 180px' }} />
            <path d="M 120,50 L 360,260 L 280,330 L 70,110 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '220px 200px' }} />
            <path d="M 380,-20 L 720,-20 L 680,180 L 420,160 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '550px 80px' }} />
            <path d="M 450,130 C 470,40 540,-10 610,60 C 660,10 710,50 690,140 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '570px 90px' }} />
            <polygon points="710,-20 1100,-20 1100,280 820,180" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '920px 110px' }} />
            <path d="M 760,150 C 840,40 940,20 990,120 C 1050,90 1090,140 1060,220 L 880,240 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '920px 130px' }} />
            <path d="M -30,480 C 120,440 220,540 240,680 L -30,760 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '90px 600px' }} />
            <path d="M -20,680 C 70,640 160,710 150,820 L -20,860 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '60px 750px' }} />
            <path d="M -30,860 C 110,830 190,920 160,1050 L -30,1110 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '70px 960px' }} />
            <path d="M -30,1100 C 120,1090 220,1200 180,1460 L -30,1460 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '90px 1270px' }} />
            <path d="M 220,1460 C 260,1310 380,1200 440,1290 L 390,1460 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '330px 1350px' }} />
            <path d="M 370,1460 L 610,1240 L 590,1460 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '490px 1350px' }} />
            <path d="M 570,1460 C 600,1300 760,1300 810,1460 Z" fill={POP_YELLOW} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '690px 1380px' }} />
            <path d="M 880,480 C 990,390 1090,440 1110,580 L 890,660 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '990px 520px' }} />
            <path d="M 910,640 C 970,540 1060,560 1100,670 L 910,750 Z" fill={POP_GREEN} stroke="#000000" strokeWidth="8" className="pop-panel-wave-2" style={{ transformOrigin: '1000px 650px' }} />
            <path d="M 870,760 C 980,720 1090,810 1110,950 L 880,1020 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-3" style={{ transformOrigin: '980px 880px' }} />
            <path d="M 840,1020 C 960,990 1080,1080 1110,1460 L 810,1460 Z" fill={POP_ORANGE} stroke="#000000" strokeWidth="8" className="pop-panel-wave-1" style={{ transformOrigin: '960px 1240px' }} />
          </g>

          {/* Portrait Halftone Dots */}
          <g className="pop-halftone-wave">
            <path d="M 120,60 L 290,220 L 220,290 L 80,110 Z" fill="url(#dots-orange-md-pt)" />
            <polygon points="410,-10 680,-10 620,160 440,140" fill="url(#dots-orange-md-pt)" />
            <polygon points="760,-10 1060,-10 980,180 820,150" fill="url(#dots-black-md-pt)" />
            <path d="M 0,510 C 110,470 210,550 220,670 L 0,690 Z" fill="url(#dots-yellow-sm-pt)" />
            <path d="M 0,880 C 90,860 160,930 140,1060 L 0,1070 Z" fill="url(#dots-black-md-pt)" />
            <polygon points="380,1450 590,1260 620,1450" fill="url(#dots-yellow-sm-pt)" />
            <path d="M 900,500 C 990,430 1070,470 1090,580 L 910,650 Z" fill="url(#dots-black-md-pt)" />
            <path d="M 860,1040 C 950,1010 1030,1070 1060,1200 L 850,1210 Z" fill="url(#dots-white-sm-pt)" />
          </g>

          {/* Portrait Speed Lines */}
          <g stroke="#000000" strokeLinecap="round" className="pop-speedlines-wave">
            <line x1="160" y1="-10" x2="280" y2="120" strokeWidth="12" />
            <line x1="240" y1="-10" x2="330" y2="90" strokeWidth="8" />
            <line x1="880" y1="-10" x2="820" y2="110" strokeWidth="10" />
            <line x1="940" y1="-10" x2="870" y2="90" strokeWidth="7" />
            <line x1="560" y1="1340" x2="680" y2="1450" strokeWidth="12" />
            <line x1="620" y1="1330" x2="730" y2="1440" strokeWidth="9" />
          </g>

          {/* Central Portrait Cream Starburst */}
          <path
            d="M 220,580 L 100,320 L 320,440 L 360,240 L 470,330 L 540,160 L 610,330 L 720,220 L 760,430 L 960,310 L 860,560 L 990,620 L 870,740 L 980,880 L 850,960 L 950,1110 L 780,1130 L 720,1280 L 590,1170 L 540,1310 L 470,1170 L 360,1270 L 310,1120 L 130,1120 L 230,960 L 90,880 L 210,750 L 80,620 Z"
            fill={BRAND_CREAM_BG}
            stroke="#000000"
            strokeWidth="9"
            strokeLinejoin="round"
          />

          {/* Portrait Sparkle Stars */}
          <g>
            {[
              { cx: 340, cy: 90, r: 52, delay: '0s' },
              { cx: 130, cy: 460, r: 56, delay: '0.6s' },
              { cx: 160, cy: 1040, r: 56, delay: '1.2s' },
              { cx: 860, cy: 170, r: 48, delay: '0.4s' },
              { cx: 910, cy: 980, r: 52, delay: '0.9s' },
            ].map((st, i) => (
              <g key={i} className="pop-star-twinkle" style={{ transformOrigin: `${st.cx}px ${st.cy}px`, animationDelay: st.delay }}>
                <path
                  d={`M ${st.cx},${st.cy - st.r} Q ${st.cx},${st.cy} ${st.cx + st.r},${st.cy} Q ${st.cx},${st.cy} ${st.cx},${st.cy + st.r} Q ${st.cx},${st.cy} ${st.cx - st.r},${st.cy} Q ${st.cx},${st.cy} ${st.cx},${st.cy - st.r} Z`}
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="7"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </g>
        </svg>
      )}

      {/* ====================================================================
          2. INGREDIENT PROPS (AUTO-CLAMPED WITHIN VIEWPORT BOUNDARIES)
      ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {POSTER_INGREDIENT_PROPS.map((prop) => {
          const rawX = isLandscape ? prop.x : (prop.px ?? prop.x);
          const rawY = isLandscape ? prop.y : (prop.py ?? prop.y);
          const baseSize = isLandscape ? prop.size : (prop.psize ?? Math.round(prop.size * 0.78));
          const propSize = Math.max(24, Math.round(baseSize * scaleFactor));

          const halfPctW = ((propSize / 2) / Math.max(1, width)) * 100;
          const halfPctH = ((propSize / 2) / Math.max(1, height)) * 100;
          const safeX = Math.max(halfPctW + 1.0, Math.min(100 - halfPctW - 1.0, rawX));
          const safeY = Math.max(halfPctH + 1.0, Math.min(100 - halfPctH - 1.0, rawY));

          return (
            <div
              key={prop.id}
              style={{
                left: `${safeX}%`,
                top: `${safeY}%`,
                width: `${propSize}px`,
                height: `${propSize}px`,
                transform: `translate(-50%, -50%) rotate(${prop.rot}deg)`,
              }}
              className="absolute"
            >
              <div
                className="w-full h-full pop-float-item"
                style={{ animationDelay: `${prop.phase}s` }}
              >
                <FlavorPropSVG flavor={prop.flavor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================================
          3. CURATED PERIMETER MAKHANAS (AUTO-CLAMPED WITHIN VIEWPORT BOUNDARIES)
      ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {CURATED_POSTER_MAKHANAS.map((m) => {
          const rawX = isLandscape ? m.x : (m.px ?? m.x);
          const rawY = isLandscape ? m.y : (m.py ?? m.y);
          const baseSize = isLandscape ? m.size : (m.psize ?? Math.round(m.size * 0.74));
          const makhanaSize = Math.max(24, Math.round(baseSize * scaleFactor));

          const halfPctW = ((makhanaSize / 2) / Math.max(1, width)) * 100;
          const halfPctH = ((makhanaSize / 2) / Math.max(1, height)) * 100;
          const safeX = Math.max(halfPctW + 1.0, Math.min(100 - halfPctW - 1.0, rawX));
          const safeY = Math.max(halfPctH + 1.0, Math.min(100 - halfPctH - 1.0, rawY));

          return (
            <div
              key={m.id}
              style={{
                left: `${safeX}%`,
                top: `${safeY}%`,
                width: `${makhanaSize}px`,
                height: `${makhanaSize}px`,
                filter: m.blur > 0 ? `blur(${Math.max(1, Math.round(m.blur * scaleFactor))}px)` : 'none',
                transform: `translate(-50%, -50%) rotate(${m.rot}deg)`,
              }}
              className="absolute"
            >
              <div
                className="w-full h-full pop-float-item"
                style={{ animationDelay: `${m.phase}s` }}
              >
                {m.type === 'comic' ? (
                  <ComicIllustratedMakhanaSVG />
                ) : m.type === 'chunk' ? (
                  <CrunchyChunkSVG />
                ) : (
                  <RealisticMakhanaSVG variant={m.variant} idSuffix={m.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================================
          4. CENTERPIECE STACK: FOX LOGO + GAP + COOLEST WAY TO SNACK BETTER + GAP + COMING SOON
          Dynamically fitted to guaranteed safe area with ZERO border collision!
      ==================================================================== */}
      <main
        className="relative z-20 flex flex-col items-center justify-center w-full h-full pointer-events-none"
        style={{
          paddingTop: isLandscape ? '44px' : '52px',
          paddingBottom: isLandscape ? '24px' : '36px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: `${maxCenterWidth}px`, maxWidth: '86vw' }}
        >
          {/* A. POP CULTURE LOGO WITH FOX MASCOT */}
          <div className="w-full">
            <PopCultureLogoSVG isAnimated={isAnimating} />
          </div>

          {/* CLEAR VERTICAL GAP 1 */}
          <div style={{ height: `${subtitleGap}px` }} />

          {/* B. \\ COOLEST WAY TO SNACK BETTER // SUBTITLE */}
          <div className="flex items-center justify-center" style={{ gap: `${Math.round(8 * centerScale)}px` }}>
            <svg
              viewBox="0 0 55 45"
              style={{ width: `${arrowWidth}px`, height: `${arrowHeight}px` }}
              className="overflow-visible"
            >
              <path d="M 14,6 L 46,32 M 6,25 L 40,40" stroke="#000000" strokeWidth="7.5" strokeLinecap="round" />
            </svg>

            <h2
              className="font-black tracking-[0.05em] uppercase text-center leading-none select-none whitespace-nowrap"
              style={{
                fontSize: `${subtitleFontSize}px`,
                color: BRAND_SUBTITLE_GREEN,
                fontFamily: "'Fredoka', 'Rubik', 'Arial Rounded MT Bold', sans-serif",
              }}
            >
              COOLEST WAY TO SNACK BETTER
            </h2>

            <svg
              viewBox="0 0 55 45"
              style={{ width: `${arrowWidth}px`, height: `${arrowHeight}px` }}
              className="overflow-visible"
            >
              <path d="M 41,6 L 9,32 M 49,25 L 15,40" stroke="#000000" strokeWidth="7.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* CLEAR VERTICAL GAP 2 */}
          <div style={{ height: `${Math.round(subtitleGap * 1.1)}px` }} />

          {/* C. "COMING SOON" 3D EXTRUDED COMIC CLOUD */}
          <div className="w-[96%] pop-cloud-breathe">
            <ComingSoonCloudSVG isAnimated={isAnimating} />
          </div>
        </div>
      </main>

      {/* ====================================================================
          5. BOTTOM-RIGHT STRIPED MAKHANA BUCKET (ALWAYS FULLY VISIBLE)
      ==================================================================== */}
      <div
        style={{
          position: 'absolute',
          right: `${bucketRight}px`,
          bottom: `${bucketBottom}px`,
          width: `${bucketWidth}px`,
          height: `${bucketHeight}px`,
          zIndex: 25,
          pointerEvents: 'none',
        }}
        className="pop-bucket-float"
      >
        <MakhanaBucketSVG tilted={true} />
      </div>

      {/* ====================================================================
          6. STOP / START ANIMATION BUTTON (BOTTOM-LEFT CORNER)
      ==================================================================== */}
      <div
        style={{
          position: 'fixed',
          left: `${Math.max(10, Math.round(width * 0.02))}px`,
          bottom: `${Math.max(10, Math.round(height * 0.018))}px`,
          zIndex: 40,
        }}
      >
        <button
          onClick={() => {
            setIsAnimating((prev) => !prev);
            if (soundEnabled) playSoundFX('pop');
          }}
          className={`neu-button flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border-[3px] sm:border-[3.5px] border-black font-black text-[11px] sm:text-xs md:text-sm shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] cursor-pointer ${
            isAnimating
              ? 'bg-[#FFE600] hover:bg-[#ffd000] text-black'
              : 'bg-[#005A2B] hover:bg-[#007538] text-white'
          }`}
        >
          {isAnimating ? (
            <>
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
              <span>STOP ANIMATION</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              <span>START ANIMATION</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================

function Game1FlavorCatch({ soundEnabled, onScoreSave }: any) {
  const [status, setStatus] = useState('playing'); // 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lives, setLives] = useState(3);
  const [foxMood, setFoxMood] = useState('idle');
  const [targetFlavorIdx, setTargetFlavorIdx] = useState(0);
  const [orderProgress, setOrderProgress] = useState(0); // 0..3 matching flavor catches
  const [items, setItems] = useState([]);
  const [popups, setPopups] = useState([]);

  const arenaRef = useRef(null);
  const foxRef = useRef(null);
  const itemElementsRef = useRef(new Map());
  const stRef = useRef({
    foxX: 50,
    score: 0,
    combo: 1,
    lives: 3,
    targetFlavorIdx: 0,
    orderProgress: 0,
    items: [],
    keys: { left: false, right: false },
  });

  const targetFlavor = FLAVORS[targetFlavorIdx];

  const spawnPopup = useCallback((x, y, text, bg = POP_YELLOW) => {
    const id = Date.now() + Math.random();
    setPopups((p) => [...p.slice(-8), { id, x, y, text, bg }]);
    setTimeout(() => setPopups((p) => p.filter((item) => item.id !== id)), 700);
  }, []);

  const restart = useCallback(() => {
    const nextIdx = Math.floor(Math.random() * FLAVORS.length);
    stRef.current = {
      foxX: 50,
      score: 0,
      combo: 1,
      lives: 3,
      targetFlavorIdx: nextIdx,
      orderProgress: 0,
      items: [],
      keys: { left: false, right: false },
    };
    if (foxRef.current) foxRef.current.style.left = '50%';
    setScore(0);
    setCombo(1);
    setLives(3);
    setTargetFlavorIdx(nextIdx);
    setOrderProgress(0);
    setItems([]);
    setFoxMood('happy');
    setStatus('playing');
  }, []);

  // Keyboard support
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') stRef.current.keys.right = true;
    };
    const up = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') stRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') stRef.current.keys.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const handleMove = (e) => {
    if (!arenaRef.current || status !== 'playing') return;
    const rect = arenaRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    stRef.current.foxX = pct;
    if (foxRef.current) {
      foxRef.current.style.left = `${pct}%`;
    }
  };

  const smashBomb = (e, item) => {
    e.stopPropagation();
    if (status !== 'playing' || item.kind !== 'bomb') return;
    if (soundEnabled) playSoundFX('slash');
    stRef.current.score += 35;
    setScore(stRef.current.score);
    onScoreSave(stRef.current.score);
    stRef.current.items = stRef.current.items.filter((i) => i.id !== item.id);
    setItems([...stRef.current.items]);
    setFoxMood('happy');
    spawnPopup(item.x, item.y, 'SMASHED! +35', '#00F5D4');
  };

  useEffect(() => {
    if (status !== 'playing') return;
    let animId;
    let last = performance.now();
    let spawnTimer = 0;

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const st = stRef.current;
      let itemsChanged = false;

      if (st.keys.left) st.foxX = Math.max(10, st.foxX - 65 * dt);
      if (st.keys.right) st.foxX = Math.min(90, st.foxX + 65 * dt);
      if (foxRef.current && (st.keys.left || st.keys.right)) {
        foxRef.current.style.left = `${st.foxX}%`;
      }

      spawnTimer += dt;
      if (spawnTimer >= 0.58) {
        spawnTimer = 0;
        const roll = Math.random();
        let kind = 'makhana';
        let flavorId = FLAVORS[st.targetFlavorIdx].id;

        if (roll < 0.22) {
          kind = 'bomb';
        } else if (roll < 0.58) {
          kind = 'flavor';
          // 65% chance to spawn the active target flavor so orders feel rewarding
          if (Math.random() < 0.65) {
            flavorId = FLAVORS[st.targetFlavorIdx].id;
          } else {
            flavorId = FLAVORS[Math.floor(Math.random() * FLAVORS.length)].id;
          }
        }

        st.items.push({
          id: Date.now() + Math.random(),
          kind,
          flavorId,
          x: 12 + Math.random() * 76,
          y: -6,
          vy: 24 + Math.random() * 14,
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 200,
          variant: Math.floor(Math.random() * 3),
        });
        itemsChanged = true;
      }

      const next = [];
      for (const item of st.items) {
        item.y += item.vy * dt;
        item.rot += item.vRot * dt;

        // Hardware accelerated GPU transform - 0 layout reflows!
        const el = itemElementsRef.current.get(item.id);
        if (el) {
          el.style.top = `${item.y}%`;
          el.style.transform = `translate(-50%, -50%) rotate(${item.rot}deg)`;
        }

        const inY = item.y >= 73 && item.y <= 88;
        const inX = Math.abs(item.x - st.foxX) <= 10.5;

        if (inY && inX) {
          itemsChanged = true;
          if (item.kind === 'bomb') {
            if (soundEnabled) playSoundFX('bomb');
            st.lives -= 1;
            st.combo = 1;
            setLives(st.lives);
            setCombo(1);
            setFoxMood('ouch');
            spawnPopup(item.x, 72, 'OUCH! -1 ❤️', '#EF4444');
            if (st.lives <= 0) {
              setStatus('gameover');
              return;
            }
          } else if (item.kind === 'makhana') {
            const pts = 15 * st.combo;
            st.score += pts;
            setScore(st.score);
            onScoreSave(st.score);
            if (soundEnabled) playSoundFX('catch');
            spawnPopup(item.x, 74, `+${pts} FOXNUT`, POP_YELLOW);
          } else if (item.kind === 'flavor') {
            const target = FLAVORS[st.targetFlavorIdx];
            if (item.flavorId === target.id) {
              const pts = 40 * st.combo;
              st.score += pts;
              st.combo = Math.min(8, st.combo + 1);
              st.orderProgress += 1;
              setFoxMood('happy');
              if (soundEnabled) playSoundFX('golden');
              spawnPopup(item.x, 72, `${target.name.toUpperCase()} MATCH! +${pts}`, target.accent);

              if (st.orderProgress >= 3) {
                st.score += 150;
                st.orderProgress = 0;
                st.targetFlavorIdx = (st.targetFlavorIdx + 1) % FLAVORS.length;
                setTargetFlavorIdx(st.targetFlavorIdx);
                spawnPopup(50, 45, 'FLAVOR ORDER COMPLETE! +150', POP_PINK);
              }
              setScore(st.score);
              onScoreSave(st.score);
              setCombo(st.combo);
              setOrderProgress(st.orderProgress);
            } else {
              // Caught non-target flavor: still gives +10 points
              st.score += 10;
              setScore(st.score);
              onScoreSave(st.score);
              if (soundEnabled) playSoundFX('catch');
              spawnPopup(item.x, 74, '+10 SPICE', '#E2E8F0');
            }
          }
          continue;
        }

        if (item.y < 104) {
          next.push(item);
        } else {
          itemsChanged = true;
        }
      }

      st.items = next;
      // Only re-render React when items list changes (spawn / despawn), not on every frame
      if (itemsChanged) {
        setItems([...next]);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [status, soundEnabled, spawnPopup, onScoreSave]);

  return (
    <div
      ref={arenaRef}
      onMouseMove={handleMove}
      onTouchStart={handleMove}
      onTouchMove={handleMove}
      style={{ touchAction: 'none' }}
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* Top HUD for Game 1 */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 pt-2">
        <div className="flex items-center gap-3 bg-white border-[3.5px] border-black rounded-2xl px-3.5 py-1.5 shadow-[4px_4px_0_#000]">
          <div>
            <div className="text-[10px] font-black text-black/60">SCORE</div>
            <div className="text-xl font-black text-[#B3281E]">{score}</div>
          </div>
          <div className="bg-[#FFE600] px-2.5 py-0.5 rounded-xl border-2 border-black font-black text-xs">
            {combo}x COMBO
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${h <= lives ? 'text-[#FF007F] fill-[#FF007F]' : 'text-gray-300 fill-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Target Flavor Order Banner */}
        <div
          style={{ backgroundColor: targetFlavor.bgLight }}
          className="flex items-center gap-2.5 border-[3.5px] border-black rounded-2xl px-3.5 py-1.5 shadow-[4px_4px_0_#000]"
        >
          <div className="w-8 h-8">
            <FlavorPropSVG flavor={targetFlavor.id} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-black/70">FOX’S TARGET FLAVOR ORDER:</div>
            <div className="text-sm font-black uppercase" style={{ color: targetFlavor.color }}>
              {targetFlavor.name} ({orderProgress}/3)
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-[#00F5D4] text-black font-black text-xs px-3 py-1.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000]">
          <Crosshair className="w-4 h-4" />
          <span>TIP: CLICK BURNT BOMBS MID-AIR TO SMASH!</span>
        </div>
      </div>

      {/* Falling Makhanas, Flavor Ingredients & Clickable Bombs */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {items.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) itemElementsRef.current.set(item.id, el);
              else itemElementsRef.current.delete(item.id);
            }}
            onMouseDown={(e) => smashBomb(e, item)}
            onTouchStart={(e) => smashBomb(e, item)}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.kind === 'flavor' ? '62px' : '66px',
              height: item.kind === 'flavor' ? '62px' : '66px',
              transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
              willChange: 'transform, top',
            }}
            className={`absolute ${item.kind === 'bomb' ? 'pointer-events-auto cursor-crosshair' : ''}`}
          >
            {item.kind === 'bomb' ? (
              <HazardBombSVG showLabel={true} />
            ) : item.kind === 'flavor' ? (
              <div className="w-full h-full drop-shadow-[0_3px_0_#000]">
                <FlavorPropSVG flavor={item.flavorId} />
              </div>
            ) : (
              <RealisticMakhanaSVG variant={item.variant} spiceColor={targetFlavor.spiceColor} />
            )}
          </div>
        ))}
      </div>

      {/* Player Lottie Fox Mascot + Striped Bucket at Bottom */}
      <div
        ref={foxRef}
        style={{ left: `${stRef.current.foxX}%`, willChange: 'left' }}
        className="absolute bottom-14 sm:bottom-5 -translate-x-1/2 z-25 flex items-end pointer-events-none"
      >
        <div className="-mr-7 mb-2 w-20 h-20 sm:w-28 sm:h-28">
          <FoxLottieMascot mood={foxMood} role="catcher" className="w-full h-full" />
        </div>
        <div className="w-[145px] h-[118px] sm:w-[185px] sm:h-[150px]">
          <MakhanaBucketSVG tilted={false} accentColor={targetFlavor.color} />
        </div>
      </div>

      {/* Popups */}
      <div className="absolute inset-0 pointer-events-none z-35">
        {popups.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.bg }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000] font-black text-xs text-black whitespace-nowrap animate-bounce"
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* On-screen Mobile Thumb Controls (Fixed to Corners so Bucket is 100% Unobstructed) */}
      <div className="sm:hidden absolute bottom-2 inset-x-0 z-35 flex justify-between px-3 pointer-events-none">
        <button
          onPointerDown={() => { stRef.current.keys.left = true; }}
          onPointerUp={() => { stRef.current.keys.left = false; }}
          onPointerCancel={() => { stRef.current.keys.left = false; }}
          className="neu-button pointer-events-auto bg-[#FFE600] active:bg-[#ffbe00] text-black font-black text-xs px-3.5 py-2 rounded-xl border-[2.5px] border-black shadow-[2.5px_2.5px_0_#000] flex items-center gap-1 select-none"
        >
          ◀ LEFT
        </button>
        <button
          onPointerDown={() => { stRef.current.keys.right = true; }}
          onPointerUp={() => { stRef.current.keys.right = false; }}
          onPointerCancel={() => { stRef.current.keys.right = false; }}
          className="neu-button pointer-events-auto bg-[#FFE600] active:bg-[#ffbe00] text-black font-black text-xs px-3.5 py-2 rounded-xl border-[2.5px] border-black shadow-[2.5px_2.5px_0_#000] flex items-center gap-1 select-none"
        >
          RIGHT ▶
        </button>
      </div>

      {/* Game Over Modal */}
      {status === 'gameover' && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDF8E2] border-[5px] border-black rounded-3xl shadow-[8px_8px_0_#000] p-6 max-w-md w-full text-center">
            <div className="w-28 h-28 mx-auto mb-2">
              <FoxLottieMascot mood="happy" role="catcher" className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-black text-[#B3281E] uppercase mb-1">GREAT CATCHING!</h3>
            <p className="text-3xl font-black text-black mb-4">SCORE: {score}</p>
            <button
              onClick={restart}
              className="bg-[#FF007F] text-white font-black px-6 py-3 rounded-2xl border-[3.5px] border-black shadow-[4px_4px_0_#000] inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 2: FOXNUT FLAVOR SLINGSHOT
// Pull & Aim from the Lottie Fox Mascot on the left!
// Shoot giant Foxnuts through floating FLAVOR SEASONING CLOUDS (Peri Peri, Cheese,
// Salt & Pepper, Cream & Onion, Lime Chilli, Chaat Masala) to coat them in that
// flavor before landing inside the moving Flavor Tub on the right!
// ============================================================================
function Game2FlavorSlingshot({ soundEnabled, onScoreSave }: any) {
  const [score, setScore] = useState(0);
  const [shotsLeft, setShotsLeft] = useState(10);
  const [foxMood, setFoxMood] = useState('focus');
  const [hasProjectile, setHasProjectile] = useState(false);
  const [popups, setPopups] = useState([]);

  const arenaRef = useRef(null);
  const tubRef = useRef(null);
  const projectileRef = useRef(null);
  const dotElementsRef = useRef([]);
  const dragStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  const aimVecRef = useRef({ dx: 65, dy: -45 });
  const tubYRef = useRef(52);
  const projStateRef = useRef(null);

  const spawnPopup = useCallback((x, y, text, bg = POP_YELLOW) => {
    const id = Date.now() + Math.random();
    setPopups((p) => [...p.slice(-6), { id, x, y, text, bg }]);
    setTimeout(() => setPopups((p) => p.filter((item) => item.id !== id)), 800);
  }, []);

  const updateTrajectoryDots = (dx, dy) => {
    for (let i = 1; i <= 9; i++) {
      const stepT = i * 0.11;
      const x = 18 + dx * stepT;
      const y = 66 + dy * stepT + 0.5 * 58 * stepT * stepT;
      const el = dotElementsRef.current[i - 1];
      if (el) {
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
      }
    }
  };

  // Animate moving target tub & flying foxnut projectile without React state thrashing
  useEffect(() => {
    let animId;
    let last = performance.now();
    let t = 0;

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      const currentTubY = 52 + Math.sin(t * 1.8) * 24;
      tubYRef.current = currentTubY;
      if (tubRef.current) {
        tubRef.current.style.top = `${currentTubY}%`;
      }

      const p = projStateRef.current;
      if (p) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 58 * dt; // Gravity
        p.rot += 320 * dt;

        if (projectileRef.current) {
          projectileRef.current.style.left = `${p.x}%`;
          projectileRef.current.style.top = `${p.y}%`;
          projectileRef.current.style.transform = `translate(-50%, -50%) rotate(${p.rot}deg)`;
        }

        // Check if projectile lands inside moving target tub
        if (p.x >= 80 && p.x <= 93 && Math.abs(p.y - currentTubY) <= 12) {
          const isSwish = Math.abs(p.y - currentTubY) <= 6;
          const pts = isSwish ? 150 : 100;
          setScore((s) => {
            const ns = s + pts;
            onScoreSave(ns);
            return ns;
          });
          setFoxMood('happy');
          if (soundEnabled) playSoundFX(isSwish ? 'golden' : 'catch');
          spawnPopup(
            84,
            currentTubY - 10,
            isSwish ? 'PERFECT SWISH! +150' : `BUCKET DUNK! +${pts}`,
            isSwish ? POP_YELLOW : '#00F5D4'
          );
          projStateRef.current = null;
          setHasProjectile(false);
        } else if (p.x > 102 || p.y > 104 || p.x < -5) {
          // Out of bounds / missed
          setFoxMood('idle');
          projStateRef.current = null;
          setHasProjectile(false);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [soundEnabled, spawnPopup, onScoreSave]);

  const handlePointerDown = (e) => {
    if (projStateRef.current || shotsLeft <= 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
    isDraggingRef.current = true;
    setFoxMood('focus');
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rawDx = dragStartRef.current.x - clientX;
    const rawDy = dragStartRef.current.y - clientY;
    // Clamp launch velocity
    const dx = Math.max(30, Math.min(115, rawDx * 0.45 + 60));
    const dy = Math.max(-85, Math.min(10, rawDy * 0.45 - 35));
    aimVecRef.current = { dx, dy };
    updateTrajectoryDots(dx, dy);
  };

  const launchFoxnut = () => {
    if (projStateRef.current || shotsLeft <= 0) return;
    isDraggingRef.current = false;
    setShotsLeft((s) => s - 1);
    if (soundEnabled) playSoundFX('slash');
    const { dx, dy } = aimVecRef.current;
    projStateRef.current = {
      x: 18,
      y: 66,
      vx: dx,
      vy: dy,
      rot: 0,
    };
    setHasProjectile(true);
  };

  return (
    <div
      ref={arenaRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={launchFoxnut}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={launchFoxnut}
      style={{ touchAction: 'none' }}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Top HUD */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 pt-2 pointer-events-none">
        <div className="flex items-center gap-3 bg-white border-[3.5px] border-black rounded-2xl px-3.5 py-1.5 shadow-[4px_4px_0_#000]">
          <div>
            <div className="text-[10px] font-black text-black/60">SCORE</div>
            <div className="text-xl font-black text-[#B3281E]">{score}</div>
          </div>
          <div className="bg-[#FFE600] px-2.5 py-1 rounded-xl border-2 border-black font-black text-xs">
            FOXNUTS LEFT: {shotsLeft}
          </div>
        </div>

        {/* Clean Slingshot Mission Badge */}
        <div className="flex items-center gap-2 bg-[#00F5D4] px-4 py-2 rounded-2xl border-[3.5px] border-black shadow-[4px_4px_0_#000] font-black text-xs text-black">
          <Target className="w-4 h-4 text-black" />
          <span>AIM & DUNK INTO THE MOVING POP TUB! (+100 PTS)</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            launchFoxnut();
          }}
          className="pointer-events-auto bg-[#FF007F] hover:bg-[#d9006c] text-white font-black text-xs px-4 py-2 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000]"
        >
          DRAG ANYWHERE OR CLICK TO SHOOT!
        </button>
      </div>

      {/* Slingshot Aim Trajectory Dots */}
      {!hasProjectile &&
        shotsLeft > 0 &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const stepT = i * 0.11;
          const initialX = 18 + aimVecRef.current.dx * stepT;
          const initialY = 66 + aimVecRef.current.dy * stepT + 0.5 * 58 * stepT * stepT;
          return (
            <div
              key={i}
              ref={(el) => (dotElementsRef.current[i - 1] = el)}
              style={{ left: `${initialX}%`, top: `${initialY}%`, willChange: 'left, top' }}
              className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFE600] border-2 border-black pointer-events-none z-15"
            />
          );
        })}

      {/* Left Side: Lottie Slingshot Fox Mascot & Slingshot Post */}
      <div className="absolute left-[10%] top-[62%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none">
        <div className="w-28 h-28 sm:w-32 sm:h-32">
          <FoxLottieMascot mood={foxMood} role="slingshot" className="w-full h-full" />
        </div>
        {/* Ready Foxnut in Slingshot */}
        {!hasProjectile && shotsLeft > 0 && (
          <div className="w-14 h-14 -ml-2 animate-pulse">
            <RealisticMakhanaSVG variant={0} />
          </div>
        )}
      </div>

      {/* Flying Foxnut Projectile */}
      {hasProjectile && (
        <div
          ref={projectileRef}
          style={{
            left: '18%',
            top: '66%',
            willChange: 'transform, left, top',
          }}
          className="absolute w-16 h-16 z-25 pointer-events-none"
        >
          <RealisticMakhanaSVG
            variant={1}
            spiceColor="#B3281E"
          />
        </div>
      )}

      {/* Right Side: Moving Target Tub */}
      <div
        ref={tubRef}
        style={{ left: '86%', top: '52%', willChange: 'top' }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[150px] h-[125px] z-20 pointer-events-none"
      >
        <div className="text-center mb-1">
          <span className="bg-[#FFE600] text-black font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-black">
            TARGET TUB
          </span>
        </div>
        <MakhanaBucketSVG tilted={false} accentColor="#B3281E" />
      </div>

      {/* Popups */}
      <div className="absolute inset-0 pointer-events-none z-35">
        {popups.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.bg }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000] font-black text-xs text-black whitespace-nowrap"
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* Out of Shots Modal */}
      {shotsLeft <= 0 && !hasProjectile && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDF8E2] border-[5px] border-black rounded-3xl shadow-[8px_8px_0_#000] p-6 max-w-md w-full text-center">
            <div className="w-28 h-28 mx-auto mb-2">
              <FoxLottieMascot mood="happy" role="slingshot" className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-black text-[#B3281E] uppercase mb-1">SLINGSHOT ROUND COMPLETE!</h3>
            <p className="text-3xl font-black text-black mb-4">TOTAL SCORE: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setShotsLeft(10);
              }}
              className="bg-[#FF007F] text-white font-black px-6 py-3 rounded-2xl border-[3.5px] border-black shadow-[4px_4px_0_#000] inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN (10 SHOTS)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 3: FOXY FLAVOR CHEF (SPICE RUSH KITCHEN)
// The Lottie Chef Fox calls out customer flavor recipes from the 6 official flavors!
// Click/Tap moving Foxnuts & Flavor Ingredients on the conveyor belt to season the
// mixing bowl before the order timer runs out!
// ============================================================================
function Game3FoxyFlavorChef({ soundEnabled, onScoreSave }: any) {
  const [score, setScore] = useState(0);
  const [ordersDone, setOrdersDone] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [foxMood, setFoxMood] = useState('happy');
  const [recipe, setRecipe] = useState(() => ({
    flavor: FLAVORS[0],
    needFoxnuts: 2,
    gotFoxnuts: 0,
    needSpice: 2,
    gotSpice: 0,
  }));
  const [beltItems, setBeltItems] = useState([]);
  const [popups, setPopups] = useState([]);

  const beltItemsRef = useRef([]);
  const beltElementsRef = useRef(new Map());

  const createNewRecipe = useCallback(() => {
    const fl = FLAVORS[Math.floor(Math.random() * FLAVORS.length)];
    return {
      flavor: fl,
      needFoxnuts: 2,
      gotFoxnuts: 0,
      needSpice: 2,
      gotSpice: 0,
    };
  }, []);

  const spawnPopup = useCallback((x, y, text, bg = POP_YELLOW) => {
    const id = Date.now() + Math.random();
    setPopups((p) => [...p.slice(-6), { id, x, y, text, bg }]);
    setTimeout(() => setPopups((p) => p.filter((item) => item.id !== id)), 700);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  // Conveyor belt item spawner & mover
  useEffect(() => {
    if (timeLeft <= 0) return;
    let animId;
    let last = performance.now();
    let spawnAcc = 0;

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      spawnAcc += dt;
      let changed = false;

      if (spawnAcc >= 0.48) {
        spawnAcc = 0;
        const lane = Math.floor(Math.random() * 2); // 2 conveyor lanes
        const roll = Math.random();
        let kind = 'foxnut';
        let flavorId = recipe.flavor.id;

        if (roll < 0.16) {
          kind = 'bomb';
        } else if (roll < 0.62) {
          kind = 'flavor';
          flavorId =
            Math.random() < 0.6
              ? recipe.flavor.id
              : FLAVORS[Math.floor(Math.random() * FLAVORS.length)].id;
        }

        beltItemsRef.current.push({
          id: Date.now() + Math.random(),
          kind,
          flavorId,
          lane,
          x: lane === 0 ? -6 : 106,
          y: lane === 0 ? 38 : 56,
          vx: lane === 0 ? 28 : -28,
          variant: Math.floor(Math.random() * 3),
        });
        changed = true;
      }

      const remaining = [];
      for (const it of beltItemsRef.current) {
        it.x += it.vx * dt;
        const el = beltElementsRef.current.get(it.id);
        if (el) {
          el.style.left = `${it.x}%`;
        }
        if (it.x >= -10 && it.x <= 110) {
          remaining.push(it);
        } else {
          changed = true;
        }
      }
      beltItemsRef.current = remaining;

      if (changed) {
        setBeltItems([...remaining]);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [timeLeft, recipe.flavor.id]);

  const handleSelectIngredient = (item) => {
    if (timeLeft <= 0) return;
    beltItemsRef.current = beltItemsRef.current.filter((i) => i.id !== item.id);
    setBeltItems([...beltItemsRef.current]);

    if (item.kind === 'bomb') {
      if (soundEnabled) playSoundFX('bomb');
      setFoxMood('ouch');
      setScore((s) => Math.max(0, s - 40));
      spawnPopup(item.x, item.y, 'BURNT KERNEL! -40', '#EF4444');
      return;
    }

    if (item.kind === 'foxnut') {
      if (soundEnabled) playSoundFX('catch');
      setFoxMood('happy');
      spawnPopup(item.x, item.y, '+FOXNUT ADDED!', POP_YELLOW);
      setRecipe((prev) => {
        const nextGot = Math.min(prev.needFoxnuts, prev.gotFoxnuts + 1);
        const completed = nextGot >= prev.needFoxnuts && prev.gotSpice >= prev.needSpice;
        if (completed) {
          if (soundEnabled) playSoundFX('golden');
          setScore((s) => {
            const ns = s + 180;
            onScoreSave(ns);
            return ns;
          });
          setOrdersDone((d) => d + 1);
          spawnPopup(50, 72, `${prev.flavor.name.toUpperCase()} BOWL SERVED! +180`, POP_PINK);
          return createNewRecipe();
        }
        return { ...prev, gotFoxnuts: nextGot };
      });
    } else if (item.kind === 'flavor') {
      if (item.flavorId === recipe.flavor.id) {
        if (soundEnabled) playSoundFX('golden');
        setFoxMood('happy');
        spawnPopup(item.x, item.y, `+${recipe.flavor.name.toUpperCase()}!`, recipe.flavor.accent);
        setRecipe((prev) => {
          const nextSpice = Math.min(prev.needSpice, prev.gotSpice + 1);
          const completed = prev.gotFoxnuts >= prev.needFoxnuts && nextSpice >= prev.needSpice;
          if (completed) {
            setScore((s) => {
              const ns = s + 180;
              onScoreSave(ns);
              return ns;
            });
            setOrdersDone((d) => d + 1);
            spawnPopup(50, 72, `${prev.flavor.name.toUpperCase()} BOWL SERVED! +180`, POP_PINK);
            return createNewRecipe();
          }
          return { ...prev, gotSpice: nextSpice };
        });
      } else {
        if (soundEnabled) playSoundFX('bomb');
        setFoxMood('ouch');
        spawnPopup(item.x, item.y, `WRONG SPICE! NEED ${recipe.flavor.name.toUpperCase()}`, '#F97316');
      }
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Top HUD */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 pt-2">
        <div className="flex items-center gap-3 bg-white border-[3.5px] border-black rounded-2xl px-3.5 py-1.5 shadow-[4px_4px_0_#000]">
          <div>
            <div className="text-[10px] font-black text-black/60">SCORE</div>
            <div className="text-xl font-black text-[#B3281E]">{score}</div>
          </div>
          <div className="bg-[#FFE600] px-2.5 py-1 rounded-xl border-2 border-black font-black text-xs">
            BOWLS SERVED: {ordersDone}
          </div>
          <div className="bg-[#FF007F] text-white px-2.5 py-1 rounded-xl border-2 border-black font-black text-xs">
            TIME: {timeLeft}s
          </div>
        </div>

        {/* Chef Fox's Active Recipe Ticket */}
        <div
          style={{ backgroundColor: recipe.flavor.bgLight }}
          className="flex items-center gap-3 border-[3.5px] border-black rounded-2xl px-4 py-1.5 shadow-[4px_4px_0_#000]"
        >
          <div className="w-9 h-9">
            <FlavorPropSVG flavor={recipe.flavor.id} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-black/70">
              CHEF FOX’S ORDER: {recipe.flavor.name.toUpperCase()} MIX
            </div>
            <div className="flex items-center gap-3 text-xs font-black">
              <span className={recipe.gotFoxnuts >= recipe.needFoxnuts ? 'text-green-700' : 'text-black'}>
                • FOXNUTS: {recipe.gotFoxnuts}/{recipe.needFoxnuts}
              </span>
              <span style={{ color: recipe.flavor.color }}>
                • {recipe.flavor.name.toUpperCase()}: {recipe.gotSpice}/{recipe.needSpice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Conveyor Belt Tracks */}
      <div className="absolute left-4 right-4 top-[33%] h-14 bg-black/10 border-y-[3px] border-dashed border-black/40 pointer-events-none" />
      <div className="absolute left-4 right-4 top-[51%] h-14 bg-black/10 border-y-[3px] border-dashed border-black/40 pointer-events-none" />

      {/* Moving Conveyor Ingredients (Click/Tap to Toss into Chef Fox's Bowl!) */}
      <div className="absolute inset-0 z-20">
        {beltItems.map((item) => (
          <button
            key={item.id}
            ref={(el) => {
              if (el) beltElementsRef.current.set(item.id, el);
              else beltElementsRef.current.delete(item.id);
            }}
            onClick={() => handleSelectIngredient(item)}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              willChange: 'left',
            }}
            className="absolute w-16 h-16 p-1.5 rounded-2xl bg-white/90 hover:bg-[#FFE600] border-[3px] border-black shadow-[3px_3px_0_#000] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          >
            {item.kind === 'bomb' ? (
              <HazardBombSVG />
            ) : item.kind === 'flavor' ? (
              <FlavorPropSVG flavor={item.flavorId} />
            ) : (
              <RealisticMakhanaSVG variant={item.variant} />
            )}
          </button>
        ))}
      </div>

      {/* Bottom Kitchen Counter: Lottie Chef Fox + Giant Mixing Bowl */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-25 flex items-end gap-3 pointer-events-none">
        <div className="w-28 h-28 sm:w-36 sm:h-36">
          <FoxLottieMascot mood={foxMood} role="chef" className="w-full h-full" />
        </div>
        <div className="bg-white border-[4px] border-black rounded-b-full px-8 py-4 shadow-[5px_5px_0_#000] text-center min-w-[230px]">
          <div className="text-[10px] font-black uppercase text-black/60">SPICE MIXING BOWL</div>
          <div className="text-sm font-black uppercase" style={{ color: recipe.flavor.color }}>
            {recipe.flavor.name} ({recipe.gotFoxnuts + recipe.gotSpice}/4)
          </div>
        </div>
      </div>

      {/* Popups */}
      <div className="absolute inset-0 pointer-events-none z-35">
        {popups.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.bg }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000] font-black text-xs text-black whitespace-nowrap"
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* Kitchen Shift Complete Modal */}
      {timeLeft <= 0 && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDF8E2] border-[5px] border-black rounded-3xl shadow-[8px_8px_0_#000] p-6 max-w-md w-full text-center">
            <div className="w-28 h-28 mx-auto mb-2">
              <FoxLottieMascot mood="happy" role="chef" className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-black text-[#B3281E] uppercase mb-1">CHEF SHIFT COMPLETE!</h3>
            <p className="text-lg font-black text-[#005A2B] mb-1">BOWLS SERVED: {ordersDone}</p>
            <p className="text-3xl font-black text-black mb-4">SCORE: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setOrdersDone(0);
                setTimeLeft(45);
              }}
              className="bg-[#FF007F] text-white font-black px-6 py-3 rounded-2xl border-[3.5px] border-black shadow-[4px_4px_0_#000] inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> COOK AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// GAME 4: FOXJA SPICE SLASH (SWIPE SLICER)
// Swipe/drag your cursor or finger across flying Foxnuts & all 6 Flavor Props!
// Slicing a Foxnut + Flavor Prop builds a FLAVOR POP COMBO! Avoid Burnt Bombs!
// ============================================================================
function Game4FoxjaSpiceSlash({ soundEnabled, onScoreSave }: any) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [foxMood, setFoxMood] = useState('focus');
  const [lastFlavorSliced, setLastFlavorSliced] = useState(FLAVORS[0]);
  const [targets, setTargets] = useState([]);
  const [popups, setPopups] = useState([]);

  const arenaRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const trailPointsRef = useRef([]);
  const targetsRef = useRef([]);
  const targetElementsRef = useRef(new Map());
  const lastFlavorSlicedRef = useRef(FLAVORS[0]);

  const spawnPopup = useCallback((x, y, text, bg = POP_YELLOW) => {
    const id = Date.now() + Math.random();
    setPopups((p) => [...p.slice(-8), { id, x, y, text, bg }]);
    setTimeout(() => setPopups((p) => p.filter((item) => item.id !== id)), 650);
  }, []);

  // Toss items upward in parabolic arcs without per-frame React state thrashing
  useEffect(() => {
    if (lives <= 0) return;
    let animId;
    let last = performance.now();
    let spawnAcc = 0;

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      spawnAcc += dt;
      let changed = false;

      // Render glowing ninja blade trail on GPU Canvas
      const cvs = trailCanvasRef.current;
      if (cvs) {
        const ctx = cvs.getContext('2d');
        if (ctx) {
          if (cvs.width !== cvs.clientWidth || cvs.height !== cvs.clientHeight) {
            cvs.width = cvs.clientWidth;
            cvs.height = cvs.clientHeight;
          }
          ctx.clearRect(0, 0, cvs.width, cvs.height);
          const pts = trailPointsRef.current.filter((p) => now - p.time < 220);
          trailPointsRef.current = pts;
          if (pts.length >= 2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
              ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.strokeStyle = lastFlavorSlicedRef.current.color;
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowColor = '#FFE600';
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Inner white-hot neon blade core
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
              ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.shadowBlur = 0;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      if (spawnAcc >= 0.55) {
        spawnAcc = 0;
        const roll = Math.random();
        const kind = roll < 0.18 ? 'bomb' : roll < 0.55 ? 'flavor' : 'foxnut';
        const fl = FLAVORS[Math.floor(Math.random() * FLAVORS.length)];
        const startX = 18 + Math.random() * 64;

        targetsRef.current.push({
          id: Date.now() + Math.random(),
          kind,
          flavor: fl,
          x: startX,
          y: 96,
          vx: (50 - startX) * 0.45 + (Math.random() - 0.5) * 18,
          vy: -(68 + Math.random() * 22),
          rot: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 260,
          sliced: false,
          variant: Math.floor(Math.random() * 3),
        });
        changed = true;
      }

      const remaining = [];
      for (const t of targetsRef.current) {
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.vy += 56 * dt;
        t.rot += t.vRot * dt;

        const el = targetElementsRef.current.get(t.id);
        if (el) {
          el.style.left = `${t.x}%`;
          el.style.top = `${t.y}%`;
          el.style.transform = `translate(-50%, -50%) rotate(${t.rot}deg)`;
        }

        if (t.y <= 105 && !t.sliced) {
          remaining.push(t);
        } else {
          changed = true;
        }
      }
      targetsRef.current = remaining;

      if (changed) {
        setTargets([...remaining]);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [lives]);

  const handleSliceAt = (clientX, clientY) => {
    if (!arenaRef.current || lives <= 0) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const xPx = clientX - rect.left;
    const yPx = clientY - rect.top;
    const xPct = (xPx / rect.width) * 100;
    const yPct = (yPx / rect.height) * 100;

    // Add glowing blade trail point for GPU Canvas
    trailPointsRef.current.push({ x: xPx, y: yPx, time: performance.now() });

    // Check slice hits against flying targets
    let slicedAny = false;
    for (const t of targetsRef.current) {
      if (t.sliced) continue;
      const dist = Math.hypot(t.x - xPct, t.y - yPct);
      if (dist < 8.5) {
        t.sliced = true;
        slicedAny = true;
        if (t.kind === 'bomb') {
          if (soundEnabled) playSoundFX('bomb');
          setLives((l) => l - 1);
          setFoxMood('ouch');
          spawnPopup(t.x, t.y, 'KABOOM! -1 ❤️', '#EF4444');
        } else if (t.kind === 'flavor') {
          if (soundEnabled) playSoundFX('golden');
          setLastFlavorSliced(t.flavor);
          lastFlavorSlicedRef.current = t.flavor;
          setFoxMood('happy');
          setScore((s) => {
            const ns = s + 35;
            onScoreSave(ns);
            return ns;
          });
          spawnPopup(t.x, t.y, `${t.flavor.name.toUpperCase()} SLICE! +35`, t.flavor.accent);
        } else {
          if (soundEnabled) playSoundFX('slash');
          setFoxMood('happy');
          setScore((s) => {
            const ns = s + 25;
            onScoreSave(ns);
            return ns;
          });
          spawnPopup(t.x, t.y, 'CRUNCH SLASH! +25', POP_YELLOW);
        }
      }
    }

    if (slicedAny) {
      targetsRef.current = targetsRef.current.filter((t) => !t.sliced);
      setTargets([...targetsRef.current]);
    }
  };

  return (
    <div
      ref={arenaRef}
      onMouseMove={(e) => handleSliceAt(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        if (e.touches[0]) handleSliceAt(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) handleSliceAt(e.touches[0].clientX, e.touches[0].clientY);
      }}
      style={{ touchAction: 'none' }}
      className="relative w-full h-full overflow-hidden select-none cursor-crosshair"
    >
      {/* Top HUD */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 pt-2 pointer-events-none">
        <div className="flex items-center gap-3 bg-white border-[3.5px] border-black rounded-2xl px-3.5 py-1.5 shadow-[4px_4px_0_#000]">
          <div>
            <div className="text-[10px] font-black text-black/60">SCORE</div>
            <div className="text-xl font-black text-[#B3281E]">{score}</div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 ${h <= lives ? 'text-[#FF007F] fill-[#FF007F]' : 'text-gray-300 fill-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div
          style={{ backgroundColor: lastFlavorSliced.bgLight }}
          className="flex items-center gap-2 border-[3.5px] border-black rounded-2xl px-3.5 py-1.5 shadow-[4px_4px_0_#000]"
        >
          <div className="w-7 h-7">
            <FlavorPropSVG flavor={lastFlavorSliced.id} />
          </div>
          <span className="text-xs font-black uppercase" style={{ color: lastFlavorSliced.color }}>
            ACTIVE BLADE SPICE: {lastFlavorSliced.name}
          </span>
        </div>

        <div className="bg-[#FFE600] text-black font-black text-xs px-3 py-1.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000]">
          SWIPE CURSOR / FINGER TO SLICE FOXNUTS & SPICES!
        </div>
      </div>

      {/* High-Performance GPU Canvas for Glowing Ninja Blade Swipe Trail */}
      <canvas
        ref={trailCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* Tossed Targets */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {targets.map((t) => (
          <div
            key={t.id}
            ref={(el) => {
              if (el) targetElementsRef.current.set(t.id, el);
              else targetElementsRef.current.delete(t.id);
            }}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              transform: `translate(-50%, -50%) rotate(${t.rot}deg)`,
              willChange: 'transform, left, top',
            }}
            className="absolute w-16 h-16"
          >
            {t.kind === 'bomb' ? (
              <HazardBombSVG showLabel={true} />
            ) : t.kind === 'flavor' ? (
              <FlavorPropSVG flavor={t.flavor.id} />
            ) : (
              <RealisticMakhanaSVG
                variant={t.variant}
                spiceColor={lastFlavorSliced.spiceColor}
              />
            )}
          </div>
        ))}
      </div>

      {/* Bottom-Left Sensei Ninja Fox Mascot */}
      <div className="absolute bottom-2 left-6 z-25 flex items-end gap-2 pointer-events-none">
        <div className="w-28 h-28 sm:w-32 sm:h-32">
          <FoxLottieMascot mood={foxMood} role="ninja" className="w-full h-full" />
        </div>
      </div>

      {/* Popups */}
      <div className="absolute inset-0 pointer-events-none z-35">
        {popups.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.bg }}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000] font-black text-xs text-black whitespace-nowrap"
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* Game Over Modal */}
      {lives <= 0 && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDF8E2] border-[5px] border-black rounded-3xl shadow-[8px_8px_0_#000] p-6 max-w-md w-full text-center">
            <div className="w-28 h-28 mx-auto mb-2">
              <FoxLottieMascot mood="happy" role="ninja" className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-black text-[#B3281E] uppercase mb-1">FOXJA DOJO COMPLETE!</h3>
            <p className="text-3xl font-black text-black mb-4">SCORE: {score}</p>
            <button
              onClick={() => {
                setScore(0);
                setLives(3);
                setTargets([]);
              }}
              className="bg-[#FF007F] text-white font-black px-6 py-3 rounded-2xl border-[3.5px] border-black shadow-[4px_4px_0_#000] inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> SLICE AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SEGMENT 2: ARCADE GAMES HUB (4 PLAYABLE FOX & FLAVOR GAMES)
// ============================================================================
function ArcadeGamesHub({ soundEnabled }: any) {
  const [selectedGame, setSelectedGame] = useState('catch'); // 'catch' | 'slingshot' | 'chef' | 'slash'
  const [bestScore, setBestScore] = useState(0);

  const handleScoreSave = useCallback((newScore) => {
    setBestScore((prev) => Math.max(prev, newScore));
  }, []);

  const GAME_TABS = [
    { id: 'catch', title: '1. Catch', fullTitle: '1. Fox Flavor Catch', icon: Gamepad2, color: '#FF007F' },
    { id: 'slingshot', title: '2. Slingshot', fullTitle: '2. Foxnut Slingshot', icon: Target, color: '#FF6B00' },
    { id: 'chef', title: '3. Chef', fullTitle: '3. Foxy Flavor Chef', icon: ChefHat, color: '#005A2B' },
    { id: 'slash', title: '4. Slash', fullTitle: '4. Foxja Spice Slash', icon: Swords, color: '#9333EA' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none" style={{ backgroundColor: POP_DARK_GREEN }}>
      {/* Comic Pop-Art Background Frame */}
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-95"
      >
        <g stroke="#000000" strokeWidth="6">
          <polygon points="960,540 0,0 480,0" fill={POP_PINK} />
          <polygon points="960,540 480,0 960,0" fill={POP_YELLOW} />
          <polygon points="960,540 960,0 1440,0" fill={POP_ORANGE} />
          <polygon points="960,540 1440,0 1920,0" fill={POP_GREEN} />
          <polygon points="960,540 1920,0 1920,540" fill={POP_PINK} />
          <polygon points="960,540 1920,540 1920,1080" fill={POP_YELLOW} />
          <polygon points="960,540 1920,1080 960,1080" fill={POP_GREEN} />
          <polygon points="960,540 960,1080 0,1080" fill={POP_ORANGE} />
          <polygon points="960,540 0,1080 0,0" fill={POP_GREEN} />
        </g>
        <rect
          x="45"
          y="118"
          width="1830"
          height="930"
          rx="40"
          fill={BRAND_CREAM_BG}
          stroke="#000000"
          strokeWidth="10"
        />
      </svg>

      {/* Sub-Navigation Bar: Switch Between the 4 Fox & Flavor Games + 6 Flavor Pills */}
      <div className="relative z-30 pt-16 sm:pt-16 px-3 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
          {GAME_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = selectedGame === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedGame(tab.id);
                  if (soundEnabled) playSoundFX('pop');
                }}
                style={{ backgroundColor: active ? tab.color : '#FFFFFF' }}
                className={`neu-button flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl border-[2.5px] sm:border-[3px] border-black font-black text-[11px] sm:text-xs cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-white shadow-[2px_2px_0_#000] sm:shadow-[3px_3px_0_#000] -translate-y-0.5'
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.fullTitle}</span>
                <span className="inline sm:hidden">{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* 6 Flavors Legend Strip */}
        <div className="hidden xl:flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-2xl border-[3px] border-black shadow-[3px_3px_0_#000]">
          <span className="text-[10px] font-black uppercase text-black/60 mr-1">6 FLAVORS:</span>
          {FLAVORS.map((fl) => (
            <span
              key={fl.id}
              style={{ backgroundColor: fl.bgLight, color: fl.color }}
              className="text-[10px] font-black px-2 py-0.5 rounded-lg border border-black"
            >
              {fl.name}
            </span>
          ))}
        </div>
      </div>

      {/* Active Game Playfield Container */}
      <div className="relative z-20 flex-1 w-full overflow-hidden">
        {selectedGame === 'catch' && (
          <Game1FlavorCatch soundEnabled={soundEnabled} onScoreSave={handleScoreSave} />
        )}
        {selectedGame === 'slingshot' && (
          <Game2FlavorSlingshot soundEnabled={soundEnabled} onScoreSave={handleScoreSave} />
        )}
        {selectedGame === 'chef' && (
          <Game3FoxyFlavorChef soundEnabled={soundEnabled} onScoreSave={handleScoreSave} />
        )}
        {selectedGame === 'slash' && (
          <Game4FoxjaSpiceSlash soundEnabled={soundEnabled} onScoreSave={handleScoreSave} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ROOT APP WITH STRICT TWO-SEGMENT TOP TOGGLE BAR (POSTER VIEW vs ARCADE GAMES)
// ============================================================================
export default function App() {
  const [activeSegment, setActiveSegment] = useState<'poster' | 'game'>('poster');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Auto-unlock Web Audio context smoothly on first touch/pointerdown
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          ctx.resume();
        }
      } catch (e) {}
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[100dvh] overflow-hidden font-sans select-none bg-[#FF007F] m-0 p-0">
      {/* Continuous Sorted Pop-Art Poster Animations & Lottie Fox Mascot Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Fredoka:wght@700;800;900&family=Lilita+One&family=Rubik:ital,wght@0,800;0,900;1,900&display=swap');

        /* Continuous, Simple & Sorted Pop-Art Poster Loops */
        @keyframes popPanelWave {
          0%, 100% { transform: scale(1) rotate(0deg); filter: saturate(1); }
          50% { transform: scale(1.028) rotate(0.6deg); filter: saturate(1.18); }
        }
        @keyframes halftoneShimmer {
          0%, 100% { opacity: 0.78; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.015); }
        }
        @keyframes speedlinePulse {
          0%, 100% { stroke-dashoffset: 0; opacity: 0.9; }
          50% { stroke-dashoffset: 14; opacity: 1; }
        }
        @keyframes starTwinkle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.18) rotate(8deg); }
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(4deg); }
        }
        @keyframes cloudBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.018); }
        }
        @keyframes splashPulse {
          0% { transform: scale(0.96); }
          100% { transform: scale(1.04); }
        }
        @keyframes posterFoxTail {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(4deg); }
        }
        @keyframes posterEarTwitch {
          0%, 86%, 100% { transform: rotate(0deg); }
          92% { transform: rotate(-6deg); }
        }

        /* Apply continuous animations when poster-anim-running is active, pause cleanly when stopped */
        .pop-panel-wave-1 { animation: popPanelWave 4.2s ease-in-out 0s infinite; }
        .pop-panel-wave-2 { animation: popPanelWave 4.2s ease-in-out 1.4s infinite; }
        .pop-panel-wave-3 { animation: popPanelWave 4.2s ease-in-out 2.8s infinite; }
        .pop-halftone-wave { animation: halftoneShimmer 3.6s ease-in-out infinite; }
        .pop-speedlines-wave { stroke-dasharray: 90 12; animation: speedlinePulse 3.2s ease-in-out infinite; }
        .pop-star-twinkle { animation: starTwinkle 2.8s ease-in-out infinite; }
        .pop-float-item { animation: gentleFloat 4.0s ease-in-out infinite; }
        .pop-cloud-breathe { animation: cloudBreathe 3.8s ease-in-out infinite; }
        .pop-bucket-float { animation: gentleFloat 4.6s ease-in-out infinite; }

        .poster-anim-paused * {
          animation-play-state: paused !important;
        }

        /* Lottie-Style Fox Mascot Articulated Keyframes */
        @keyframes foxTailWag {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes foxBodyBreathe {
          0% { transform: scaleY(1) translateY(0px); }
          100% { transform: scaleY(1.03) translateY(-3px); }
        }
        @keyframes foxEarTwitch {
          0%, 80%, 100% { transform: rotate(0deg); }
          88% { transform: rotate(-8deg); }
          94% { transform: rotate(5deg); }
        }
        @keyframes foxPawWave {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(5deg); }
        }
      `}</style>

      {/* ====================================================================
          TOP-CENTER TWO-SEGMENT TOGGLE BAR (1. POSTER VIEW | 2. ARCADE GAMES)
      ==================================================================== */}
      <header className="fixed top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 max-w-[96vw]">
        <div className="bg-[#FDF8E2] p-1 rounded-full border-[3px] sm:border-[3.5px] border-black shadow-[4px_4px_0_#000] flex items-center gap-1">
          {/* Segment 1: Poster View */}
          <button
            onClick={() => {
              setActiveSegment('poster');
              if (soundEnabled) playSoundFX('pop');
            }}
            className={`neu-button flex items-center gap-1 sm:gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-black text-[11px] sm:text-xs md:text-sm cursor-pointer whitespace-nowrap ${
              activeSegment === 'poster'
                ? 'bg-[#B3281E] text-white border-2 border-black shadow-[2px_2px_0_#000]'
                : 'text-black hover:bg-black/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>POSTER VIEW</span>
          </button>

          {/* Segment 2: Arcade Games (4 Fox & Flavor Games) */}
          <button
            onClick={() => {
              setActiveSegment('game');
              if (soundEnabled) playSoundFX('golden');
            }}
            className={`neu-button flex items-center gap-1 sm:gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-black text-[11px] sm:text-xs md:text-sm cursor-pointer whitespace-nowrap ${
              activeSegment === 'game'
                ? 'bg-[#FF007F] text-white border-2 border-black shadow-[2px_2px_0_#000]'
                : 'text-black hover:bg-black/5'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>ARCADE GAMES (4)</span>
          </button>
        </div>

        {/* Sound Mute/Unmute Button */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          className="neu-button bg-[#FFE600] hover:bg-[#ffd000] text-black p-2 sm:p-2.5 rounded-full border-[3px] sm:border-[3.5px] border-black shadow-[3px_3px_0_#000] cursor-pointer"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </header>

      {/* ====================================================================
          ACTIVE SEGMENT RENDERER
      ==================================================================== */}
      {activeSegment === 'poster' ? (
        <PosterSegment soundEnabled={soundEnabled} />
      ) : (
        <ArcadeGamesHub soundEnabled={soundEnabled} />
      )}
    </div>
  );
}