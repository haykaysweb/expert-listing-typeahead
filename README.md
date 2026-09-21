# Expert Listing Frontend Screening Task
Modular React + TypeScript + Tailwind CSS typeahead/autocomplete search component querying Open-Meteo Geocoding API.

## Features
- Debounced input (300ms)
- Race condition & stale response cancellation via `AbortController`
- Keyboard navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`)
- Reusable sub-components (`SearchInput`, `DropdownList`)
- Loading, empty, and error feedback states

## Run Locally
```bash
npm install
npm run dev
