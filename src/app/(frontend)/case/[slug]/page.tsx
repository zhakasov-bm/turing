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

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Получаем кейс по слагу
async function getCase(slug: string) {
  try {
    const payload = await getPayload({ config: configPromise })

    const component = await payload.findGlobal({ slug: 'component' })

    const caseResult = await payload.find({
      collection: 'cases',
      where: { slug: { equals: slug } },
    })

    if (!caseResult.docs?.length) {
      notFound()
    }

    const caseData = caseResult.docs[0]
    const navigation = await payload.findGlobal({ slug: 'navigation' })

    const casesResult = await payload.find({
      collection: 'cases',
      limit: 10,
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

  return {
    title: `${caseData.heading}`,
    description: caseData.subtitle.substring(0, 160),
    alternates: {
      canonical: `https://alanturing.app/case/${slug}`,
    },
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  if (!slug) {
    notFound()
  }
  const { caseData, component, navigation, casesList } = await getCase(slug)
  const { solutions } = await getHomePageData()

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
