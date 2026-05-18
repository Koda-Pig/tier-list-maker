---
title: Drag-and-drop ranking
type: AFK
triage: ready-for-agent
blocked_by:
  - 002-title-and-items.md
parent: prd/tier-list-maker-v1.md
---

## Parent

`prd/tier-list-maker-v1.md`

## What to build

Integrate `@dnd-kit` (core, sortable, utilities) so ranking works end-to-end. A single drag context spans the unranked pool and all tier drop zones.

The user can drag items from unranked into any tier, from one tier to another, from a tier back to unranked, and reorder items within a tier (left-to-right order is preserved). Drag-end events are translated into reducer `MOVE_ITEM` actions (and `UNRANK_ITEM` where appropriate). A drag coordinator module isolates dnd-kit specifics from presentation components.

Ranked item pills use their tier's color; unranked pills remain neutral. Each tier pill's × sends the item back to unranked (non-destructive). Progress bar counts an item as ranked only when it sits in a tier; updates immediately on every move or unrank.

## Acceptance criteria

- [ ] `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` are installed and configured
- [ ] Drag from unranked into a tier places the item in that tier
- [ ] Drag between tiers moves the item without duplication
- [ ] Drag from a tier to unranked returns the item to the staging pool
- [ ] Reordering within a tier updates order and persists in state
- [ ] Ranked pills render with tier-colored backgrounds; unranked pills stay neutral
- [ ] × on a tier pill moves item to unranked; item is not deleted
- [ ] Progress ranked count, percentage, and bar update immediately on drag and unrank
- [ ] Empty tier drop zones remain valid drop targets
- [ ] Manual smoke test: add several items, rank across tiers, reorder within a tier, unrank via drag and via ×

## Blocked by

- `002-title-and-items.md`
