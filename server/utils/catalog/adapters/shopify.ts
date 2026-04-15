import type { CatalogAdapter, CatalogProduct } from '../types'
import { shopifyStorefrontRequest } from '../../shopify/client'

const PRODUCTS_QUERY = `#graphql
query ShopifyProducts($first: Int!) {
  products(first: $first, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id
      title
      handle
      description
      productType
      tags
      featuredImage {
        url
      }
      images(first: 10) {
        nodes {
          url
        }
      }
      options {
        name
        values
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}`

const PRODUCT_BY_HANDLE_QUERY = `#graphql
query ShopifyProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    description
    productType
    tags
    featuredImage {
      url
    }
    images(first: 10) {
      nodes {
        url
      }
    }
    options {
      name
      values
    }
    variants(first: 50) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
}`

interface ShopifyProductsPayload {
  products?: {
    nodes?: ShopifyProductNode[]
  }
}

interface ShopifyProductPayload {
  product?: ShopifyProductNode | null
}

interface ShopifyProductNode {
  id?: string
  title?: string
  handle?: string
  description?: string
  productType?: string
  tags?: string[]
  featuredImage?: {
    url?: string
  }
  images?: {
    nodes?: Array<{ url?: string }>
  }
  options?: Array<{ name?: string, values?: string[] }>
  variants?: {
    nodes?: ShopifyVariantNode[]
  }
}

interface ShopifyVariantNode {
  id?: string
  title?: string
  availableForSale?: boolean
  price?: {
    amount?: string
  }
  selectedOptions?: Array<{ name?: string, value?: string }>
}

export const shopifyCatalogAdapter: CatalogAdapter = {
  async listProducts(event) {
    const payload = await shopifyStorefrontRequest<ShopifyProductsPayload>(event, PRODUCTS_QUERY, { first: 100 })
    const nodes = payload.products?.nodes

    if (!Array.isArray(nodes)) {
      return []
    }

    return nodes.map((node) => normalizeShopifyProduct(node))
  },
  async getProductBySlug(event, slug) {
    const payload = await shopifyStorefrontRequest<ShopifyProductPayload>(event, PRODUCT_BY_HANDLE_QUERY, { handle: slug })
    const node = payload.product
    return node ? normalizeShopifyProduct(node) : null
  }
}

const normalizeShopifyProduct = (entry: ShopifyProductNode): CatalogProduct => {
  const variants = normalizeVariants(entry.variants?.nodes)
  const firstVariant = variants[0]
  const sizeOptions = normalizeSizes(entry.options, variants)
  const images = normalizeImages(entry)

  return {
    productId: parseNumericId(entry.id),
    title: String(entry.title || ''),
    slug: String(entry.handle || ''),
    price: Number(firstVariant?.price || 0),
    category: mapCategory(entry.productType, entry.tags, entry.title),
    badge: 'new season',
    highlight: String(entry.productType || 'shopify selection'),
    description: String(entry.description || ''),
    images,
    sizes: sizeOptions,
    composition: 'n/a',
    fabricWeightGsm: 0,
    origin: 'n/a',
    care: 'see product details',
    fitNote: 'true to size',
    sizeChart: [],
    reviews: [],
    variants
  }
}

const normalizeVariants = (value: ShopifyVariantNode[] | undefined) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((variant) => Boolean(variant.id) && variant.availableForSale !== false)
    .map((variant) => ({
      id: String(variant.id || ''),
      size: String(findSelectedOption(variant.selectedOptions, 'size') || ''),
      title: String(variant.title || ''),
      price: Number(variant.price?.amount || 0)
    }))
    .filter((variant) => Boolean(variant.id))
}

const normalizeSizes = (
  options: ShopifyProductNode['options'],
  variants: Array<{ size: string }>
): string[] => {
  if (Array.isArray(options)) {
    const sizeOption = options.find((option) => String(option.name || '').toLowerCase() === 'size')
    if (sizeOption?.values?.length) {
      return sizeOption.values.map((value) => String(value || ''))
    }
  }

  const fromVariants = variants.map((variant) => String(variant.size || '')).filter(Boolean)
  return fromVariants.length ? Array.from(new Set(fromVariants)) : ['M']
}

const normalizeImages = (entry: ShopifyProductNode): string[] => {
  const urls = Array.isArray(entry.images?.nodes)
    ? entry.images?.nodes?.map((node) => String(node?.url || '')).filter(Boolean)
    : []

  if (urls.length) {
    return urls
  }

  if (entry.featuredImage?.url) {
    return [String(entry.featuredImage.url)]
  }

  return []
}

const findSelectedOption = (options: ShopifyVariantNode['selectedOptions'], targetName: string) => {
  if (!Array.isArray(options)) {
    return ''
  }

  const match = options.find((option) => String(option.name || '').toLowerCase() === targetName.toLowerCase())
  return String(match?.value || '')
}

const parseNumericId = (gid: unknown): number => {
  const value = String(gid || '')
  const id = value.split('/').pop() || ''
  const parsed = Number(id)
  return Number.isFinite(parsed) ? parsed : 0
}

const mapCategory = (value: unknown, tags: unknown, title: unknown): string => {
  const productType = String(value || '').toLowerCase()
  const tagsText = Array.isArray(tags) ? tags.map((tag) => String(tag || '')).join(' ').toLowerCase() : ''
  const titleText = String(title || '').toLowerCase()

  const classify = (source: string) => {
    if (!source) {
      return ''
    }

    if (source.includes('gift card') || source.includes('giftcard')) {
      return 'giftcard'
    }
    if (source.includes('accessor') || source.includes('wax')) {
      return 'accessories'
    }
    if (source.includes('snowboard') || source.includes('ski')) {
      return 'snowboard'
    }
    if (source.includes('dress')) {
      return 'dresses'
    }
    if (source.includes('shirt')) {
      return 'shirts'
    }
    if (source.includes('pant') || source.includes('trouser') || source.includes('bottom')) {
      return 'bottoms'
    }
    if (source.includes('coat') || source.includes('jacket') || source.includes('outer')) {
      return 'outerwear'
    }
    if (source.includes('sweat') || source.includes('hoodie')) {
      return 'sweats'
    }

    return ''
  }

  const byProductType = classify(productType)
  if (byProductType) {
    return byProductType
  }

  const byTags = classify(tagsText)
  if (byTags) {
    return byTags
  }

  const byTitle = classify(titleText)
  if (byTitle) {
    return byTitle
  }

  const normalizedTags = Array.isArray(tags)
    ? tags
      .map((tag) => slugifyCategory(String(tag || '')))
      .filter(Boolean)
    : []
  const primary = String(value || '').trim() || normalizedTags[0] || 'tailoring'
  return slugifyCategory(primary)
}

const slugifyCategory = (value: string) => {
  const slug = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'tailoring'
}
