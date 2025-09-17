import { notFound } from 'next/navigation'
import { SolutionPageLayout } from './_components/SolutionPageLayout'
import { Metadata } from 'next'
import { getSolutionData } from '@/app/utils/solutionsService'
import { getHomePageData } from '@/app/utils/homeService'
import { cookies } from 'next/headers'
import { ALLOWED_CITIES } from '@/app/utils/cities'

interface PageProps {
  params: Promise<{ city: string; serviceSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Метаданные страницы
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { city, serviceSlug: slug } = await params
  const locale = (await cookies()).get('lang')?.value || 'ru'

  const { solution } = await getSolutionData(slug, locale)
  const imageUrl = typeof solution.icon === 'string' ? solution.icon : solution.icon?.url || ''

  return {
    title: `${solution.name}`,
    description: solution.subtitle.substring(0, 160),
    alternates: {
      canonical: `https://alanturing.app/${city}/solution/${slug}`,
    },
    openGraph: {
      title: solution.name,
      description: solution.subtitle ?? '',
      url: `https://alanturing.app/${city}/solution/${slug}`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: solution.name,
      description: solution.subtitle ?? '',
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function SolutionPage({ params }: PageProps) {
  try {
    const { city, serviceSlug: slug } = await params

    if (!ALLOWED_CITIES.includes(city)) {
      notFound()
    }

    const cookieStore = await cookies()
    const locale = cookieStore.get('lang')?.value || 'ru'

    const { component, solution, subservices, formBlock, cases, navigation } =
      await getSolutionData(slug, locale)
    const { solutions } = await getHomePageData(locale)

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
