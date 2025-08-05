import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  const payload = await getPayload({ config })

  const solutionsRes = await payload.find({ collection: 'solutions', limit: 100 })
  const solutions = solutionsRes.docs

  const subservicesRes = await payload.find({ collection: 'subservices', limit: 100 })
  const subservices = subservicesRes.docs

  const siteUrl = process.env.SITE_URL || 'https://alanturing.app'

  const staticPages = [
    { loc: `${siteUrl}/`, lastmod: new Date().toISOString() },
    { loc: `${siteUrl}/company`, lastmod: new Date().toISOString() },
    { loc: `${siteUrl}/solution`, lastmod: new Date().toISOString() },
  ]

  const solutionPaths = solutions.map((solution) => ({
    loc: `${siteUrl}/solution/${solution.slug}`,
    lastmod: new Date().toISOString(),
  }))

  const subservicePaths = subservices.map((sub) => ({
    loc: `${siteUrl}/solution/${(sub.service as { slug: string })?.slug}/${sub.slug}`,
    lastmod: new Date().toISOString(),
  }))

  const fields = [...staticPages, ...solutionPaths, ...subservicePaths]

  return getServerSideSitemap(fields)
}
