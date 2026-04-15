import { createClient } from '@sanity/client'
import type { CatalogAdapter, CatalogProduct } from '../types'

const SANITY_PRODUCT_PROJECTION = `{
  productId,
  title,
  titleFr,
  slug,
  price,
  category,
  badge,
  badgeFr,
  highlight,
  highlightFr,
  description,
  descriptionFr,
  images,
  sizes,
  composition,
  compositionFr,
  fabricWeightGsm,
  origin,
  originFr,
  care,
  careFr,
  fitNote,
  fitNoteFr,
  sizeChart,
  reviews
}`

const SANITY_PRODUCTS_QUERY = `*[_type == "product"] | order(productId asc) ${SANITY_PRODUCT_PROJECTION}`
const SANITY_PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] ${SANITY_PRODUCT_PROJECTION}`

export const sanityCatalogAdapter: CatalogAdapter = {
  async listProducts(event) {
    const rows = await fetchFromSanity(event, SANITY_PRODUCTS_QUERY)
    if (!Array.isArray(rows)) {
      return []
    }

    return rows.map((row) => normalizeSanityProduct(row))
  },
  async getProductBySlug(event, slug) {
    const row = await fetchFromSanity(event, SANITY_PRODUCT_BY_SLUG_QUERY, { slug })
    return row ? normalizeSanityProduct(row) : null
  }
}

const fetchFromSanity = async (event: any, query: string, params?: Record<string, unknown>) => {
  const config = readSanityConfig(event)
  const client = createSanityClient(config)

  try {
    return await client.fetch(query, params || {})
  } catch (error) {
    if (config.token && isUnauthorizedError(error)) {
      const publicClient = createSanityClient({ ...config, token: '' })
      return await publicClient.fetch(query, params || {})
    }

    throw error
  }
}

const readSanityConfig = (event: any) => {
  const config = useRuntimeConfig(event)
  const projectId = String(config.sanityProjectId || '')
  const dataset = String(config.sanityDataset || '')
  const apiVersion = String(config.sanityApiVersion || '2025-01-01')
  const token = String(config.sanityToken || '')

  if (!projectId || !dataset) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Sanity provider is enabled but missing SANITY_PROJECT_ID or SANITY_DATASET.'
    })
  }

  return { projectId, dataset, apiVersion, token }
}

const createSanityClient = (config: { projectId: string, dataset: string, apiVersion: string, token: string }) => {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    token: config.token || undefined,
    useCdn: false,
    perspective: 'published'
  })
}

const isUnauthorizedError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false
  }

  return Number((error as { statusCode?: number }).statusCode || 0) === 401
}

const normalizeSanityProduct = (entry: any): CatalogProduct => ({
  productId: Number(entry.productId || 0),
  title: String(entry.title || ''),
  titleFr: optionalString(entry.titleFr),
  slug: normalizeSlug(entry.slug),
  price: Number(entry.price || 0),
  category: String(entry.category || 'tailoring'),
  badge: String(entry.badge || ''),
  badgeFr: optionalString(entry.badgeFr),
  highlight: String(entry.highlight || ''),
  highlightFr: optionalString(entry.highlightFr),
  description: String(entry.description || ''),
  descriptionFr: optionalString(entry.descriptionFr),
  images: normalizeImages(entry.images),
  sizes: toStringArray(entry.sizes),
  composition: String(entry.composition || ''),
  compositionFr: optionalString(entry.compositionFr),
  fabricWeightGsm: Number(entry.fabricWeightGsm || 0),
  origin: String(entry.origin || ''),
  originFr: optionalString(entry.originFr),
  care: String(entry.care || ''),
  careFr: optionalString(entry.careFr),
  fitNote: String(entry.fitNote || ''),
  fitNoteFr: optionalString(entry.fitNoteFr),
  sizeChart: Array.isArray(entry.sizeChart) ? entry.sizeChart : [],
  reviews: Array.isArray(entry.reviews) ? entry.reviews : []
})

const normalizeSlug = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && 'current' in value) {
    return String((value as { current?: string }).current || '')
  }

  return ''
}

const normalizeImages = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((image) => {
      if (typeof image === 'string') {
        return image
      }

      if (image && typeof image === 'object' && 'asset' in image) {
        const asset = (image as { asset?: { url?: string } }).asset
        if (asset?.url) {
          return String(asset.url)
        }
      }

      if (image && typeof image === 'object' && 'url' in image) {
        return String((image as { url?: string }).url || '')
      }

      return ''
    })
    .filter(Boolean)
}

const optionalString = (value: unknown) => {
  if (!value) {
    return undefined
  }

  return String(value)
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => String(item || ''))
}
