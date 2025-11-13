type BitrixPayload = {
  title: string
  name?: string
  phone: string
  email?: string
  comments: string
}

function ensureEnv(variable: string) {
  const value = process.env[variable]
  if (!value) {
    throw new Error(`Отсутствует переменная окружения ${variable}`)
  }
  return value.replace(/\/$/, '')
}

export async function sendLeadToBitrix({
  title,
  name,
  phone,
  email,
  comments,
}: BitrixPayload) {
  const webhookBase = ensureEnv('BITRIX_WEBHOOK_URL')
  const endpoint = `${webhookBase}/crm.lead.add.json`

  const payload = {
    fields: {
      TITLE: title,
      NAME: name || '',
      PHONE: phone
        ? [
            {
              VALUE: phone,
              VALUE_TYPE: 'WORK',
            },
          ]
        : [],
      EMAIL: email
        ? [
            {
              VALUE: email,
              VALUE_TYPE: 'WORK',
            },
          ]
        : [],
      COMMENTS: comments,
      SOURCE_ID: 'WEB',
    },
    params: {
      REGISTER_SONET_EVENT: 'Y',
    },
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok || body?.error) {
    throw new Error(body?.error_description || body?.error || 'Bitrix ошибка')
  }

  return body
}
