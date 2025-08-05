import React from 'react'
import './styles.css'
import { Providers } from './_components/providers/providers'
import Header from './_components/Header/Header'
import Footer from './_components/Footer/Footer'
import { getSolutionData } from '../utils/solutionsService'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Solution, Subservice } from '@/payload-types'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const payload = await getPayload({ config })

  const navigation = await payload.findGlobal({ slug: 'navigation' })

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
    <html lang="en">
      <body>
        <Providers>
          <Header nav={navigation} solutions={solutions} subservices={subservices} />
          <main>{children}</main>
          <Footer nav={navigation} solutions={solutions} />
        </Providers>
      </body>
    </html>
  )
}
