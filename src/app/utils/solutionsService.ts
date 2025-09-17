import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { AppLocale } from './locale'
// import { extractFormBlocks } from '@/app/utils/formBlockUtils'
import { Case, Component, Navigation, Solution, Subservice } from '@/payload-types'
import { getHomePageData } from './homeService'
import { notFound } from 'next/navigation'

type FormBlockType = Extract<Component['globals'][0], { blockType: 'form' }>

export interface SolutionData {
  component: Component
  solution: Solution
  subservices: Subservice[]
  cases: Case[]
  formBlock: FormBlockType | null
  navigation: Navigation
}

export async function getSolutionData(
  slug: string,
  locale: AppLocale | 'all' = 'ru',
): Promise<SolutionData> {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  const { navigation } = await getHomePageData(locale)

  const [component, solutionRes, casesResult] = await Promise.all([
    payload.findGlobal({ slug: 'component', locale }),
    payload.find({
      collection: 'solutions',
      where: { slug: { equals: slug } },
      user,
      locale,
    }),
    payload.find({
      collection: 'cases',
      limit: 3,
      sort: '-createdAt',
      user,
      locale,
    }),
  ])

  const solution = solutionRes.docs?.[0]
  if (!solution) {
    notFound()
  }

  // Get subservices related to this service
  const subservicesRes = await payload.find({
    collection: 'subservices',
    where: {
      service: {
        equals: solution.id,
      },
    },
    user,
    locale,
  })

  const subservices = subservicesRes.docs.map((sub) => ({
    ...sub,
    icon:
      typeof sub.icon === 'object' && sub.icon
        ? {
            ...sub.icon,
            url: sub.icon.url || '',
            alt: sub.icon.alt || '',
          }
        : sub.icon,
  }))

  // Extract form blocks using shared utility
  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  return {
    component,
    solution,
    subservices,
    cases: casesResult.docs,
    formBlock: formBlocks[0] || null,
    navigation,
  }
}
