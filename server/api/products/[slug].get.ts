import { getCatalogAdapter } from '../../utils/catalog/adapters'
import { mapProductForApi, resolveLocale } from '../../utils/catalog/map'

export default defineEventHandler(async (event) => {
  const locale = resolveLocale(event)
  const slug = String(getRouterParam(event, 'slug') || '')
  const adapter = getCatalogAdapter(event)

  const entry = await adapter.getProductBySlug(event, slug)
  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found.' })
  }

  return mapProductForApi(entry, locale)
})
