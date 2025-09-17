import configPromise from '@/payload.config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import BrandsBlock from '../../_components/BrandsBlock'
import Hero from './components/Hero'
import OrderBLock from './components/OrderBlock'
import ActionsBlock from './components/ActionsBlock'
import ResultsBlock from './components/ResultsBlock'
import LeadCaptureBlock from '../../_components/ApplicationForm/LeadCaptureBlock'
import CasesBlock from '../../_components/CasesBlock'
import BGraphic from '../../_components/BGraphic'
import { Metadata } from 'next'
import FloatingNav from '../../_components/FloatingNav'
import ApplicationFormBlock from '../../_components/ApplicationForm/ApplicationFormBlock'
import { getHomePageData } from '@/app/utils/homeService'
import { cookies } from 'next/headers'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Получаем кейс по слагу
async function getCase(slug: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    const locale = cookies().get('lang')?.value || 'ru'
    const component = await payload.findGlobal({ slug: 'component', locale })

    const caseResult = await payload.find({
      collection: 'cases',
      where: { slug: { equals: slug } },
      locale,
    })

    if (!caseResult.docs?.length) {
      notFound()
    }

    const caseData = caseResult.docs[0]
    const navigation = await payload.findGlobal({ slug: 'navigation', locale })

    const casesResult = await payload.find({
      collection: 'cases',
      limit: 10,
      locale,
    })

    return {
      caseData,
      component,
      navigation,
      casesList: casesResult.docs,
    }
  } catch (error) {
    console.error('Ошибка при получении кейса:', error)
    notFound()
  }
}

// Метаданные страницы
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const { caseData } = await getCase(slug)

  const imageUrl = typeof caseData.image === 'string' ? caseData.image : caseData.image?.url || ''

  return {
    title: `${caseData.heading}`,
    description: caseData.subtitle.substring(0, 160),
    alternates: {
      canonical: `https://alanturing.app/case/${slug}`,
    },
    openGraph: {
      title: caseData.heading,
      description: caseData.subtitle ?? '',
      url: `https://alanturing.app/case/${slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: caseData.heading,
      description: caseData.subtitle ?? '',
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  if (!slug) {
    notFound()
  }
  const { caseData, component, navigation, casesList } = await getCase(slug)
  const { solutions } = await getHomePageData(cookies().get('lang')?.value || 'ru')

  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />

      <Hero caseData={caseData} />
      <BrandsBlock component={component} />
      <OrderBLock caseData={caseData} />
      <ActionsBlock caseData={caseData} />
      <ResultsBlock caseData={caseData} />
      {formBlocks && <LeadCaptureBlock block={formBlocks[0]} solutions={solutions} />}
      <CasesBlock
        heading="Посмотрите другие кейсы"
        cases={casesList}
        type="simple"
        excludeId={caseData.id}
      />
      <ApplicationFormBlock component={component} />
    </div>
  )
}
