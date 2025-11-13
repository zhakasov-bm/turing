import type React from 'react'

const PHONE_REGEX = /^\+?\d{10,15}$/
const DEFAULT_FORM_NAME = 'Заявка с сайта'

async function submitLeadRequest(formData: FormData) {
  const response = await fetch('/api/lead', {
    method: 'POST',
    body: formData,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.message || 'Не удалось отправить форму. Попробуйте позже.')
  }

  return payload
}

type SetFormState = React.Dispatch<
  React.SetStateAction<{
    loading: boolean
    error: string | null
    success: boolean
  }>
>

export const handleFormSubmit = async ({
  e,
  form,
  phone,
  setFormState,
  setPhone,
}: {
  e: React.FormEvent<HTMLFormElement>
  form: any
  phone: string
  setFormState: SetFormState
  setPhone: (v: string) => void
}) => {
  e.preventDefault()

  setFormState({ loading: true, error: null, success: false })

  try {
    const formData = new FormData(e.target as HTMLFormElement)
    formData.set('phone', phone)

    if (form && typeof form === 'object') {
      formData.set('formName', typeof form?.title === 'string' ? form.title : DEFAULT_FORM_NAME)
      if (form?.id) {
        formData.set('formId', String(form.id))
      }
    } else {
      formData.set('formName', DEFAULT_FORM_NAME)
    }

    const phoneValue = String(formData.get('phone') || '').replace(/[\s()-]/g, '')
    if (!PHONE_REGEX.test(phoneValue)) {
      setFormState({ loading: false, error: 'Некорректный номер телефона', success: false })
      return
    }

    await submitLeadRequest(formData)

    setFormState({ loading: false, error: null, success: true })
    setPhone('+7 ')
    ;(e.target as HTMLFormElement).reset()

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
  }
}
