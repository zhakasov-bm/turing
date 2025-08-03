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

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const component = await payload.findGlobal({
    slug: 'component',
    user,
  })

  const serviceBlock = component.globals.find((block) => block.blockType === 'services')
  const heading = serviceBlock?.heading || ''

  const solutionsRes = await payload.find({ collection: 'solutions' })
  const solutions = solutionsRes.docs
  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div>
      <BGraphic />
      <HeroBlock component={component} />
      <AboutUsBlock component={component} />
      <ServicesBlock heading={heading} solutions={solutions} />
      <OurStackBlock component={component} />
      <div className="hidden md:block">
        <BrandsBlock component={component} isLabel={true} />
      </div>
      <TeamBlock component={component} />

      <ReviewBlock component={component} />
      <ApplicationFormBlock component={component} />
    </div>
  )
}
