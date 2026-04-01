import { contentCatalogAdapter } from './content'
import { sanityCatalogAdapter } from './sanity'

export const getCatalogAdapter = (event: any) => {
  const config = useRuntimeConfig(event)
  const provider = String(config.catalogProvider || 'content').toLowerCase()

  if (provider === 'sanity') {
    return sanityCatalogAdapter
  }

  return contentCatalogAdapter
}
