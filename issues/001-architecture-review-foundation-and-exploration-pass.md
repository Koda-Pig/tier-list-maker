---
title: Architecture review foundation + exploration pass
type: AFK
triage: ready-for-agent
blocked_by: []
parent: /Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md
---

## Parent

`/Users/joshkoter/.agents/skills/improve-codebase-architecture/SKILL.md`

## What to build

Create the first end-to-end architecture deepening pass that establishes shared language and then explores the codebase organically to capture concrete friction. The slice should produce a reusable review baseline grounded in module/interface/depth/seam/adapter/locality/leverage terms and apply the deletion test to suspected shallow modules so later work starts from evidence instead of intuition.

## Acceptance criteria

- [ ] The review process explicitly uses the architecture glossary terms and avoids drift in terminology.
- [ ] Exploration output captures concrete friction points, including at least shallow-module signals, seam leaks, and test-surface pain.
- [ ] Deletion-test analysis is documented for suspected shallow modules, with clear rationale for why each module does or does not earn its keep.

## Blocked by

None - can start immediately
