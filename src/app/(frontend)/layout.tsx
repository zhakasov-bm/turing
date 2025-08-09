import React from 'react'
import './styles.css'
import { unbounded, montserrat, inter } from '@/app/fonts'

import { Providers } from './_components/providers/providers'
import Header from './_components/Header/Header'
import Footer from './_components/Footer/Footer'
import { Metadata } from 'next'
import { getHomePageData } from '../utils/homeService'
import { getAllSubservices } from '../utils/getAllSubservices'

export const metadata: Metadata = {
  title: {
    default: 'Turing — IT-решения, которые меняют бизнес',
    template: '%s | Turing — IT-решения, которые меняют бизнес',
  },
  description:
    'Turing — это команда творческих профессионалов, объединённых целью создавать инновационные IT-решения, которые трансформируют бизнес. Мы вдохновляемся идеями, подходим к каждому проекту индивидуально и помогаем компаниям становиться эффективнее, автоматизированнее и технологичнее.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        url: 'https://alanturing.app',
        name: 'Alan Turing IT Agency',
        description:
          'Разработка программного обеспечения, подбор удалённых разработчиков, IT-аутсорсинг.',
        publisher: { '@id': 'https://alanturing.app/#organization' },
      },
      {
        '@type': 'Organization',
        '@id': 'https://alanturing.app/#organization',
        name: 'Alan Turing IT Agency',
        url: 'https://alanturing.app',
        logo: 'https://alanturing.app/company-og.jpg',
        sameAs: ['https://www.instagram.com/turing.kz'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. Маркова, д. 24а',
          addressLocality: 'Алматы',
          postalCode: '050000',
          addressCountry: 'KZ',
        },

        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+7 775 202 60 10',
            contactType: 'customer support',
          },
        ],
      },
    ],
  }

  const { children } = props

  const { solutions, navigation } = await getHomePageData()
  const subservices = await getAllSubservices()

  return (
    <html lang="ru" className={`${unbounded.variable} ${montserrat.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
