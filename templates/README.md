# Seamless Auth React Templates

The repository root is the default React auth-routes starter. The directories
here are complete alternative web starters intended for CLI selection.

## Variants

- `headless`: custom app-owned auth UI built with `useAuthClient()`,
  `useAuth()`, and `usePasskeySupport()`.
- `oauth`: passkey sign-in plus dynamic OAuth provider buttons and an
  `/oauth/callback` completion route.

Each variant includes its own package metadata, Vite config, Docker files,
runtime config, and README. A CLI can copy the selected directory directly into
the generated project's `web/` directory.
