# Project Analysis — Outillage General Benyahiya

> Full-stack e-commerce shop for an Algerian hardware/tool store.  
> **Frontend**: Next.js 16 (App Router) + Tailwind CSS v4 + Axios  
> **Backend**: Express 4 + Prisma ORM + MongoDB Atlas  
> **Notifications**: Telegram Bot API  

---

## 1. Project Root

```
/home/billelforreal/main/si chrif/
├── backend/          # Express API server
├── frontend/         # Next.js storefront + admin dashboard
└── .codex/           # (code assistant config)
```

---

## 2. Backend Architecture

### 2.1 Entry Points

| File | Purpose |
|------|---------|
| [server.js](file:///home/billelforreal/main/si%20chrif/backend/src/server.js) | Starts Express on port 4000, graceful shutdown |
| [app.js](file:///home/billelforreal/main/si%20chrif/backend/src/app.js) | CORS, JSON body parser, mounts `/api` routes |

### 2.2 Database — Prisma + MongoDB

| File | Purpose |
|------|---------|
| [schema.prisma](file:///home/billelforreal/main/si%20chrif/backend/prisma/schema.prisma) | Data models definition |
| [seed.js](file:///home/billelforreal/main/si%20chrif/backend/prisma/seed.js) | Seeds admin, 30 products, 2 orders, 2 wishlist sessions |

#### Models:

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **Admin** | `name`, `email` (unique), `passwordHash` | Single admin user |
| **Product** | `name`, `description`, `category` (enum), `price` (Float), `imageUrl`, `stock` | Categories: `OUTILLAGE_ELECTRIQUE`, `OUTILLAGE_SANS_FIL`, `OUTILLAGE_A_MAIN`, `PIECE_ACCESSOIRES`, `QUINCAILLERIE_CONSOMMABLES`, `ELECTRICITE_LUMIERE`, `PLOMBERIE`, `NOUVEAUTE`, `PROMOTION` |
| **Order** | `customerName`, `customerPhone`, `customerAddress`, `totalPrice`, `status` (enum: PENDING/CONFIRMED/DELIVERED/CANCELLED) | Has many `OrderItem` |
| **OrderItem** | `orderId`, `productId`, `quantity`, `price` | Junction between Order and Product |
| **WishlistItem** | `sessionId`, `productId` | Session-based wishlist (no login needed) |

### 2.3 Routes → Controllers → Services

| Route | Method | Auth | Controller → Service |
|-------|--------|------|---------------------|
| `/api/admin/login` | POST | ❌ | `adminController.login` → `adminService.loginAdmin` |
| `/api/admin/me` | GET | ✅ JWT | `adminController.me` |
| `/api/products` | GET | ❌ | `productController.getProducts` → `productService.getProducts` |
| `/api/products/:id` | GET | ❌ | `productController.getProductById` |
| `/api/products` | POST | ✅ JWT | `productController.createProduct` → `productService.createProduct` |
| `/api/products/:id` | PUT | ✅ JWT | `productController.updateProduct` |
| `/api/products/:id` | DELETE | ✅ JWT | `productController.deleteProduct` |
| `/api/orders` | POST | ❌ | `orderController.createOrder` → `orderService.createOrder` (validates stock, decrements) |
| `/api/orders` | GET | ✅ JWT | `orderController.getOrders` → includes orderItems + product relation |
| `/api/orders/:id` | GET | ❌ | `orderController.getOrderById` → includes orderItems + product |
| `/api/orders/:id/status` | PATCH | ✅ JWT | `orderController.updateOrderStatus` |
| `/api/wishlist` | POST | ❌ | `wishlistController.addWishlistItem` |
| `/api/wishlist/:sessionId` | GET | ❌ | `wishlistController.getWishlistBySessionId` |
| `/api/wishlist/:id` | DELETE | ❌ | `wishlistController.removeWishlistItem` |

### 2.4 Middlewares

| File | Purpose |
|------|---------|
| [authMiddleware.js](file:///home/billelforreal/main/si%20chrif/backend/src/middlewares/authMiddleware.js) | `requireAdminAuth` — validates JWT Bearer token, loads admin from DB |
| [errorMiddleware.js](file:///home/billelforreal/main/si%20chrif/backend/src/middlewares/errorMiddleware.js) | `notFoundHandler`, `errorHandler` — Prisma-aware error responses |
| [asyncHandler.js](file:///home/billelforreal/main/si%20chrif/backend/src/middlewares/asyncHandler.js) | Wraps async route handlers with try/catch |

### 2.5 Environment Variables (`.env`)

```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET, JWT_EXPIRES_IN (7d)
ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
```

---

## 3. Frontend Architecture

### 3.1 Tech Stack

- **Framework**: Next.js 16.2.4 (App Router)
- **CSS**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **HTTP Client**: Axios (for admin API calls), native `fetch` (for Next.js API routes)
- **State**: React Context (`CartProvider`, `AdminSessionProvider`)
- **Font**: Manrope (Google Fonts)

### 3.2 Route Structure

```
app/
├── layout.js                          # Root layout (Manrope font, RootProviders)
├── globals.css                        # Tailwind + theme imports
├── (shop)/                            # Public storefront group
│   ├── layout.js                      # SiteHeader + SiteFooter wrapper
│   ├── page.js                        # HOME PAGE — search, filter, product grid
│   ├── products/[id]/page.js          # Product detail page
│   ├── cart/page.js                   # Cart + order form (guest checkout)
│   └── checkout/page.js               # Redirects to /cart
├── admin/
│   ├── login/page.js                  # Admin login page
│   └── (protected)/                   # Requires JWT auth
│       ├── layout.js                  # AdminSessionProvider + AuthGuard + AdminShell
│       ├── page.js                    # ADMIN DASHBOARD — stats + recent orders table
│       ├── orders/page.js             # ADMIN ORDERS — full order table with status filter/update
│       └── products/
│           ├── page.js                # ADMIN PRODUCTS — product table with search, CRUD
│           ├── new/page.js            # Create new product form
│           └── [id]/edit/page.js      # Edit existing product form
└── api/
    └── orders/
        ├── route.js                   # POST (create order + Telegram) | GET (list orders, admin-only)
        └── [id]/status/route.js       # PATCH (update order status, admin-only)
```

### 3.3 Components Map

| Component | File | Purpose |
|-----------|------|---------|
| **SiteHeader** | [site-header.js](file:///home/billelforreal/main/si%20chrif/frontend/components/site-header.js) | Sticky header, hamburger menu, floating cart FAB |
| **SiteFooter** | [site-footer.js](file:///home/billelforreal/main/si%20chrif/frontend/components/site-footer.js) | Brand info, contact, store location |
| **ProductCard** | [product-card.js](file:///home/billelforreal/main/si%20chrif/frontend/components/product-card.js) | Product card used on home page grid |
| **CartLineItem** | [cart-line-item.js](file:///home/billelforreal/main/si%20chrif/frontend/components/cart/cart-line-item.js) | Single item row in cart |
| **ImageUpload** | [ImageUpload.jsx](file:///home/billelforreal/main/si%20chrif/frontend/components/ImageUpload.jsx) | Image upload component with preview + progress bar |
| **ProductForm** | [product-form.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/product-form.js) | Create/edit product form (uses ImageUpload) |
| **OrderStatusForm** | [order-status-form.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/order-status-form.js) | Status dropdown for admin order management |
| **AdminShell** | [admin-shell.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/admin-shell.js) | Admin layout with sidebar + main content |
| **Sidebar** | [sidebar.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/sidebar.js) | Admin nav (Overview, Products, Orders), logout |
| **AdminAuthGuard** | [admin-auth-guard.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/admin-auth-guard.js) | Redirects to login if no admin session |
| **AdminLoginForm** | [admin-login-form.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/admin-login-form.js) | Login form with JWT storage |
| **AdminSessionProvider** | [admin-session-provider.js](file:///home/billelforreal/main/si%20chrif/frontend/components/admin/admin-session-provider.js) | Context for admin auth state |
| **RootProviders** | [root-providers.js](file:///home/billelforreal/main/si%20chrif/frontend/components/providers/root-providers.js) | Wraps app with CartProvider |

#### UI Primitives

| Component | File | Purpose |
|-----------|------|---------|
| **Button** | [button.js](file:///home/billelforreal/main/si%20chrif/frontend/components/ui/button.js) | Variants: primary/secondary/ghost/danger, sizes: sm/md/lg |
| **Card** | [card.js](file:///home/billelforreal/main/si%20chrif/frontend/components/ui/card.js) | `.panel.rounded-2xl` wrapper |
| **SectionHeader** | [card.js](file:///home/billelforreal/main/si%20chrif/frontend/components/ui/card.js) | Eyebrow + title + description + optional action |
| **DataTable** | [table.js](file:///home/billelforreal/main/si%20chrif/frontend/components/ui/table.js) | Responsive table with column headers |
| **StatusBadge** | [status-badge.js](file:///home/billelforreal/main/si%20chrif/frontend/components/ui/status-badge.js) | Color-coded status pill (PENDING/CONFIRMED/DELIVERED) |
| **Logo** | [Logo.tsx](file:///home/billelforreal/main/si%20chrif/frontend/components/ui/Logo.tsx) | Brand logo image component |
| **EmptyState** | [empty-state.js](file:///home/billelforreal/main/si%20chrif/frontend/components/empty-state.js) | Empty state with title + CTA |
| **FormField** | [form-field.js](file:///home/billelforreal/main/si%20chrif/frontend/components/form-field.js) | Input/textarea/select with label |
| **LoadingState** | [loading-state.js](file:///home/billelforreal/main/si%20chrif/frontend/components/loading-state.js) | Spinner with title + description |

### 3.4 Library Files

| File | Purpose |
|------|---------|
| [api.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/api.js) | Axios instances (`api` for public, `adminApi` with JWT interceptor). Functions: `fetchProducts`, `fetchProduct`, `loginAdmin`, `fetchAdminMe`, `fetchAdminProducts`, `createAdminProduct`, `updateAdminProduct`, `deleteAdminProduct` |
| [auth.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/auth.js) | `getAdminToken`, `setAdminToken`, `clearAdminToken` — localStorage + cookie |
| [format.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/format.js) | `formatCurrency(value, currency="USD", locale="en-US")`, `formatDate`, `formatCategory` |
| [normalize.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/normalize.js) | `normalizeProduct`, `normalizeOrder`, `normalizeAdminUser` — handles various API shapes |
| [orders.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/orders.js) | Client-side order functions: `createOrder`, `fetchOrders`, `updateOrderStatus` — calls Next.js API routes |
| [orderServer.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/orderServer.js) | Server-side order operations: `createOrderRecord`, `listOrderRecords`, `updateOrderRecordStatus` — proxies to Express backend |
| [adminAuthServer.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/adminAuthServer.js) | Server-side admin auth verification |
| [telegram.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/telegram.js) | `sendTelegramOrderNotification` — sends HTML-formatted order notification to Telegram |

### 3.5 Hooks

| Hook | File | Purpose |
|------|------|---------|
| **useImageUpload** | [useImageUpload.js](file:///home/billelforreal/main/si%20chrif/frontend/hooks/useImageUpload.js) | Validates file type/size, reads as data URL (base64), returns data URL as "uploaded URL" — **NO actual cloud upload, just converts to base64** |

### 3.6 State Management

| Store | File | Purpose |
|-------|------|---------|
| **CartProvider** | [cart.js](file:///home/billelforreal/main/si%20chrif/frontend/store/cart.js) | React Context + useReducer. Persists to `localStorage`. Actions: ADD_ITEM, REMOVE_ITEM, SET_QUANTITY, CLEAR |

### 3.7 Styling

| File | Purpose |
|------|---------|
| [theme.css](file:///home/billelforreal/main/si%20chrif/frontend/styles/theme.css) | CSS custom properties: `--background`, `--foreground`, `--accent`, `--danger`, etc. |
| [globals.css](file:///home/billelforreal/main/si%20chrif/frontend/app/globals.css) | Tailwind import, theme mapping to `@theme inline`, body gradient, `.page-shell`, `.panel`, `.input-base`, `.btn-primary`, `.btn-secondary` |

---

## 4. Data Flow

### 4.1 Product Browsing (Customer)
```
Customer → Home Page (page.js) → fetchProducts() [Axios → Express /api/products]
         → Products displayed in grid via <ProductCard>
         → Click product → /products/[id] → fetchProduct(id)
         → "Add to cart" → CartProvider (localStorage)
```

### 4.2 Order Placement (Customer)
```
Customer → /cart → fills name, phone, address
         → createOrder() [fetch → Next.js /api/orders → Express /api/orders]
         → Express: validates items, checks stock, decrements stock, creates Order + OrderItems
         → Next.js API: sends Telegram notification
         → Success screen shown
```

### 4.3 Admin Dashboard
```
Admin → /admin/login → loginAdmin() → JWT stored in localStorage + cookie
      → /admin → Dashboard (stats: products count, orders count, pending, revenue)
      → /admin/orders → Order table with status filter + OrderStatusForm dropdown
      → /admin/products → Product table with CRUD (search, filter, delete, edit)
```

### 4.4 Image Upload Flow
```
Admin → ProductForm → ImageUpload component → useImageUpload hook
      → File selected → validateImage (type, size ≤ 6MB)
      → readAsDataURL(file) → Returns base64 data URL
      → Data URL stored as "imageUrl" in product
      → Sent to backend: createAdminProduct({ imageUrl: base64DataUrl })
      → Stored in MongoDB as base64 string
```

---

## 5. Known Issues & Areas for Improvement

### 5.1 Currency — Currently USD
- **File**: [format.js](file:///home/billelforreal/main/si%20chrif/frontend/lib/format.js) line 1: `formatCurrency(value, currency = "USD", locale = "en-US")`
- All price displays use this function with default USD
- Label texts show "DA" but the formatted output shows "$"

### 5.2 Image Upload — Base64 Data URL Issue
- **File**: [useImageUpload.js](file:///home/billelforreal/main/si%20chrif/frontend/hooks/useImageUpload.js) line 62: `readAsDataUrl(file)`
- Images are converted to base64 data URLs (can be 1-8MB strings!)
- These massive strings are stored in MongoDB as `imageUrl`
- Base64 URLs work in `<img>` tags but Next.js `<Image>` may reject non-http URLs or blob URLs
- `next.config.mjs` only allows `images.unsplash.com`, `picsum.photos`, `example.com` — no data URL pattern

### 5.3 Language — Currently English
- All UI text is hardcoded in English across all components
- No i18n/localization system exists
- Category labels are already in French in code (e.g., "Outillage électrique")

### 5.4 Admin Orders — No Item Detail View
- In [admin orders page](file:///home/billelforreal/main/si%20chrif/frontend/app/admin/%28protected%29/orders/page.js), clicking an order only shows item count (`order.items.length`), not individual item details
- No expandable/click-to-view order items UI

### 5.5 Product Detail Page — No Back Button
- [products/[id]/page.js](file:///home/billelforreal/main/si%20chrif/frontend/app/%28shop%29/products/%5Bid%5D/page.js) has a text link "Back to catalog" but no prominent button
- Need a clear, visible back button

### 5.6 Mobile Responsiveness
- Layout uses some responsive classes but not thoroughly optimized for mobile
- Admin sidebar doesn't collapse on mobile
- Tables overflow on small screens without proper mobile alternatives
- Search bars and filters need mobile optimization

---

## 6. Environment & Configuration

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### `next.config.mjs` — Image Domains
```js
images.unsplash.com, picsum.photos, example.com
```

### Port
- Backend: `4000`
- Frontend: `3000` (Next.js default)

---

## 7. Brand Info
- **Name**: `Outillage General Benyahiya`
- **Logo**: `/public/logo.png` (382KB)
- **Theme**: Yellow/gold accent (`#ffd400`, `#f6c800`), warm white background, dark foreground
- **Target Market**: Algeria (Alger, Blida, Tipaza, Boumerdes delivery locations)
