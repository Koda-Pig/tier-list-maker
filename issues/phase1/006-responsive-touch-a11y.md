---
title: Responsive layout, touch, and baseline a11y
type: AFK
triage: ready-for-agent
blocked_by:
  - 003-drag-and-drop-ranking.md
parent: prd/tier-list-maker-v1.md
---

## Parent

`prd/tier-list-maker-v1.md`

## What to build

Polish the app for smaller viewports, touch input, and baseline accessibility. Header controls (title, add-item field, Add, + Tier, Reset) reflow sensibly on narrow screens without breaking usability. Tier rows and unranked area remain usable on tablet and phone widths.

Enable `@dnd-kit` touch sensors so drag-and-drop works on touchscreen devices. Ensure interactive elements are keyboard-focusable with visible focus rings. Icon-only controls (×, −, Add if icon-only) carry `aria-label` attributes. Tier identity remains clear via letter labels, not color alone.

Drag-only ranking remains acceptable for v1 (no keyboard tier-move shortcuts).

## Acceptance criteria

- [ ] Layout is usable on a narrow viewport (e.g. 375px width): no horizontal overflow that hides core controls
- [ ] Header controls wrap or stack without overlapping unusably
- [ ] Touch drag works on a touchscreen or emulated touch for unranked ↔ tier and within-tier reorder
- [ ] All buttons and inputs are focusable via keyboard tab order
- [ ] Focused controls show a visible focus indicator
- [ ] ×, −, and other icon actions have descriptive `aria-label` values
- [ ] Tier rows display letter labels (S, A, B, …) alongside color for identification
- [ ] Manual smoke test on mobile or narrow DevTools: add item, drag to tier, unrank, reset

## Blocked by

- `003-drag-and-drop-ranking.md`
