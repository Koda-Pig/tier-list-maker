---
title: Decision capture branches (ADR + interface alternatives)
type: HITL
triage: needs-human
blocked_by:
  - 003-selected-candidate-grilling-loop-and-context-updates.md
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Add the two post-grilling decision branches: (1) record or reopen ADRs when a rejected deepening move has load-bearing rationale that future reviewers must preserve, and (2) support optional comparison of alternative interfaces for the deepened module when the current shape still has unresolved trade-offs. This slice ensures architecture outcomes are durable and discoverable, not trapped in chat history.

## Acceptance criteria

- [ ] Rejected candidates with durable, load-bearing rationale can be captured as ADR decisions when appropriate.
- [ ] A clear path exists to explore and compare interface alternatives when additional design pressure-testing is needed.
- [ ] The output distinguishes ephemeral deferrals from durable architectural decisions so future reviews avoid repeating dead ends.

## Blocked by

- `003-selected-candidate-grilling-loop-and-context-updates.md`
