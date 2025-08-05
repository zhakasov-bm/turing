import ReviewBlock from '@/app/(frontend)/_components/ReviewBlock'
import BrandsBlock from '../../../_components/BrandsBlock'
import InfoBlock from './InfoBlock'
import ProblemBlock from '../../components/ProblemBlock'

import Hero from './Hero'
import WhyUsBlock from './WhyUsBlock'
import BGraphic from '../../../_components/BGraphic'
import QABlock from './QABlock'

import WhyServiceNeeded from './WhyServiceNeeded'
import AvailableServices from './AvailableServices/AvailableServices'
import LeadCaptureBlock from '@/app/(frontend)/_components/ApplicationForm/LeadCaptureBlock'
import LeadBlock from '../../components/LeadBlock'
import FloatingNav from '@/app/(frontend)/_components/FloatingNav'
import OurStackBlock from '@/app/(frontend)/_components/OurStackBlock'
import ApproachesBlock from './ApproachesBlock'

interface SolutionPageLayoutProps {
  component: any
  solution: any
  subservices: any[]
  solutions?: any[]
  //   cases: any[]
  formBlock: any
  navigation: any
}

export function SolutionPageLayout({
  component,
  solution,
  solutions,
  subservices,
  //   cases,
  formBlock,
  navigation,
}: SolutionPageLayoutProps) {
  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />

      <Hero component={component} solution={solution} />
      <BrandsBlock component={component} />

      <div className="hidden md:block">
        {formBlock && !solution.isOutstaffing && (
          <LeadCaptureBlock block={formBlock} solutions={solutions} />
        )}
      </div>

      {!solution.isOutstaffing &&
        (solution.hasSubservices ? (
          <WhyServiceNeeded solution={solution} />
        ) : (
          <InfoBlock solution={solution} />
        ))}
      {solution.isOutstaffing && <ApproachesBlock solution={solution} block={formBlock} />}

      <ProblemBlock solution={solution} />

      {solution.isOutstaffing && <OurStackBlock component={component} />}
      {!solution.isOutstaffing && (
        <AvailableServices subservices={subservices} solution={solution} block={formBlock} />
      )}

      {/* <CasesBlock heading="Наши кейсы" cases={cases} type="simple" /> */}

      {formBlock && <LeadCaptureBlock block={formBlock} solutions={solutions} />}
      <WhyUsBlock component={component} />
      <ReviewBlock component={component} />

      <QABlock solution={solution} />
      <LeadBlock solution={solution} block={formBlock} />
    </div>
  )
}
