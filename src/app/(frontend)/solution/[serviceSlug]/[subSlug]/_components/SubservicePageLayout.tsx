import BGraphic from '@/app/(frontend)/_components/BGraphic'
import Hero from '../../_components/Hero'
import BrandsBlockBlock from '@/app/(frontend)/_components/BrandsBlock'
import InfoBlock from '../../_components/InfoBlock'
import AvailableServices from '../../_components/AvailableServices/AvailableServices'
import ReviewBlock from '@/app/(frontend)/_components/ReviewBlock'
import ApplicationFormBlock from '@/app/(frontend)/_components/ApplicationForm/ApplicationFormBlock'
import QABlock from '../../_components/QABlock'
import LeadCaptureBlock from '@/app/(frontend)/_components/ApplicationForm/LeadCaptureBlock'
import WhyUsBlock from '../../_components/WhyUsBlock'
import FloatingNav from '@/app/(frontend)/_components/FloatingNav'

interface SubservicePageLayoutProps {
  component: any
  solutions?: any[]
  service: any
  subservice: any
  // cases: any[]
  formBlock: any
  navigation: any
}

export function SubservicePageLayout({
  component,
  solutions,
  service,
  subservice,
  // cases,
  formBlock,
  navigation,
}: SubservicePageLayoutProps) {
  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />

      <Hero component={component} subservice={subservice} />
      <BrandsBlockBlock component={component} />

      <div className="hidden md:block">
        {formBlock && <LeadCaptureBlock block={formBlock} solutions={solutions} />}
      </div>

      <InfoBlock subservice={subservice} />

      <AvailableServices
        solution={service}
        subservices={[subservice]}
        subservice={subservice}
        block={formBlock}
      />
      <WhyUsBlock component={component} />
      {/* <CasesBlock heading="Наши кейсы" cases={cases} type="simple" /> */}

      <div className="hidden md:block">
        {formBlock && <LeadCaptureBlock block={formBlock} solutions={solutions} />}
      </div>

      <ReviewBlock component={component} />
      <QABlock subservice={subservice} />

      <ApplicationFormBlock component={component} />
    </div>
  )
}
