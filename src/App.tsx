import { Minus, Moon, Sun, X } from "lucide-react";
import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type CSSProperties
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  SortableDropZone,
  SortableItem,
  TierListDragContext,
  type SortableItemBindings
} from "./tier-list/dragCoordinator";
import {
  DEFAULT_TITLE,
  ITEM_LABEL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  UNRANKED_CONTAINER_ID,
  canAddTier,
  canRemoveTier,
  initialTierListState,
  sanitizeItemLabel,
  tierListReducer,
  type Item,
  type Tier
} from "./tier-list/state";

const THEME_STORAGE_KEY = "tier-list-maker-theme";
type Theme = "system" | "light" | "dark";

function getPreferredColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function App() {
  const [state, dispatch] = useReducer(tierListReducer, initialTierListState);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "system" || stored === "light" || stored === "dark") {
      return stored;
    }

    return "system";
  });
  const [preferredColorScheme, setPreferredColorScheme] = useState<
    "light" | "dark"
  >(getPreferredColorScheme);
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const totalItems = Object.keys(state.items).length;
  const rankedItems = state.tiers.reduce(
    (count, tier) => count + (state.placements[tier.id]?.length ?? 0),
    0
  );
  const progressPercent =
    totalItems === 0 ? 0 : Math.round((rankedItems / totalItems) * 100);
  const canAddItem = sanitizeItemLabel(newItemLabel).length > 0;
  const canAddAnotherTier = canAddTier(state);
  const isDarkMode =
    theme === "system" ? preferredColorScheme === "dark" : theme === "dark";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setPreferredColorScheme(mediaQuery.matches ? "dark" : "light");
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const nextTitle = state.title.trim();
    document.title = nextTitle.length > 0 ? nextTitle : DEFAULT_TITLE;
  }, [state.title]);

  function handleAddItem(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const label = sanitizeItemLabel(newItemLabel);

    if (label.length === 0) {
      return;
    }

    dispatch({ type: "ADD_ITEM", label });
    setNewItemLabel("");
    newItemInputRef.current?.focus();
  }

  function handleConfirmReset() {
    dispatch({ type: "RESET" });
    setNewItemLabel("");
  }

  return (
    <main className="min-h-svh bg-linear-to-b from-slate-100 to-slate-200 px-4 py-5 text-slate-900 transition-colors dark:from-slate-900 dark:to-[#07070b] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-lg border border-slate-300/70 bg-white/85 p-5 shadow-xl shadow-slate-300/35 backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/30">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="font-medium text-amber-700 dark:text-amber-300">
              Tier List Maker
            </h1>
            <button
              type="button"
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 outline-none transition hover:bg-slate-50 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:hover:bg-white/8 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20"
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            >
              {isDarkMode ? (
                <Sun aria-hidden="true" className="size-4" />
              ) : (
                <Moon aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <input
                aria-label="Tier list title"
                className="block w-full min-w-0 rounded-md border border-transparent bg-transparent px-0 py-1 text-2xl placeholder:text-2xl font-semibold leading-tight text-slate-900 outline-none transition sm:text-3xl focus:border-amber-500/70 focus:bg-slate-100/90 focus:px-3 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 dark:text-white dark:focus:border-amber-400/70 dark:focus:bg-white/3 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20"
                maxLength={TITLE_MAX_LENGTH}
                value={state.title}
                onChange={(event) =>
                  dispatch({
                    type: "SET_TITLE",
                    title: event.currentTarget.value
                  })
                }
              />
            </div>

            <form
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center lg:w-3xl"
              onSubmit={handleAddItem}
            >
              <input
                ref={newItemInputRef}
                aria-label="Item name"
                className="h-11 min-w-0 rounded-lg border border-slate-300 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-amber-500/80 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:focus:border-amber-400/80 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20"
                maxLength={ITEM_LABEL_MAX_LENGTH}
                placeholder="Item name"
                value={newItemLabel}
                onChange={(event) => setNewItemLabel(event.currentTarget.value)}
                autoComplete="off"
                enterKeyHint="done"
              />
              <button
                type="submit"
                className="h-11 rounded-lg border border-amber-600/20 bg-amber-500 px-5 font-medium text-white outline-none transition hover:bg-amber-400 focus:ring-4 focus:ring-amber-500/20 focus-visible:ring-4 focus-visible:ring-amber-500/30 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400 dark:border-amber-300/25 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 dark:disabled:border-white/10 dark:disabled:bg-white/4 dark:disabled:text-slate-500"
                disabled={!canAddItem}
              >
                Add
              </button>
              <button
                type="button"
                className="h-11 rounded-lg border border-slate-300 bg-white px-5 font-medium text-slate-900 outline-none transition hover:bg-slate-50 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-white dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:hover:bg-white/8 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20 dark:disabled:text-slate-500 dark:disabled:hover:bg-white/4"
                disabled={!canAddAnotherTier}
                onClick={() => dispatch({ type: "ADD_TIER" })}
              >
                + Tier
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="h-11 rounded-lg border border-slate-300 bg-white px-5 font-medium text-slate-900 outline-none transition hover:bg-slate-50 focus:ring-4 focus:ring-amber-500/15 focus-visible:ring-4 focus-visible:ring-amber-500/20 dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:hover:bg-white/8 dark:focus:ring-amber-400/15 dark:focus-visible:ring-amber-400/20"
                  >
                    Reset
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset this tier list?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This clears all tiers and items. This cannot be undone in
                      this session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleConfirmReset}
                    >
                      Reset list
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </div>
        </header>

        <section
          aria-label="Ranking progress"
          className="rounded-lg border border-slate-300/70 bg-white/80 p-5 transition-colors dark:border-white/10 dark:bg-slate-950/70"
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-base font-medium text-slate-900 dark:text-slate-100">
              {rankedItems} of {totalItems} ranked
            </p>
            <p className="text-base font-semibold text-amber-700 dark:text-amber-200">
              {progressPercent}%
            </p>
          </div>
          <progress
            className="h-3 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-amber-400 [&::-moz-progress-bar]:transition-[width] [&::-moz-progress-bar]:duration-300 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-amber-400 [&::-webkit-progress-value]:transition-[width] [&::-webkit-progress-value]:duration-300 dark:[&::-webkit-progress-bar]:bg-slate-800"
            value={rankedItems}
            max={Math.max(totalItems, 1)}
          >
            {progressPercent}%
          </progress>
        </section>

        <TierListDragContext
          state={state}
          dispatch={dispatch}
          renderOverlay={(item, containerId) => (
            <ItemPill
              item={item}
              tone={getPillTone(state.tiers, containerId)}
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
                  dispatch({ type: "REMOVE_TIER", tierId: tier.id })
                }
                onUnrank={(itemId) => dispatch({ type: "UNRANK_ITEM", itemId })}
              />
            ))}
          </section>

          <UnrankedSection
            itemIds={state.unranked}
            items={state.items}
            onRemove={(itemId) => dispatch({ type: "REMOVE_ITEM", itemId })}
          />
        </TierListDragContext>
      </div>
    </main>
  );
}

