const TELEGRAM_API_BASE = 'https://api.telegram.org'

type TelegramPayload = {
  data: Record<string, string>
  file?: File
}

function ensureEnv(variable: string) {
  const value = process.env[variable]
  if (!value) {
    throw new Error(`Отсутствует переменная окружения ${variable}`)
  }
  return value
}

export async function sendLeadToTelegram({ data, file }: TelegramPayload) {
  const botToken = ensureEnv('TELEGRAM_BOT_TOKEN')
  const chatId = ensureEnv('TELEGRAM_CHAT_ID')

  const message = Object.entries(data)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => `<b>${key}:</b> ${value}`)
    .join('\n')

  const sendMessageResponse = await fetch(
    `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message || 'Поступила новая заявка без деталей.',
        parse_mode: 'HTML',
      }),
    }
  )

  const sendMessageBody = await sendMessageResponse.json().catch(() => ({}))

  if (!sendMessageResponse.ok || !sendMessageBody?.ok) {
    throw new Error(
      sendMessageBody?.description || 'Не удалось отправить сообщение в Telegram'
    )
  }

  if (file && file.size > 0) {
    const telegramFormData = new FormData()
    telegramFormData.append('chat_id', chatId)
    telegramFormData.append('document', file, file.name || 'attachment')

    const sendDocumentResponse = await fetch(
      `${TELEGRAM_API_BASE}/bot${botToken}/sendDocument`,
      {
        method: 'POST',
        body: telegramFormData,
      }
    )

    const sendDocumentBody = await sendDocumentResponse.json().catch(() => ({}))

    if (!sendDocumentResponse.ok || !sendDocumentBody?.ok) {
      throw new Error(
        sendDocumentBody?.description ||
          'Не удалось отправить вложение в Telegram'
      )
    }
  }
}
