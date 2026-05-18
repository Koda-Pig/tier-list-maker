---
title: Tighten TierListFeature interface to Alternative A
type: AFK
triage: ready-for-agent
blocked_by:
  - 006-move-intent-seam-between-drag-and-state.md
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Align implementation with the recorded Alternative A decision by minimizing the `TierListFeature` public interface to only what the shell currently needs. Remove non-essential callback surface that is not required for current shell integration.

## Acceptance criteria

- [x] `TierListFeature` public props are reduced to the minimal shell integration shape used by current callers.
- [x] `App.tsx` integration remains behaviorally unchanged.
- [x] Unit tests and Chromium Playwright smoke tests remain green.

## Output

- `issues/phase2/007-tighten-tier-list-feature-interface-to-alternative-a-output.md`

## Blocked by

- `006-move-intent-seam-between-drag-and-state.md`
