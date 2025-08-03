'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// import { useCurrentCity } from '@/app/utils/useCurrentCity'

import { Solution } from '@/payload-types'
// import UniversalButton from './UniversalButton'
// import { ConsultationForm } from './Modal/ConsultationModal'

type Props = {
  heading: string
  solutions: Solution[]
}

export default function ServicesBlock({ heading, solutions }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  //   const [currentCity] = useCurrentCity()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="container-class" id="services">
      <h1 className="text-4xl text-center mb-8 md:mb-12">{heading}</h1>

      {/* Card */}
      <div className="flex overflow-x-auto hide-scrollbar md:grid grid-cols-2 gap-3 h-[280px] md:h-auto">
        {solutions.map((solution) => (
          <Link
            href={`/solution/${solution.slug}`}
            key={solution.id}
            className="relative bg-background rounded-custom p-6 flex flex-col md:flex-row justify-between items-start group md:max-h-[240px] min-w-[80%] overflow-hidden"
          >
            <div className="flex flex-col gap-2 z-10 md:pb-16 md:max-w-90">
              <h3 className="text-base md:text-xl">{solution.name}</h3>
              <div className="flex flex-wrap w-full gap-1 md:gap-2 pt-2 pb-10">
                {solution.details?.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 md:px-3 py-1 border border-link/20 bg-background/20 backdrop-blur-[2px] rounded-custom text-[10px] md:text-sm"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Image */}
            {typeof solution.icon === 'object' && solution.icon?.url && (
              <div className="absolute bottom-[-20px] -right-10 w-[200px] h-[200px] md:bottom-[-70px] md:right-[-40px] md:w-[280px] md:h-[280px] pointer-events-none">
                <Image
                  src={solution.icon?.url}
                  alt={solution.icon?.alt || ''}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  draggable={false}
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
