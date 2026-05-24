import { authFnMiddleware } from '@/middlewares/auth'
import { bulkImportFormSchema, importFormSchema } from '@/schemas/import'
import { createServerFn } from '@tanstack/react-start'
import { mapUrlService, scrapeUrlService } from './items.service'

// https://tanstack.com/start/v0/docs/framework/react/guide/server-functions#parameters--validation

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importFormSchema)
  .handler(async ({ context, data }) => {
    const userId = context.session.user.id
    const { url } = data

    return await scrapeUrlService({ url, userId })
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkImportFormSchema)
  .handler(async ({ data }) => {
    const { url, search } = data

    return await mapUrlService({ url, search })
  })
