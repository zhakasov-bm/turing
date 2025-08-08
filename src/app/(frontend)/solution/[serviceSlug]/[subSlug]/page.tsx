import { getSubserviceData } from '@/app/utils/subservicesService'
import { SubservicePageLayout } from './_components/SubservicePageLayout'
import { Metadata } from 'next'
import { getHomePageData } from '@/app/utils/homeService'
import { notFound } from 'next/navigation'

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
    alternates: {
      canonical: `https://alanturing.app/solution/${serviceSlug}/${subSlug}`,
    },
  }
}

export default async function SubservicePage({ params }: PageProps) {
  try {
    const { serviceSlug, subSlug } = await params

    const { component, service, subservice, cases, formBlock, navigation } =
      await getSubserviceData(serviceSlug, subSlug)

    const { solutions } = await getHomePageData()

    return (
      <SubservicePageLayout
        component={component}
        solutions={solutions}
        service={service}
        subservice={subservice}
        cases={cases}
        formBlock={formBlock}
        navigation={navigation}
      />
    )
  } catch (error) {
    console.error('Error in SubservicePage:', error)
    notFound()
  }
}
