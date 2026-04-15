interface ShopifyConfig {
  storeDomain: string
  apiVersion: string
  storefrontAccessToken: string
}

interface ShopifyGraphQlError {
  message?: string
}

interface ShopifyResponse<TData> {
  data?: TData
  errors?: ShopifyGraphQlError[]
}

export const getShopifyConfig = (event: any): ShopifyConfig => {
  const config = useRuntimeConfig(event)
  const storeDomain = String(config.shopifyStoreDomain || '')
  const apiVersion = String(config.shopifyStorefrontApiVersion || '2025-01')
  const storefrontAccessToken = String(config.shopifyStorefrontAccessToken || '')

  if (!storeDomain || !storefrontAccessToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Shopify provider is enabled but SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing.'
    })
  }

  return { storeDomain, apiVersion, storefrontAccessToken }
}

export const shopifyStorefrontRequest = async <TData>(
  event: any,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<TData> => {
  const config = getShopifyConfig(event)
  const endpoint = `https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`

  const response = await $fetch<ShopifyResponse<TData>>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken
    },
    body: {
      query,
      variables
    }
  })

  if (Array.isArray(response.errors) && response.errors.length) {
    throw createError({
      statusCode: 502,
      statusMessage: response.errors[0]?.message || 'Shopify request failed.'
    })
  }

  if (!response.data) {
    throw createError({ statusCode: 502, statusMessage: 'Shopify returned an empty response.' })
  }

  return response.data
}
