# Seamless Auth React Headless Template

A Vite + React starter that uses the Seamless Auth React SDK without mounting
the SDK-provided auth routes.

## What This Template Shows

- `AuthProvider` configured with the application API origin
- Custom login and registration screens built with `useAuthClient()`
- Passkey support detection with `usePasskeySupport()`
- Phone OTP, email OTP, magic-link, and passkey continuation handling
- Custom `/verify-magiclink` callback handling without `AuthRoutes`
- Protected routes and protected API calls through the companion Express starter

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

The app expects the companion API origin in `.env`:

```text
VITE_API_URL=http://localhost:3000/
```

The companion Express starter mounts the Seamless Auth adapter at `/auth`, so
the React SDK sends auth requests to `${VITE_API_URL}/auth/...`.

## Template Notes

The root auth flow lives in `src/pages/HeadlessAuth.tsx`. It intentionally uses
the SDK primitives directly so application teams can replace the markup without
changing the auth protocol.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
