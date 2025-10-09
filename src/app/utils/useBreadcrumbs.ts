import { usePathname } from 'next/navigation'
import { ALLOWED_CITIES } from './cities'
import { useCurrentCity } from './useCurrentCity'
import { resolveLocale, type AppLocale } from './locale'
import { getBreadcrumbDefaultLabel } from './breadcrumbLabels'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface UseBreadcrumbsOptions {
  showHome?: boolean
  customLabels?: Record<string, string>
  items?: BreadcrumbItem[]
}

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}) {
  const pathname = usePathname()
  const [currentCity] = useCurrentCity()
  const { showHome = true, customLabels = {}, items } = options
  const locale = getClientLocale()

  // Если items переданы, используем их
  if (items) {
    return items
  }

  // Иначе генерируем из pathname
  return generateBreadcrumbsFromPath(pathname, showHome, customLabels, currentCity, locale)
}

function generateBreadcrumbsFromPath(
  pathname: string,
  showHome: boolean,
  customLabels: Record<string, string>,
  currentCity: string,
  locale: AppLocale,
): BreadcrumbItem[] {
  let segments = pathname.split('/').filter(Boolean)
  // Определяем город только из URL, не из currentCity
  let city = ''
  if (segments.length && ALLOWED_CITIES.includes(segments[0])) {
    city = segments[0]
    segments = segments.slice(1)
  }

  const breadcrumbs: BreadcrumbItem[] = []

  // Главная страница
  if (showHome) {
    breadcrumbs.push({
      label: getBreadcrumbDefaultLabel('home', locale) ?? 'Главная',
      href: city ? `/${city}` : '/',
    })
  }

  let currentPath = city ? `/${city}` : ''
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    // Определяем label для каждого сегмента
    let label = segment
    if (customLabels[segment]) {
      label = customLabels[segment]
    } else {
      const defaultLabel = getBreadcrumbDefaultLabel(segment, locale)
      label = defaultLabel ?? formatBreadcrumbSegment(segment)
    }

    const isLast = i === segments.length - 1
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isActive: isLast,
    })
  }

  return breadcrumbs
}

function getClientLocale(): AppLocale {
  if (typeof document === 'undefined') {
    return 'ru'
  }
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/)
  return resolveLocale(match?.[1])
}

function formatBreadcrumbSegment(segment: string): string {
  let decoded = segment
  try {
    decoded = decodeURIComponent(segment)
  } catch {
    decoded = segment
  }

  const spaced = decoded.replace(/-/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
