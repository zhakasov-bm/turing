import BGraphic from '@/app/(frontend)/_components/BGraphic'
import Hero from '../../_components/Hero'
import BrandsBlockBlock from '@/app/(frontend)/_components/BrandsBlock'
import InfoBlock from '../../_components/InfoBlock'
import AvailableServices from '../../_components/AvailableServices/AvailableServices'
import ReviewBlock from '@/app/(frontend)/_components/ReviewBlock'
import ApplicationFormBlock from '@/app/(frontend)/_components/ApplicationForm/ApplicationFormBlock'
import QABlock from '../../_components/QABlock'
// import FloatingNav from '@/app/(frontend)/_components/FloatingNav'

interface SubservicePageLayoutProps {
  component: any
  service: any
  subservice: any
  // cases: any[]
  formBlock: any
  // requestFormBlock: any
  // seoBlocks: any[]
  // navigation: any
}

export function SubservicePageLayout({
  component,
  service,
  subservice,
  // cases,
  formBlock,
  // requestFormBlock,
  // seoBlocks,
  // navigation,
}: SubservicePageLayoutProps) {
  return (
    <div>
      <BGraphic />
      {/* <FloatingNav nav={navigation} /> */}

      <Hero component={component} subservice={subservice} />
      <BrandsBlockBlock component={component} />

      {/* {formBlock && <LeadCaptureBlock block={formBlock} formId="form-0" />} */}
      <InfoBlock subservice={subservice} />

      <AvailableServices
        solution={service}
        subservices={[subservice]}
        subservice={subservice}
        block={formBlock}
      />
      {/* <WhyUsBlock component={component} /> */}
      {/* <CasesBlock heading="Наши кейсы" cases={cases} type="simple" /> */}

      {/* {formBlock && <LeadCaptureBlock block={formBlock} formId="form-1" />} */}

      <ReviewBlock component={component} />
      <QABlock subservice={subservice} />

      <ApplicationFormBlock component={component} />
    </div>
  )
}
