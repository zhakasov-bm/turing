import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Breadcrumbs from '../../_components/Breadcrumbs/Breadcrumbs'
import { Page } from '@/payload-types'
import type { AppLocale } from '@/app/utils/locale'
import { getBreadcrumbLocaleLabels } from '@/app/utils/breadcrumbLabels'

type HeroProps = {
  page: Page
  locale: AppLocale
}

export default function Hero({ page, locale }: HeroProps) {
  const breadcrumbLabels = getBreadcrumbLocaleLabels(locale)

  return (
    <section className="container mx-auto pt-8 relative">
      {Array.isArray(page.layout) &&
        page.layout.map((block, id) => {
          if (block.blockType === 'company') {
            return (
              <div key={id} className="flex flex-col items-center">
                {/* Breadcrumbs */}
                <div className="mb-8 px-6 md:px-0 flex justify-center">
                  <Breadcrumbs
                    customLabels={{
                      company:
                        typeof page.name === 'string' && page.name
                          ? page.name
                          : breadcrumbLabels.company,
                    }}
                  />
                </div>
                <RichText data={page.heading} className="company-richtext" />
                <div className="relative w-4/6 aspect-video">
                  {typeof page.image === 'object' && page.image?.url && (
                    <Image
                      src={page.image.url}
                      alt={page.image.alt}
                      fill
                      className="object-contain"
                      draggable={false}
                    />
                  )}
                </div>
              </div>
            )
          }
        })}
    </section>
  )
}
