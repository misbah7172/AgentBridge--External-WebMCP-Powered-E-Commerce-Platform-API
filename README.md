# AgentBridge Store

AgentBridge is a standalone Next.js e-commerce application with a PostgreSQL/Prisma data layer. It intentionally does **not** implement WebMCP. Any WebMCP functionality belongs in a separate, website-specific AgentBridge adapter repository.

## Local setup

1. Create a local PostgreSQL database named `agentbridge`. This project defaults to `postgresql://postgres:postgres@localhost:5432/agentbridge?schema=public` in `.env`; edit it if your PostgreSQL username, password, host, or port differs.
2. Run `npm install`.
3. Run `npm run db:migrate`, then `npm run db:seed`.
4. Run `npm run dev`.

## Demo credentials

After running `npm run db:seed`, use the following local/demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@example.com` | `ChangeMe123!` |
| Administrator | `admin@example.com` | `ChangeMe123!` |

These credentials are seed data only. Replace them in every non-demo environment and do not treat them as credentials for a separately provisioned deployment.

## Architecture

Next.js UI → route handlers → services → Prisma repositories → PostgreSQL. Route handlers validate input with Zod, return a consistent JSON envelope, and derive authorization solely from HTTP-only server-validated sessions.

## WebMCP integration classification

This repository is the **origin application**, not the WebMCP adapter. It intentionally does not register browser WebMCP tools. Its role is to expose the commerce capabilities consumed by the separate [AgentBridge WebMCP Adapter](https://github.com/misbah7172/AgentBridge--External-WebMCP-API-Adapter).

The overall solution is an **API Adapter**, not a UI or browser-automation adapter:

```text
Website REST API → External Adapter → WebMCP tools → Agent
```

The storefront provides standard REST routes under [`app/api/`](app/api/) for products, cart, wishlist, orders, checkout, shipping, and authentication. The external adapter maps approved routes to browser-native WebMCP tools using `fetch()` with `credentials: "include"`. Playwright is used only for E2E verification; it is not part of production tool execution.

The adapter never accesses the database directly or bypasses origin authorization. The storefront remains responsible for sessions, resource ownership, stock, coupon, and order rules.

## Verification

Run `npm run build` and `npm test`. The WebMCP browser journey is intentionally isolated: configure `E2E_BASE_URL`, `E2E_EMAIL`, and `E2E_PASSWORD` for a disposable adapter deployment before running `npm run test:e2e`. API documentation is at `/docs/api`; the machine-readable specification is `/openapi.json`.

## Security

Passwords are bcrypt hashes, cookies are HTTP-only, and user IDs are never accepted as authorization input. Checkout uses a mock payment flow and never stores card data. Product, cart, address, and order operations validate all input and verify ownership server-side.
