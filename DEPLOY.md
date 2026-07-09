# Deploying iffykhan.ae (Worker: new-sitetest)

One-time Wrangler deploy to enable the branded 404 page
(`not_found_handling = "404-page"` cannot be set via dashboard drag-and-drop).

## Prerequisites
- Node.js 18+ (`node --version` — if missing, install the LTS from https://nodejs.org)
- Access to the Cloudflare account that owns the `new-sitetest` Worker

## Run these from THE SITE FOLDER
(the folder containing index.html and wrangler.jsonc — either
`~/Claude/code/deploy 20` on Rayy's Mac, or the extracted
`iffykhan-build-2026-07-09-U6.zip`)

```bash
cd "/Users/rayy/Claude/code/deploy 20"     # or the extracted zip folder

# 1. Confirm wrangler runs (downloads on first use)
npx wrangler --version

# 2. Log in — opens a browser; approve with the Cloudflare account
#    that owns new-sitetest (skip if already logged in)
npx wrangler login

# 3. Deploy — uploads the site assets AND applies 404-page handling.
#    Assets deploys are full replacements, so this also purges old
#    orphaned files (iffy-film.mp4, superseded .jpg files).
npx wrangler deploy
```

Expected output ends with something like:
`Deployed new-sitetest ... https://new-sitetest.atlassingh11.workers.dev`

## What this does and does not touch
- DOES: publish the current folder as the Worker's static assets,
  apply `not_found_handling = "404-page"`.
- DOES NOT: change domain bindings (iffykhan.ae stays attached to the
  Worker by name), design, copy, or any dashboard settings.

## Verify after deploy
```bash
# must be HTTP/2 404 …
curl -sI https://iffykhan.ae/random-test-page | head -1
# … must print the branded page title
curl -s  https://iffykhan.ae/random-test-page | grep -o "<title>[^<]*</title>"
# … must include noindex
curl -s  https://iffykhan.ae/random-test-page | grep -o 'name="robots" content="noindex"'
# main pages still on build U6
curl -sL https://iffykhan.ae/        | grep -o 'name="build" content="[^"]*"'
curl -sL https://iffykhan.ae/about   | grep -o 'name="build" content="[^"]*"'
curl -sL https://iffykhan.ae/privacy | grep -o 'name="build" content="[^"]*"'
```

Expected: `404`, `<title>Page Not Found | Iffy Khan</title>`,
the noindex meta, and `2026-07-09-U6` on all three pages.
