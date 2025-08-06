import { Post } from '@/payload-types'
import Image from 'next/image'
import { RichText as SerializedRichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { formatDate } from '@/app/utils/date'
import Breadcrumbs from '@/app/(frontend)/_components/Breadcrumbs/Breadcrumbs'

type Props = {
  post: Post
}

export default function BlogCard({ post }: Props) {
  return (
    <div>
      <Link
        href={`/blogs/${post.slug}`}
        key={post.id}
        className="group flex flex-col justify-between gap-3 bg-background p-3 rounded-custom"
      >
        {post.image && typeof post.image === 'object' && post.image.url && (
          <div className="w-full">
            <Image
              src={post.image.url}
              alt={post.image.alt || ''}
              width={1920}
              height={200}
              layout="responsive"
              className="object-cover rounded-2xl"
              draggable={false}
            />
          </div>
        )}

        <div className="flex flex-col gap-2 p-2">
          <time className="text-link/40 font-inter text-xs font-normal">
            {formatDate(post.createdAt)}
          </time>
          <article className="space-y-4 font-inter">
            <h4 className="text-lg font-medium leading-6 text-link group-hover:text-hoverText transition-colors mb-3">
              {post.title}
            </h4>
            {post.content && (
              <SerializedRichText
                className="text-sm line-clamp-5 text-link/60"
                data={post.content}
              />
            )}
          </article>
        </div>
        <p className="font-inter text-center text-sm text-blue-500 underline">Читать полностью</p>
      </Link>
    </div>
  )
}
