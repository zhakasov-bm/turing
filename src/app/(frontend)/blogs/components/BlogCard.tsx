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
      <Link href={`/blogs/${post.slug}`} key={post.id} className="group flex flex-col gap-3">
        <div className="w-[200px] h-[100px] overflow-hidden rounded-lg relative shrink-0">
          {post.image && typeof post.image === 'object' && post.image.url && (
            <Image
              src={post.image.url}
              alt={post.image.alt || ''}
              fill
              className="object-cover"
              draggable={false}
            />
          )}
        </div>
        <div className="flex flex-col">
          <time className="text-link/40 font-inter text-xs font-normal">
            {formatDate(post.createdAt)}
          </time>
          <article className="space-y-4 font-inter">
            <h4 className="text-sm font-normal text-link line-clamp-3 group-hover:text-hoverText transition-colors mb-3">
              {post.title}
            </h4>
          </article>
        </div>
      </Link>
    </div>
  )
}
