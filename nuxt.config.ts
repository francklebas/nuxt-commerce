// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/content', '@nuxt/image'],
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://picsum.photos; upgrade-insecure-requests",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    }
  },
  css: ['~/assets/css/main.css'],
  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },
  image: {
    domains: ['picsum.photos', 'images.unsplash.com', 'cdn.sanity.io', 'cdn.shopify.com'],
    format: ['webp', 'avif']
  },
  i18n: {
    langDir: '../locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Francais', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },
  runtimeConfig: {
    catalogProvider: process.env.CATALOG_PROVIDER || 'content',
    sanityProjectId: process.env.SANITY_PROJECT_ID,
    sanityDataset: process.env.SANITY_DATASET,
    sanityApiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
    sanityToken: process.env.SANITY_TOKEN,
    shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN,
    shopifyStorefrontApiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || '2025-01',
    shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },
  nitro: {
    preset: process.env.NITRO_PRESET || 'cloudflare-pages'
  }
})
