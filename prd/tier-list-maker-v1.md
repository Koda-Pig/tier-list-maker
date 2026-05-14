---
title: Tier List Maker v1
triage: ready-for-agent
---

## Problem Statement

People want a quick, friction-free way to rank a set of items into ordered tiers (S through F) without signing up, saving to a server, or learning a complex tool. Existing tier list sites are often cluttered, require accounts, or bury the core drag-and-rank workflow under extra features. The user needs a personal, single-session tier ranking experience that matches a polished dark-theme design: add items, drag them into tiers, track progress, and reset when starting over.

## Solution

A client-only tier list web app built on the existing Vite + React + TypeScript scaffold. On each visit the user gets a blank slate with a default title, four starting tiers (S, A, B, C), and an unranked pool. They add text items, drag them into tiers (with meaningful order within each tier), optionally extend the list to D, E, and F, and see live ranking progress. No data survives a tab close. The UI follows the provided mock: dark theme, colored tier labels, pill-shaped items, header controls, progress bar, and unranked staging area.

## User Stories

1. As a user, I want to open the app and immediately see an empty tier list with default tiers S, A, B, and C, so that I can start ranking without setup or onboarding.
2. As a user, I want the default title to read "Untitled tier list", so that I have a sensible placeholder before I name my list.
3. As a user, I want to edit the list title inline, so that I can label what I am ranking (e.g. "styling approaches").
4. As a user, I want the title to enforce a maximum length, so that long names do not break the header layout on desktop or mobile.
5. As a user, I want to type an item name and click Add, so that I can build the set of things to rank.
6. As a user, I want to press Enter in the add-item field to add an item, so that I can add items quickly without reaching for the mouse.
7. As a user, I want empty or whitespace-only item names to be ignored, so that I do not accidentally create blank pills.
8. As a user, I want item names to be limited to a single line and a maximum character count, so that pills stay readable inside tier rows.
9. As a user, I want to add multiple items with the same display name, so that I can rank legitimately duplicate labels (e.g. two "Season 1" entries) without the app blocking me.
10. As a user, I want each item to exist as a distinct entity internally, so that duplicate labels do not collide when dragging or removing.
11. As a user, I want newly added items to appear in the unranked area, so that I have a staging ground before I place them in tiers.
12. As a user, I want the unranked area to show a label like "UNRANKED — DRAG INTO TIERS ABOVE", so that I understand what the section is for.
13. As a user, I want the unranked area to show how many items are in it, so that I can see at a glance what still needs ranking.
14. As a user, I want to drag an item from unranked into a tier, so that I can rank it.
15. As a user, I want to drag an item from one tier to another, so that I can change my mind about placement.
16. As a user, I want to drag an item from a tier back to unranked, so that I can un-rank without deleting it.
17. As a user, I want to reorder items within a tier by dragging left or right, so that order within a tier reflects my preference.
18. As a user, I want ranked item pills to use the color of their tier, so that the list is visually scannable.
19. As a user, I want unranked item pills to use a neutral dark style, so that unranked items are visually distinct from ranked ones.
20. As a user, I want each item pill to show an × control, so that I can remove or un-rank items without dragging.
21. As a user, I want clicking × on an item in a tier to send it back to unranked, so that I can undo a ranking non-destructively.
22. As a user, I want clicking × on an item in unranked to delete it from the list entirely, so that I can remove items I no longer want to rank.
23. As a user, I want each tier row to show a colored label with its letter (S, A, B, etc.), so that tiers are identifiable without relying on color alone.
24. As a user, I want tier rows to have a drop zone beside the label, so that I have a clear target when dragging items.
25. As a user, I want to click a + Tier control to add another tier row, so that I can expand beyond the default four tiers when needed.
26. As a user, I want new tiers to be added in order as D, then E, then F, so that the tier sequence stays conventional.
27. As a user, I want the + Tier control disabled when F is already present, so that I cannot exceed seven tiers.
28. As a user, I want system-assigned labels and colors for every tier, so that I do not have to configure tiers manually in v1.
29. As a user, I want a − control on added tiers D, E, and F when they are empty, so that I can remove tiers I no longer need.
30. As a user, I want S, A, B, and C to never be removable, so that the core tier structure always remains.
31. As a user, I want the − control hidden or unavailable when a removable tier contains items, so that I am not surprised by losing placements.
32. As a user, I want a progress indicator showing how many items are ranked out of the total, so that I know how much ranking is left.
33. As a user, I want a percentage next to the progress text, so that I can see completion at a glance.
34. As a user, I want a visual progress bar that fills as items are ranked, so that progress is easy to scan.
35. As a user, I want an item to count as ranked only when it is placed in a tier (not unranked), so that the progress bar reflects actual ranking work.
36. As a user, I want the progress display to update immediately when I move or remove items, so that the UI always reflects the current state.
37. As a user, I want to see "0 of 0 ranked" when there are no items, so that the empty state is consistent rather than hidden.
38. As a user, I want a Reset control, so that I can start a new list in the same session.
39. As a user, I want Reset to ask for confirmation before clearing, so that I do not lose work from a misclick.
40. As a user, I want Reset to restore the default title, tiers S through C only, and remove all items, so that I get a true fresh slate.
41. As a user, I want the app to work without logging in or creating an account, so that I can use it immediately.
42. As a user, I want the app to run entirely in the browser with no backend, so that it is fast and private.
43. As a user, I want closing the tab to discard my list, so that nothing is stored without my choosing a future save feature.
44. As a user, I want the layout to work on smaller screens, so that I can use the app on a tablet or phone.
45. As a user, I want drag-and-drop to work with touch input, so that I can rank on a touchscreen device.
46. As a user, I want buttons and inputs to be keyboard-focusable with visible focus styles, so that basic navigation is usable without a mouse.
47. As a user, I want actionable controls to have accessible labels, so that assistive technology can identify buttons like Add, Reset, and remove.
48. As a user, I want the UI to use a dark theme consistent with the design mock, so that the app feels polished and modern.
49. As a user, I want rounded pills, tier rows, and inputs, so that the visual design matches the intended mock.
50. As a user, I want the header to group the title, add-item field, tier controls, and reset action, so that all list management is in one place.

