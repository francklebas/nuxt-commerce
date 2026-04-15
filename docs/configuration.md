# Configuration

## Runtime requirements

- Bun for local development
- Node runtime compatible with Nuxt 4 for deployment
- Wrangler CLI for Cloudflare Pages deployment

## Environment variables

Required:

```bash
NUXT_PUBLIC_APP_URL=https://your-domain.com
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpca_...
```

Optional catalog provider settings:

```bash
CATALOG_PROVIDER=shopify
SHOPIFY_STOREFRONT_API_VERSION=2025-01
SANITY_PROJECT_ID=
SANITY_DATASET=
SANITY_API_VERSION=2025-01-01
SANITY_TOKEN=
```

- Keep `CATALOG_PROVIDER=shopify` for Shopify headless storefront mode
- Use `CATALOG_PROVIDER=content` to use YAML catalog files
- Use `CATALOG_PROVIDER=sanity` to read products from Sanity

## i18n setup

- Default locale: `en`
- Secondary locale: `fr`
- Strategy: `prefix_except_default`

Examples:
- `/` -> English
- `/fr` -> French

## Deployment notes (Cloudflare Pages)

1. Authenticate Wrangler:

```bash
wrangler login
```

2. Create your Pages project (once):

```bash
wrangler pages project create nuxt-commerce --production-branch=main
```

3. Upload Shopify secret:

```bash
wrangler pages secret put SHOPIFY_STOREFRONT_ACCESS_TOKEN
```

4. Set non-secret environment variables in Cloudflare Pages settings:

- `CATALOG_PROVIDER=shopify`
- `SHOPIFY_STORE_DOMAIN=your-store.myshopify.com`
- `SHOPIFY_STOREFRONT_API_VERSION=2025-01`
- `NUXT_PUBLIC_APP_URL=https://aurora.francklebas.com/`

6. Add your custom domain in Cloudflare Pages project settings:

- `aurora.francklebas.com`

7. Deploy:

```bash
bun run build:deploy
```
