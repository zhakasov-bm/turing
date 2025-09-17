import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { AppLocale } from './locale'
import { Case, Component, Navigation, Solution, Subservice } from '@/payload-types'
import { getHomePageData } from './homeService'
import { notFound } from 'next/navigation'

type FormBlockType = Extract<Component['globals'][0], { blockType: 'form' }>

export interface SubserviceData {
  component: Component
  service: Solution
  subservice: Subservice
  cases: Case[]
  formBlock: FormBlockType | null
  navigation: Navigation
}

export async function getSubserviceData(
  serviceSlug: string,
  subSlug: string,
  locale: AppLocale | 'all' = 'ru',
): Promise<SubserviceData> {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  const { navigation } = await getHomePageData(locale)

  const [component, serviceRes, casesResult] = await Promise.all([
    payload.findGlobal({ slug: 'component', locale }),
    payload.find({
      collection: 'solutions',
      sort: 'createdAt',
      where: { slug: { equals: serviceSlug } },
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

  const service = serviceRes.docs[0]
  if (!service) {
    notFound()
  }

  const subRes = await payload.find({
    collection: 'subservices',
    where: { slug: { equals: subSlug }, service: { equals: service.id } },
    user,
    locale,
  })

  const subservice = subRes.docs[0]
  if (!subservice) {
    notFound()
  }

  // Extract form blocks using shared utility
  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  return {
    component,
    service,
    subservice,
    cases: casesResult.docs,
    formBlock: formBlocks[0] || null,
    navigation,
  }
}
