---
title: Title editing and unranked items
type: AFK
triage: ready-for-agent
blocked_by:
  - 001-app-foundation.md
parent: prd/tier-list-maker-v1.md
---

## Parent

`prd/tier-list-maker-v1.md`

## What to build

Wire the header for title editing and item creation end-to-end through the reducer and UI.

The user can edit the list title inline; input is clamped to ~60 characters. An add-item field and Add button accept a label (trimmed, single-line, max ~50 characters); empty submissions are ignored. Enter and Add both create an item. Duplicate display names are allowed; each new item gets a unique id via `crypto.randomUUID()`.

New items appear as neutral dark pills in the unranked area. Each pill shows an × control that deletes the item from the list entirely. The unranked header shows the item count (e.g. "3 items"). The progress bar updates live: ranked count stays 0 until items are placed in tiers (none yet in this slice), total reflects all items, percentage and bar fill accordingly. At zero items, progress remains **0 of 0 ranked** / **0%**.

Reducer actions used: `SET_TITLE`, `ADD_ITEM`, `REMOVE_ITEM`.

## Acceptance criteria

- [ ] Title input is editable and updates list title via reducer; max ~60 characters enforced
- [ ] Add item via Add button and Enter key; whitespace-only input ignored
- [ ] Item labels clamped to ~50 characters, single line
- [ ] Duplicate labels can coexist; each item has a unique internal id
- [ ] New items render as neutral pills in the unranked dashed area
- [ ] Unranked section shows count of items in the pool
- [ ] × on an unranked pill removes the item from the list completely
- [ ] Progress text shows "X of Y ranked" and percentage; Y equals total items; X is 0 while all items are unranked
- [ ] Progress shows "0 of 0 ranked" and 0% when there are no items
- [ ] Progress updates immediately on add and delete

## Blocked by

- `001-app-foundation.md`
