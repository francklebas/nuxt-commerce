# AURORA Commerce

**A premium Nuxt 4 storefront for solo operators and small brands — ship your store in a day, not a sprint.**

No custom commerce backend. No database lock-in. No monthly SaaS fees.  
Shopify powers products, checkout, customers, and orders while Aurora handles the frontend experience.

→ **[Live demo](https://nuxt-commerce-flame-chi.vercel.app/)** · [Documentation](#documentation)

---

## What's inside

- **Shopify headless ready** — Storefront API products + Shopify hosted checkout
- **Pluggable product catalog** — Shopify default, optional YAML or Sanity providers
- **Bilingual out of the box** — English default, French included (`/fr` prefix strategy)
- **Light / Dark mode** — system preference + manual toggle
- **Conversion-focused pages** — Home, Shop, Product detail, Cart, Success, Cancel
- **SEO-ready** — per-route `<title>` and meta description, Lighthouse target ≥ 95
- **Cloudflare Pages-ready** — deploy with Wrangler in one command

## Who this is for

- Independent fashion labels and curated product drops
- Solo operators who want to own their stack
- Developers who want a clean starting point, not a bloated platform

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 + Vue 3 |
| Styling | Tailwind CSS |
| State | Pinia |
| Catalog | Adapter layer (Nuxt Content YAML / Sanity) |
| Payments | Shopify Checkout |
| Runtime | Bun |
| Deployment | Cloudflare Pages |

## How it works

```
Catalog adapter (shopify / content / sanity)
        ↓
Nuxt 4 storefront (SSR)
        ↓
Shopify Checkout (hosted)
        ↓
/success or /cancel
```

Products are served through a catalog adapter. The server route builds a Shopify cart and redirects to checkout. No order database, no admin panel — keep it simple until you need more.

## Quick start

```bash
bun install
cp .env.example .env
bun run dev
```

Open `http://localhost:3000`.

## Environment variables

```bash
NUXT_PUBLIC_APP_URL=https://your-domain.com
CATALOG_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2025-01
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpca_...
```

See `docs/configuration.md` for full setup details.

## Add your first product

Duplicate any file in `content/products/`, update the fields, rebuild:

```bash
bun run build
```

See `docs/catalog-content.md` for the full schema and field reference.

## Deploy

```bash
wrangler login
wrangler pages project create nuxt-commerce --production-branch=main
wrangler pages secret put SHOPIFY_STOREFRONT_ACCESS_TOKEN
bun run build:deploy
```

Set `CATALOG_PROVIDER`, `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_API_VERSION`, and `NUXT_PUBLIC_APP_URL`
in Cloudflare Pages environment variables.

If you set Cloudflare CI commands manually, use:

- Build command: `bun run build`
- Deploy command: `npx wrangler --cwd dist pages deploy`

For this project, use:

```bash
NUXT_PUBLIC_APP_URL=https://aurora.francklebas.com/
```

## Documentation

| Doc | What it covers |
|---|---|
| `docs/architecture.md` | Data flow and infrastructure decisions |
| `docs/configuration.md` | Env vars, i18n, deployment |
| `docs/catalog-content.md` | Full YAML schema and product management |
| `docs/cms-adapters.md` | Sanity setup and custom adapter architecture |
| `docs/payments-stripe.md` | Shopify checkout setup and test mode |
| `docs/branding-design.md` | Visual system and copy guidelines |
| `docs/qa-release.md` | Pre-release checklist and Lighthouse |
| `docs/support-policy.md` | What's included in support |

## License

See `LICENSE`.
