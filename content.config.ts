import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const providerSchema = z.array(
  z.object({
    name: z.string(),
    url: z.string().url(),
    plans: z.array(
      z.object({
        name: z.string(),
        baseCost: z.union([
          z.object({
            currency: z.string(),
            value: z.number(),
            interval: z.number().optional(),
            vat: z.boolean().optional()
          }),
          z.array(
            z.object({
              currency: z.string(),
              value: z.number(),
              interval: z.number().optional(),
              vat: z.boolean().optional()
            })
          )
        ]),
        storage: z.object({
          included: z.number(),
          more: z
            .object({
              cost: z.object({
                value: z.number(),
                currency: z.string(),
                interval: z.number().optional(),
                vat: z.boolean().optional()
              }),
              per: z.number()
            })
            .optional()
        }),
        trafficAll: z
          .object({
            included: z.number()
          })
          .optional(),
        trafficEgress: z
          .object({
            included: z.number(),
            includedStorageMultiplier: z.number().optional(),
            more: z
              .object({
                cost: z.object({
                  value: z.number(),
                  currency: z.string()
                }),
                per: z.number()
              })
              .optional()
          })
          .optional(),
        trafficIngress: z
          .object({
            included: z.number()
          })
          .optional()
      })
    ),
    protocols: z.array(z.string())
  })
)

export default defineContentConfig({
  collections: {
    storageProviders: defineCollection({
      type: 'data',
      source: 'data/**.json',
      schema: z.object({
        providers: providerSchema
      })
    })
  }
})
