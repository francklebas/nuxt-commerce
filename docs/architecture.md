# Architecture

## Overview

```text
Nuxt Content (YAML catalog)
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

1. Product data is stored in `content/products/*.yml`
2. Pages query content via `queryCollection('products')`
3. Cart stores selected items in Pinia
4. Checkout API builds Stripe session and redirects user

## Current constraints

- Inventory is manual
- No order management backoffice
- Shipping operations are handled directly in Stripe dashboard
