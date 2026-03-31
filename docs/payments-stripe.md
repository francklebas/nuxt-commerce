# Stripe Payments

## Checkout model

This storefront uses hosted Stripe Checkout.

- Payment page is handled by Stripe
- Address collection is handled by Stripe
- Frontend redirects to Stripe session URL

## API endpoint

- `server/api/checkout-session.post.ts`

The endpoint receives cart line items, validates payload, creates a Checkout session, and returns `session.url`.

## Test mode flow

1. Set `STRIPE_SECRET_KEY=sk_test_...`
2. Run app locally or in preview
3. Use test card `4242 4242 4242 4242`
4. Verify redirect to `/success`

## Going live

1. Switch secret key to `sk_live_...`
2. Verify domain in Stripe dashboard
3. Test with a low-value real transaction

## Recommended next step

Add a webhook endpoint for `checkout.session.completed` to automate post-purchase actions.