type ItemPillTone = { kind: "neutral" } | { kind: "tier"; color: string };

function ItemPill({
  item,
  tone = { kind: "neutral" },
  onRemove,
  removeLabel,
  drag,
  isOverlay = false
}: {
  item: Item;
  tone?: ItemPillTone;
  onRemove?: () => void;
  removeLabel?: string;
  drag?: SortableItemBindings;
  isOverlay?: boolean;
}) {
  const pillStyle: CSSProperties = {
    ...drag?.style,
    ...(tone.kind === "tier" ? pillColorStyle(tone.color) : {})
  };
  const toneClass =
    tone.kind === "tier"
      ? "border-white/20 bg-[var(--pill-color)] text-slate-950"
      : "border-slate-300 bg-white text-slate-800 dark:border-white/10 dark:bg-slate-800 dark:text-slate-100";
  const removeControlClass =
    tone.kind === "tier"
      ? "text-slate-900/70 hover:bg-black/10 hover:text-slate-950 focus:bg-black/10 focus:text-slate-950 focus:ring-slate-900/30"
      : "text-slate-500 hover:bg-slate-200 hover:text-slate-900 focus:bg-slate-200 focus:text-slate-900 focus:ring-amber-400/50 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white dark:focus:ring-amber-300/50";

  return (
    <span
      ref={drag?.setNodeRef}
      data-item-id={item.id}
      style={pillStyle}
      className={[
        "inline-flex max-w-full touch-none select-none items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-sm shadow-black/20 outline-none transition focus-visible:ring-2 focus-visible:ring-amber-300/70",
        toneClass,
        drag ? "cursor-grab active:cursor-grabbing" : "",
        drag?.isDragging ? "opacity-30" : "",
        isOverlay ? "cursor-grabbing shadow-2xl shadow-black/35" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      {...(drag?.attributes ?? {})}
      {...(drag?.listeners ?? {})}
    >
      <span className="truncate">{item.label}</span>
      <button
        type="button"
        aria-label={removeLabel ?? `Remove ${item.label}`}
        className={[
          "-mr-1 grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none outline-none transition focus:ring-2",
          removeControlClass
        ].join(" ")}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onRemove?.();
        }}
      >
        <X aria-hidden="true" className="size-4" strokeWidth={2.5} />
      </button>
    </span>
  );
}