## Implementation Decisions

### Codebase starting point

The repository is a fresh Vite + React 19 + TypeScript application with the default template still in place. Implementation replaces the template with the tier list UI and adds Tailwind CSS and `@dnd-kit` as dependencies.

### Major modules

The implementation should favor **deep modules** with narrow, stable interfaces:

| Module | Responsibility | Why deep |
|--------|----------------|----------|
| **Tier list reducer** | Owns all list state and transitions (add/remove item, move item, add/remove tier, set title, reset). Exposes a single `reduce(state, action)` entry point. | Encapsulates the most complex logic; UI stays thin; future persistence or export can hook the same state shape. |
| **Tier list state model** | Defines items, tiers, placements, and initial/reset state. Includes tier color palette and label sequence (S→F). | Central schema for the domain; prevents ad hoc state spread across components. |
| **Drag-and-drop coordinator** | Wraps `@dnd-kit` configuration: container ids, sortable contexts, pointer/touch sensors, and translation of drag end events into reducer `MOVE_ITEM` actions. | Isolates library-specific drag logic from presentation components. |
| **Presentation shell** | Header, progress bar, tier list, unranked section — mostly render props/state slices and dispatch callbacks. | Shallow by design; easy to restyle without touching rules. |

### State shape

```ts
type Item = { id: string; label: string }

type Tier = {
  id: string
  label: string   // "S" | "A" | ... | "F"
  color: string   // from preset palette
}

type TierListState = {
  title: string
  tiers: Tier[]
  items: Record<string, Item>           // id → item
  unranked: string[]                    // ordered item ids
  placements: Record<string, string[]>  // tierId → ordered item ids
}
```

New items receive a unique id via `crypto.randomUUID()` at creation time (not `useId`, which is per component instance).

### Reducer actions

- `SET_TITLE` — clamp to max length (~60 characters)
- `ADD_ITEM` — trim, reject empty, clamp label (~50 characters), append to `unranked`
- `REMOVE_ITEM` — delete from `items` and whichever container holds it
- `UNRANK_ITEM` — move from a tier back to `unranked` (used by × in tier)
- `MOVE_ITEM` — handle same-container reorder and cross-container moves (from dnd-kit active/over ids and index)
- `ADD_TIER` — append next label D→E→F if under cap; no-op at F
- `REMOVE_TIER` — only for D/E/F when that tier's placement list is empty
- `RESET` — restore initial state (title, four tiers, no items)

### Tier rules

- Initial tiers: **S, A, B, C** (four rows).
- **+ Tier** adds **D**, then **E**, then **F**; disabled at seven tiers.
- **S–C** are permanent; **D/E/F** may be removed only when empty via a **−** on the tier label.
- Tier labels and colors are system-assigned from a fixed palette matching the design mock (S red-orange through F teal/cyan).

