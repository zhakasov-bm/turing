import { getPayload } from 'payload'
import config from '@/payload.config'
import BGraphic from '../_components/BGraphic'
import Breadcrumbs from '../_components/Breadcrumbs/Breadcrumbs'
import { getHomePageData } from '@/app/utils/homeService'
import ApplicationFormBlock from '../_components/ApplicationForm/ApplicationFormBlock'
import BlogCard from './components/BlogCard'
import FloatingNav from '../_components/FloatingNav'
import { getPost } from '@/app/utils/getPostData'

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
    sort: '-createdAt',
    where: {
      includedInBlog: {
        equals: true,
      },
    },
  })

  const { component, navigation } = await getHomePageData()

  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />
      <div className="mb-8 px-6 md:px-0 pt-28 md:pt-20 flex justify-center">
        <Breadcrumbs
          customLabels={{ blogs: typeof posts.docs[0].title === 'string' ? page.name : 'Блог' }}
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 p-6 mb-10 lg:px-24">
        {posts.docs.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <ApplicationFormBlock component={component} />
    </div>
  )
}
