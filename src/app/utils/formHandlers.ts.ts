import { submitToTelegram } from '@/app/utils/submitToTelegram'

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

  if (!form || typeof form !== 'object') {
    return setFormState({
      loading: false,
      error: 'Неверная конфигурация формы',
      success: false,
    })
  }

  setFormState({ loading: true, error: null, success: false })

  try {
    const formData = new FormData(e.target as HTMLFormElement)
    formData.set('phone', phone)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>

    // Валидация номера
    const phoneValue = data.phone || ''
    const phoneRegex = /^\+?\d{10,15}$/
    if (!phoneRegex.test(phoneValue)) {
      setFormState({ loading: false, error: 'Некорректный номер телефона', success: false })
      return
    }

    await submitToTelegram(data)

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
