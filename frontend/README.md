# Atelier Market Frontend

Production-ready shop frontend built with Next.js App Router, TailwindCSS, and Axios.

## Features

- Public storefront with product list, product details, cart, and simple order placement
- LocalStorage-backed cart using React context
- Admin login flow with JWT storage and protected admin routes
- Admin dashboard, product CRUD screens, and order status management
- Mobile-first responsive layout with clean reusable components

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Set the backend base URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-admin-chat-id
```

## Product Images

Product images selected in the admin UI are converted to data URLs and saved through the product API.

## MongoDB Orders + Telegram

Orders are created through the cart, stored by the backend in MongoDB, and notify admins through Telegram.

The order status flow is:

`pending -> confirmed -> delivered`

No credit card details are collected, stored, or sent to Telegram.

4. Start the frontend:

```bash
npm run dev
```

## API assumptions

This frontend is wired to backend product/admin auth routes and Next.js order routes:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET /api/products` (admin list uses the same route with auth)
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders` (Next.js route, proxies to MongoDB backend and notifies Telegram)
- `GET /api/orders` (Next.js admin route, reads from MongoDB backend)
- `PATCH /api/orders/:id/status` (Next.js admin route, updates MongoDB backend)

The default local backend URL is `http://localhost:4000`, which matches the backend server default in `src/server.js`.

After running the backend seed, you can sign into the admin area with:

- Email: `admin@test.com`
- Password: `hashedpassword`

## Project structure

```text
app/
  (shop)/
    cart/page.js
    checkout/page.js (redirects to cart)
    products/[id]/page.js
    layout.js
    page.js
  admin/
    login/page.js
    (protected)/
      products/page.js
      products/new/page.js
      products/[id]/edit/page.js
      orders/page.js
      layout.js
      page.js
components/
  admin/
  cart/
  providers/
lib/
store/
styles/
proxy.js
```
