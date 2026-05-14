---
title: App foundation and tier list shell
type: AFK
triage: ready-for-agent
blocked_by: []
parent: prd/tier-list-maker-v1.md
---

## Parent

`prd/tier-list-maker-v1.md`

## What to build

Replace the default Vite template with the tier list app foundation. Add Tailwind CSS via the Vite plugin. Introduce the tier list state model and a `useReducer` wired to initial state (and a `RESET` action that restores that initial state, even if no Reset button exists yet).

On load, the user sees a polished dark-theme shell matching the design mock: header area grouping title and future controls, a progress section, four tier rows (**S, A, B, C**) with system-assigned colored labels and empty drop zones, and an unranked section with header copy ("UNRANKED — DRAG INTO TIERS ABOVE") and a dashed staging area. Default title reads **Untitled tier list**. Progress shows **0 of 0 ranked** and **0%** with an empty bar.

State shape (from PRD):

```ts
type Item = { id: string; label: string }

type Tier = {
  id: string
  label: string
  color: string
}

type TierListState = {
  title: string
  tiers: Tier[]
  items: Record<string, Item>
  unranked: string[]
  placements: Record<string, string[]>
}
```

No item interactions yet beyond viewing the blank list. No drag-and-drop. No backend or persistence.

## Acceptance criteria

- [ ] Vite default template content is removed; app renders the tier list shell instead
- [ ] Tailwind CSS is configured and used for dark-theme layout, rounded containers, and tier label colors from the preset palette (S through C at minimum)
- [ ] Tier list state model and reducer exist with correct initial state: title "Untitled tier list", tiers S–C, no items, empty placements
- [ ] Four tier rows render with colored letter labels and empty drop-zone areas beside each label
- [ ] Unranked section renders with instructional header copy and dashed border container
- [ ] Progress area shows "0 of 0 ranked", 0%, and an unfilled progress bar
- [ ] App is client-only with no API calls or browser storage reads/writes
- [ ] `pnpm dev` runs without errors and the shell is visually recognizable against the design mock

## Blocked by

None - can start immediately
