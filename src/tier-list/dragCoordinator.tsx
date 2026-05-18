import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCorners,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import {
  type Item,
  type TierListAction,
  type TierListState
} from "./state";

type DragItemData = {
  kind: "item";
  itemId: string;
  containerId: string;
};

type DragContainerData = {
  kind: "container";
  containerId: string;
  itemCount: number;
};

type DragData = DragItemData | DragContainerData;
type SortableResult = ReturnType<typeof useSortable>;

export type SortableItemBindings = {
  setNodeRef: SortableResult["setNodeRef"];
  attributes: SortableResult["attributes"];
  listeners: SortableResult["listeners"];
  style: CSSProperties;
  isDragging: boolean;
};

export function TierListDragContext({
  state,
  dispatch,
  resolveItemContainer,
  resolveContainerItemIds,
  renderOverlay,
  children
}: {
  state: TierListState;
  dispatch: (action: TierListAction) => void;
  resolveItemContainer: (state: TierListState, itemId: string) => string | null;
  resolveContainerItemIds: (
    state: TierListState,
    containerId: string
  ) => string[];
  renderOverlay: (item: Item, containerId: string | null) => ReactNode;
  children: ReactNode;
}) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const stateRef = useRef(state);
  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 140, tolerance: 8 }
    })
  );
  const activeItem = activeItemId === null ? null : state.items[activeItemId];
  const activeContainerId =
    activeItemId === null ? null : resolveItemContainer(state, activeItemId);

  function handleDragStart(event: DragStartEvent) {
    setActiveItemId(getItemId(event.active));
  }

  function handleDragEnd(event: DragEndEvent) {
    const action = createMoveAction(
      stateRef.current,
      event,
      resolveItemContainer,
      resolveContainerItemIds
    );

    setActiveItemId(null);

    if (action !== null) {
      dispatch(action);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={tierListCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveItemId(null)}
    >
      {children}
      <DragOverlay>
        {activeItem ? renderOverlay(activeItem, activeContainerId) : null}
      </DragOverlay>
    </DndContext>
  );
}

const tierListCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    const itemCollisions = pointerCollisions.filter(({ id }) =>
      isNonActiveItemCollision(args, id)
    );

    if (itemCollisions.length > 0) {
      return itemCollisions;
    }

    const emptyContainerCollisions = pointerCollisions.filter(({ id }) => {
      const data = getDroppableData(args, id);
      return data?.kind === "container" && data.itemCount === 0;
    });

    if (emptyContainerCollisions.length > 0) {
      return emptyContainerCollisions;
    }

    const pointerContainerIds = new Set(
      pointerCollisions.flatMap(({ id }) => {
        const data = getDroppableData(args, id);
        return data?.kind === "container" ? [data.containerId] : [];
      })
    );
    const closestItemCollisions = closestCorners(args).filter(({ id }) =>
      isNonActiveItemCollision(args, id, pointerContainerIds)
    );

    if (closestItemCollisions.length > 0) {
      return closestItemCollisions;
    }

    return pointerCollisions;
  }

  const rectCollisions = rectIntersection(args);

  if (rectCollisions.length > 0) {
    return rectCollisions;
  }

  return closestCorners(args);
};

function getDroppableData(
  args: Parameters<CollisionDetection>[0],
  id: Parameters<CollisionDetection>[0]["active"]["id"]
): DragData | null {
  const container = args.droppableContainers.find(
    (droppable) => droppable.id === id
  );

  return readDragData(container?.data.current);
}

function isNonActiveItemCollision(
  args: Parameters<CollisionDetection>[0],
  id: Parameters<CollisionDetection>[0]["active"]["id"],
  allowedContainerIds?: Set<string>
): boolean {
  const data = getDroppableData(args, id);

  return (
    id !== args.active.id &&
    data?.kind === "item" &&
    (allowedContainerIds === undefined ||
      allowedContainerIds.has(data.containerId))
  );
}

export function SortableDropZone({
  containerId,
  itemIds,
  ariaLabel,
  className,
  children
}: {
  containerId: string;
  itemIds: string[];
  ariaLabel: string;
  className: string;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: {
      kind: "container",
      containerId,
      itemCount: itemIds.length
    } satisfies DragContainerData
  });

  return (
    <SortableContext
      id={containerId}
      items={itemIds}
      strategy={rectSortingStrategy}
    >
      <div
        ref={setNodeRef}
        aria-label={ariaLabel}
        className={className}
        data-over={isOver ? "true" : undefined}
      >
        {children}
      </div>
    </SortableContext>
  );
}

