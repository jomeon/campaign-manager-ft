# Campaign Manager

A responsive single-page app for managing advertising campaigns — full **CRUD** (create, read, update, delete) for the products a seller wants to advertise.

Each campaign captures a name, keywords, a bid amount, a fund that is deducted from the seller's **Emerald** balance, an on/off status, an optional town, and a delivery radius.

**Live demo:** https://jomeon.github.io/campaign-manager-ft/

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

---

## Features

- **Full CRUD** — create, edit, delete and list campaigns.
- **Emerald balance** — campaign funds are deducted from a live balance shown in the header; deleting a campaign refunds its fund, editing applies the difference. Spending more than the balance is blocked with an inline error.
- **Keyword typeahead** — custom accessible component: filter-as-you-type, keyboard navigation (↑ ↓ Enter Esc), removable chips, duplicate protection, max 20 keywords.
- **Validation** — schema-driven with Zod + React Hook Form. Required fields, minimum bid, positive fund, radius cap.
- **Status toggle** — a real on/off switch with optimistic updates.
- **Town dropdown** — pre-populated list of Polish towns (optional field).
- **Search & filter** — by name/keyword and by status.
- **Responsive** — mobile-first, 1 → 2 → 3 column grid, bottom-sheet modal on small screens.
- **Polish** — skeleton loaders, toasts, empty/error states, delete confirmation, error boundary, WCAG AA contrast.

---

## Tech stack

| Concern      | Choice                                |
| ------------ | ------------------------------------- |
| UI           | React 18 + Vite                       |
| Language     | TypeScript                            |
| Styling      | SCSS Modules (design tokens + mixins) |
| Forms        | React Hook Form + Zod                 |
| Server state | TanStack Query v5                     |
| Client state | Zustand (Emerald balance, toasts)     |
| Persistence  | Browser `localStorage`                |
| Icons        | lucide-react                          |
| Testing      | Vitest + Testing Library              |

---

## Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
npm install
npm run dev      # http://localhost:5173
```

### Scripts

| Script              | What it does                        |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start the Vite dev server           |
| `npm run build`     | Type-check and build for production  |
| `npm run preview`   | Preview the production build         |
| `npm run lint`      | Lint with ESLint                     |
| `npm run typecheck` | Type-check without emitting          |
| `npm run test`      | Run unit tests (watch)               |
| `npm run test:run`  | Run unit tests once                  |

---

## Data & persistence

There is no separate backend to run. Campaigns are persisted in the browser's
**`localStorage`** through a small async data layer ([`src/api/campaigns.ts`](src/api/campaigns.ts))
that mirrors a REST client, so the UI keeps realistic loading and optimistic
states and could be pointed at a real API by editing that one file.

On first load the list is seeded from [`src/constants/seedCampaigns.ts`](src/constants/seedCampaigns.ts).
The Emerald balance starts at **10 000 PLN** and is also kept in `localStorage`.
Clear site data to reset everything.

---

## Project structure

```
src/
├── api/            localStorage-backed campaign data layer
├── components/
│   ├── campaigns/  CampaignList, CampaignCard, CampaignForm, CampaignFilters
│   ├── layout/     Header (with Emerald balance), Layout
│   └── ui/         Button, Badge, Toggle, Modal, ConfirmDialog,
│                   Typeahead, EmptyState, Skeleton, Toaster
├── constants/      towns, keyword suggestions, seed campaigns
├── hooks/          useCampaigns (TanStack Query), useEmeraldBalance
├── pages/          CampaignsPage (wires the whole flow)
├── store/          Zustand stores (emerald balance, toasts)
├── styles/         SCSS design tokens, reset, globals
├── types/          Campaign type + Zod schema
└── utils/          formatting + classnames helpers
```

---

## Deployment

Pushing to `main` builds the app and publishes it to **GitHub Pages** via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The Vite `base`
is set to the repository name for correct asset paths on the project URL.
