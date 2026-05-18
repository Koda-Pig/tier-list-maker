---
title: Move-intent seam between drag adapter and state module
type: AFK
triage: ready-for-agent
blocked_by:
  - 005-reducer-id-seam-and-unit-test-harness.md
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Execute the deferred drag/state coupling deepening move by introducing a clearer seam between drag intent generation and state shape helpers. Keep drag behavior parity while reducing hard-coded dependence of the drag adapter on concrete state helper imports.

## Acceptance criteria

- [x] `TierListDragContext` depends on explicit resolver callbacks for item-container lookup and destination item IDs, instead of directly importing those helpers.
- [x] Feature wiring provides state-owned resolvers to the drag adapter, preserving behavior.
- [x] Unit tests and Chromium Playwright smoke tests remain green after seam refactor.

## Output

- `issues/phase2/006-move-intent-seam-between-drag-and-state-output.md`

## Blocked by

- `005-reducer-id-seam-and-unit-test-harness.md`
