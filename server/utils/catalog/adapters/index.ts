import { contentCatalogAdapter } from './content'
import { shopifyCatalogAdapter } from './shopify'
import { sanityCatalogAdapter } from './sanity'

export const getCatalogAdapter = (event: any) => {
  const config = useRuntimeConfig(event)
  const provider = String(config.catalogProvider || 'content').toLowerCase()

  if (provider === 'sanity') {
    return sanityCatalogAdapter
  }

  if (provider === 'shopify') {
    return shopifyCatalogAdapter
  }

  return contentCatalogAdapter
}
