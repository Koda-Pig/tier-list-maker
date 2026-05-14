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

export type TierListAction = { type: 'RESET' }

export const DEFAULT_TITLE = 'Untitled tier list'

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

export function tierListReducer(
  _state: TierListState,
  action: TierListAction,
): TierListState {
  switch (action.type) {
    case 'RESET':
      return createInitialTierListState()
    default:
      return _state
  }
}
