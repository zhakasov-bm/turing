'use client'

import { useEffect, useState } from 'react'
import { Component } from '@/payload-types'
import { X } from 'lucide-react'
import { handleFormSubmit } from '@/app/utils/formHandlers.ts'
import FormBuilder from '../ApplicationForm/FormBuilder'
import { RichText } from '@payloadcms/richtext-lexical/react'

type LeadCaptureProps = Extract<Component['globals'][0], { blockType: 'form' }>

type Props = {
  isOpen: boolean
  onClose: () => void
  block: LeadCaptureProps
}

type FormState = {
  loading: boolean
  error: string | null
  success: boolean
}

export default function ConsultationModal({ isOpen, onClose, block }: Props) {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  })
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('consultation-modal-form')
    if (saved) {
      const { phone: savedPhone } = JSON.parse(saved)
      setPhone(savedPhone || '')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('consultation-modal-form', JSON.stringify({ phone }))
  }, [phone])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    handleFormSubmit({ e, form: block.form, phone, setFormState, setPhone })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-custom p-6 w-full max-w-md text-center relative mx-6 shadow-2xl">
        <div className="flex justify-end items-end mb-4">
          <X onClick={onClose} size={28} className="cursor-pointer" />
        </div>
        {typeof block?.form === 'object' && block?.form?.title === 'application-form' && (
          <div>
            {formState.success ? (
              <div className="text-center py-6 px-4 text-lg">
                <div className="text-green-500 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {block.form?.confirmationMessage ? (
                  <RichText data={block.form.confirmationMessage} />
                ) : (
                  <p className="text-green-600">Форма успешно отправлена!</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6 md:p-4">
                <span className="text-xl leadForm text-center">Получить консультацию</span>
                <FormBuilder
                  form={block.form}
                  phone={phone}
                  setPhone={setPhone}
                  onSubmit={handleSubmit}
                  error={formState.error ?? undefined}
                  submitButtonLabel={block?.form?.submitButtonLabel || 'Отправить'}
                  allowedFields={['fullname', 'email', 'phone']}
                  classNames={{
                    wrapper: 'flex flex-col gap-3 items-stretch font-inter',
                    input:
                      'peer w-full rounded-2xl px-4 pt-5 pb-2 text-black bg-background text-lg focus:outline-none focus:ring-2',
                    button:
                      'bg-primary text-black px-5 rounded-2xl py-4 lg:h-min-full font-unbounded transition hover:bg-hover cursor-pointer',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
