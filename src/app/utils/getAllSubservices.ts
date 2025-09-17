import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@/payload.config'

export async function getAllSubservices(locale: string = 'ru') {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  const res = await payload.find({ collection: 'subservices', limit: 100, user, locale })
  return res.docs
}
