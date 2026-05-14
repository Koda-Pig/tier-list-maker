# Tier List Maker Context

This context defines the product-language terms used for architecture deepening and refactoring decisions in this repository.

## Language

**Tier List**:
The full ranking artifact composed of tiers, ranked placements, and an unranked pool.
_Avoid_: Board, grid, table

**Tier List Item**:
A user-created rankable item that can move between the unranked pool and tiers.
_Avoid_: Card, token, entity

**Tier**:
A labeled ranking bucket within a tier list that can hold zero or more item placements.
_Avoid_: Row, lane, column

**Unranked Pool**:
The staging area for tier list items that are not currently placed in any tier.
_Avoid_: Backlog, inbox, unsorted list

**Placement**:
The position of a tier list item within either a specific tier or the unranked pool.
_Avoid_: Mapping, assignment record

## Relationships

- A **Tier List** contains one **Unranked Pool** and one or more **Tiers**
- A **Tier List Item** has exactly one active **Placement** at a time
- A **Placement** points to either a **Tier** or the **Unranked Pool**

## Example dialogue

> **Dev:** "When we drag a **Tier List Item** from one **Tier** to another, is that one move or a remove+add sequence in domain terms?"
> **Domain expert:** "Treat it as one **Placement** update; the item always has exactly one active placement."

## Flagged ambiguities

- "Unranked" and "staging area" were both used for the same concept; resolved term is **Unranked Pool**.
- "Item" and "pill" were both used interchangeably in UI discussions; resolved domain term is **Tier List Item** ("pill" is UI-only wording).
