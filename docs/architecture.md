# Architecture

## Overview

```text
Catalog adapter (Content YAML or Sanity)
        ->
Nuxt 4 storefront (SSR)
        ->
Stripe Checkout (hosted payment)
        ->
Success / Cancel pages
```

## Why this architecture

- Minimal infrastructure cost
- Easy deployment on Vercel
- Fast to maintain for a small premium catalog
- Content updates without database migrations

## Data flow

1. Product data is fetched through the catalog adapter resolver
2. Provider is selected via `CATALOG_PROVIDER` (`content` by default)
3. Pages fetch products from `/api/products`
4. Cart stores selected items in Pinia
5. Checkout API builds Stripe session and redirects user

## Catalog providers

- `content`: Nuxt Content + `content/products/*.yml`
- `sanity`: Sanity visual CMS documents (`_type == "product"`)
- See `docs/cms-adapters.md` for adapter internals and custom providers

## Current constraints

- Inventory is manual
- No order management backoffice
- Shipping operations are handled directly in Stripe dashboard
