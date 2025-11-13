import { NextResponse } from 'next/server'

import { sendLeadToBitrix } from '@/server/integrations/bitrix'
import { sendLeadToTelegram } from '@/server/integrations/telegram'

export const runtime = 'nodejs'

const PHONE_REGEX = /^\+?\d{10,15}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_FORM_NAME = 'Заявка с сайта'

type ParsedLeadPayload = {
  data: Record<string, string>
  file?: File
}

type NormalizedLeadPayload = {
  data: Record<string, string>
  phone: string
  email?: string
  name?: string
  formName: string
}

class LeadValidationError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'LeadValidationError'
    this.status = status
  }
}

export async function POST(req: Request) {
  try {
    const parsed = await parseLeadRequest(req)
    const normalized = validateLeadData(parsed.data)

    await sendLeadToTelegram({
      data: normalized.data,
      file: parsed.file,
    })

    await sendLeadToBitrix({
      title: normalized.formName,
      name: normalized.name,
      phone: normalized.phone,
      email: normalized.email,
      comments: buildCommentText(normalized.data),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof LeadValidationError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status })
    }

    console.error('Lead submission error', error)
    return NextResponse.json(
      { ok: false, message: 'Не удалось обработать заявку. Попробуйте позже.' },
      { status: 500 }
    )
  }
}

async function parseLeadRequest(req: Request): Promise<ParsedLeadPayload> {
  const contentType = req.headers.get('content-type') || ''

  if (
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/x-www-form-urlencoded')
  ) {
    const formData = await req.formData()
    const data: Record<string, string> = {}
    let file: File | undefined

    formData.forEach((value, key) => {
      if (value instanceof File) {
        if (!file && value.size > 0) {
          file = value
        }
        return
      }
      data[key] = value.toString()
    })

    return { data, file }
  }

  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      throw new LeadValidationError('Неверный формат данных')
    }

    const data: Record<string, string> = {}

    Object.entries(body as Record<string, unknown>).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      data[key] = typeof value === 'string' ? value : String(value)
    })

    return { data }
  }

  throw new LeadValidationError('Неподдерживаемый тип содержимого')
}

function validateLeadData(rawData: Record<string, string>): NormalizedLeadPayload {
  if (!rawData || Object.keys(rawData).length === 0) {
    throw new LeadValidationError('Пустая форма')
  }

  const data: Record<string, string> = {}
  Object.entries(rawData).forEach(([key, value]) => {
    const trimmed = typeof value === 'string' ? value.trim() : ''
    data[key] = trimmed
  })

  const rawPhone = data.phone || data.phoneNumber || ''
  const normalizedPhone = rawPhone.replace(/[\s()-]/g, '')

  if (!normalizedPhone) {
    throw new LeadValidationError('Укажите номер телефона')
  }

  if (!PHONE_REGEX.test(normalizedPhone)) {
    throw new LeadValidationError('Укажите корректный номер телефона')
  }

  data.phone = rawPhone

  const email = data.email
  if (email && !EMAIL_REGEX.test(email)) {
    throw new LeadValidationError('Укажите корректный email')
  }

  const formName = data.formName || DEFAULT_FORM_NAME
  data.formName = formName

  const name = data.fullname || data.fullName || data.name

  return {
    data,
    phone: rawPhone,
    email,
    name,
    formName,
  }
}

function buildCommentText(data: Record<string, string>) {
  return Object.entries(data)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}
