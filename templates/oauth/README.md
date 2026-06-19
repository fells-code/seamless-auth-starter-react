# Seamless Auth React OAuth Template

A Vite + React starter showing passkey sign-in alongside OAuth providers
configured on the Seamless Auth API.

## What This Template Shows

- `AuthProvider` configured with the application API origin
- Dynamic provider buttons from `listOAuthProviders()`
- OAuth redirect start with `startOAuthLogin()`
- `/oauth/callback` completion with `finishOAuthLogin()`
- Passkey sign-in as a first-class option
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

## OAuth Server Configuration

The UI lists only providers returned by the auth server. To make buttons appear,
enable OAuth on the Seamless Auth API:

```text
LOGIN_METHODS=passkey,magic_link,oauth
OAUTH_PROVIDERS=[{...}]
```

Provider client secrets stay on the server in environment variables referenced
by each provider's `clientSecretEnv`.

For local development, provider redirect URIs should include:

```text
http://localhost:5173/oauth/callback
```

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
