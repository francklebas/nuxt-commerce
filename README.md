# Aurora Commerce - Nuxt 4

Application e-commerce pret-a-porter avec funnel de vente complet:

- Landing page conversion
- Boutique (3 produits)
- Fiches produit
- Panier (Pinia)
- Paiement Stripe Checkout
- Produits charges depuis Supabase

## Stack

- Nuxt 4 + Vue 3
- Tailwind CSS
- Pinia
- Supabase
- Stripe

## Installation

```bash
bun install
cp .env.example .env
```

## Variables d'environnement

Remplis les variables dans `.env`:

```bash
NUXT_PUBLIC_APP_URL=http://localhost:3000

NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Base de donnees Supabase

1. Cree un projet Supabase
2. Ouvre SQL Editor
3. Execute le script `supabase/seed.sql`

Le script cree la table `products`, active RLS et ajoute 3 produits avec images generees par IA.

## Lancer le projet

```bash
bun run dev
```

Application disponible sur `http://localhost:3000`.

## Paiement Stripe

Le endpoint server `server/api/checkout-session.post.ts` cree une session Stripe avec:

- quantites du panier
- prix et details produits recuperes depuis Supabase
- redirection vers `/success` et `/cancel`

## Build

```bash
bun run build
bun run preview
```
# nuxt-commerce
