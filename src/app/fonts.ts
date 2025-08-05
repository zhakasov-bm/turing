import { Unbounded, Montserrat, Inter } from 'next/font/google'

export const unbounded = Unbounded({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-unbounded',
  display: 'swap',
})

export const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})
