export type Item = { id: string; label: string };

export type Tier = {
  id: string;
  label: string;
  color: string;
};

export type TierListState = {
  title: string;
  tiers: Tier[];
  items: Record<string, Item>;
  unranked: string[];
  placements: Record<string, string[]>;
};

export type TierListAction =
  | { type: "SET_TITLE"; title: string }
  | { type: "ADD_ITEM"; label: string }
  | { type: "REMOVE_ITEM"; itemId: string }
  | { type: "UNRANK_ITEM"; itemId: string }
  | { type: "ADD_TIER" }
  | { type: "REMOVE_TIER"; tierId: string }
  | {
      type: "MOVE_ITEM";
      itemId: string;
      toContainerId: string;
      toIndex: number;
    }
  | { type: "RESET" };

export type TierListReducerDeps = {
  createItemId?: () => string;
};

export const DEFAULT_TITLE = "Untitled tier list";
export const TITLE_MAX_LENGTH = 60;
export const ITEM_LABEL_MAX_LENGTH = 50;
export const UNRANKED_CONTAINER_ID = "unranked";

export const TIER_PALETTE: Tier[] = [
  { id: "tier-s", label: "S", color: "#ff6b5f" },
  { id: "tier-a", label: "A", color: "#ffb454" },
  { id: "tier-b", label: "B", color: "#ffe066" },
  { id: "tier-c", label: "C", color: "#57d68d" },
  { id: "tier-d", label: "D", color: "#38d4c1" },
  { id: "tier-e", label: "E", color: "#4fb7ff" },
  { id: "tier-f", label: "F", color: "#9b8cff" }
];

export const DEFAULT_TIERS = TIER_PALETTE.slice(0, 4);
const OPTIONAL_TIERS = TIER_PALETTE.slice(DEFAULT_TIERS.length);
const LAST_TIER_ID = TIER_PALETTE[TIER_PALETTE.length - 1].id;
const TIER_ORDER = new Map(TIER_PALETTE.map((tier, index) => [tier.id, index]));

export function createInitialTierListState(): TierListState {
  const tiers = DEFAULT_TIERS.map((tier) => ({ ...tier }));

  return {
    title: DEFAULT_TITLE,
    tiers,
    items: {},
    unranked: [],
    placements: tiers.reduce<Record<string, string[]>>((placements, tier) => {
      placements[tier.id] = [];
      return placements;
    }, {})
  };
}

export const initialTierListState = createInitialTierListState();

export function sanitizeTitle(title: string): string {
  return title.replace(/[\r\n]+/g, " ").slice(0, TITLE_MAX_LENGTH);
}

export function sanitizeItemLabel(label: string): string {
  return label
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, ITEM_LABEL_MAX_LENGTH);
}

export function getContainerItemIds(
  state: TierListState,
  containerId: string
): string[] {
  if (containerId === UNRANKED_CONTAINER_ID) {
    return state.unranked;
  }

  return state.placements[containerId] ?? [];
}

export function findItemContainer(
  state: TierListState,
  itemId: string
): string | null {
  if (state.unranked.includes(itemId)) {
    return UNRANKED_CONTAINER_ID;
  }

  for (const [tierId, itemIds] of Object.entries(state.placements)) {
    if (itemIds.includes(itemId)) {
      return tierId;
    }
  }

  return null;
}

export function canAddTier(state: TierListState): boolean {
  return getNextAddableTier(state) !== null;
}

export function canRemoveTier(state: TierListState, tierId: string): boolean {
  return (
    state.tiers.some((tier) => tier.id === tierId) &&
    OPTIONAL_TIERS.some((tier) => tier.id === tierId) &&
    (state.placements[tierId]?.length ?? 0) === 0
  );
}

function isKnownContainer(state: TierListState, containerId: string): boolean {
  return (
    containerId === UNRANKED_CONTAINER_ID ||
    Object.prototype.hasOwnProperty.call(state.placements, containerId)
  );
}

function insertAt(itemIds: string[], itemId: string, index: number): string[] {
  const nextItemIds = [...itemIds];
  nextItemIds.splice(clampIndex(index, nextItemIds.length), 0, itemId);
  return nextItemIds;
}

function clampIndex(index: number, length: number): number {
  if (!Number.isFinite(index)) {
    return length;
  }

  return Math.min(Math.max(Math.trunc(index), 0), length);
}

