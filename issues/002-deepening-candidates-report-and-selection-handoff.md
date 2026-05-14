---
title: Deepening candidates report + user selection handoff
type: AFK
triage: ready-for-agent
blocked_by:
  - 001-architecture-review-foundation-and-exploration-pass.md
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Convert exploration findings into a numbered set of deepening opportunities that are easy to compare and choose from. Each candidate should describe the friction, the deepening move, and the expected leverage/locality/testability outcomes in plain language. End this slice with an explicit "which candidate should we explore?" handoff and no interface design yet.

## Acceptance criteria

- [ ] A numbered candidate list is produced, with each entry covering files involved, problem, solution, and benefits.
- [ ] Benefits are framed in locality, leverage, and test-surface improvements rather than implementation detail.
- [ ] The slice ends with an explicit user-choice checkpoint that selects one candidate for deeper design work.

## Blocked by

- `001-architecture-review-foundation-and-exploration-pass.md`
