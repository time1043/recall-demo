import { z } from 'zod'

export const importFormSchema = z.object({
  url: z.url(),
})

export const bulkImportFormSchema = z.object({
  url: z.url(),
  search: z.string(),
})