function getNextAddableTier(state: TierListState): Tier | null {
  if (state.tiers.some((tier) => tier.id === LAST_TIER_ID)) {
    return null;
  }

  const existingTierIds = new Set(state.tiers.map((tier) => tier.id));

  return OPTIONAL_TIERS.find((tier) => !existingTierIds.has(tier.id)) ?? null;
}

function sortTiersByPaletteOrder(tiers: Tier[]): Tier[] {
  return [...tiers].sort(
    (first, second) =>
      (TIER_ORDER.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
      (TIER_ORDER.get(second.id) ?? Number.MAX_SAFE_INTEGER)
  );
}

export function createTierListReducer({
  createItemId = () => crypto.randomUUID()
}: TierListReducerDeps = {}) {
  return function tierListReducer(
    state: TierListState,
    action: TierListAction
  ): TierListState {
    switch (action.type) {
      case "SET_TITLE":
        return {
          ...state,
          title: sanitizeTitle(action.title)
        };
      case "ADD_ITEM": {
        const label = sanitizeItemLabel(action.label);

        if (label.length === 0) {
          return state;
        }

        const id = createItemId();

        return {
          ...state,
          items: {
            ...state.items,
            [id]: { id, label }
          },
          unranked: [...state.unranked, id]
        };
      }
      case "REMOVE_ITEM": {
        if (!state.items[action.itemId]) {
          return state;
        }

        const items = { ...state.items };
        delete items[action.itemId];

        return {
          ...state,
          items,
          unranked: state.unranked.filter((itemId) => itemId !== action.itemId),
          placements: Object.fromEntries(
            Object.entries(state.placements).map(([tierId, itemIds]) => [
              tierId,
              itemIds.filter((itemId) => itemId !== action.itemId)
            ])
          )
        };
      }
      case "UNRANK_ITEM": {
        if (!state.items[action.itemId]) {
          return state;
        }

        // Button-based unrank has no drop position, so it returns the item to
        // the end of the staging pool. Drag-to-unrank uses MOVE_ITEM with an index.
        const fromContainerId = findItemContainer(state, action.itemId);

        if (
          fromContainerId === null ||
          fromContainerId === UNRANKED_CONTAINER_ID
        ) {
          return state;
        }

        return {
          ...state,
          unranked: [...state.unranked, action.itemId],
          placements: Object.fromEntries(
            Object.entries(state.placements).map(([tierId, itemIds]) => [
              tierId,
              itemIds.filter((itemId) => itemId !== action.itemId)
            ])
          )
        };
      }
      case "MOVE_ITEM": {
        if (
          !state.items[action.itemId] ||
          !isKnownContainer(state, action.toContainerId)
        ) {
          return state;
        }

        const fromContainerId = findItemContainer(state, action.itemId);

        if (fromContainerId === null) {
          return state;
        }

        let unranked =
          fromContainerId === UNRANKED_CONTAINER_ID
            ? state.unranked.filter((itemId) => itemId !== action.itemId)
            : state.unranked;
        const placements = Object.fromEntries(
          Object.entries(state.placements).map(([tierId, itemIds]) => [
            tierId,
            tierId === fromContainerId
              ? itemIds.filter((itemId) => itemId !== action.itemId)
              : itemIds
          ])
        );

        if (action.toContainerId === UNRANKED_CONTAINER_ID) {
          unranked = insertAt(unranked, action.itemId, action.toIndex);
        } else {
          placements[action.toContainerId] = insertAt(
            placements[action.toContainerId],
            action.itemId,
            action.toIndex
          );
        }

        return {
          ...state,
          unranked,
          placements
        };
      }
      case "ADD_TIER": {
        const tier = getNextAddableTier(state);

        if (tier === null) {
          return state;
        }

        return {
          ...state,
          tiers: sortTiersByPaletteOrder([...state.tiers, { ...tier }]),
          placements: {
            ...state.placements,
            [tier.id]: state.placements[tier.id] ?? []
          }
        };
      }
      case "REMOVE_TIER": {
        if (!canRemoveTier(state, action.tierId)) {
          return state;
        }

        const placements = { ...state.placements };
        delete placements[action.tierId];

        return {
          ...state,
          tiers: state.tiers.filter((tier) => tier.id !== action.tierId),
          placements
        };
      }
      case "RESET":
        return createInitialTierListState();
      default:
        return state;
    }
  };
}

export const tierListReducer = createTierListReducer();
