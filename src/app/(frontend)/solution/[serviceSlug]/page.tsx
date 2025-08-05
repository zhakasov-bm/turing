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
  if (!slug) return notFound()
  const { solution } = await getSolutionData(slug)

  return {
    title: `${solution.name}`,
    description: solution.subtitle.substring(0, 160),
  }
}

export default async function SolutionPage({ params }: PageProps) {
  try {
    const { serviceSlug: slug } = await params
    if (!slug) return notFound()

    const { component, solution, subservices, formBlock, navigation } = await getSolutionData(slug)
    const { solutions } = await getHomePageData()

    return (
      <SolutionPageLayout
        component={component}
        solution={solution}
        solutions={solutions}
        subservices={subservices}
        // cases={cases}
        formBlock={formBlock}
        navigation={navigation}
      />
    )
  } catch (error) {
    console.error('Error in SolutionPage:', error)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Error loading solution</h1>
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    )
  }
}
