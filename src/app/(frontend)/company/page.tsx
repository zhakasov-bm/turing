import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import BGraphic from '../_components/BGraphic'
import Hero from './components/Hero'
import About from './components/About'
import Mission from './components/Mission'
import TeamBlock from '../_components/TeamBlock'
import OurStackBlock from '../_components/OurStackBlock'

export default async function CompanyPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const component = await payload.findGlobal({
    slug: 'component',
    user,
  })

  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'company' } },
    limit: 1,
  })
  const page = res.docs[0]

  if (!page) {
    return <div>Страница не найдена</div>
  }

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div>
      <BGraphic />
      <Hero page={page} />
      <About page={page} />
      <Mission page={page} />
      <TeamBlock component={component} />
      <OurStackBlock component={component} />
    </div>
  )
}
