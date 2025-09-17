import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'
import { getPayload } from 'payload'
import { Post } from '@/payload-types'

export async function getPost(slug: string, locale: string = 'ru'): Promise<Post> {
  try {
    const headers = await getHeaders()
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })
    const result = await payload.find({
      collection: 'posts',
      sort: '-createdAt',

      where: {
        slug: {
          equals: slug,
        },
        includedInBlog: {
          equals: true,
        },
      },
      user,
      locale,
    })

    return result.docs?.[0]
  } catch (error) {
    console.error('Error fetching post:', error)
    throw error
  }
}
