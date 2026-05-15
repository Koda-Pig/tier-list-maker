---
title: Reducer ID seam + unit-test harness deepening
type: AFK
triage: ready-for-agent
blocked_by:
  - 004-decision-capture-branches-adr-and-interface-alternatives.md
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Implement the deferred deterministic-reducer and test-harness deepening moves by introducing an explicit dependency seam for item-ID generation in the reducer module and adding fast unit tests against the reducer interface. Keep behavior parity for the application while improving test leverage and locality.

## Acceptance criteria

- [x] `src/tier-list/state.ts` exposes a reducer-construction seam that allows deterministic ID generation in tests while preserving default runtime behavior.
- [x] Unit tests are added against the reducer interface and run locally through a dedicated script.
- [x] Existing behavior checks remain green (Playwright Chromium smoke suite).

## Output

- `issues/phase2/005-reducer-id-seam-and-unit-test-harness-output.md`

## Blocked by

- `004-decision-capture-branches-adr-and-interface-alternatives.md`
