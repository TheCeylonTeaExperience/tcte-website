This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database & Prisma Setup

The authentication system relies on Prisma and MySQL. Configure your environment and schema before running the app:

```bash
# 1. Ensure the .env/.env.local files contain a valid DATABASE_URL and JWT secrets
# 2. Apply migrations (creates the users and refresh_tokens tables)
npx prisma migrate dev --name init

# 3. Generate the Prisma client (already handled during `npm install`, safe to rerun)
npx prisma generate
```

## Required Environment Variables

| Variable             | Description                                      | Default       |
| -------------------- | ------------------------------------------------ | ------------- |
| `DATABASE_URL`       | MySQL connection string                          | –             |
| `JWT_ACCESS_SECRET`  | HS256 secret (>=32 chars) for access tokens      | –             |
| `JWT_REFRESH_SECRET` | HS256 secret (>=32 chars) for refresh tokens     | –             |
| `JWT_ACCESS_EXPIRY`  | Access token lifetime (`15m`, `1h`, etc.)        | `15m`         |
| `JWT_REFRESH_EXPIRY` | Refresh token lifetime (`7d`, `30d`, `1w`, etc.) | `7d`          |
| `NODE_ENV`           | Controls cookie security flags                   | `development` |

## API Endpoints

All endpoints return JSON and live under `/api`. Access tokens belong in the `Authorization: Bearer <token>` header and refresh tokens are stored in the `refreshToken` httpOnly cookie.

### `POST /api/auth/login`

- Body: `{ "email": "user@example.com", "password": "Password123" }`
- On success: issues a short-lived access token, rotates the refresh token (stored hashed in MySQL), and sets the secure cookie.

### `POST /api/auth/refresh`

- Reads the refresh token from the cookie, verifies DB state (revocation + expiration), deletes the old record, and returns a new access token plus cookie.

### `POST /api/auth/logout`

- Revokes the current refresh token (if present) and clears the cookie.

### `POST /api/auth/logout-all`

- Requires an access token in the `Authorization` header.
- Revokes **all** refresh tokens for the user and clears the cookie, effectively signing out every device.

### `GET /api/protected-example`

- Protected by `middleware.js`. Requires a valid Bearer access token. Returns the injected user payload for quick verification/testing.

## Token & Cookie Behaviour

- Access tokens are **never** persisted in the database.
- Refresh tokens are hashed with `bcryptjs` before storage and rotated on every refresh.
- Cookies use `httpOnly`, `sameSite: 'strict'`, `secure` (in production), and a dynamic `maxAge` derived from `JWT_REFRESH_EXPIRY`.
- Secrets shorter than 32 characters throw on startup to prevent insecure deployments.

## Validation & Tooling

- `npm run lint` – Lints the project (warnings currently exist in legacy pages; new auth files pass the ruleset).
- `npm run dev` – Starts Next.js locally with middleware-protected APIs.
- `npx prisma studio` – Optional UI to inspect the `users` and `refresh_tokens` tables while developing.

## Deployment Notes

- Ensure the production environment exposes the same environment variables listed above.
- Run `npx prisma migrate deploy` as part of your CI/CD pipeline before starting the Next.js server.
- Configure HTTPS so secure cookies function correctly in production.
