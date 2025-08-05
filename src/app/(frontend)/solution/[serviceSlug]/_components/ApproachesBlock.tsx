'use client'

import ConsultationModal from '@/app/(frontend)/_components/Modal/ConsultationModal'
import UniversalButton from '@/app/(frontend)/_components/UniversalButton'
import { Component, Solution } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { useState } from 'react'

type LeadCaptureProps = Extract<Component['globals'][0], { blockType: 'form' }>

type Props = {
  solution?: Solution
  block: LeadCaptureProps
}

export default function ApproachesBlock({ solution, block }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  const content = solution
  if (!content) return null

  return (
    <section id="faq" className="container mx-auto px-8 md:px-24 my-16">
      <div className="approach-richtext">
        {typeof solution.titleOutstaff === 'object' && solution.titleOutstaff?.root && (
          <RichText data={solution.titleOutstaff} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-12">
        {solution.approaches?.map((approach, id) => (
          <div key={id} className="flex items-center gap-3 px-4 py-2 bg-background rounded-custom">
            {typeof approach.icon === 'object' && approach.icon?.url && (
              <Image
                src={approach.icon.url}
                alt={approach.icon.alt || ''}
                width={100}
                height={100}
                className="contain"
                draggable={false}
              />
            )}
            <span>{approach.title}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-10">
        <UniversalButton label="Получить консультацию" onClick={() => setModalOpen(true)} />
      </div>
      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} block={block} />
    </section>
  )
}
