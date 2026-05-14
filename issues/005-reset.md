---
title: Reset with confirmation
type: AFK
triage: ready-for-agent
blocked_by:
  - 002-title-and-items.md
parent: prd/tier-list-maker-v1.md
---

## Parent

`prd/tier-list-maker-v1.md`

## What to build

Add a Reset control to the header. Clicking Reset opens a confirmation dialog (native `window.confirm` or an in-app modal) warning that the action cannot be undone in the current session. On confirm, dispatch `RESET` to restore initial state: title **Untitled tier list**, tiers **S–C** only (any D/E/F rows removed), all items cleared, progress back to **0 of 0 ranked** / **0%**.

Cancel leaves state unchanged. No persistence layer is involved.

Ideally verified after drag-and-drop and tier management are in place, but the reducer action and UI can be built as soon as items can be added.

## Acceptance criteria

- [ ] Reset button is visible in the header toolbar
- [ ] Reset requires explicit confirmation before clearing state
- [ ] Confirmation copy states the reset cannot be undone in-session
- [ ] Cancel preserves title, tiers, items, and placements unchanged
- [ ] Confirm restores default title, tiers S–C only, no items, empty unranked, 0 of 0 progress
- [ ] Confirm removes any added D/E/F tiers
- [ ] After reset, user can add items and rank again from a clean slate
- [ ] No localStorage or other persistence is read or written

## Blocked by

- `002-title-and-items.md`
