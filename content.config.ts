import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    products: defineCollection({
      type: 'data',
      source: 'products/*.yml',
      schema: z.object({
        productId: z.number(),
        title: z.string(),
        slug: z.string(),
        price: z.number(),
        category: z.enum(['tailoring', 'bottoms', 'outerwear', 'shirts', 'dresses', 'sweats']),
        badge: z.string(),
        highlight: z.string(),
        description: z.string(),
        titleFr: z.string().optional(),
        descriptionFr: z.string().optional(),
        badgeFr: z.string().optional(),
        highlightFr: z.string().optional(),
        images: z.array(z.string()),
        sizes: z.array(z.string()),
        composition: z.string(),
        compositionFr: z.string().optional(),
        fabricWeightGsm: z.number(),
        origin: z.string(),
        originFr: z.string().optional(),
        care: z.string(),
        careFr: z.string().optional(),
        fitNote: z.string(),
        fitNoteFr: z.string().optional(),
        sizeChart: z.array(
          z.object({
            size: z.string(),
            chestCm: z.number(),
            waistCm: z.number(),
            hipsCm: z.number(),
            lengthCm: z.number()
          })
        ),
        reviews: z.array(
          z.object({
            author: z.string(),
            city: z.string(),
            rating: z.number(),
            date: z.string(),
            quote: z.string()
          })
        )
      })
    })
  }
})
