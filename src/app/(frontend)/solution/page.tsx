import { getPayload } from 'payload'
import config from '@/payload.config'

import BGraphic from '../_components/BGraphic'
import ServicesBlock from '../_components/ServicesBlock'
import { notFound } from 'next/navigation'

export const metadata = {
  title: { absolute: 'Услуги компании Simply Digital' },
  description:
    'Услуги компании Simply Digital: комплексный digital-маркетинг, стратегия, реклама, SEO, SMM и аналитика.',
}

export default async function page() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const component = await payload.findGlobal({
    slug: 'component',
  })

  const serviceBlock = component.globals.find((block) => block.blockType === 'services')
  const heading = serviceBlock?.heading || ''

  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  const solutionsRes = await payload.find({ collection: 'solutions', sort: 'createdAt' })
  const solutions = solutionsRes.docs

  if (!solutions) return notFound()

  return (
    <div>
      <BGraphic />
      <ServicesBlock heading={heading} solutions={solutions} block={formBlocks[0]} />
    </div>
  )
}
