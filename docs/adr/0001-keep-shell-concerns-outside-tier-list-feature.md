# Keep shell concerns outside TierListFeature

When deepening the Tier List Module seam, we decided to keep app-shell concerns (theme mode persistence, document-level title effects, and page chrome) outside `TierListFeature` and inside `App.tsx`. We rejected pulling those concerns behind the feature seam because it would blur Module ownership and reduce Locality by mixing cross-app shell behavior into Tier List Implementation details.
