import { describe, expect, it } from "vitest";
import {
  UNRANKED_CONTAINER_ID,
  createInitialTierListState,
  createTierListReducer
} from "./state";

describe("createTierListReducer", () => {
  it("uses injected item-id dependency when adding items", () => {
    const reducer = createTierListReducer({
      createItemId: () => "item-fixed"
    });
    const initial = createInitialTierListState();

    const next = reducer(initial, { type: "ADD_ITEM", label: "  Chess  " });

    expect(Object.keys(next.items)).toEqual(["item-fixed"]);
    expect(next.items["item-fixed"]).toEqual({
      id: "item-fixed",
      label: "Chess"
    });
    expect(next.unranked).toEqual(["item-fixed"]);
  });

  it("moves a known item into tier placement using move action", () => {
    const reducer = createTierListReducer({
      createItemId: () => "item-fixed"
    });
    const initial = createInitialTierListState();
    const withItem = reducer(initial, { type: "ADD_ITEM", label: "Chess" });
    const destinationTierId = withItem.tiers[0]?.id;

    expect(destinationTierId).toBeTruthy();

    const next = reducer(withItem, {
      type: "MOVE_ITEM",
      itemId: "item-fixed",
      toContainerId: destinationTierId!,
      toIndex: 0
    });

    expect(next.unranked).toEqual([]);
    expect(next.placements[destinationTierId!]).toEqual(["item-fixed"]);
    expect(next.placements[destinationTierId!]).not.toContain(
      UNRANKED_CONTAINER_ID
    );
  });
});
