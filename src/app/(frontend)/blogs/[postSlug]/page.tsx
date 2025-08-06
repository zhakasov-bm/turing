import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import config from '@/payload.config'
import { getPayload } from 'payload'
import PostBlock from './components/PostBlock'
import ApplicationFormBlock from '../../_components/ApplicationForm/ApplicationFormBlock'
import { getHomePageData } from '@/app/utils/homeService'
import { getPost } from '@/app/utils/getPostData'

type Props = {
  params: Promise<{ postSlug: string }>
}

// Метаданные страницы
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { postSlug: slug } = await params

  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return {
    title: `${post.title}`,
    description: post.description.substring(0, 160) || '',
    alternates: {
      canonical: `https://alanturing.app/posts/${slug}`,
    },
  }
}

export default async function Page({ params }: Props) {
  const { postSlug: slug } = await params

  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const { component } = await getHomePageData()
  const postBlock = component.globals.find((block) => block.blockType === 'posts')
  const postHeading = postBlock?.heading || 'Последнее из блога'

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

  return (
    <div>
      <PostBlock posts={posts.docs} post={post} />
      <ApplicationFormBlock component={component} />
    </div>
  )
}
