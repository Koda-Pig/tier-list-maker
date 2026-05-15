# Reducer ID Seam + Unit-Test Harness Output

## Scope

This slice executes the deferred deepening work around deterministic reducer behavior and a direct reducer test surface, while preserving runtime behavior in the app shell and feature module.

## Implementation summary

1. **Reducer dependency seam**
   - Updated `src/tier-list/state.ts` to expose:
     - `TierListReducerDeps`
     - `createTierListReducer(deps?)`
     - `tierListReducer` as the default runtime reducer built from `createTierListReducer()`.
   - `ADD_ITEM` now uses injected `createItemId` when provided, defaulting to `crypto.randomUUID()` in normal app execution.

2. **Unit-test harness**
   - Added `vitest` as a dev dependency.
   - Added `test:unit` script in `package.json`:
     - `vitest run src`
   - Added reducer tests in `src/tier-list/state.test.ts`:
     - deterministic ID generation via dependency seam
     - move action behavior from unranked pool into a tier placement

3. **Behavior parity checks**
   - Kept existing runtime wiring unchanged by continuing to export and use default `tierListReducer`.
   - Existing Playwright Chromium smoke suite remains green.

## Validation results

- `pnpm test:unit` -> pass (`2` tests).
- `npx playwright test --project=chromium` -> pass (`3` tests).
- Lint diagnostics for changed files -> no new lint errors.

## Leverage and locality impact

- **Leverage**: callers keep the same reducer interface while tests can now control nondeterministic ID behavior through a narrow seam.
- **Locality**: reducer behavior checks now live close to the reducer module, reducing dependence on slower broad-surface testing for core state transitions.
- **Test surface**: unit tests now directly target the tier-list state module interface, complementing existing end-to-end smoke tests.
