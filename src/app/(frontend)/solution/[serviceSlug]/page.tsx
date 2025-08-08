import { getPayload } from 'payload'
import config from '@/payload.config'

import { notFound } from 'next/navigation'
// import { getSolutionData } from '@/app/utils/solutionsService'
import { SolutionPageLayout } from './_components/SolutionPageLayout'
import { Metadata } from 'next'
import { getSolutionData } from '@/app/utils/solutionsService'
import { getHomePageData } from '@/app/utils/homeService'

interface PageProps {
  params: Promise<{ serviceSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Метаданные страницы
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { serviceSlug: slug } = await params

  const { solution } = await getSolutionData(slug)

  return {
    title: `${solution.name}`,
    description: solution.subtitle.substring(0, 160),
    alternates: {
      canonical: `https://alanturing.app/solution/${slug}`,
    },
  }
}

export default async function SolutionPage({ params }: PageProps) {
  try {
    const { serviceSlug: slug } = await params

    const { component, solution, subservices, formBlock, cases, navigation } =
      await getSolutionData(slug)
    const { solutions } = await getHomePageData()

    return (
      <SolutionPageLayout
        component={component}
        solution={solution}
        solutions={solutions}
        subservices={subservices}
        cases={cases}
        formBlock={formBlock}
        navigation={navigation}
      />
    )
  } catch (error) {
    console.error('Error in SolutionPage:', error)
    notFound()
  }
}
