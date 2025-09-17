import { headers as getHeaders, cookies } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import BGraphic from '../_components/BGraphic'
import Hero from './components/Hero'
import About from './components/About'
import Mission from './components/Mission'
import TeamBlock from '../_components/TeamBlock'
import OurStackBlock from '../_components/OurStackBlock'
import LeadCaptureBlock from '../_components/ApplicationForm/LeadCaptureBlock'
import ApplicationFormBlock from '../_components/ApplicationForm/ApplicationFormBlock'
import { getHomePageData } from '@/app/utils/homeService'
import FloatingNav from '../_components/FloatingNav'
import { notFound } from 'next/navigation'

export const metadata = {
  title: { absolute: 'О компании Turing' },
  description:
    'О компании Turing: наша миссия, команда и инновационные подходы к разработке программного обеспечения и подбору удалённых разработчиков.',
  alternates: {
    canonical: 'https://alanturing.app/company',
  },
  openGraph: {
    title: 'О компании Turing',
    description:
      'О компании Turing: наша миссия, команда и инновационные подходы к разработке программного обеспечения и подбору удалённых разработчиков.',
    url: 'https://alanturing.app/company',
    images: [
      {
        url: 'https://alanturing.app/company-og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
    siteName: 'Alan Turing IT Agency',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'О компании Turing',
    description:
      'О компании Turing: наша миссия, команда и инновационные подходы к разработке программного обеспечения и подбору удалённых разработчиков.',
    images: ['https://alanturing.app/company-og.jpg'],
  },
}

export default async function CompanyPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const locale = (await cookies()).get('lang')?.value || 'ru'
  const component = await payload.findGlobal({
    slug: 'component',
    user,
    locale,
  })

  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'company' } },
    limit: 1,
    locale,
  })
  const page = res.docs[0]

  if (!page) {
    return notFound()
  }

  const formBlocks = component.globals.filter((block) => block.blockType === 'form')
  const { navigation } = await getHomePageData(locale)

  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />

      <Hero page={page} />
      <About page={page} />
      <Mission page={page} />
      <LeadCaptureBlock block={formBlocks[0]} />
      <OurStackBlock component={component} />
      <TeamBlock component={component} />
      <ApplicationFormBlock component={component} />
    </div>
  )
}
