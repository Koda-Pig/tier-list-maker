# Tighten TierListFeature Interface to Alternative A Output

## Scope

This slice applies the Alternative A interface decision by removing non-essential feature callback surface and keeping only the minimal shell integration needed by current behavior.

## Implementation summary

- Updated `src/tier-list/TierListFeature.tsx`:
  - Removed optional `onSnapshotChange` from `TierListFeatureProps`.
  - Removed associated effect hook.
  - Kept `onTitleChange` as the sole shell integration callback.
- `src/App.tsx` integration remains unchanged and continues to consume title updates for document-level ownership.

## Validation results

- `pnpm test:unit` -> pass (`2` tests).
- `npx playwright test --project=chromium` -> pass (`3` tests).
- Lint diagnostics for changed files -> no new lint errors.

## Leverage and locality impact

- **Leverage**: shell callers use a smaller, clearer feature interface.
- **Locality**: feature internals remain encapsulated behind a tighter seam, reducing pressure for shell-feature coupling drift.
- **Decision alignment**: implementation now more closely matches the recorded Alternative A direction in phase2 decision capture.