export function SortableItem({
  itemId,
  containerId,
  children
}: {
  itemId: string;
  containerId: string;
  children: (bindings: SortableItemBindings) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: itemId,
    data: {
      kind: "item",
      itemId,
      containerId
    } satisfies DragItemData
  });

  return (
    <>
      {children({
        attributes,
        listeners,
        setNodeRef,
        style: {
          transform: CSS.Transform.toString(transform),
          transition
        },
        isDragging
      })}
    </>
  );
}

function createMoveAction(
  state: TierListState,
  event: DragEndEvent,
  resolveItemContainer: (state: TierListState, itemId: string) => string | null,
  resolveContainerItemIds: (
    state: TierListState,
    containerId: string
  ) => string[]
): TierListAction | null {
  const { active, over } = event;
  const itemId = getItemId(active);

  if (itemId === null || !state.items[itemId] || over === null) {
    return null;
  }

  const fromContainerId = resolveItemContainer(state, itemId);
  const toContainerId = getContainerId(over);

  if (fromContainerId === null || toContainerId === null) {
    return null;
  }

  const destinationItemIds = resolveContainerItemIds(state, toContainerId);
  const overItemId = getItemId(over);
  let toIndex = destinationItemIds.length;

  if (overItemId !== null && overItemId !== itemId) {
    const overIndex = destinationItemIds.indexOf(overItemId);

    if (overIndex >= 0) {
      toIndex =
        fromContainerId === toContainerId
          ? overIndex
          : overIndex + (isAfterOverItem(event) ? 1 : 0);
    }
  } else if (fromContainerId === toContainerId) {
    toIndex = getSameContainerFallbackIndex(
      event,
      destinationItemIds.length,
      destinationItemIds.indexOf(itemId)
    );
  }

  if (fromContainerId === toContainerId) {
    const fromIndex = destinationItemIds.indexOf(itemId);

    if (fromIndex === -1 || fromIndex === toIndex) {
      return null;
    }
  }

  return {
    type: "MOVE_ITEM",
    itemId,
    toContainerId,
    toIndex
  };
}

function getItemId(
  draggable: DragEndEvent["active"] | NonNullable<DragEndEvent["over"]>
): string | null {
  const data = getDragData(draggable);
  return data?.kind === "item" ? String(draggable.id) : null;
}

function getContainerId(
  draggable: DragEndEvent["active"] | NonNullable<DragEndEvent["over"]>
): string | null {
  const data = getDragData(draggable);

  if (data?.kind === "container" || data?.kind === "item") {
    return data.containerId;
  }

  return null;
}

function getDragData(
  draggable: DragEndEvent["active"] | NonNullable<DragEndEvent["over"]>
): DragData | null {
  return readDragData(draggable.data.current);
}

function getSameContainerFallbackIndex(
  event: DragEndEvent,
  itemCount: number,
  fromIndex: number
): number {
  const initialRect = event.active.rect.current.initial;
  const translatedRect = event.active.rect.current.translated;

  if (initialRect === null || translatedRect === null || fromIndex < 0) {
    return itemCount;
  }

  const deltaX = translatedRect.left - initialRect.left;
  const deltaY = translatedRect.top - initialRect.top;

  if (Math.abs(deltaY) > initialRect.height / 2) {
    return deltaY < 0 ? 0 : itemCount;
  }

  if (Math.abs(deltaX) > initialRect.width / 4) {
    return deltaX < 0 ? 0 : itemCount;
  }

  return fromIndex;
}

function readDragData(data: unknown): DragData | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (
    record.kind === "item" &&
    typeof record.itemId === "string" &&
    typeof record.containerId === "string"
  ) {
    return {
      kind: "item",
      itemId: record.itemId,
      containerId: record.containerId
    };
  }

  if (record.kind === "container" && typeof record.containerId === "string") {
    return {
      kind: "container",
      containerId: record.containerId,
      itemCount: typeof record.itemCount === "number" ? record.itemCount : 0
    };
  }

  return null;
}

function isAfterOverItem(event: DragEndEvent): boolean {
  if (event.over === null || event.active.rect.current.translated === null) {
    return false;
  }

  const activeRect = event.active.rect.current.translated;
  const overRect = event.over.rect;
  const activeCenterX = activeRect.left + activeRect.width / 2;
  const activeCenterY = activeRect.top + activeRect.height / 2;
  const overCenterX = overRect.left + overRect.width / 2;
  const overCenterY = overRect.top + overRect.height / 2;

  if (Math.abs(activeCenterY - overCenterY) > overRect.height / 2) {
    return activeCenterY > overCenterY;
  }

  return activeCenterX > overCenterX;
}
