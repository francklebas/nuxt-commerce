# AURORA Commerce

**A premium Nuxt 4 storefront for solo operators and small brands — ship your store in a day, not a sprint.**

No commerce backend. No database. No monthly SaaS fees.  
Products live in YAML files. Payments go through Stripe. Everything else stays out of your way.

→ **[Live demo](https://nuxt-commerce-flame-chi.vercel.app/)** · [Documentation](#documentation)

---

## What's inside

- **Git-based product catalog** — manage products as YAML files, deploy on push
- **Stripe Checkout** — hosted payment, address collection, no PCI scope
- **Bilingual out of the box** — English default, French included (`/fr` prefix strategy)
- **Light / Dark mode** — system preference + manual toggle
- **Conversion-focused pages** — Home, Shop, Product detail, Cart, Success, Cancel
- **SEO-ready** — per-route `<title>` and meta description, Lighthouse target ≥ 95
- **Vercel-ready** — zero-config deployment with Bun

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
| Catalog | Nuxt Content v3 (YAML) |
| Payments | Stripe Checkout |
| Runtime | Bun |
| Deployment | Vercel |

## How it works

```
content/products/*.yml
        ↓
Nuxt 4 storefront (SSR)
        ↓
Stripe Checkout (hosted)
        ↓
/success or /cancel
```

Products are plain YAML files. The server route builds the Stripe session at checkout. No order database, no admin panel — keep it simple until you need more.

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
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
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
bun run build
bun run preview
```

Set `STRIPE_SECRET_KEY` in your Vercel environment. Build command: `bun run build`.

## Documentation

| Doc | What it covers |
|---|---|
| `docs/architecture.md` | Data flow and infrastructure decisions |
| `docs/configuration.md` | Env vars, i18n, deployment |
| `docs/catalog-content.md` | Full YAML schema and product management |
| `docs/payments-stripe.md` | Stripe setup, test mode, going live |
| `docs/branding-design.md` | Visual system and copy guidelines |
| `docs/qa-release.md` | Pre-release checklist and Lighthouse |
| `docs/support-policy.md` | What's included in support |

## License

See `LICENSE`.
