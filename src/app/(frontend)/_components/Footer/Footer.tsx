// components/Footer.tsx

'use client'

import type { Navigation, Solution } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
// import { useCurrentCity } from '@/app/utils/useCurrentCity'
import { getNavLinkProps } from '../Header/Header'

import { FaFacebook, FaInstagram, FaTelegram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { Logo } from '../Logo/Logo'

type Props = {
  nav: Navigation
  solutions: Solution[]
}

// Helper: returns true if the link should be active for the current path
function isNavLinkActive(linkUrl: string, pathname: string): boolean {
  const cityRegex = /^\/[a-zа-я-]+/
  const cleanedPath = pathname.replace(cityRegex, '') || '/'

  if (linkUrl === '/') {
    return pathname === '/'
  }
  const regex = new RegExp(`^${linkUrl}(\/|$)`)
  return regex.test(cleanedPath)
}

export default function Footer({ nav, solutions }: Props) {
  const pathname = usePathname()
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  // const [currentCity] = useCurrentCity()

  const icons = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    telegram: FaTelegram,
    linkedin: FaLinkedin,
    youtube: FaYoutube,
  }

  return (
    <footer className="py-8 border-t border-link/10">
      <div className="container mx-auto flex flex-wrap justify-between px-8 py-8">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="hidden md:block">
            <Logo nav={nav} />
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl py-2">{nav.contactTitle}</h3>
            {nav.contacts?.map((contact, id) => (
              <div key={id}>
                <p className="font-light text-base text-link/40">{contact.item}</p>
              </div>
            ))}
          </div>

          {/* SocialMedia */}
          <div className="flex gap-3">
            {nav.socialMedia?.map(({ platform, url }) => {
              const Icon = icons[platform]
              return (
                <Link key={platform} href={url} target="_blank" rel="noreferrer">
                  <Icon
                    size={48}
                    className="bg-background rounded-xl p-3 hover:bg-primary transition duration-300"
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex flex-col gap-2">
          <h3 className="text-2xl py-2">Компания</h3>
          {nav.links?.map((link, idx) => {
            const isActive = isNavLinkActive(link.url, pathname)
            const props = getNavLinkProps({
              link,
              idx,
              pathname,
              activeIdx,
              // currentCity,
              isCasePage: pathname.startsWith('/case'),
              // mainPageHref: `/${currentCity}`,
              mainPageHref: `/`,
              setActiveIdx,
            })
            return (
              <Link
                key={idx}
                {...props}
                className={`text-sm font-light hover:text-link ${isActive ? 'text-link' : 'text-link/40'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Services */}
        <div className="hidden pt-16 md:pt-0 md:flex flex-col gap-4">
          <h3 className="text-2xl py-2">Услуги</h3>

          <ul className="space-y-1">
            {solutions.map((solution, id) => (
              <li key={id}>
                <Link
                  href={`/solution/${solution.slug}`}
                  className={`text-sm font-light hover:text-link ${
                    pathname === `/solution/${solution.slug}` ? 'text-link' : 'text-link/40'
                  }`}
                >
                  {solution.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 font-light py-4">© alanturing.app</div>
    </footer>
  )
}
