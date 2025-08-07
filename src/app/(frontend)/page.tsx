import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import BGraphic from './_components/BGraphic'
import HeroBlock from './_components/HeroBlock'
import AboutUsBlock from './_components/AboutUsBlock'
import TeamBlock from './_components/TeamBlock'
import BrandsBlock from './_components/BrandsBlock'
import ReviewBlock from './_components/ReviewBlock'
import ApplicationFormBlock from './_components/ApplicationForm/ApplicationFormBlock'
import OurStackBlock from './_components/OurStackBlock'
import ServicesBlock from './_components/ServicesBlock'
import LeadCaptureBlock from './_components/ApplicationForm/LeadCaptureBlock'
import FloatingNav from './_components/FloatingNav'
import { getHomePageData } from '../utils/homeService'
import PostsSection from './_components/PostsSection'
import CasesBlock from './_components/CasesBlock'

export default async function HomePage() {
  // const headers = await getHeaders()
  // const payloadConfig = await config
  // const payload = await getPayload({ config: payloadConfig })

  const { component, solutions, cases, navigation } = await getHomePageData()

  const serviceBlock = component.globals.find((block) => block.blockType === 'services')
  const heading = serviceBlock?.heading || ''

  const postBlock = component.globals.find((block) => block.blockType === 'posts')
  const postHeading = postBlock?.heading || 'Последнее из блога'

  // const solutionsRes = await payload.find({ collection: 'solutions', sort: 'createdAt' })
  // const solutions = solutionsRes.docs
  const formBlocks = component.globals.filter((block) => block.blockType === 'form')

  return (
    <div>
      <BGraphic />
      <FloatingNav nav={navigation} />

      <HeroBlock component={component} />
      <AboutUsBlock component={component} />
      <ServicesBlock heading={heading} solutions={solutions} block={formBlocks[0]} />
      <CasesBlock heading="Кейсы – истории, которые мы создали" cases={cases} type="slider" />
      <div
        className="hidden md:block"
        style={{
          backgroundImage: 'url("graphic.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          backgroundSize: 'contain',
        }}
      >
        <LeadCaptureBlock block={formBlocks[0]} solutions={solutions} />
      </div>

      <OurStackBlock component={component} />
      <div className="hidden md:block">
        <BrandsBlock component={component} isLabel={true} />
      </div>
      <LeadCaptureBlock block={formBlocks[1]} solutions={solutions} />

      <TeamBlock component={component} />
      <ReviewBlock component={component} />
      <PostsSection heading={postHeading} />
      <ApplicationFormBlock component={component} />
    </div>
  )
}
