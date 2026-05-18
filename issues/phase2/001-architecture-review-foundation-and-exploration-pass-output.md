# Architecture Review Foundation + Exploration Pass

## Scope

This pass establishes shared architecture language, records concrete friction in the current codebase, and applies the deletion test to suspected shallow modules.

## Review process baseline (reusable)

Use these terms consistently in every architecture review note:

- **Module**: any unit with an Interface and an Implementation.
- **Interface**: everything callers must know to use a Module correctly.
- **Implementation**: code behind the Interface.
- **Depth**: leverage at the Interface (deep = high leverage, shallow = low leverage).
- **Seam**: where an Interface lives.
- **Adapter**: concrete thing satisfying an Interface at a Seam.
- **Leverage**: what callers gain from Depth.
- **Locality**: what maintainers gain from Depth.

Required checks for each suspected friction point:

1. Name the **Module** and files.
2. Describe the **Interface** vs **Implementation** mismatch.
3. Label the **Depth** signal (deep or shallow).
4. Identify the active **Seam** and any **Adapter** role.
5. Record expected **Leverage** and **Locality** impact.
6. Run the **deletion test**.

## Exploration findings

### 1) Shallow-module signals

1. **Module**: `src/lib/utils.ts` (`cn`)
   - **Signal**: thin Interface over thin Implementation.
   - **Depth**: shallow.
   - **Why it matters**: low leverage by itself; value is mostly as a shared Adapter to class-merging behavior.

2. **Module**: `src/App.tsx`
   - **Signal**: very wide Interface at one location (theme, shell, title, progress, drag rendering, tier-row rendering, unranked rendering).
   - **Depth**: mixed; domain behavior is delegated, but Interface exposure and ownership are broad.
   - **Why it matters**: weak locality because unrelated change streams concentrate in one Module.

### 2) Seam leaks

1. **Seam** between `src/App.tsx` and feature logic is wide:
   - `App.tsx` directly coordinates `state.ts` and `dragCoordinator.tsx` with many feature-specific rendering details inline.
   - Result: low locality for feature-only changes, because the shell Module must be edited for feature-level behavior shifts.

2. **Seam** between drag Adapter and state Interface:
   - `src/tier-list/dragCoordinator.tsx` relies on `findItemContainer` and `getContainerItemIds` from `src/tier-list/state.ts`.
   - Result: valid coupling for current shape, but schema evolution in container identity can leak across both Modules at once.

### 3) Test-surface pain

1. `tests/example.spec.ts` targets Playwright documentation, not this product Module.
   - **Pain**: no leverage for product regressions.

2. `playwright.config.ts` has no active local test-server setup.
   - **Pain**: Interface-level end-to-end verification is not wired to the app.

3. No unit-test runner is configured for `src/tier-list/state.ts` or drag Adapter logic.
   - **Pain**: the richest Interface for behavior (`tierListReducer` + actions) has no direct test surface.

## Deletion-test analysis

### Suspected shallow Module: `src/lib/utils.ts`

- **Delete and inline outcome**: complexity mostly reappears at each caller (`button` and `alert-dialog` Modules) as repeated class-merging calls.
- **Decision**: Module earns its keep as a shared Adapter, even though Depth is shallow.
- **Rationale**: deletion reduces locality and modestly reduces leverage.

### Suspected shallow Module: `src/components/ui/button.tsx`

- **Delete and inline outcome**: class-variance wiring and slot behavior reappear across every callsite.
- **Decision**: Module earns its keep as a UI Adapter Module.
- **Rationale**: shallow domain Depth, but strong leverage/locality for repeated UI behavior.

### Suspected shallow Module: `src/components/ui/alert-dialog.tsx`

- **Delete and inline outcome**: dialog wiring, slot attributes, and style handling spread across callsites.
- **Decision**: Module earns its keep as a UI Adapter Module.
- **Rationale**: centralizes integration behavior and preserves locality.

### Oversized Module candidate (not shallow but low-locality): `src/App.tsx`

- **Delete and inline outcome**: not meaningful; behavior must exist somewhere.
- **Refined deletion test**: delete feature rendering ownership from `App.tsx` and move it behind one feature Module Interface.
- **Result**: complexity concentrates and seam becomes clearer.
- **Decision**: keep shell responsibilities in `App.tsx`, move tier-list feature behavior behind a tighter seam in a dedicated Module.

## Handoff notes for next slice

- This pass intentionally stops before proposing new Interfaces.
- Next step is a numbered deepening-candidate list with files, problem, solution, and leverage/locality/test-surface benefits.
