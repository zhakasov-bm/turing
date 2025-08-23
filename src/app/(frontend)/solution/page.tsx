import { headers as getHeaders } from 'next/headers'

import { getPayload } from 'payload'
import config from '@/payload.config'

import BGraphic from '../_components/BGraphic'
import ServicesBlock from '../_components/ServicesBlock'
import { notFound } from 'next/navigation'

export const metadata = {
  title: { absolute: 'Услуги компании Alan Turing' },
  description:
    'Услуги компании Turing: комплексный IT-решения, автоматизация, SEO, разработка и аналитика.',
  alternates: {
    canonical: `https://alanturing.app/solution`,
  },
  openGraph: {
    title: 'Услуги компании Alan Turing',
    description:
      'Услуги компании Turing: комплексный IT-решения, автоматизация, SEO, разработка и аналитика.',
    url: `'https://alanturing.app/solution/`,
    images: [
      {
        url: 'https://alanturing.app/company-og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Услуги компании Alan Turing',
    description:
      'Услуги компании Turing: комплексный IT-решения, автоматизация, SEO, разработка и аналитика.',
    images: ['https://alanturing.app/company-og.jpg'],
  },
}

export default async function page() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const component = await payload.findGlobal({
    slug: 'component',
    user,
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
