import { prisma } from '@/db'
import { firecrawl } from '@/lib/firecrawl'
import type { ExtractAiType } from '@/schemas/import'
import { extractAiSchema } from '@/schemas/import'
import z from 'zod'

type ScrapeUrlServiceProps = { url: string; userId: string }
type MapUrlServiceProps = { url: string; search: string }
type BulkScrapeUrlsServiceProps = { urls: string[]; userId: string }

export async function scrapeUrlService({ url, userId }: ScrapeUrlServiceProps) {
  const item = await prisma.savedItem.create({
    data: {
      url,
      userId,
      status: 'PROCESSING',
    },
  })

  try {
    // https://docs.firecrawl.dev/introduction#scrape
    const result = await firecrawl.scrape(url, {
      formats: [
        'markdown',
        {
          type: 'json',
          schema: z.toJSONSchema(extractAiSchema),
          // prompt: 'please extract the author and also publishedAt timestamps',
        },
      ], // markdown, html, images
      // onlyMainContent: true, // By default the scraper returns only the main content. Set to false to return full page content including navbar and so on.
    })
    const { metadata, markdown } = result
    const jsonData = result.json as ExtractAiType

    let publishedAt = null
    if (jsonData.publishedAt) {
      const parsed = new Date(jsonData.publishedAt)
      if (!isNaN(parsed.getTime())) publishedAt = parsed
    }

    const updatedItem = await prisma.savedItem.update({
      where: {
        id: item.id,
      },
      data: {
        title: metadata?.title || null,
        content: markdown || null,
        ogImage: metadata?.ogImage || null,
        author: jsonData.author || null,
        publishedAt,
        status: 'COMPLETED',
      },
    })

    return { success: true, data: updatedItem }
  } catch (error) {
    const failedItem = await prisma.savedItem.update({
      where: {
        id: item.id,
      },
      data: {
        status: 'FAILED',
      },
    })

    return { success: false, data: failedItem }
  }
}

export async function mapUrlService({ url, search }: MapUrlServiceProps) {
  try {
    // https://docs.firecrawl.dev/features/map
    const result = await firecrawl.map(url, {
      limit: 25,
      search,
      // location: { country: 'US', languages: ['en'] }, // default
    })
    const { links } = result

    return { success: true, data: links }
  } catch (error) {
    return { success: false, data: [] }
  }
}

export async function bulkScrapeUrlsService({
  urls,
  userId,
}: BulkScrapeUrlsServiceProps) {
  // for (let i = 0; i < urls.length; i++) {
  //   const url = urls[i]
  for (const url of urls) {
    const item = await prisma.savedItem.create({
      data: {
        url,
        userId,
        status: 'PROCESSING',
      },
    })
    const itemId = item.id

    try {
      const result = await firecrawl.scrape(url, {
        formats: [
          'markdown',
          {
            type: 'json',
            schema: z.toJSONSchema(extractAiSchema),
            // prompt: 'please extract the author and also publishedAt timestamps',
          },
        ],
      })
      const { metadata, markdown } = result
      const jsonData = extractAiSchema.parse(result.json)

      let publishedAt = null
      if (jsonData.publishedAt) {
        const parsed = new Date(jsonData.publishedAt)
        if (!isNaN(parsed.getTime())) publishedAt = parsed
      }

      await prisma.savedItem.update({
        where: {
          id: itemId,
        },
        data: {
          title: metadata?.title || null,
          content: markdown || null,
          ogImage: metadata?.ogImage || null,
          author: jsonData.author || null,
          publishedAt,
          status: 'COMPLETED',
        },
      })

      // return { success: true, data: updatedItem }
    } catch (error) {
      await prisma.savedItem.update({
        where: {
          id: itemId,
        },
        data: {
          status: 'FAILED',
        },
      })

      // return { success: false, data: failedItem }
    }
  }
  // return { success: true, data: [] }
}
