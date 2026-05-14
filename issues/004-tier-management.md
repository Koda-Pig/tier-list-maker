---
title: Tier add and remove
type: AFK
triage: ready-for-agent
blocked_by:
  - 002-title-and-items.md
parent: prd/tier-list-maker-v1.md
---

## Parent

`prd/tier-list-maker-v1.md`

## What to build

Add tier row management through the header and tier labels, wired to reducer `ADD_TIER` and `REMOVE_TIER`.

**+ Tier** in the header appends the next tier in sequence: **D**, then **E**, then **F**. New tiers receive system-assigned labels and colors from the preset palette. The control is disabled when **F** already exists (seven tiers max). **S, A, B, C** are never removable.

Removable tiers (**D, E, F**) show a **−** control on the tier label only when that tier has zero items. Clicking **−** removes the empty tier row. If a tier contains items, **−** is hidden or unavailable.

This slice can be implemented in parallel with drag-and-drop ranking once unranked items exist.

## Acceptance criteria

- [ ] + Tier adds D, then E, then F in order with correct system colors
- [ ] + Tier is disabled when F is present (cannot exceed seven tiers)
- [ ] S, A, B, C rows never show a remove control
- [ ] − appears on D/E/F only when that tier's placement list is empty
- [ ] − removes the tier row and updates state without affecting other tiers
- [ ] − is not available when the tier contains one or more items
- [ ] Newly added tiers participate in drag-and-drop as drop targets (verify once 003 is merged, or stub-verify drop zone renders)
- [ ] Manual smoke test: add D and E, remove empty E, confirm cannot remove D while it has items

## Blocked by

- `002-title-and-items.md`
