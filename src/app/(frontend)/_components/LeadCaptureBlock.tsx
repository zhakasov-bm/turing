'use client'

import { useEffect, useState } from 'react'

import { handleFormSubmit } from '@/app/utils/formHandlers.ts'
import { Component, Solution } from '@/payload-types'
import FormBuilder from './ApplicationForm/FormBuilder'
import SuccessModal from './Modal/SuccessModal'
import { RichText } from '@payloadcms/richtext-lexical/react'

type LeadCaptureProps = Extract<Component['globals'][0], { blockType: 'form' }>
type FormState = {
  loading: boolean
  error: string | null
  success: boolean
}

type Props = {
  block: LeadCaptureProps
}

export default function LeadCaptureBlock({ block }: Props) {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  })

  const [solutions, setSolutions] = useState<Solution[]>([])
  useEffect(() => {
    fetch('/api/solutions')
      .then((res) => (res.ok ? res.json() : Promise.reject('Ошибка при получении решений')))
      .then((data) => setSolutions(data.docs || []))
      .catch((err) => console.error(err))
  }, [])

  const [phone, setPhone] = useState('')

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (formState.success) {
      setShowSuccessModal(true)
    }
  }, [formState.success])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    handleFormSubmit({ e, form: block.form, phone, setFormState, setPhone })

  return (
    <section className="container mx-auto my-16 lg:my-20 px-6 md:px-56">
      <div className="bg-background rounded-custom">
        {typeof block?.form === 'object' && block?.form?.title === 'application-form' && (
          <div className="flex flex-col gap-6 py-10 px-4 md:px-8">
            <h3 className="text-xl md:text-xl md:px-16 leadForm text-center">{block.heading}</h3>
            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
              {block.form?.confirmationMessage ? (
                <RichText data={block.form.confirmationMessage} />
              ) : (
                <p>Форма сәтті жіберілді!</p>
              )}
            </SuccessModal>
            <FormBuilder
              form={block.form}
              phone={phone}
              setPhone={setPhone}
              onSubmit={handleSubmit}
              error={formState.error ?? undefined}
              submitButtonLabel={block?.form?.submitButtonLabel || 'Отправить'}
              allowedFields={['fullname', 'phone', 'category']}
              solutions={solutions}
              classNames={{
                wrapper: 'flex flex-col lg:flex-row gap-3 items-stretch font-inter',
                button:
                  'bg-primary text-black px-5 rounded-2xl py-4 lg:h-min-full font-unbounded transition hover:bg-hover cursor-pointer',
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
