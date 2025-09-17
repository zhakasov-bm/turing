import React, { useEffect, useState } from 'react'
import { ALLOWED_CITIES, CITY_RU, getCityLabel } from '@/app/utils/cities'
import { X } from 'lucide-react'

type CityModalProps = {
  currentCity: string
  onSelect: (city: string) => void
  onClose: () => void
}

export const CityModal = ({ currentCity, onSelect, onClose }: CityModalProps) => {
  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru')
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(/(?:^|; )lang=([^;]+)/)
      const val = (m?.[1] as 'ru' | 'kk' | 'en' | undefined) || 'ru'
      setLang(val)
    }
  }, [])
  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden'
    return () => {
      // Restore scroll
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 focus:outline">
      <div className="bg-background rounded-custom p-6 min-w-[300px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-base">
            {lang === 'kk' ? 'Қаланы таңдаңыз' : lang === 'en' ? 'Choose a city' : 'Выберите город'}
          </span>
          <X onClick={onClose} size={28} className="cursor-pointer" />
        </div>

        <ul>
          {ALLOWED_CITIES.map((city) => (
            <li key={city}>
              <button
                className={`w-full font-inter text-left py-2 px-4 rounded-custom cursor-pointer hover:bg-cityHover ${
                  city === currentCity ? 'text-link' : 'text-link/40'
                }`}
                onClick={() => onSelect(city)}
              >
                {getCityLabel(city, lang)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
