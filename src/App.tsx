import { useReducer, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import {
  SortableDropZone,
  SortableItem,
  TierListDragContext,
  type SortableItemBindings,
} from './tier-list/dragCoordinator'
import {
  ITEM_LABEL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  UNRANKED_CONTAINER_ID,
  canAddTier,
  canRemoveTier,
  initialTierListState,
  sanitizeItemLabel,
  tierListReducer,
  type Item,
  type Tier,
} from './tier-list/state'

function App() {
  const [state, dispatch] = useReducer(tierListReducer, initialTierListState)
  const [newItemLabel, setNewItemLabel] = useState('')
  const totalItems = Object.keys(state.items).length
  const rankedItems = state.tiers.reduce(
    (count, tier) => count + (state.placements[tier.id]?.length ?? 0),
    0,
  )
  const progressPercent =
    totalItems === 0 ? 0 : Math.round((rankedItems / totalItems) * 100)
  const canAddItem = sanitizeItemLabel(newItemLabel).length > 0
  const canAddAnotherTier = canAddTier(state)

  function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const label = sanitizeItemLabel(newItemLabel)

    if (label.length === 0) {
      return
    }

    dispatch({ type: 'ADD_ITEM', label })
    setNewItemLabel('')
  }

  return (
    <main className="min-h-svh px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-sm font-medium text-violet-300">
                Tier list
              </p>
              <input
                aria-label="Tier list title"
                className="block w-full min-w-0 rounded-md border border-transparent bg-transparent px-0 py-1 text-4xl font-semibold leading-tight text-white outline-none transition focus:border-violet-400/70 focus:bg-white/[0.03] focus:px-3 focus:ring-4 focus:ring-violet-400/15"
                maxLength={TITLE_MAX_LENGTH}
                value={state.title}
                onChange={(event) =>
                  dispatch({
                    type: 'SET_TITLE',
                    title: event.currentTarget.value,
                  })
                }
              />
            </div>

            <form
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] lg:w-[48rem]"
              onSubmit={handleAddItem}
            >
              <input
                aria-label="Item name"
                className="h-11 min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-violet-400/80 focus:ring-4 focus:ring-violet-400/15"
                maxLength={ITEM_LABEL_MAX_LENGTH}
                placeholder="Item name"
                value={newItemLabel}
                onChange={(event) => setNewItemLabel(event.currentTarget.value)}
                autoComplete="off"
                enterKeyHint="done"
              />
              <button
                type="submit"
                className="h-11 rounded-lg border border-violet-300/25 bg-violet-400 px-5 font-medium text-slate-950 outline-none transition hover:bg-violet-300 focus:ring-4 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.04] disabled:text-slate-500"
                disabled={!canAddItem}
              >
                Add
              </button>
              <button
                type="button"
                className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-5 font-medium text-slate-100 outline-none transition hover:bg-white/[0.08] focus:ring-4 focus:ring-violet-400/15 disabled:cursor-not-allowed disabled:text-slate-500 disabled:hover:bg-white/[0.04]"
                disabled={!canAddAnotherTier}
                onClick={() => dispatch({ type: 'ADD_TIER' })}
              >
                + Tier
              </button>
              <button
                type="button"
                className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-5 font-medium text-slate-400 disabled:cursor-not-allowed"
                disabled
              >
                Reset
              </button>
            </form>
          </div>
        </header>

        <section
          aria-label="Ranking progress"
          className="rounded-lg border border-white/10 bg-slate-950/70 p-5"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-base font-medium text-slate-100">
              {rankedItems} of {totalItems} ranked
            </p>
            <p className="text-base font-semibold text-violet-200">
              {progressPercent}%
            </p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-400 transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </section>

        <TierListDragContext
          state={state}
          dispatch={dispatch}
          renderOverlay={(item, containerId) => (
            <ItemPill
              item={item}
              tone={getPillTone(state.tiers, containerId)}
              hideRemove
              isOverlay
            />
          )}
        >
          <section aria-label="Tier rows" className="flex flex-col gap-3">
            {state.tiers.map((tier) => (
              <TierRow
                key={tier.id}
                tier={tier}
                itemIds={state.placements[tier.id] ?? []}
                items={state.items}
                canRemove={canRemoveTier(state, tier.id)}
                onRemoveTier={() =>
                  dispatch({ type: 'REMOVE_TIER', tierId: tier.id })
                }
                onUnrank={(itemId) =>
                  dispatch({ type: 'UNRANK_ITEM', itemId })
                }
              />
            ))}
          </section>

          <UnrankedSection
            itemIds={state.unranked}
            items={state.items}
            onRemove={(itemId) => dispatch({ type: 'REMOVE_ITEM', itemId })}
          />
        </TierListDragContext>
      </div>
    </main>
  )
}

type ItemPillTone = { kind: 'neutral' } | { kind: 'tier'; color: string }

