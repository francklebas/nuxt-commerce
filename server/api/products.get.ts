import { getCatalogAdapter } from '../utils/catalog/adapters'
import { mapProductForApi, resolveLocale } from '../utils/catalog/map'

export default defineEventHandler(async (event) => {
  const locale = resolveLocale(event)
  const adapter = getCatalogAdapter(event)
  const entries = await adapter.listProducts(event)
  return entries.map((entry) => mapProductForApi(entry, locale))
})
