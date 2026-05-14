# Deepening Candidates Report + Selection Handoff

This report turns exploration evidence into a short list of deepening opportunities. Each candidate is framed as Module friction, a deepening move, and expected leverage/locality/test-surface gains.

## Candidates

1. **Deepen the tier-list feature Module seam**
   - **Files**: `src/App.tsx`, `src/tier-list/state.ts`, `src/tier-list/dragCoordinator.tsx` (plus one new feature Module file under `src/tier-list/`).
   - **Problem**: `App.tsx` currently owns both shell responsibilities and tier-list feature Implementation details, so the Interface at this seam is wide. Feature changes require editing the shell Module, which weakens locality.
   - **Solution**: Move tier-list feature ownership behind one dedicated Module seam and keep `App.tsx` as a thin shell caller.
   - **Benefits**:
     - **Locality**: tier-list changes cluster in one Module instead of spreading through shell code.
     - **Leverage**: callers interact with a smaller Interface while feature behavior remains rich behind the seam.
     - **Test surface**: feature behavior can be exercised through a focused Module interface instead of broad app-level rendering paths.

2. **Deepen move-intent handling between drag Adapter and state Module**
   - **Files**: `src/tier-list/dragCoordinator.tsx`, `src/tier-list/state.ts`.
   - **Problem**: drag behavior depends directly on low-level container details (`findItemContainer`, `getContainerItemIds`), so seam changes can leak across both Modules. This coupling increases friction when reorder rules evolve.
   - **Solution**: Introduce a clearer seam where drag interactions produce move intent in one place, and state application stays behind the state Module Interface.
   - **Benefits**:
     - **Locality**: drag-specific rules and state-application rules stop co-evolving in multiple files.
     - **Leverage**: a stable move-intent seam supports future interaction changes without editing each caller path.
     - **Test surface**: drag-to-action mapping and reducer behavior can be tested separately, reducing cross-module test setup.

3. **Deepen reducer dependency seams for deterministic behavior tests**
   - **Files**: `src/tier-list/state.ts`.
   - **Problem**: the reducer currently reaches global behavior (for example, ID generation), which makes some transitions less deterministic under direct Module tests and keeps test leverage lower than it could be.
   - **Solution**: route external side-effect details through a seam so reducer behavior is deterministic from the caller perspective.
   - **Benefits**:
     - **Locality**: behavior rules remain concentrated in the reducer Module while environment-specific details sit behind an adapter seam.
     - **Leverage**: callers use the same action Interface while internal behavior becomes easier to reason about.
     - **Test surface**: state transitions become straightforward to assert with stable inputs/outputs.

4. **Deepen test harness ownership around the tier-list Module interface**
   - **Files**: `tests/example.spec.ts`, `playwright.config.ts`, `src/tier-list/state.ts` (and new test files under `tests/` or `src/tier-list/`).
   - **Problem**: current tests are not aligned with the product Module interface, and the active harness does not verify tier-list behavior paths. Regressions can slip because the richest behavior seam is untested.
   - **Solution**: realign tests so they target the tier-list Module interface directly, with a lightweight end-to-end path and focused Module-level behavior tests.
   - **Benefits**:
     - **Locality**: failures point to the Module seam that owns the behavior instead of broad unrelated surfaces.
     - **Leverage**: one test harness investment protects many behavior paths.
     - **Test surface**: better coverage of reducer transitions and key UI interaction flows through stable seams.

## Selection checkpoint

Which candidate should we explore next for deeper design work?

- Candidate 1: Deepen the tier-list feature Module seam.
- Candidate 2: Deepen move-intent handling between drag Adapter and state Module.
- Candidate 3: Deepen reducer dependency seams for deterministic behavior tests.
- Candidate 4: Deepen test harness ownership around the tier-list Module interface.

## Selection result (this run)

- Selected candidate: **Candidate 1 — Deepen the tier-list feature Module seam**.
- Handoff target: proceed to the structured grilling loop for candidate 1.
