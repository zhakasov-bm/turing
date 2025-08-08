import { getPayload } from 'payload'
import config from '@/payload.config'
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
): Promise<SubserviceData> {
  const payload = await getPayload({ config })

  const { navigation } = await getHomePageData()

  const [component, serviceRes, casesResult] = await Promise.all([
    payload.findGlobal({ slug: 'component' }),
    payload.find({
      collection: 'solutions',
      sort: 'createdAt',
      where: { slug: { equals: serviceSlug } },
    }),
    payload.find({
      collection: 'cases',
      limit: 3,
      sort: '-createdAt',
    }),
  ])

  const service = serviceRes.docs[0]
  if (!service) {
    notFound()
  }

  const subRes = await payload.find({
    collection: 'subservices',
    where: { slug: { equals: subSlug }, service: { equals: service.id } },
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
