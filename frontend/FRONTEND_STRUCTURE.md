# Frontend Project Structure — Atelier Market

This document describes the frontend workspace layout, responsibilities of key folders/files, and guidance for where to make changes.

## High level
- Framework: Next.js App Router (React 19) + TailwindCSS
- Main responsibilities:
  - Public storefront (product catalog, product pages, cart)
  - Admin area (login, product CRUD, order management)
  - Lightweight API client wired to backend at `NEXT_PUBLIC_API_URL`

## Top-level files
- `package.json` — project dependencies and scripts.
- `next.config.mjs` — Next.js configuration.
- `README.md` — setup and high-level notes.
- `.env.local` — environment (not checked in) — contains `NEXT_PUBLIC_API_URL`.

## app/
App Router routes and layouts.

- `(shop)/` — public storefront and product pages
  - `page.js` — home / product listing with search and filters
  - `products/[id]/page.js` — product detail view
  - `cart/page.js` — cart UI
  - `checkout/page.js` — order flow

- `admin/` — admin area
  - `login/page.js` — admin login page
  - `(protected)/` — authenticated admin routes
    - `products/page.js` — admin product list & management
    - `products/new/page.js` — create product form
    - `products/[id]/edit/page.js` — edit product form
    - `orders/page.js` — admin orders list

## components/
Reusable UI components used across the app.

- `admin/` — admin-specific components
  - `product-form.js` — form used for create/edit product
  - `admin-login-form.js`, `admin-auth-guard.js`, etc.
- `cart/` — cart line items and helpers
- `ui/` — primitive UI elements: `button.js`, `card.js`, `table.js`, `Logo.tsx`
- `ImageUpload.jsx` — managed image uploader
- `product-card.js` — product display on listing pages

## lib/
Application helpers and API client.

- `api.js` — axios client for backend and admin API helpers
- `auth.js`, `adminAuthServer.js`, `orderServer.js` — auth and orders helpers
- `format.js` — formatCurrency, formatCategory
- `normalize.js` — normalizing API responses to app shape

## store/
Client-side stores and hooks.
- `cart.js` — localStorage-backed cart store

## hooks/
- `useImageUpload.js` — image uploader hook used by admin form

## styles/
Global CSS & theme variables.
- `globals.css` — Tailwind layers and theme overrides
- `theme.css` — custom CSS variables

## API routes (Next.js)
- `app/api/orders/*` — server-side order creation and webhook proxies

## Notes for common tasks
- Add new product field: update `backend/prisma/schema.prisma`, `frontend/lib/normalize.js`, `frontend/lib/api.js`, and `frontend/components/admin/product-form.js`.
- Wire API changes: update `frontend/lib/api.js` and normalize functions accordingly.
- Styling adjustments: edit components in `components/ui/` or page-level `app/*/page.js` files.

## How to run locally
1. Start backend: `cd backend && npm run dev` (or `npm start`) and ensure MongoDB URI is set.
2. Start frontend: `cd frontend && npm run dev`
3. Seed backend (optional): `cd backend && node prisma/seed.js` — admin creds: `admin@test.com` / `hashedpassword`.

## Where I cleaned up UI
- Admin product list: `app/admin/(protected)/products/page.js` — unified layout, search/filter panel, responsive table.

If you want, I can also generate a smaller `file-list.md` that lists every file in `frontend/` with a one-line description.
