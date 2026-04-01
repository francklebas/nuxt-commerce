# Catalog Management (Nuxt Content)

This guide applies when `CATALOG_PROVIDER=content` (default).
If you use Sanity or another CMS adapter, see `docs/cms-adapters.md`.

## Source of truth

All products are managed in:

- `content/products/*.yml`

## Minimal product fields

- `productId`
- `title`, `titleFr`
- `slug`
- `price`
- `category`
- `description`, `descriptionFr`
- `images`
- `sizes`

## Add a new product

1. Duplicate an existing YAML file in `content/products/`
2. Update identity fields (`productId`, `slug`, `title`)
3. Fill copy and details (`description`, `composition`, `fitNote`, etc.)
4. Add image URLs
5. Run:

```bash
bun run build
```

## Content quality checklist

- Slug is unique
- Price is numeric and realistic
- FR/EN copies are both present
- At least 3 images
- Size chart is complete
