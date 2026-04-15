# QA and Release Checklist

## Pre-release checks

- `bun run build` passes
- Home, shop, product, cart pages load
- Light/dark switch works
- EN and FR switch works
- Cart quantity updates work
- Checkout redirect works

## SEO checks

- Every route has `<title>`
- Every route has `meta description`
- Product page title reflects product name

## Lighthouse

```bash
lighthouse http://127.0.0.1:3000 --output json --output-path ./lighthouse.json
```

Target baseline:
- Accessibility >= 95
- SEO >= 95

## Release checks

- Env vars set in Cloudflare Pages
- Build command uses Bun
- Manual checkout test in preview environment
