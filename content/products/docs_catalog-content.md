# Catalog Management (Nuxt Content)

## Source of truth

All products are managed in:

- `content/products/*.yml`

## Full product schema

Below is the complete reference schema with all supported fields.

```yaml
productId: 6                                      # Unique integer identifier
title: Heavyweight Crewneck - Charcoal            # EN display title
titleFr: Sweat Crewneck Heavyweight - Charbon     # FR display title
slug: heavyweight-crewneck-charcoal               # URL slug — must be unique
price: 109                                        # Price in euros (integer). Converted to cents server-side.
category: sweats                                  # Used for filtering
badge: Core line                                  # Optional short label (e.g. "New", "Core line")
badgeFr: Ligne core
highlight: Brushed cotton 420 g/m2               # One-line material callout
highlightFr: Coton brosse 420 g/m2
description: >
  Oversize sweatshirt in ultra-soft brushed cotton. 420 g/m2 weight,
  reinforced collar, and premium finishes. The staple you never take off.
descriptionFr: >
  Sweat oversize en coton brosse ultra-doux 420 g/m2. Col renforce,
  finitions soignees. Le basique premium que tu portes tous les jours.
images:
  - https://your-cdn.com/product-1.jpg           # Min. 3 images recommended
  - https://your-cdn.com/product-2.jpg
  - https://your-cdn.com/product-3.jpg
sizes:
  - S
  - M
  - L
  - XL
composition: French brushed cotton fleece 420 g/m2
compositionFr: Coton francais brosse 420 g/m2
fabricWeightGsm: 420                             # Numeric GSM value
origin: Knit in France, made in Portugal
originFr: Maille France, confection Portugal
care: Wash at 30C, do not tumble dry
careFr: Lavage 30C, pas de seche-linge
fitNote: Controlled oversize fit with raglan sleeves.
fitNoteFr: Coupe oversize maitrisee avec manches raglan.
sizeChart:
  - size: S
    chestCm: 90
    waistCm: 74
    hipsCm: 96
    lengthCm: 67
  - size: M
    chestCm: 95
    waistCm: 79
    hipsCm: 101
    lengthCm: 68
  - size: L
    chestCm: 100
    waistCm: 84
    hipsCm: 106
    lengthCm: 69
  - size: XL
    chestCm: 106
    waistCm: 90
    hipsCm: 112
    lengthCm: 70
reviews:
  - author: Theo G.
    city: Nantes
    rating: 5
    date: '2026-03-07'
    quote: The weight is perfect and the finish feels way above standard sweatshirts.
  - author: Lucas B.
    city: Toulouse
    rating: 5
    date: '2026-02-20'
    quote: Super soft inside and holds shape after washing.
```

## Minimal required fields

At minimum, a product must include:

- `productId`
- `title`, `titleFr`
- `slug`
- `price`
- `category`
- `description`, `descriptionFr`
- `images` (min. 3)
- `sizes`

All other fields are optional but recommended for a complete product page.

## Price format

`price` is stored as an **integer in euros**. The server route `checkout-session.post.ts` converts it to cents automatically (`price * 100`) before sending to Stripe. Never store cents in the YAML.

## Add a new product

1. Duplicate an existing YAML file in `content/products/`
2. Update identity fields (`productId`, `slug`, `title`, `titleFr`)
3. Fill copy fields (`description`, `descriptionFr`, `fitNote`, etc.)
4. Add image URLs (minimum 3)
5. Fill `sizeChart` with real measurements
6. Run:

```bash
bun run build
```

## Content quality checklist

- Slug is unique across all products
- Price is a positive integer (euros, not cents)
- EN and FR copies are both present for all bilingual fields
- At least 3 images provided
- `sizeChart` is complete for all declared sizes
- `productId` is unique and incremented
