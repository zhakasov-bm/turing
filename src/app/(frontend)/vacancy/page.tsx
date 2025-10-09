import { headers as getHeaders, cookies } from 'next/headers'
import { resolveLocale } from '@/app/utils/locale'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import BGraphic from '../_components/BGraphic'
import Breadcrumbs from '../_components/Breadcrumbs/Breadcrumbs'
import VacancyCard from './components/VacancyCard'
import { Vacancy } from '@/payload-types'
import { getBreadcrumbLocaleLabels } from '@/app/utils/breadcrumbLabels'

export const metadata = {
  title: 'Вакансии',
  description:
    'Актуальные вакансии в Alan Turing. Присоединяйтесь к нашей команде и развивайтесь вместе с нами.',
  alternates: {
    canonical: `https://alanturing.app/vacancy`,
  },
  openGraph: {
    title: 'Вакансии компании Alan Turing',
    description:
      'Актуальные вакансии в Alan Turing. Присоединяйтесь к нашей команде и развивайтесь вместе с нами.',
    url: `https://alanturing.app/vacancy`,
    images: [
      {
        url: 'https://alanturing.app/company-og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Вакансии компании Alan Turing',
    description:
      'Актуальные вакансии в Alan Turing. Присоединяйтесь к нашей команде и развивайтесь вместе с нами.',
    images: ['https://alanturing.app/company-og.jpg'],
  },
}

export default async function page() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  const locale = resolveLocale((await cookies()).get('lang')?.value)

  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'vacancy' } },
    limit: 1,
    user,
    locale,
  })

  const page = res.docs[0]
  const breadcrumbLabels = getBreadcrumbLocaleLabels(locale)

  const vacancyRes = await payload.find({
    collection: 'vacancy',
    sort: '-createdAt',
    limit: 100,
    user,
    locale,
  })

  const vacancies: Vacancy[] = vacancyRes.docs

  const groupedByCategory = vacancies.reduce<Record<string, Vacancy[]>>((acc, vacancy) => {
    const category = vacancy.category || 'Другие'
    if (!acc[category]) acc[category] = []
    acc[category].push(vacancy)
    return acc
  }, {})

  const categoryTitles: Record<string, string> = {
    IT: 'IT-вакансии',
    marketing: 'Маркетинг',
    Другие: 'Другие',
  }

  return (
    <div>
      <BGraphic />

      <div className="mb-8 px-6 md:px-0 pt-8 md:pt-20 flex justify-center">
        <Breadcrumbs
          customLabels={{ vacancy: page?.name || breadcrumbLabels.vacancy }}
        />
      </div>

      <div className="px-8 md:px-40">
        <RichText data={page?.heading} className="vacancy-richtext" />

        {Object.entries(groupedByCategory).map(([category, vacancies]) => (
          <div key={category} className="py-8 md:py-12">
            <h2 className="text-xl mb-6">{categoryTitles[category] || category}</h2>
            <div className="flex flex-col gap-3">
              {vacancies.map((vacancy, i) => (
                <VacancyCard key={vacancy.id || i} item={vacancy} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
