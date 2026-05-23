import { z } from 'zod'

export const importFormSchema = z.object({
  url: z.string().url(),
})

export const bulkImportFormSchema = z.object({
  url: z.string().url(),
  search: z.string(),
})

// For firecrawl ai
export const extractAiSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})
export type ExtractAiType = z.infer<typeof extractAiSchema>
