import { getSubserviceData } from '@/app/utils/subservicesService'
import { SubservicePageLayout } from './_components/SubservicePageLayout'
import { Metadata } from 'next'
import { getHomePageData } from '@/app/utils/homeService'

interface PageProps {
  params: Promise<{ serviceSlug: string; subSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Метаданные страницы
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { serviceSlug, subSlug } = await params

  const { subservice } = await getSubserviceData(serviceSlug, subSlug)

  return {
    title: `${subservice.name}`,
    description: subservice.subtitle.substring(0, 160),
  }
}

export default async function SubservicePage({ params }: PageProps) {
  try {
    const { serviceSlug, subSlug } = await params

    const {
      component,
      service,
      subservice,
      // cases,
      formBlock,
      // seoBlocks,
      navigation,
    } = await getSubserviceData(serviceSlug, subSlug)

    const { solutions } = await getHomePageData()

    return (
      <SubservicePageLayout
        component={component}
        solutions={solutions}
        service={service}
        subservice={subservice}
        // cases={cases}
        formBlock={formBlock}
        // seoBlocks={seoBlocks}
        navigation={navigation}
      />
    )
  } catch (error) {
    console.error('Error in SubservicePage:', error)
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Error loading subservice</h1>
        <p className="text-red-600">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    )
  }
}
