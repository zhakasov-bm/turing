import type { AppLocale } from './locale'

type LabelMap = Record<string, string>

const BREADCRUMB_LABELS: Record<AppLocale, LabelMap> = {
  ru: {
    home: 'Главная',
    solution: 'Услуги',
    case: 'Кейсы',
    company: 'О компании',
    blogs: 'Блог',
    vacancy: 'Вакансии',
  },
  kk: {
    home: 'Басты бет',
    solution: 'Қызметтер',
    case: 'Кейстер',
    company: 'Компания туралы',
    blogs: 'Блог',
    vacancy: 'Вакансиялар',
  },
  en: {
    home: 'Home',
    solution: 'Services',
    case: 'Case Studies',
    company: 'About Us',
    blogs: 'Blog',
    vacancy: 'Vacancies',
  },
}

export function getBreadcrumbLocaleLabels(locale: AppLocale): LabelMap {
  return BREADCRUMB_LABELS[locale] ?? BREADCRUMB_LABELS.ru
}

export function getBreadcrumbDefaultLabel(segment: string, locale: AppLocale): string | undefined {
  return getBreadcrumbLocaleLabels(locale)[segment]
}
