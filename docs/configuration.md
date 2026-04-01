# Configuration

## Runtime requirements

- Bun for local development
- Node runtime compatible with Nuxt 4 for deployment

## Environment variables

Required:

```bash
NUXT_PUBLIC_APP_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_test_or_sk_live
STRIPE_WEBHOOK_SECRET=whsec_...
```

Optional catalog provider settings:

```bash
CATALOG_PROVIDER=content
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=2025-01-01
SANITY_TOKEN=
```

- Keep `CATALOG_PROVIDER=content` to use YAML catalog files
- Use `CATALOG_PROVIDER=sanity` to read products from Sanity

## i18n setup

- Default locale: `en`
- Secondary locale: `fr`
- Strategy: `prefix_except_default`

Examples:
- `/` -> English
- `/fr` -> French

## Deployment notes (Vercel)

- Build command: `bun run build`
- Install command: `bun install`
- Ensure `STRIPE_SECRET_KEY` is set for Production and Preview
