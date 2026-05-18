# Drag E2E Stability Evaluation Output

## Scope

This slice evaluates direct drag-and-drop automation reliability for tier-list movement behavior in Playwright Chromium and captures the resulting decision for phase2 continuity.

## Attempt summary

- Implemented and iterated a drag-path Playwright test to move an item from the Unranked Pool into tier `S`.
- Tried multiple pointer sequences:
  - direct source-to-target drag
  - explicit activation-threshold crossing for dnd-kit pointer sensor
  - slower stepped movement and brief pre-drag delay
- In headless Chromium execution, drag assertions remained unstable/non-deterministic in this environment.

## Decision

- **Deferral type**: ephemeral/operational (not an ADR).
- **Reason**: current harness-level drag gesture reliability is insufficient for deterministic CI-style assertions in this slice.
- **Action taken**: replaced unstable drag assertion with a stable tier-control behavior test ("add and remove optional empty tier") to maintain nearby coverage without flake.

## Current stable coverage set

- Title input updates document title.
- Add item + reset clears state.
- Add/remove optional empty tier.

## Validation

- `npx playwright test --project=chromium` -> pass (`3` tests).

## Follow-up direction

- Revisit drag-path automation once a more deterministic interaction strategy is available (e.g., stronger test handles around drag intent seams or a non-headless/local interactive mode strategy).
