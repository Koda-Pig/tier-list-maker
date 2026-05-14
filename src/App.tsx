import { useReducer, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import {
  ITEM_LABEL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
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
                className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-5 font-medium text-slate-400 disabled:cursor-not-allowed"
                disabled
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

        <section aria-label="Tier rows" className="flex flex-col gap-3">
          {state.tiers.map((tier) => (
            <TierRow
              key={tier.id}
              tier={tier}
              itemCount={state.placements[tier.id].length}
            />
          ))}
        </section>

        <section className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-200">
              UNRANKED — DRAG INTO TIERS ABOVE
            </h2>
            <p className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-400">
              {state.unranked.length} items
            </p>
          </div>
          <div
            aria-label="Unranked staging area"
            className="flex min-h-28 flex-wrap items-start gap-2 rounded-lg border border-dashed border-slate-500/70 bg-slate-900/45 p-3"
          >
            {state.unranked.map((itemId) => {
              const item = state.items[itemId]

              if (!item) {
                return null
              }

              return (
                <ItemPill
                  key={item.id}
                  item={item}
                  onRemove={() =>
                    dispatch({ type: 'REMOVE_ITEM', itemId: item.id })
                  }
                />
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

function ItemPill({
  item,
  onRemove,
}: {
  item: Item
  onRemove: () => void
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 shadow-sm shadow-black/20">
      <span className="truncate">{item.label}</span>
      <button
        type="button"
        aria-label={`Remove ${item.label}`}
        className="-mr-1 grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none text-slate-400 outline-none transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:ring-2 focus:ring-violet-300/50"
        onClick={onRemove}
      >
        ×
      </button>
    </span>
  )
}

function TierRow({ tier, itemCount }: { tier: Tier; itemCount: number }) {
  return (
    <article className="grid grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden rounded-lg border border-white/10 bg-slate-950/75">
      <div
        className="flex min-h-20 items-center justify-center bg-[var(--tier-color)] text-3xl font-bold text-slate-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]"
        style={tierColorStyle(tier.color)}
      >
        {tier.label}
      </div>
      <div
        aria-label={`${tier.label} tier drop zone`}
        className="min-h-20 border-l border-white/10 bg-slate-900/45 p-3"
      >
        <span className="sr-only">
          {itemCount} items in tier {tier.label}
        </span>
      </div>
    </article>
  )
}

function tierColorStyle(color: string): CSSProperties {
  return {
    '--tier-color': color,
  } as CSSProperties
}

export default App
