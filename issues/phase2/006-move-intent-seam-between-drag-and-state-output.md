# Move-Intent Seam Between Drag and State Output

## Scope

This slice executes the deferred drag/state coupling deepening candidate by tightening the seam between drag intent mapping and state helper ownership, while preserving user-visible interaction behavior.

## Implementation summary

1. **Drag adapter seam tightening**
   - Updated `src/tier-list/dragCoordinator.tsx` so `TierListDragContext` receives resolver callbacks:
     - `resolveItemContainer(state, itemId)`
     - `resolveContainerItemIds(state, containerId)`
   - Removed direct imports of `findItemContainer` and `getContainerItemIds` from the drag adapter.
   - Internal move-action mapping now depends on the injected resolver interface.

2. **Feature-level adapter wiring**
   - Updated `src/tier-list/TierListFeature.tsx` to provide the state-owned resolvers:
     - `resolveItemContainer={findItemContainer}`
     - `resolveContainerItemIds={getContainerItemIds}`

This keeps state shape knowledge owned by the state module while drag logic remains focused on interaction-to-intent mapping.

## Validation results

- `pnpm test:unit` -> pass (`2` tests).
- `npx playwright test --project=chromium` -> pass (`3` tests).
- Lint diagnostics for changed files -> no new lint errors.

## Leverage and locality impact

- **Leverage**: drag adapter now works against a smaller interface and can be evolved with less dependence on concrete state helper imports.
- **Locality**: state-container resolution remains concentrated in the state module, while drag intent mapping stays in the drag adapter.
- **Seam quality**: this turns a direct helper import coupling into an explicit adapter seam that is easier to evolve and test independently.
