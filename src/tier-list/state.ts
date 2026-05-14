export type Item = { id: string; label: string }

export type Tier = {
  id: string
  label: string
  color: string
}

export type TierListState = {
  title: string
  tiers: Tier[]
  items: Record<string, Item>
  unranked: string[]
  placements: Record<string, string[]>
}

export type TierListAction =
  | { type: 'SET_TITLE'; title: string }
  | { type: 'ADD_ITEM'; label: string }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'RESET' }

export const DEFAULT_TITLE = 'Untitled tier list'
export const TITLE_MAX_LENGTH = 60
export const ITEM_LABEL_MAX_LENGTH = 50

export const TIER_PALETTE: Tier[] = [
  { id: 'tier-s', label: 'S', color: '#ff6b5f' },
  { id: 'tier-a', label: 'A', color: '#ffb454' },
  { id: 'tier-b', label: 'B', color: '#ffe066' },
  { id: 'tier-c', label: 'C', color: '#57d68d' },
  { id: 'tier-d', label: 'D', color: '#38d4c1' },
  { id: 'tier-e', label: 'E', color: '#4fb7ff' },
  { id: 'tier-f', label: 'F', color: '#9b8cff' },
]

export const DEFAULT_TIERS = TIER_PALETTE.slice(0, 4)

export function createInitialTierListState(): TierListState {
  const tiers = DEFAULT_TIERS.map((tier) => ({ ...tier }))

  return {
    title: DEFAULT_TITLE,
    tiers,
    items: {},
    unranked: [],
    placements: tiers.reduce<Record<string, string[]>>((placements, tier) => {
      placements[tier.id] = []
      return placements
    }, {}),
  }
}

export const initialTierListState = createInitialTierListState()

export function sanitizeTitle(title: string): string {
  return title.replace(/[\r\n]+/g, ' ').slice(0, TITLE_MAX_LENGTH)
}

export function sanitizeItemLabel(label: string): string {
  return label.replace(/[\r\n]+/g, ' ').trim().slice(0, ITEM_LABEL_MAX_LENGTH)
}

export function tierListReducer(
  state: TierListState,
  action: TierListAction,
): TierListState {
  switch (action.type) {
    case 'SET_TITLE':
      return {
        ...state,
        title: sanitizeTitle(action.title),
      }
    case 'ADD_ITEM': {
      const label = sanitizeItemLabel(action.label)

      if (label.length === 0) {
        return state
      }

      const id = crypto.randomUUID()

      return {
        ...state,
        items: {
          ...state.items,
          [id]: { id, label },
        },
        unranked: [...state.unranked, id],
      }
    }
    case 'REMOVE_ITEM': {
      if (!state.items[action.itemId]) {
        return state
      }

      const items = { ...state.items }
      delete items[action.itemId]

      return {
        ...state,
        items,
        unranked: state.unranked.filter((itemId) => itemId !== action.itemId),
        placements: Object.fromEntries(
          Object.entries(state.placements).map(([tierId, itemIds]) => [
            tierId,
            itemIds.filter((itemId) => itemId !== action.itemId),
          ]),
        ),
      }
    }
    case 'RESET':
      return createInitialTierListState()
    default:
      return state
  }
}
