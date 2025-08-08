import React from 'react'
import './styles.css'
import { unbounded, montserrat, inter } from '@/app/fonts'

import { Providers } from './_components/providers/providers'
import Header from './_components/Header/Header'
import Footer from './_components/Footer/Footer'
import { getSolutionData } from '../utils/solutionsService'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Navigation, Solution, Subservice } from '@/payload-types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Turing — IT-решения, которые меняют бизнес',
    template: '%s | Turing — IT-решения, которые меняют бизнес',
  },
  description:
    'Turing — это команда творческих профессионалов, объединённых целью создавать инновационные IT-решения, которые трансформируют бизнес. Мы вдохновляемся идеями, подходим к каждому проекту индивидуально и помогаем компаниям становиться эффективнее, автоматизированнее и технологичнее.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const payload = await getPayload({ config })

  const navigation: Navigation = await payload.findGlobal({ slug: 'navigation' })

  // Услуги (solutions) и подуслуги (subservices) через shared service
  let solutions: Solution[] = []
  let subservices: Subservice[] = []
  try {
    // Fetch all solutions (limit 100) and their subservices
    const allSolutionsRes = await payload.find({ collection: 'solutions', limit: 100 })
    solutions = allSolutionsRes.docs
    // For all solutions, fetch subservices and flatten
    const subservicesArr = await Promise.all(
      solutions.map(async (solution) => {
        const { subservices } = await getSolutionData(solution.slug)
        return subservices
      }),
    )
    subservices = subservicesArr.flat()
  } catch (e) {
    console.error('Error fetching solutions or subservices:', e)
  }

  return (
    <html lang="ru" className={`${unbounded.variable} ${montserrat.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <Header nav={navigation} solutions={solutions} subservices={subservices} />
          <main className="pt-20 md:pt-0">{children}</main>
          <Footer nav={navigation} solutions={solutions} />
        </Providers>
      </body>
    </html>
  )
}
