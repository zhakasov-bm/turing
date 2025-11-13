'use client'

import { useState } from 'react'
import UniversalButton from '../UniversalButton'
import { X } from 'lucide-react'

type FormState = {
  loading: boolean
  error: string | null
  success: boolean
}

type Props = {
  vacancyName: string
  buttonTitle: string
}

export default function VacancyModal({ vacancyName, buttonTitle }: Props) {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  })

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setFormState({ loading: true, error: null, success: false })

    try {
      const formElement = e.target as HTMLFormElement
      const formData = new FormData(formElement)
      formData.set('formName', `Отклик на вакансию: ${vacancyName}`)
      formData.set('vacancyName', vacancyName)

      const response = await fetch('/api/lead', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || 'Не удалось отправить форму. Попробуйте позже.')
      }

      setFormState({ loading: false, error: null, success: true })
      formElement.reset()

      setTimeout(() => {
        setFormState({ loading: false, error: null, success: false })
      }, 3000)
    } catch (err) {
      console.error(err)
      setFormState({
        loading: false,
        error: err instanceof Error ? err.message : 'Ошибка отправки формы',
        success: false,
      })
    } finally {
      setLoading(false)
    }
  }
  //
  return (
    <>
      {/* Trigger Button */}

      <UniversalButton label={buttonTitle} onClick={() => setOpen(true)} />

      {/* Modal Overlay */}

      {open && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-custom p-6 w-full max-w-md text-center relative mx-6 shadow-2xl">
            <div className="flex justify-end items-end mb-4">
              <X onClick={() => setOpen(false)} size={28} className="cursor-pointer text-black" />
            </div>
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
                  <p className="text-green-600">Форма успешно отправлена!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6 md:p-4">
                  <p className="text-xl text-black text-left font-inter">
                    <span className="font-medium font-unbounded pb-2">Отклик на вакансию</span>{' '}
                    <br /> &quot;{vacancyName}&quot;
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input name="name" placeholder="Имя" required className="inputBase" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Почта"
                      required
                      className="inputBase"
                    />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Телефон"
                      required
                      className="inputBase"
                    />
                    <input
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      placeholder="Загрузить резюме"
                      required
                      className="inputBase text-sm file:block file:w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:mb-2 file:cursor-pointer file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white px-5 h-[56px] rounded-2xl font-unbounded hover:text-hover transition"
                    >
                      {loading ? 'Отправка...' : 'Отправить'}
                    </button>
                    {formState.error && (
                      <p className="text-sm text-red-500 text-left">{formState.error}</p>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
