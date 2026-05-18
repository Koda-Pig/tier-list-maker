# Decision Capture Branches (ADR + Interface Alternatives)

This slice captures the two post-grilling branches for the selected deepening candidate ("extract Tier List feature ownership behind a dedicated Module seam").

## Branch 1: ADR capture for durable rejected moves

### Durable decision captured

- **Rejected deepening move**: pull shell-level concerns (theme persistence, document title side effects, and page chrome wiring) into `TierListFeature`.
- **Why rejected**: this would weaken Module ownership by mixing app-shell responsibilities into Tier List feature Implementation, reducing Locality and making the seam less clear.
- **Durability test**:
  - **Hard to reverse**: medium/high, because it changes feature/shell ownership shape.
  - **Surprising without context**: yes; a future reviewer may otherwise re-suggest "move all side effects into the feature."
  - **Real trade-off**: yes; deeper feature ownership vs clear shell/feature separation.
- **Recorded ADR**: `docs/adr/0001-keep-shell-concerns-outside-tier-list-feature.md`.

### Ephemeral deferrals (explicitly not ADRs)

- Candidate 2 (move-intent seam deepening), candidate 3 (reducer dependency seam), and candidate 4 (test harness deepening) are deferred by scope, not rejected on architecture grounds.
- These are time/sequence deferrals and should remain in issue backlog notes, not in ADRs.

This distinguishes durable architectural no-s from "not now" decisions so future reviews do not treat both as equivalent.

## Branch 2: Optional interface-alternatives comparison

### Problem space framing

Any `TierListFeature` Interface for this deepening pass must satisfy:

- Preserve behavior parity for Tier List interactions and Placement rules.
- Keep `tierListReducer` (`src/tier-list/state.ts`) and drag Adapter behavior (`src/tier-list/dragCoordinator.tsx`) behind the feature seam.
- Keep shell concerns (theme persistence, document-level effects) in `App.tsx`.
- Improve caller Leverage while increasing Locality for Tier List changes.

### Alternative A: Minimal interface (1-3 entry points)

- One feature root component with optional `onChange` and `onError`.
- Feature owns reducer state and all Tier List mutations internally.
- Highest immediate Leverage for shell simplicity; lowest Interface surface area.

### Alternative B: Flexible/headless interface

- Controlled/uncontrolled modes, command API, extension hooks, optional state/drag Adapters.
- Maximizes adaptability for future embedding and advanced custom rendering.
- Highest flexibility but broadest Interface surface and testing burden.

### Alternative C: Common-caller optimized interface

- Single component with ergonomic optional callbacks (`onSnapshotChange`, `onTitleChange`) and light composition slots.
- Balances default simplicity with a few integration hooks.
- Lower complexity than headless design while still supporting shell-level integration.

### Comparison outcome

- **Depth**:
  - A and C are deeper immediately for current needs because they hide more Implementation behind a narrow seam.
  - B can become deep, but only with disciplined contract enforcement; otherwise it risks a shallow "everything is configurable" Interface.
- **Locality**:
  - A and C strongly concentrate Tier List behavior in one Module.
  - B introduces more cross-module movement due to adapters/hooks.
- **Seam placement**:
  - All options keep the main seam at `App.tsx` -> `TierListFeature`.
  - B adds additional seams that are useful later but premature for this extraction pass.

### Recommendation

Proceed with **Alternative A** as the current decision for this pass:

- Implement `TierListFeature` as the single public Module entry point.
- Keep the caller-facing Interface minimal (feature root with only narrowly-scoped optional integration hooks).
- Keep state and drag dependencies as internal Adapters.
- Defer headless/command Interface (Alternative B) and broader callback shape until a concrete caller requires them.

This maximizes immediate leverage and locality for the extraction pass by keeping the seam as small and durable as possible.

## Decision record (this run)

- ADR branch decision: keep `docs/adr/0001-keep-shell-concerns-outside-tier-list-feature.md` as-is for the durable rejected move.
- Interface branch decision: choose **Alternative A** as the default interface direction for implementation.
