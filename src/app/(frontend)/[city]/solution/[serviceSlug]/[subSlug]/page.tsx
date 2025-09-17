import { getSubserviceData } from '@/app/utils/subservicesService'
import { SubservicePageLayout } from './_components/SubservicePageLayout'
import { Metadata } from 'next'
import { getHomePageData } from '@/app/utils/homeService'
import { notFound } from 'next/navigation'
import { ALLOWED_CITIES } from '@/app/utils/cities'
import { cookies } from 'next/headers'

interface PageProps {
  params: Promise<{ city: string; serviceSlug: string; subSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Метаданные страницы
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { city, serviceSlug, subSlug } = await params
  const locale = (await cookies()).get('lang')?.value || 'ru'

  if (!ALLOWED_CITIES.includes(city)) {
    notFound()
  }

  const { subservice } = await getSubserviceData(serviceSlug, subSlug, locale)

  const imageUrl =
    typeof subservice.icon === 'string' ? subservice.icon : subservice.icon?.url || ''

  return {
    title: `${subservice.name}`,
    description: subservice.subtitle.substring(0, 160),
    alternates: {
      canonical: `https://alanturing.app/${city}/solution/${serviceSlug}/${subSlug}`,
    },
    openGraph: {
      title: subservice.name,
      description: subservice.subtitle ?? '',
      url: `https://alanturing.app/${city}/solution/${serviceSlug}/${subSlug}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: subservice.name,
      description: subservice.subtitle ?? '',
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function SubservicePage({ params }: PageProps) {
  try {
    const { serviceSlug, subSlug } = await params
    const cookieStore = await cookies()
    const locale = cookieStore.get('lang')?.value || 'ru'

    const { component, service, subservice, cases, formBlock, navigation } =
      await getSubserviceData(serviceSlug, subSlug, locale)

    const { solutions } = await getHomePageData(locale)

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
