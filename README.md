# Pop Culture Makhana | Neubrutalism Launch Experience 🍿🦊

An energetic, full-bleed Neubrutalist interactive web poster and 4-game arcade hub for **Pop Culture Roasted Makhana (Foxnut) Snacks**.

---

## 🌟 Features

### 1. Poster View (Interactive Neubrutalism Poster)
- **Official Brand Assets**: Features the official sitting Fox Mascot and typography from the brand's secondary logo vector.
- **Dual-Mode Full-Bleed Engine**:
  - **Widescreen Desktop (`>= 1.12`)**: Landscape comic panels, halftone dots, speed lines, and cream starburst.
  - **Mobile & Snapped Portrait (`< 1.12`)**: Dedicated vertical portrait comic framing.
  - **Zero Letterboxing & Zero Clipping**: Uses proportional viewport clamping (`Math.min`) to guarantee the logo, subtitle, cloud, and makhana bucket stay 100% visible at all screen sizes.
- **Continuous Sorted Pop-Art Animations**: Fluid 60/120fps CSS GPU keyframe animations (waves, shimmers, sparkles, and cloud breathe).
- **Audio & Controls**: Top-level mute/unmute toggle and a single sticky STOP / START ANIMATION controller.

### 2. Arcade Games Hub (4 Fox & Flavor Games)
1. **Fox's Flavor Catch**: Move the Fox Mascot and tub horizontally to catch falling roasted foxnuts and target flavor ingredients, while smashing burnt bombs mid-air.
2. **Foxnut Slingshot**: Drag and release to launch roasted foxnuts at floating flavor bubbles and bonus multiplier targets.
3. **Foxy Flavor Chef**: Assemble recipes by catching matching flavor spices in sequence against the clock.
4. **Foxja Spice Slash**: Swipe/drag across mid-air roasted puffs and ingredients while avoiding hazard kernels.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 + Neubrutalism UI (bold 3.5px black borders, hard offset drop shadows)
- **Icons**: Lucide React
- **Audio**: Web Audio API Synthesizer (custom sound effects)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested with Node 20 / 24)
- npm or pnpm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
```
Builds the app into `dist/` ready for static hosting.
