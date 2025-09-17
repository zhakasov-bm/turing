import { headers as getHeaders, cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import BGraphic from '../_components/BGraphic'
import Breadcrumbs from '../_components/Breadcrumbs/Breadcrumbs'
import { getHomePageData } from '@/app/utils/homeService'
import ApplicationFormBlock from '../_components/ApplicationForm/ApplicationFormBlock'
import BlogCard from './components/BlogCard'
import FloatingNav from '../_components/FloatingNav'

export const metadata = {
  title: { absolute: 'Блог компании Turing IT agency' },
  description:
    'Откройте IT-блог Казахстана на alanturing.app — полезные статьи, советы, обзоры. Нужна консультация? Звоните: +7 (775) 202 60 10.',
  alternates: {
    canonical: `https://alanturing.app/blogs`,
  },
  openGraph: {
    title: 'Блог компании Turing IT agency',
    description:
      'Откройте IT-блог Казахстана — полезные статьи, советы, обзоры. Нужна консультация? Звоните: +7 (775) 202 60 10.',
    url: 'https://alanturing.app/blogs',
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
    title: 'Блог компании Turing IT agency',
    description:
      'Откройте IT-блог Казахстана — полезные статьи, советы, обзоры. Нужна консультация? Звоните: +7 (775) 202 60 10.',
    images: ['https://alanturing.app/company-og.jpg'],
  },
}

export default async function page() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const locale = cookies().get('lang')?.value || 'ru'

  const posts = await payload.find({
    collection: 'posts',
    sort: '-createdAt',
    where: {
      includedInBlog: {
        equals: true,
      },
    },
    user,
    locale,
  })

  const { component, navigation } = await getHomePageData(locale)
  const blogLabel = navigation?.links?.find((link) => link.url === '/blogs')?.label || 'Блог'

  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />
      <div className="px-6 md:px-0 pt-8 flex justify-center">
        <Breadcrumbs customLabels={{ blogs: blogLabel }} />
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 p-6 mb-10 lg:px-24 md:auto-rows-fr">
        {posts.docs.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <ApplicationFormBlock component={component} />
    </div>
  )
}
