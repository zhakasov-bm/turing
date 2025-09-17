import { headers as getHeaders, cookies } from 'next/headers'

import { getPayload } from 'payload'
import config from '@/payload.config'

import BGraphic from '../../_components/BGraphic'
import ServicesBlock from '../../_components/ServicesBlock'
import { notFound } from 'next/navigation'
import { ALLOWED_CITIES } from '@/app/utils/cities'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ city: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { city } = await params

  if (!ALLOWED_CITIES.includes(city)) {
    notFound()
  }
  return {
    title: { absolute: 'Услуги компании Alan Turing' },
    description:
      'Услуги компании Turing: комплексный IT-решения, автоматизация, SEO, разработка и аналитика.',
    alternates: {
      canonical: `https://alanturing.app/${city}/solution`,
    },
    openGraph: {
      title: 'Услуги компании Alan Turing',
      description:
        'Услуги компании Turing: комплексный IT-решения, автоматизация, SEO, разработка и аналитика.',
      url: `'https://alanturing.app/${city}/solution/`,
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
}

export default async function page({ params }: Props) {
  const { city } = await params
  if (!ALLOWED_CITIES.includes(city)) {
    notFound()
  }

  const locale = (await cookies()).get('lang')?.value || 'ru'
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const component = await payload.findGlobal({
    slug: 'component',
    user,
    locale,
  })

  const serviceBlock = component.globals.find((block) => block.blockType === 'services')
  const heading = serviceBlock?.heading || ''

  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  const solutionsRes = await payload.find({ collection: 'solutions', sort: 'createdAt', locale })
  const solutions = solutionsRes.docs

  if (!solutions) return notFound()

  return (
    <div>
      <BGraphic />
      <ServicesBlock heading={heading} solutions={solutions} block={formBlocks[0]} />
    </div>
  )
}
