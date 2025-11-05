# Go4It_BlueGlow_BrandSystem

This codifies the Go4It Verified neon glow aesthetic across the app. It’s lightweight (pure CSS + existing Tailwind) and safe to apply incrementally.

## Core tokens

Defined in `app/globals.css` under `:root`:

- --blueglow-cyan: #00FFFF
- --blueglow-black: #000000
- --blueglow-white: #FFFFFF
- --surface-base, --surface-elevated
- --border-cyan, --border-muted
- Glow shadows: --glow-1/2/3, --drop-soft/--drop-strong

Body default: black background, white foreground.

## Utilities (apply anywhere)

- Glow text: `glow-text`
- Glow border/card edge: `glow-border`
- Strong drop shadow: `glow-drop`
- Pulsing glow: `pulse-blueglow`
- Brand helpers: `brand-bg`, `brand-fg`, `brand-border`, `focus-brand`

## Components

- Button (filled): `btn-blueglow`
- Button (outline): `btn-blueglow-outline`
- Input: `input-blueglow`
- Card: `card-blueglow`
- Icon color/glow: `icon-blueglow` (SVGs must use currentColor or stroke)
- Star text glow: `star-blueglow`

Example:

```tsx
<button className="btn-blueglow">Unlock Combine Report</button>
<input className="input-blueglow" placeholder="Email" />
<div className="card-blueglow"><h3 className="glow-text">GAR™ Verified</h3></div>
```

## Icons

Use `lucide-react` with `icon-blueglow` or import pre-wrapped icons:

```tsx
import { SpeedTestedIcon, CognitiveProfileIcon, StarRatingIcon } from "@/components/BlueGlowIcons";

<SpeedTestedIcon size={24} />
<CognitiveProfileIcon size={24} />
<StarRatingIcon count={5} />
```

## Landing Page adjustments

- Nav rethemed to black with cyan border.
- Cyan variables unified to #00FFFF.
- Athlete images refined to maintain aspect ratio (no cropping).

## Motion guidance

- Soft pulsing via `pulse-blueglow` (1.5s ease-in-out).
- Hover states add `--drop-strong` for elevated glow.

## Accessibility

- Base contrast 8:1 (black/white). Cyan used for accents and glow; do not rely on glow alone for state.
- Inputs keep clear focus rings via `focus-brand` and input focus styles.

## Notes

- The system is additive: you can apply a few classes to any existing element to get the neon look without refactoring.
- For static SVGs, ensure `stroke="currentColor"` or add `class="icon-blueglow"` inside the SVG.
