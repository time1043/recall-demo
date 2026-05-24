import { z } from 'zod'

export const importFormSchema = z.object({
  url: z.url(),
})

export const bulkImportFormSchema = z.object({
  url: z.url(),
  search: z.string(),
})

export const bulkScrapeFormSchema = z.object({
  urls: z.array(z.url()),
})

// For firecrawl ai
export const extractAiSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})
export type ExtractAiType = z.infer<typeof extractAiSchema>
