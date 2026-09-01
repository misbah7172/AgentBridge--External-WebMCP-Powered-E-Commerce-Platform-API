# AgentBridge Store

AgentBridge is a standalone Next.js e-commerce application with a PostgreSQL/Prisma data layer. It intentionally does **not** implement WebMCP. Any WebMCP functionality belongs in a separate, website-specific AgentBridge adapter repository.

## Local setup

1. Create a local PostgreSQL database named `agentbridge`. This project defaults to `postgresql://postgres:postgres@localhost:5432/agentbridge?schema=public` in `.env`; edit it if your PostgreSQL username, password, host, or port differs.
2. Run `npm install`.
3. Run `npm run db:migrate`, then `npm run db:seed`.
4. Run `npm run dev`.

Development users after seeding: `customer@example.com` and `admin@example.com`, both with password `ChangeMe123!`. Change these outside local development.

## Architecture

Next.js UI → route handlers → services → Prisma repositories → PostgreSQL. Route handlers validate input with Zod, return a consistent JSON envelope, and derive authorization solely from HTTP-only server-validated sessions.

## Verification

Run `npm run build`, `npm test`, and `npm run test:e2e` (after configuring a running database and application). API documentation is at `/docs/api`; the machine-readable specification is `/openapi.json`.

## Security

Passwords are bcrypt hashes, cookies are HTTP-only, and user IDs are never accepted as authorization input. Checkout uses a mock payment flow and never stores card data. Product, cart, address, and order operations validate all input and verify ownership server-side.
