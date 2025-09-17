type CityInfo = {
  ru: string
  prepositional: string
  // Optional future translations; fallback to ru if missing
  kk?: string
  en?: string
  prepositionalKk?: string
  prepositionalEn?: string
}

export const CITIES: Record<string, CityInfo> = {
  default: { ru: '', prepositional: '', kk: '', en: '', prepositionalKk: '', prepositionalEn: '' },
  almaty: {
    ru: 'Алматы',
    prepositional: 'в Алматы',
    kk: 'Алматы',
    en: 'Almaty',
    prepositionalKk: 'Алматы',
    prepositionalEn: 'in Almaty',
  },
  astana: {
    ru: 'Астана',
    prepositional: 'в Астане',
    kk: 'Астана',
    en: 'Astana',
    prepositionalKk: 'Астана',
    prepositionalEn: 'in Astana',
  },
  shymkent: {
    ru: 'Шымкент',
    prepositional: 'в Шымкенте',
    kk: 'Шымкент',
    en: 'Shymkent',
    prepositionalKk: 'Шымкент',
    prepositionalEn: 'in Shymkent',
  },
  aktobe: {
    ru: 'Актобе',
    prepositional: 'в Актобе',
    kk: 'Ақтөбе',
    en: 'Aktobe',
    prepositionalKk: 'Ақтөбе',
    prepositionalEn: 'in Aktobe',
  },
  aktau: {
    ru: 'Актау',
    prepositional: 'в Актау',
    kk: 'Ақтау',
    en: 'Aktau',
    prepositionalKk: 'Ақтау',
    prepositionalEn: 'in Aktau',
  },
  atyrau: {
    ru: 'Атырау',
    prepositional: 'в Атырау',
    kk: 'Атырау',
    en: 'Atyrau',
    prepositionalKk: 'Атырау',
    prepositionalEn: 'in Atyrau',
  },
  taraz: {
    ru: 'Тараз',
    prepositional: 'в Таразе',
    kk: 'Тараз',
    en: 'Taraz',
    prepositionalKk: 'Тараз',
    prepositionalEn: 'in Taraz',
  },
  talgar: {
    ru: 'Талгар',
    prepositional: 'в Талгаре',
    kk: 'Талғар',
    en: 'Talgar',
    prepositionalKk: 'Талғар',
    prepositionalEn: 'in Talgar',
  },
  kyzylorda: {
    ru: 'Кызылорда',
    prepositional: 'в Кызылорде',
    kk: 'Қызылорда',
    en: 'Kyzylorda',
    prepositionalKk: 'Қызылорда',
    prepositionalEn: 'in Kyzylorda',
  },
  kostanay: {
    ru: 'Костанай',
    prepositional: 'в Костанае',
    kk: 'Қостанай',
    en: 'Kostanay',
    prepositionalKk: 'Қостанай',
    prepositionalEn: 'in Kostanay',
  },
  dubai: {
    ru: 'Дубай',
    prepositional: 'в Дубае',
    kk: 'Дубай',
    en: 'Dubai',
    prepositionalKk: 'Дубай',
    prepositionalEn: 'in Dubai',
  },
  batumi: {
    ru: 'Батуми',
    prepositional: 'в Батуми',
    kk: 'Батуми',
    en: 'Batumi',
    prepositionalKk: 'Батуми',
    prepositionalEn: 'in Batumi',
  },
}

export const ALLOWED_CITIES = Object.keys(CITIES)

export const CITY_RU = Object.fromEntries(
  Object.entries(CITIES).map(([key, value]) => [key, value.ru]),
)

export const CITY_PREPOSITIONAL = Object.fromEntries(
  Object.entries(CITIES).map(([key, value]) => [key, value.prepositional]),
)

export const getCityRegex = () => {
  return new RegExp(`^/(${ALLOWED_CITIES.join('|')})`)
}

export type CityLocale = 'ru' | 'kk' | 'en'

export function getCityLabel(code: string, locale: CityLocale = 'ru'): string {
  const info = CITIES[code]
  if (!info) return code
  if (locale === 'kk') return info.kk || info.ru
  if (locale === 'en') return info.en || info.ru
  return info.ru
}

export function getCityPrepositionalLabel(
  code: string,
  locale: CityLocale = 'ru',
): string {
  const info = CITIES[code]
  if (!info) return code
  if (locale === 'kk') return info.prepositionalKk || info.prepositional
  if (locale === 'en') return info.prepositionalEn || info.prepositional
  return info.prepositional
}
