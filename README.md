# FFXIV Macro Helper

A config-driven web tool for tracking FFXIV fight mechanic timelines. Tap macro-pad style buttons to build a 6-step action timeline — useful for solving complex encounter mechanics without memorization.

- **Warm, tactile UI** — designed like a well-worn instrument panel, not a dark gaming HUD
- **Draggable layout** — rearrange buttons via Edit Mode; position persists in `localStorage`
- **Dual-layer timeline** — each step shows a **main action** plus an optional **sub note**
- **Mobile-first** — fully usable on a phone held in one hand

---

## Setup

Requires Node.js 20+.

```bash
cd ffxiv-macro-helper
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static files are emitted to `dist/`.

## Deploy

### GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment**.
3. Select **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on every push to `main`.

> If you rename the repo, update `base` in `vite.config.ts` to match.

### Vercel
1. Import the repo on [vercel.com](https://vercel.com).
2. Set **Framework Preset** to Vite.
3. Deploy. No extra config needed.

---

## Configuration

All buttons and timeline mappings live in **`src/config/buttons.ts`**. Edit this file to adapt the tool for any fight.

### Button structure

```ts
export const buttonConfigs: ButtonConfig[] = [
  {
    id: 'unique-id',           // Internal ID; must be unique
    label: 'Button Label',     // Text shown under the icon
    icon: 'LucideIconName',    // Lucide icon, emoji, or inline SVG
    group: 'Group Name',       // Optional grouping
    description: 'Tooltip',    // Hover tooltip text
    slots: {
      2: '石化出',             // Slot 1–6: main text only (shorthand)
      4: { subText: '不要動' }, // Sub note only
      5: { mainText: '鋼鐵', subText: '靠近 Boss' }, // Both
    },
  },
];
```

### Slot syntax

| You want | Write it as |
|---|---|
| Main text only | `slots: { 3: '鋼鐵' }` |
| Sub note only | `slots: { 3: { subText: '不要動' } }` |
| Both main + sub | `slots: { 3: { mainText: '鋼鐵', subText: '靠近 Boss' } }` |

A button can map to **any number** of timeline slots (1–6). Tapping a button adds its mappings to the timeline; later taps **override** earlier ones for the same slot.

### Icons

- **Lucide icons** (recommended): use the PascalCase name from [lucide.dev/icons](https://lucide.dev/icons/)
- **Emoji**: `icon: '🔥'`
- **Inline SVG**: pass a full `<svg>...</svg>` string

---

## Layout editing

Tap **Edit Layout** to enter drag mode. Buttons show a grip indicator and can be dragged to any grid cell, including empty slots. Tap **Done** to save. Layout persists in `localStorage`.

If you add new buttons to `buttons.ts` after editing the layout, they'll automatically fill the first empty slots.

---

## Project Structure

```
src/
  config/buttons.ts         # All mechanic definitions
  hooks/
    useTimeline.ts          # Timeline state + merge logic
    useGridLayout.ts        # Drag grid + localStorage persistence
  components/
    StreamDeck.tsx          # 5×5 macro pad container
    DeckButton.tsx          # Individual button
    EmptySlot.tsx           # Empty grid placeholder
    Timeline.tsx            # 6-slot timeline display
    TimelineSlot.tsx        # Single slot (main + sub text)
```

## Design

- **Palette**: warm antique tones — oxidized copper, aged brass, tea-stained paper
- **Typography**: Crimson Pro (headings) + Inter (UI)
- **Responsive**: mobile 3×2 timeline / desktop 6×1 horizontal
- **Accessibility**: `prefers-reduced-motion` respected, touch targets ≥ 44px
