import PhoneInput from 'react-phone-input-2'
import { useId } from 'react'

export default function FormBuilder({
  form,
  onSubmit,
  phone,
  setPhone,
  error,
  submitButtonLabel = 'Отправить',
  allowedFields,
  solutions = [],
  classNames = {},
}: {
  form: any
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>
  phone: string
  setPhone: (value: string) => void
  error?: string
  submitButtonLabel?: string
  withTextarea?: boolean
  allowedFields?: string[]
  solutions?: { id: string; name: string }[]
  classNames?: {
    wrapper?: string
    input?: string
    textarea?: string
    button?: string
  }
}) {
  const formId = useId()

  return (
    <form className={classNames.wrapper || 'flex flex-col gap-3'} onSubmit={onSubmit}>
      {form?.fields
        ?.filter((field: any) => !allowedFields || allowedFields.includes(field.name))
        .map((field: any, index: number) => {
          const name = field.name || `field-${index}`
          const inputId = `${formId}-${name}-${index}`

          return (
            <div key={field.id || inputId} className="relative flex-1 min-w-[180px]">
              {field.name === 'phone' ? (
                <PhoneInput
                  country={'kz'}
                  specialLabel=""
                  inputProps={{
                    id: inputId,
                    name: field.name,
                    required: field.required,
                    placeholder: field.placeholder,
                    className: classNames.input || 'w-full rounded-2xl bg-white px-4 py-4',
                  }}
                  value={phone}
                  onChange={setPhone}
                />
              ) : field.blockType === 'textarea' ? (
                <textarea
                  name={field.name}
                  id={inputId}
                  required={field.required}
                  placeholder={field.defaultValue}
                  className={
                    classNames.textarea ||
                    'w-full rounded-2xl px-4 pt-5 pb-2 h-40 text-black bg-white text-base font-light italic focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none'
                  }
                />
              ) : field.blockType === 'select' && solutions ? (
                <select
                  name={field.name}
                  id={inputId}
                  required={field.required}
                  className={classNames.input || 'w-full rounded-2xl px-4 py-4 bg-white text-black'}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Выберите услугу
                  </option>
                  {solutions.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type={field.blockType}
                    name={field.name}
                    id={inputId}
                    required={field.required}
                    placeholder=""
                    className={
                      classNames.input ||
                      'peer w-full rounded-2xl px-4 pt-5 pb-2 text-black bg-white text-lg focus:outline-none focus:ring-2'
                    }
                  />
                  <label
                    htmlFor={inputId}
                    className="absolute left-4 top-2 text-xs text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-xs"
                  >
                    {field.label}
                  </label>
                </>
              )}
            </div>
          )
        })}

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        className={
          classNames.button ||
          'w-full bg-black text-white px-5 h-[56px] rounded-2xl font-unbounded hover:text-hover transition'
        }
      >
        {submitButtonLabel}
      </button>
    </form>
  )
}
