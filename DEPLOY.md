# Deploying iffykhan.ae

The site is a static Next.js export published by the existing Cloudflare Worker
`new-sitetest`. Wrangler is restricted to the generated `out/` directory, so a
deploy is a full replacement of the Worker assets rather than an upload of the
repository root.

## Prerequisites

- Node.js 20 or newer
- Access to the Cloudflare account that owns `new-sitetest`
- An authenticated Wrangler session (`npx wrangler login` when needed)

## Build and verify

Run from the repository root:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run check:js-budget
npm run test:e2e
```

`npm run build` creates `out/`, including the generated routes, branded 404,
robots and sitemap files, security/cache headers, redirects, and approved local
media. `npm run test:e2e` serves that exact directory through Wrangler.

## Deploy

```bash
npx wrangler deploy
```

The Worker name and domain binding are already defined outside the static asset
bundle. Do not change those bindings during a routine site deployment.

## Verify production

```bash
curl -sI https://iffykhan.ae/ | head -1
curl -sI https://iffykhan.ae/about | head -1
curl -sI https://iffykhan.ae/areas | head -1
curl -sI https://iffykhan.ae/random-test-page | head -1
curl -s https://iffykhan.ae/random-test-page | grep -o '<title>[^<]*</title>'
curl -s https://iffykhan.ae/random-test-page | grep -o 'name="robots" content="[^"]*"'
curl -sI https://iffykhan.ae/assets/images/iffykhan-og.jpg | grep -i '^location:'
```

Expected results:

- Main routes return `200`.
- The unknown route returns `404`, uses the branded page, and includes
  `noindex`.
- The legacy social-image URL redirects to `/media/iffykhan-og.jpg`.

Wrangler asset deployments are full replacements. That property removes
orphaned files from previous static builds, while the current advisor film is
retained because it is now an explicitly activated part of the landing page.
