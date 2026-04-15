# Shopify Checkout

## Checkout model

This storefront uses hosted Shopify checkout from a headless Aurora frontend.

- Payment page is handled by Shopify
- Address and shipping collection are handled by Shopify
- Frontend redirects to Shopify `checkoutUrl`

## API endpoint

- `server/api/checkout-session.post.ts`

The endpoint receives cart line items, validates payload, creates a Shopify cart, and returns `checkoutUrl`.

## Test mode flow

1. Set `CATALOG_PROVIDER=shopify`
2. Set `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
3. Run app locally or in preview
4. Add product to cart and continue to checkout
5. Verify order and customer appear in Shopify admin

## Going live

1. Use your production Shopify store domain and Storefront token
2. Verify payment and shipping settings in Shopify admin
3. Test checkout end-to-end with a real low-value order

## Recommended next step

Add Shopify webhooks for `orders/create` and `customers/create` to automate post-purchase actions.
