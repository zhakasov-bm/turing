import Breadcrumbs from '@/app/(frontend)/_components/Breadcrumbs/Breadcrumbs'
import UniversalButton from '@/app/(frontend)/_components/UniversalButton'
import { Case } from '@/payload-types'
import type { AppLocale } from '@/app/utils/locale'
import { getBreadcrumbLocaleLabels } from '@/app/utils/breadcrumbLabels'

type HeroProps = {
  caseData: Case
  locale: AppLocale
}

export default function Hero({ caseData, locale }: HeroProps) {
  const breadcrumbLabels = getBreadcrumbLocaleLabels(locale)

  return (
    <section className="container mx-auto pt-20 md:pb-20 flex flex-col items-center text-center">
      <div className="flex flex-col items-center gap-5 max-w-5xl p-8 md:p-0">
        {/* Breadcrumbs */}
        <div className="mb-8 px-6 md:px-0 flex justify-center">
          <Breadcrumbs
            customLabels={{
              case: breadcrumbLabels.case,
              [caseData.slug]: caseData.heading,
            }}
          />
        </div>
        <h1 className="text-5xl md:leading-14">{caseData.heading}</h1>
        <p className="text-lg md:text-2xl font-light font-inter">{caseData.subtitle}</p>
        <UniversalButton label="Обсудить проект" className="mt-8 max-w-fit" to="#contact" />
      </div>
    </section>
  )
}
