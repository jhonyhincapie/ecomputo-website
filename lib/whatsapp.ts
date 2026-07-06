const OPENWA_URL = process.env.OPENWA_URL || 'http://localhost:2785'
const OPENWA_KEY = process.env.OPENWA_API_KEY || ''
const SESSION_ID = process.env.WHATSAPP_SESSION_ID || 'ecomputo-session'

export async function sendWhatsAppMessage(to: string, body: string): Promise<void> {
  try {
    const res = await fetch(
      `${OPENWA_URL}/api/sessions/${SESSION_ID}/messages/send-text`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': OPENWA_KEY,
        },
        body: JSON.stringify({ chatId: to, body }),
      }
    )
    if (!res.ok) {
      const err = await res.text()
      console.error(`[WhatsApp] Failed to send to ${to}: ${err}`)
    }
  } catch (err) {
    console.error(`[WhatsApp] Network error sending to ${to}:`, err)
  }
}
