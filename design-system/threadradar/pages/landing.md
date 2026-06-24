# Landing Page Overrides — Threadradar

> Overrides `MASTER.md` for the marketing landing only.

## Theme: Dark Premium SaaS

Adaptación del MASTER para intent monitoring B2B. Mantiene legibilidad WCAG en dark mode.

| Role | Hex | Token |
|------|-----|-------|
| Background | `#020617` | `--background` |
| Surface | `#0F172A` | `--background-elevated` |
| Secondary | `#334155` | borders / muted surfaces |
| CTA / Accent | `#10B981` | `--primary` (emerald, acción) |
| Accent glow | `#34D399` | highlights |
| Text | `#F8FAFC` | `--foreground` |
| Muted text | `#94A3B8` | `--foreground-muted` |

## Pattern

**Hero + Testimonials + CTA** con **Bento Grid** de features.

Section order:
1. Floating navbar
2. Hero + product demo mock
3. Problem statement
4. How it works (3 steps)
5. Bento features grid
6. Platforms
7. Testimonials
8. Stats band
9. Final CTA
10. Footer

## Typography

Plus Jakarta Sans — headings 600/700, body 400/500.

## Effects

- Transitions 200ms ease
- Hover: opacity/border/color only (no layout-shifting scale)
- `prefers-reduced-motion`: disable glow animations
- SVG icons: Lucide 24px, stroke 1.5

## CTA

Primary: "Empezar gratis con Google" → `/login`
Secondary: "Ver precios" → `/pricing`
