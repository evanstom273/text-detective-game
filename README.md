# Text Detective Game

Foundation for the Text Detective Game case-generator project.

This repository currently contains only the application/tooling foundation and a minimal placeholder page. Procedural generation, game mechanics, case generation, and game data models are intentionally out of scope for this stage.

## Local development

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Run the full local check sequence with:

```bash
pnpm check
```

To test the production PWA locally:

```bash
pnpm build
pnpm vite preview
```

## PWA behavior

The production build includes a standalone web app manifest, temporary PNG icons, and a Workbox-generated service worker. The service worker is disabled during normal Vite development so local work is not affected by stale caches.

The development screen shows `Install App` only after the browser exposes its native `beforeinstallprompt` event. When the app is already running in standalone mode, it shows `Installed app` instead. Browsers that do not expose that event, including some Safari and Firefox contexts, will not show the button; those platforms may require their normal browser-specific “Add to Home Screen” flow.

When a newer service-worker version is detected, the screen shows `Update available`. Updating is user-triggered and reloads only after choosing `Update now`; dismissing it leaves the current session running.

## Project boundaries

- `src/app` contains the React entry point and UI.
- `src/generator` is reserved for future procedural generator logic and is intentionally empty of game behavior for now.

## Deployment

The Vercel configuration builds the Vite app into `dist` and skips Git-triggered builds for refs other than `main`. In the Vercel project settings, set `main` as the Production Branch and confirm that automatic preview deployments are disabled or restricted if the project is connected directly to GitHub.

No Supabase project, tables, schemas, migrations, or client integration are configured yet. When backend requirements are defined, add only the required environment variables and integration at that time.