function SortableItemPill({
  item,
  containerId,
  tone,
  onRemove,
  removeLabel
}: {
  item: Item;
  containerId: string;
  tone: ItemPillTone;
  onRemove: () => void;
  removeLabel: string;
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
  );
}

function TierRow({
  tier,
  itemIds,
  items,
  canRemove,
  onRemoveTier,
  onUnrank
}: {
  tier: Tier;
  itemIds: string[];
  items: Record<string, Item>;
  canRemove: boolean;
  onRemoveTier: () => void;
  onUnrank: (itemId: string) => void;
}) {
  return (
    <article className="grid grid-cols-[3.5rem_minmax(0,1fr)] overflow-hidden rounded-lg border border-slate-300/70 bg-white/80 transition-colors dark:border-white/10 dark:bg-slate-950/75 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
      <div
        className="relative flex min-h-20 items-center justify-center bg-(--tier-color) text-2xl font-bold text-slate-950 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)] sm:text-3xl"
        style={tierColorStyle(tier.color)}
      >
        <span>{tier.label}</span>
        {canRemove ? (
          <button
            type="button"
            aria-label={`Remove empty ${tier.label} tier`}
            className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-slate-950/15 text-lg font-semibold leading-none text-slate-950 outline-none transition hover:bg-slate-950/25 focus:ring-2 focus:ring-slate-950/35 focus-visible:ring-2 focus-visible:ring-slate-950/50 sm:right-1.5 sm:top-1.5"
            onClick={onRemoveTier}
          >
            <Minus aria-hidden="true" className="size-4" strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
      <SortableDropZone
        containerId={tier.id}
        itemIds={itemIds}
        ariaLabel={`${tier.label} tier drop zone`}
        className="flex min-h-20 flex-wrap items-start gap-2 border-l border-slate-300/70 bg-slate-100/85 p-3 transition dark:border-white/10 dark:bg-slate-900/45 data-[over=true]:bg-slate-200/80 dark:data-[over=true]:bg-slate-800/75 data-[over=true]:ring-2 data-[over=true]:ring-amber-300/30"
      >
        <span className="sr-only">
          {itemIds.length} items in tier {tier.label}
        </span>
        {itemIds.map((itemId) => {
          const item = items[itemId];

          if (!item) {
            return null;
          }

          return (
            <SortableItemPill
              key={item.id}
              item={item}
              containerId={tier.id}
              tone={{ kind: "tier", color: tier.color }}
              onRemove={() => onUnrank(item.id)}
              removeLabel={`Move ${item.label} back to unranked`}
            />
          );
        })}
      </SortableDropZone>
    </article>
  );
}

function UnrankedSection({
  itemIds,
  items,
  onRemove
}: {
  itemIds: string[];
  items: Record<string, Item>;
  onRemove: (itemId: string) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-300/70 bg-white/80 p-5 transition-colors dark:border-white/10 dark:bg-slate-950/70">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          UNRANKED — DRAG INTO TIERS ABOVE
        </h2>
        <p className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          {itemIds.length} items
        </p>
      </div>
      <SortableDropZone
        containerId={UNRANKED_CONTAINER_ID}
        itemIds={itemIds}
        ariaLabel="Unranked staging area"
        className="flex min-h-28 flex-wrap items-start gap-2 rounded-lg border border-dashed border-slate-400 bg-slate-100/85 p-3 transition dark:border-slate-500/70 dark:bg-slate-900/45 data-[over=true]:border-amber-400/70 dark:data-[over=true]:border-amber-300/80 data-[over=true]:bg-slate-200/80 dark:data-[over=true]:bg-slate-800/75 data-[over=true]:ring-2 data-[over=true]:ring-amber-300/30"
      >
        {itemIds.map((itemId) => {
          const item = items[itemId];

          if (!item) {
            return null;
          }

          return (
            <SortableItemPill
              key={item.id}
              item={item}
              containerId={UNRANKED_CONTAINER_ID}
              tone={{ kind: "neutral" }}
              onRemove={() => onRemove(item.id)}
              removeLabel={`Remove ${item.label}`}
            />
          );
        })}
      </SortableDropZone>
    </section>
  );
}

function getPillTone(tiers: Tier[], containerId: string | null): ItemPillTone {
  const tier = tiers.find((candidate) => candidate.id === containerId);
  return tier ? { kind: "tier", color: tier.color } : { kind: "neutral" };
}

function tierColorStyle(color: string): CSSProperties {
  return {
    "--tier-color": color
  } as CSSProperties;
}

function pillColorStyle(color: string): CSSProperties {
  return {
    "--pill-color": color
  } as CSSProperties;
}

export default App;
