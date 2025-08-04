'use client'

import { Component } from '@/payload-types'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import SuccessModal from '../Modal/SuccessModal'
import FormBuilder from './FormBuilder'
import { handleFormSubmit } from '@/app/utils/formHandlers.ts'

type FormState = {
  loading: boolean
  error: string | null
  success: boolean
}

export default function ApplicationFormBlock({ component }: { component: Component }) {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  })

  /**
   * Handles the form submission
   * @param e
   * @returns
   */

  const [phone, setPhone] = useState('')

  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (formState.success) {
      setShowSuccessModal(true)
    }
  }, [formState.success])

  const formBlock = component.globals.find((b) => b.blockType === 'application-form')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    handleFormSubmit({ e, form: formBlock?.form, phone, setFormState, setPhone })

  return (
    <section id="contact" className="lg:block md:container md:mx-auto md:py-24 md:px-24">
      {component.globals.map((block, id) => {
        if (block.blockType === 'application-form') {
          return (
            <div key={id}>
              <h1 className="text-4xl text-center pb-8 md:pb-12">{block.heading}</h1>
              <div
                className="hidden lg:flex"
                style={{
                  backgroundImage: 'url("/contact-graphic.svg")',
                  width: '100%',
                  height: '100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
              >
                {/* Left Side */}
                <div className="flex flex-col gap-5 w-1/2 pt-40 pl-40 text-black">
                  <h1 className="text-3xl pb-4">{block.title}</h1>
                  {block.contacts?.map((contact, i) => (
                    <div key={i}>
                      {typeof contact.icon === 'object' && contact.icon.url && (
                        <div className="flex gap-3">
                          <Image
                            src={contact.icon.url}
                            alt={contact.icon.alt}
                            width={24}
                            height={24}
                            className="object-contain"
                            draggable={false}
                          />
                          <p className="font-light">{contact.item}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Side */}
                <div className="w-1/2 py-40 pr-24">
                  {typeof block?.form === 'object' && block?.form?.title === 'application-form' && (
                    <div className="flex flex-col gap-6">
                      <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                      >
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
                        allowedFields={['fullname', 'email', 'phone', 'comment']}
                        classNames={{
                          wrapper: 'flex flex-col gap-3 items-stretch font-inter',
                          button:
                            'w-full bg-black text-white px-5 h-[56px] rounded-2xl cursor-pointer font-unbounded hover:text-hover transition',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile */}
              <div className="px-6 py-8 md:p-12 m-6 bg-primary rounded-custom lg:hidden">
                {typeof block?.form === 'object' && block?.form?.title === 'application-form' && (
                  <div className="flex flex-col gap-6">
                    <SuccessModal
                      isOpen={showSuccessModal}
                      onClose={() => setShowSuccessModal(false)}
                    >
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
                      allowedFields={['fullname', 'email', 'phone', 'comment']}
                      classNames={{
                        wrapper: 'flex flex-col gap-3 items-stretch font-inter',
                        button:
                          'w-full bg-black text-white px-5 h-[56px] rounded-2xl cursor-pointer font-unbounded hover:text-hover transition',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        }
      })}
    </section>
  )
}