### Drag-and-drop

- Library: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- One `DndContext` spans unranked and all tier drop zones.
- Reordering within a tier is supported; unranked order is maintained but not semantically important.
- Touch sensors enabled for mobile/tablet use.

### Styling

- **Tailwind CSS** via the Vite plugin.
- Dark background, rounded containers, tier-colored pills when ranked, neutral pills when unranked.
- Responsive header: controls reflow on narrow viewports.

### UI component breakdown

- **App** — hosts reducer, dnd context, layout.
- **Header** — title input, add-item form (input + Add button), + Tier, Reset.
- **ProgressBar** — ranked count, total, percentage, bar fill.
- **TierList / TierRow** — label (with optional −), droppable/sortable item list.
- **UnrankedSection** — header copy, count, dashed drop zone, sortable pills.
- **ItemPill** — label, × button, sortable drag handle (whole pill draggable).

### Validation and limits

| Field | Rule |
|-------|------|
| Title | Default "Untitled tier list"; max ~60 characters |
| Item label | Single line; trim; max ~50 characters; duplicates allowed |
| Tiers | Min 4 (S–C); max 7 (through F) |

### Accessibility (v1 baseline)

- Drag-only ranking (no keyboard tier moves in v1).
- Focusable controls, visible focus rings, `aria-label` on icon buttons.
- Tier identity conveyed by letter label, not color alone.

### Build sequence (recommended)

1. Tailwind setup; remove Vite template; shell layout and dark theme.
2. Reducer + initial state; title, add item, progress bar (no drag yet).
3. Tier rows and unranked rendering; × remove/unrank behavior.
4. `@dnd-kit` integration for cross-container and within-tier moves.
5. + Tier / − tier, Reset with confirmation, responsive/touch polish.

## Testing Decisions

### Philosophy

Good tests assert **observable behavior** (state after an action, rendered text, user-visible outcomes), not internal component structure or CSS class names. The reducer is the highest-value test target because it encodes most business rules in a pure, isolated interface.

### v1 scope

**No automated tests in v1.** The user chose manual testing only for the first release. All flows (add, drag, remove, tier add/remove, reset, progress, responsive/touch) should be verified manually.

### Future test targets (post–v1)

When tests are added, prioritize:

| Module | What to test |
|--------|----------------|
| Tier list reducer | Add item, move within/between containers, unrank via action, delete from unranked, add/remove tier guards, reset, title/item length clamping |
| Drag coordinator (optional) | Maps dnd-kit drag-end payloads to correct `MOVE_ITEM` actions |

No prior test art exists in the codebase.

## Out of Scope

- **Export PNG** — deferred; design includes the button in the mock but v1 does not implement image export.
- **Persistence** — no `localStorage`, session storage, or backend; closing the tab loses all state.
- **Shareable URLs** — no routing, encoding state in the URL, or public list viewing.
- **User accounts and authentication.**
- **Editable tier labels or custom tier colors.**
- **Removing tiers that contain items** (no auto-move to unranked on tier delete).
- **Keyboard-based ranking** — no arrow-key or shortcut moves between tiers in v1.
- **Full screen-reader / WCAG drag-and-drop compliance** — baseline labels and focus only.
- **Automated unit, component, or E2E tests** in v1.
- **Demo/seed data on first load** — always blank slate.
- **Item images, rich text, or non-text items.**
- **Import/export JSON** for backup or transfer.
- **Undo/redo** beyond unrank-via-×.

## Further Notes

### Design reference

A high-fidelity UI mock defines the target look: dark theme, header with title and controls, purple-accent progress bar, S–F tier color spectrum, pill items with ×, and a dashed unranked bucket. v1 implements all mock functionality except Export PNG.

### Dependencies to add

- `tailwindcss`, `@tailwindcss/vite` (dev)
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

### Edge cases (implementer defaults)

- **+ Tier** disabled when tier F exists.
- **−** on D/E/F shown only when that tier has zero items.
- Progress at zero items: show **0 of 0 ranked** and **0%**.
- Reset confirmation copy should state the action cannot be undone in-session.

### Module expectations

The four modules above (reducer, state model, drag coordinator, presentation shell) are the intended decomposition. The user did not request automated tests for any module in v1; the reducer remains the recommended first test target when testing is introduced later.
