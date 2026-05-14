# Tier List Maker

A drag-and-drop tier list app built with React, TypeScript, and Vite.

## Live Demo

Deployed on Netlify: [https://tierlist-maker.netlify.app/](https://tierlist-maker.netlify.app/)

## Current Features

- Editable tier list title
- Add custom items to an unranked pool
- Drag and drop items between tiers and unranked
- Reorder items within the same tier
- Add optional extra tiers and remove empty optional tiers
- Unrank individual items or delete them entirely
- Reset the list back to default state
- Ranking progress indicator (count + percentage)

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- `@dnd-kit` (`core`, `sortable`, `utilities`) for drag and drop
- ESLint for linting
- Playwright dependency and sample test file scaffold

## Development

### Prerequisites

- Node.js 20+ (recommended)
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```
