import { getPayload } from 'payload'
import config from '@/payload.config'
import BGraphic from '../_components/BGraphic'
import Breadcrumbs from '../_components/Breadcrumbs/Breadcrumbs'
import { getHomePageData } from '@/app/utils/homeService'
import ApplicationFormBlock from '../_components/ApplicationForm/ApplicationFormBlock'
import BlogCard from './components/BlogCard'

export const metadata = {
  title: { absolute: 'Блог компании Turing IT agency' },
  description:
    'Откройте IT-блог Казахстана на alanturing.app — полезные статьи, советы, обзоры. Нужна консультация? Звоните: +7 (775) 202 60 10.',
}

export default async function page() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const posts = await payload.find({
    collection: 'posts',
    limit: 2,
    sort: '-createdAt',
    where: {
      includedInBlog: {
        equals: true,
      },
    },
  })

  const { component } = await getHomePageData()

  return (
    <div>
      <BGraphic />
      <div className="mb-8 px-6 md:px-0 pt-28 md:pt-20 flex justify-center">
        <Breadcrumbs />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {posts.docs.map((post) => (
          <BlogCard post={post} />
        ))}
      </div>

      <ApplicationFormBlock component={component} />
    </div>
  )
}
