---
title: Drag E2E stability evaluation and deferral capture
type: AFK
triage: ready-for-agent
blocked_by:
  - 007-tighten-tier-list-feature-interface-to-alternative-a.md
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Evaluate whether drag-and-drop behavior can be covered with deterministic Playwright automation in the current environment and explicitly capture deferral status when it cannot be made stable without substantial harness changes.

## Acceptance criteria

- [x] Attempted drag-path Playwright coverage is recorded with outcomes.
- [x] A clear reason is documented for deferring unstable drag automation in this slice.
- [x] Stable replacement coverage remains in place to protect nearby behavior.

## Output

- `issues/phase2/008-drag-e2e-stability-evaluation-output.md`

## Blocked by

- `007-tighten-tier-list-feature-interface-to-alternative-a.md`
