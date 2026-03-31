# AURORA Commerce

Premium Nuxt 4 storefront designed for solo operators and small brands.

This project is built to be sold, reused, and shipped fast:
- Product catalog from Nuxt Content (YAML)
- Conversion-oriented storefront (home, shop, product, cart)
- Stripe Checkout funnel
- i18n (English default, French available)
- Light/Dark mode

## Live Concept

`Nuxt Content -> Nuxt Frontend -> Stripe Checkout -> Success/Cancel`

No heavyweight commerce backend required for a small curated catalog.

## Tech Stack

- Nuxt 4
- Vue 3
- Tailwind CSS
- Pinia
- Nuxt Content v3
- Stripe Checkout
- Bun

## Quick Start

```bash
bun install
cp .env.example .env
bun run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required:

```bash
NUXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=
```

Optional legacy vars may exist in config but are not required for the current Nuxt Content + Stripe flow.

## Build

```bash
bun run build
bun run preview
```

## Documentation

- `docs/architecture.md`
- `docs/configuration.md`
- `docs/catalog-content.md`
- `docs/payments-stripe.md`
- `docs/branding-design.md`
- `docs/qa-release.md`
- `docs/monetization.md`

## Lighthouse

```bash
lighthouse http://127.0.0.1:3000 --output json --output-path ./lighthouse.json
```

## License

See `LICENSE`.
