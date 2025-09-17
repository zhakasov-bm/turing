'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const SUPPORTED = ['ru', 'kk', 'en'] as const
type Locale = (typeof SUPPORTED)[number]

function getLangFromCookie(): Locale {
  if (typeof document === 'undefined') return 'ru'
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/)
  const value = match?.[1]
  if (value && SUPPORTED.includes(value as Locale)) return value as Locale
  return 'ru'
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const [lang, setLang] = useState<Locale>('ru')

  useEffect(() => {
    setLang(getLangFromCookie())
  }, [])

  const onChange = (value: string) => {
    const next = (value || 'ru') as Locale
    setLang(next)
    if (typeof document !== 'undefined') {
      document.cookie = `lang=${next}; path=/; max-age=31536000`
      // Force full reload so all client components pick up new cookie
      window.location.reload()
      return
    }
    router.refresh()
  }

  return (
    <select
      value={lang}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm bg-transparent border border-gray-300 rounded px-2 py-1 cursor-pointer"
      aria-label="Language selector"
    >
      <option value="ru">RU</option>
      <option value="kk">KK</option>
      <option value="en">EN</option>
    </select>
  )
}
