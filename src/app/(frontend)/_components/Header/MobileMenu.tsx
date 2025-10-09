'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import type { Navigation, Solution, Subservice } from '@/payload-types'
import { useCurrentCity } from '@/app/utils/useCurrentCity'
import { getNavLinkProps } from './Header'
import { CITY_RU, getCityLabel } from '@/app/utils/cities'
import LanguageSwitcher from './LanguageSwitcher'
import { PiMapPinFill } from 'react-icons/pi'

type Props = {
  nav: Navigation
  solutions: Solution[]
  subservices: Subservice[]
  toggleMobileMenu: () => void
  onOpenCityModal: () => void
  isMobileOpen: boolean
}

export function MobileMenu({
  nav,
  solutions,
  subservices,
  toggleMobileMenu,
  onOpenCityModal,
  isMobileOpen,
}: Props) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [openSolutionId, setOpenSolutionId] = useState<string | null>(null)
  const [currentCity, setCurrentCity] = useCurrentCity()

  // Prevent page scroll when menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileOpen])

  const toggleSolution = (id: string) => {
    setOpenSolutionId((prev) => (prev === id ? null : id))
  }

  const [lang, setLang] = useState<'ru' | 'kk' | 'en'>('ru')
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const m = document.cookie.match(/(?:^|; )lang=([^;]+)/)
      const val = (m?.[1] as 'ru' | 'kk' | 'en' | undefined) || 'ru'
      setLang(val)
    }
  }, [])

  return (
    isMobileOpen && (
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-inputBG shadow-lg font-inter z-500 px-8 py-10 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-end items-center mb-4 flex-shrink-0">
          <button onClick={toggleMobileMenu}>
            <X size={40} />
          </button>
        </div>

        {/* City Selector + Language Switcher (same row) */}
        <div className="flex items-center justify-between gap-4">
          <button
            className="flex items-center gap-2 text-base font-inter underline decoration-dashed cursor-pointer"
            onClick={onOpenCityModal}
          >
            <PiMapPinFill />
            {typeof currentCity === 'string' && CITY_RU[currentCity]
              ? getCityLabel(currentCity, lang)
              : lang === 'kk'
                ? 'Қаланы таңдаңыз'
                : lang === 'en'
                  ? 'Choose a city'
                  : 'Выберите город'}
          </button>
          <LanguageSwitcher />
        </div>

        {/* Scrollable content */}
        <div className="flex flex-col gap-4 overflow-y-auto mt-4">
          {/* Main nav links */}
          {nav.links?.map((link, idx) => {
            const isServices = link.url === '/solution'

            return (
              <div key={idx}>
                {isServices ? (
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex justify-between items-center text-left text-transform: uppercase font-medium text-xl rounded-2xl active:bg-background"
                  >
                    {link.label}
                    {servicesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                ) : (
                  (() => {
                    const props = getNavLinkProps({
                      link,
                      idx,
                      pathname: '', // pathname not needed for mobile active state
                      activeIdx: null,
                      currentCity,
                      isCasePage: false,
                      mainPageHref: `/`,
                      setActiveIdx: undefined,
                    })
                    return (
                      <Link
                        {...props}
                        onClick={toggleMobileMenu}
                        className="w-full flex justify-between items-center text-left text-transform: uppercase font-medium text-xl rounded-2xl active:bg-background"
                      >
                        {link.label}
                      </Link>
                    )
                  })()
                )}

                {/* Services Dropdown */}
                {isServices && servicesOpen && (
                  <div className="pl-4 mt-2 flex flex-col gap-4">
                    {solutions.map((solution) => {
                      const relatedSubs = subservices.filter(
                        (sub) => typeof sub.service === 'object' && sub.service.id === solution.id,
                      )

                      const isOpen = openSolutionId === solution.id

                      return (
                        <div key={solution.id} className="flex flex-col gap-4">
                          {relatedSubs.length === 0 ? (
                            <Link
                              href={`/${currentCity}/solution/${solution.slug}`}
                              onClick={toggleMobileMenu}
                              className="w-full text-left pr-4 rounded-2xl active:bg-background"
                            >
                              {solution.name}
                            </Link>
                          ) : (
                            <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-center">
                                <Link
                                  href={`/${currentCity}/solution/${solution.slug}`}
                                  onClick={toggleMobileMenu}
                                  className="flex-1 text-left rounded-2xl active:bg-background"
                                >
                                  {solution.name}
                                </Link>
                                <button
                                  onClick={() => toggleSolution(solution.id)}
                                  className="p-2 rounded-2xl active:bg-background"
                                >
                                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Subservices */}
                          {isOpen && relatedSubs.length > 0 && (
                            <div className="pl-4 flex flex-col gap-4">
                              {relatedSubs.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/${currentCity}/solution/${solution.slug}/${sub.slug}`}
                                  onClick={toggleMobileMenu}
                                  className="rounded-2xl active:bg-background"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  )
}
