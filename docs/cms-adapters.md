# CMS Adapters (Pro)

This template now supports a pluggable catalog source on the server side.

Default behavior:

- Provider: `shopify`
- Source: Shopify Storefront API

You can switch to a visual CMS like Sanity without changing the storefront pages.

## Adapter architecture

- API routes (`/api/products`, `/api/products/[slug]`, `/api/checkout-session`) call a single resolver: `getCatalogAdapter(event)`
- The selected adapter returns normalized `CatalogProduct` data
- Mapping to the API response remains centralized in `server/utils/catalog/map.ts`
- Checkout uses normalized variants to create a Shopify checkout session

Core files:

- `server/utils/catalog/types.ts`
- `server/utils/catalog/map.ts`
- `server/utils/catalog/adapters/index.ts`
- `server/utils/catalog/adapters/content.ts`
- `server/utils/catalog/adapters/sanity.ts`
- `server/utils/catalog/adapters/shopify.ts`

## Built-in providers

### 1) Shopify (headless storefront)

Use Shopify provider:

```bash
CATALOG_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2025-01
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpca_...
```

Notes:

- Aurora reads products through Storefront GraphQL
- Checkout redirects users to Shopify hosted checkout URL
- Orders, customers, shipping operations remain in Shopify admin

### 2) Nuxt Content (YAML)

Use the default provider:

```bash
CATALOG_PROVIDER=content
```

### 3) Sanity CMS

Switch provider and set Sanity credentials:

```bash
CATALOG_PROVIDER=sanity
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
SANITY_TOKEN=optional_read_token
```

Notes:

- `SANITY_TOKEN` is optional for public datasets
- For private datasets or draft access, provide a read token
- Product documents are queried from `_type == "product"`
- Slug supports both `slug.current` and plain string fallback

## Sanity schema expectations

The adapter expects fields equivalent to the YAML schema:

- `productId`, `title`, `slug`, `price`, `category`
- `badge`, `highlight`, `description`
- optional FR variants (`titleFr`, `descriptionFr`, etc.)
- `images`, `sizes`, `sizeChart`, `reviews`
- `composition`, `fabricWeightGsm`, `origin`, `care`, `fitNote`

## Add your own CMS adapter

1. Create a new file in `server/utils/catalog/adapters/` (example: `strapi.ts`)
2. Implement `CatalogAdapter`:
   - `listProducts(event)`
   - `getProductBySlug(event, slug)`
3. Normalize external payloads into `CatalogProduct`
4. Register your provider in `server/utils/catalog/adapters/index.ts`
5. Select it with `CATALOG_PROVIDER=your-provider`

If your CMS payload shape changes, only adapter-level normalization should be updated.
The storefront and checkout logic do not need to change.
