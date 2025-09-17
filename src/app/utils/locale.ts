export type AppLocale = 'ru' | 'kk' | 'en'

export function resolveLocale(input?: string | null): AppLocale {
  return input === 'ru' || input === 'kk' || input === 'en' ? input : 'ru'
}

