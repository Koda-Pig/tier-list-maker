# Selected Candidate Grilling Loop + Context Updates

## Selected candidate

Candidate 1 was selected: deepen the tier-list feature Module seam by extracting feature ownership from `App.tsx` into a dedicated `TierListFeature` Module.

## Structured grilling loop

### 1) Constraints branch

- The existing user-visible behavior must stay stable during the seam move (add/remove tiers, add/remove items, drag reorder, reset, title editing, progress display, dark-mode toggle).
- The first pass should maximize locality without redesigning interaction rules; this is a seam deepening pass, not a product behavior change.
- Existing state invariants in `tierListReducer` remain the source of truth:
  - placements only contain known item IDs
  - unranked and placements do not duplicate a single item ID at the same time
  - tier add/remove rules remain unchanged
- Accessibility and keyboard/mouse/touch drag affordances from the current UI must survive extraction.

### 2) Dependencies branch

- `TierListFeature` depends on:
  - `src/tier-list/state.ts` for reducer, actions, constants, and invariants.
  - `src/tier-list/dragCoordinator.tsx` for drag Adapter behavior and move-action generation.
- `App.tsx` should no longer depend directly on reducer/drag internals after extraction; it should depend on the feature Module Interface.
- Theme persistence and document-level concerns (`localStorage`, `document.title`, color-scheme listeners) stay in the app shell unless later explicitly migrated.

### 3) Seam-shape branch

- **Deepened Module**: `TierListFeature`.
- **Caller-facing Interface (initial shape)**:
  - Render contract: one feature root component exposed to the shell.
  - Optional props only for shell-level integration points, not for state mutation internals.
- **Implementation behind seam**:
  - reducer state ownership (`useReducer(tierListReducer, initialTierListState)`)
  - feature header controls (title input, add item, add tier, reset)
  - ranking progress display
  - tier rows and unranked pool rendering
  - drag context overlay wiring and dispatch-to-action coordination

This keeps the caller Interface narrow while preserving rich behavior depth behind the seam.

### 4) What stays behind the seam

- Item placement mechanics (`MOVE_ITEM`, `UNRANK_ITEM`, container lookup/index clamping).
- Drag collision and same-container fallback heuristics.
- Tier-row/unranked rendering and pill tone logic.
- Feature-scoped input normalization (title/item sanitization use sites) and local form state.

### 5) Test survivability branch

The following tests should survive this refactor unchanged in intent:

- Reducer behavior tests for `tierListReducer` action transitions and invariants (module-level seam remains stable).
- Drag Adapter mapping tests around move-intent generation and destination index handling (adapter seam remains stable).
- Lightweight app-shell render smoke tests (app still renders feature root and shell-level concerns).
- End-to-end interaction checks for add/remove/move/reset flows (behavioral contract unchanged).

Tests likely to need path-level updates only:

- Any UI tests that mount internals via `App.tsx` selectors instead of a feature-root handle.

## Branch resolutions

- Proceed with extraction under a behavior-parity constraint.
- Keep a narrow `TierListFeature` caller Interface for this pass.
- Keep drag and reducer internals behind the seam.
- Preserve test focus on Interface behavior rather than old file ownership.

## Context documentation updates

Domain terminology was tightened and recorded in `CONTEXT.md` so future deepening reviews reuse the same vocabulary:

- **Tier List** as the canonical domain artifact.
- **Tier** as an ordered ranking bucket within a Tier List.
- **Unranked Pool** as the staging area for not-yet-ranked items.
- **Placement** as the assignment of an item to a tier position.
- **Tier List Item** as the rankable entity.

## Handoff

This grilling loop resolves the core design branches for candidate 1 and leaves implementation ready for extraction work, with terminology updates captured for reuse.

## HITL confirmation (this run)

- Candidate confirmation: **Candidate 1** remains the selected deepening target.
- No additional constraint or dependency changes were introduced during this confirmation pass.
