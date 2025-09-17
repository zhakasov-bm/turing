import React from 'react'
import BGraphic from '../_components/BGraphic'
import HeroBlock from '../_components/HeroBlock'
import AboutUsBlock from '../_components/AboutUsBlock'
import TeamBlock from '../_components/TeamBlock'
import BrandsBlock from '../_components/BrandsBlock'
import ReviewBlock from '../_components/ReviewBlock'
import ApplicationFormBlock from '../_components/ApplicationForm/ApplicationFormBlock'
import OurStackBlock from '../_components/OurStackBlock'
import ServicesBlock from '../_components/ServicesBlock'
import LeadCaptureBlock from '../_components/ApplicationForm/LeadCaptureBlock'
import FloatingNav from '../_components/FloatingNav'
import { getHomePageData } from '../../utils/homeService'
import PostsSection from '../_components/PostsSection'
import CasesBlock from '../_components/CasesBlock'
import { ALLOWED_CITIES } from '@/app/utils/cities'
import { cookies } from 'next/headers'
import { resolveLocale } from '@/app/utils/locale'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { city } = await params

  if (!ALLOWED_CITIES.includes(city)) {
    notFound()
  }

  return {
    openGraph: {
      title: 'Turing — IT-решения, которые меняют бизнес',
      description:
        'Turing — это команда творческих профессионалов, объединённых целью создавать инновационные IT-решения, которые трансформируют бизнес. Мы вдохновляемся идеями, подходим к каждому проекту индивидуально и помогаем компаниям становиться эффективнее, автоматизированнее и технологичнее.',
      url: `https://alanturing.app//${city}`,
      images: [
        {
          url: 'https://alanturing.app/company-og.jpg',
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Turing — IT-решения, которые меняют бизнес',
      description:
        'Turing — это команда творческих профессионалов, объединённых целью создавать инновационные IT-решения, которые трансформируют бизнес. Мы вдохновляемся идеями, подходим к каждому проекту индивидуально и помогаем компаниям становиться эффективнее, автоматизированнее и технологичнее.',
      images: ['https://alanturing.app/company-og.jpg'],
    },
  }
}

export default async function CityPage({ params }: PageProps) {
  const { city } = await params
  if (!ALLOWED_CITIES.includes(city)) {
    notFound()
  }

  const locale = resolveLocale((await cookies()).get('lang')?.value)
  const { component, solutions, cases, navigation } = await getHomePageData(locale)

  const serviceBlock = component.globals.find((block) => block.blockType === 'services')
  const heading = serviceBlock?.heading || ''

  const postBlock = component.globals.find((block) => block.blockType === 'posts')
  const postHeading = postBlock?.heading || 'Последнее из блога'

  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />

      <HeroBlock component={component} />
      <AboutUsBlock component={component} />
      <ServicesBlock heading={heading} solutions={solutions} block={formBlocks[0]} />
      {cases.length > 0 && (
        <CasesBlock heading="Кейсы – истории, которые мы создали" cases={cases} type="slider" />
      )}
      <div
        className="hidden md:block"
        style={{
          backgroundImage: 'url("graphic.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          backgroundSize: 'contain',
        }}
      >
        <LeadCaptureBlock block={formBlocks[0]} solutions={solutions} />
      </div>

      <OurStackBlock component={component} />
      <div className="hidden md:block">
        <BrandsBlock component={component} isLabel={true} />
        <LeadCaptureBlock block={formBlocks[1]} solutions={solutions} />
      </div>
      <div className="block md:hidden">
        <LeadCaptureBlock block={formBlocks[0]} solutions={solutions} />
      </div>

      <TeamBlock component={component} />
      <ReviewBlock component={component} />
      <PostsSection heading={postHeading} />
      <ApplicationFormBlock component={component} />
    </div>
  )
}