function ItemPill({
  item,
  tone = { kind: 'neutral' },
  onRemove,
  removeLabel,
  drag,
  hideRemove = false,
  isOverlay = false,
}: {
  item: Item
  tone?: ItemPillTone
  onRemove?: () => void
  removeLabel?: string
  drag?: SortableItemBindings
  hideRemove?: boolean
  isOverlay?: boolean
}) {
  const pillStyle: CSSProperties = {
    ...drag?.style,
    ...(tone.kind === 'tier' ? pillColorStyle(tone.color) : {}),
  }
  const toneClass =
    tone.kind === 'tier'
      ? 'border-white/20 bg-[var(--pill-color)] text-slate-950'
      : 'border-white/10 bg-slate-800 text-slate-100'
  const removeControlClass =
    tone.kind === 'tier'
      ? 'text-slate-900/70 hover:bg-black/10 hover:text-slate-950 focus:bg-black/10 focus:text-slate-950 focus:ring-slate-900/30'
      : 'text-slate-400 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:ring-violet-300/50'

  return (
    <span
      ref={drag?.setNodeRef}
      data-item-id={item.id}
      style={pillStyle}
      className={[
        'inline-flex max-w-full touch-none select-none items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-sm shadow-black/20 outline-none transition focus-visible:ring-2 focus-visible:ring-violet-300/70',
        toneClass,
        drag ? 'cursor-grab active:cursor-grabbing' : '',
        drag?.isDragging ? 'opacity-30' : '',
        isOverlay ? 'cursor-grabbing shadow-2xl shadow-black/35' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...(drag?.attributes ?? {})}
      {...(drag?.listeners ?? {})}
    >
      <span className="truncate">{item.label}</span>
      {hideRemove ? null : onRemove ? (
        <button
          type="button"
          aria-label={removeLabel ?? `Remove ${item.label}`}
          className={[
            '-mr-1 grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none outline-none transition focus:ring-2',
            removeControlClass,
          ].join(' ')}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
        >
          ×
        </button>
      ) : (
        <span
          aria-hidden="true"
          className={[
            '-mr-1 grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none',
            tone.kind === 'tier' ? 'text-slate-900/60' : 'text-slate-400',
          ].join(' ')}
        >
          ×
        </span>
      )}
    </span>
  )
}

function SortableItemPill({
  item,
  containerId,
  tone,
  onRemove,
  removeLabel,
}: {
  item: Item
  containerId: string
  tone: ItemPillTone
  onRemove: () => void
  removeLabel: string
}) {
  return (
    <SortableItem itemId={item.id} containerId={containerId}>
      {(drag) => (
        <ItemPill
          item={item}
          tone={tone}
          onRemove={onRemove}
          removeLabel={removeLabel}
          drag={drag}
        />
      )}
    </SortableItem>
  )
}

function TierRow({
  tier,
  itemIds,
  items,
  canRemove,
  onRemoveTier,
  onUnrank,
}: {
  tier: Tier
  itemIds: string[]
  items: Record<string, Item>
  canRemove: boolean
  onRemoveTier: () => void
  onUnrank: (itemId: string) => void
}) {
  return (
    <article className="grid grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden rounded-lg border border-white/10 bg-slate-950/75">
      <div
        className="relative flex min-h-20 items-center justify-center bg-[var(--tier-color)] text-3xl font-bold text-slate-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]"
        style={tierColorStyle(tier.color)}
      >
        <span>{tier.label}</span>
        {canRemove ? (
          <button
            type="button"
            aria-label={`Remove empty ${tier.label} tier`}
            className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-slate-950/15 text-lg font-semibold leading-none text-slate-950 outline-none transition hover:bg-slate-950/25 focus:ring-2 focus:ring-slate-950/35"
            onClick={onRemoveTier}
          >
            −
          </button>
        ) : null}
      </div>
      <SortableDropZone
        containerId={tier.id}
        itemIds={itemIds}
        ariaLabel={`${tier.label} tier drop zone`}
        className="flex min-h-20 flex-wrap items-start gap-2 border-l border-white/10 bg-slate-900/45 p-3 transition data-[over=true]:bg-slate-800/75 data-[over=true]:ring-2 data-[over=true]:ring-violet-300/30"
      >
        <span className="sr-only">
          {itemIds.length} items in tier {tier.label}
        </span>
        {itemIds.map((itemId) => {
          const item = items[itemId]

          if (!item) {
            return null
          }

          return (
            <SortableItemPill
              key={item.id}
              item={item}
              containerId={tier.id}
              tone={{ kind: 'tier', color: tier.color }}
              onRemove={() => onUnrank(item.id)}
              removeLabel={`Move ${item.label} back to unranked`}
            />
          )
        })}
      </SortableDropZone>
    </article>
  )
}

function UnrankedSection({
  itemIds,
  items,
  onRemove,
}: {
  itemIds: string[]
  items: Record<string, Item>
  onRemove: (itemId: string) => void
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-200">
          UNRANKED — DRAG INTO TIERS ABOVE
        </h2>
        <p className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
          {itemIds.length} items
        </p>
      </div>
      <SortableDropZone
        containerId={UNRANKED_CONTAINER_ID}
        itemIds={itemIds}
        ariaLabel="Unranked staging area"
        className="flex min-h-28 flex-wrap items-start gap-2 rounded-lg border border-dashed border-slate-500/70 bg-slate-900/45 p-3 transition data-[over=true]:border-violet-300/80 data-[over=true]:bg-slate-800/75 data-[over=true]:ring-2 data-[over=true]:ring-violet-300/30"
      >
        {itemIds.map((itemId) => {
          const item = items[itemId]

          if (!item) {
            return null
          }

          return (
            <SortableItemPill
              key={item.id}
              item={item}
              containerId={UNRANKED_CONTAINER_ID}
              tone={{ kind: 'neutral' }}
              onRemove={() => onRemove(item.id)}
              removeLabel={`Remove ${item.label}`}
            />
          )
        })}
      </SortableDropZone>
    </section>
  )
}

function getPillTone(tiers: Tier[], containerId: string | null): ItemPillTone {
  const tier = tiers.find((candidate) => candidate.id === containerId)
  return tier ? { kind: 'tier', color: tier.color } : { kind: 'neutral' }
}

function tierColorStyle(color: string): CSSProperties {
  return {
    '--tier-color': color,
  } as CSSProperties
}

function pillColorStyle(color: string): CSSProperties {
  return {
    '--pill-color': color,
  } as CSSProperties
}

export default App
