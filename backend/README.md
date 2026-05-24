# Simple Shop Backend

Minimal production-ready backend using Express, Prisma, and MongoDB.

## Stack

- Node.js
- Express.js
- Prisma ORM
- MongoDB
- dotenv
- cors

## Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── lib/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Database Models

- `Admin`
- `Product`
- `Order`
- `OrderItem`
- `WishlistItem`

The Prisma schema includes MongoDB ObjectId primary keys, collection relations, numeric money fields, order status handling, and a session-based wishlist model.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `MONGODB_URI` in `.env` to match your MongoDB database.

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Apply the schema to the database:

```bash
npm run prisma:push
```

MongoDB uses `prisma db push`; Prisma migrations are not used for this connector.

## Run

Seed the database with demo data:

```bash
npm run seed
```

This creates a test admin you can use from the frontend:

- Email: `admin@test.com`
- Password: `hashedpassword`

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Health Check

`GET /` returns a simple JSON response to confirm the server is running.

## API Summary

- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `POST /api/wishlist`
- `GET /api/wishlist/:sessionId`
- `DELETE /api/wishlist/:id`
