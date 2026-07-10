'use client'
import { MessageCircle } from 'lucide-react'

export function WhatsAppFab() {
  const number = process.env.NEXT_PUBLIC_SITE_PHONE?.replace(/\D/g, '') || ''
  if (!number) return null

  const msg = encodeURIComponent('Hola! Me interesa conocer más sobre sus productos.')
  const href = `https://wa.me/${number}?text=${msg}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25d366] hover:bg-[#1ebe5b] text-white p-4 rounded-full shadow-lg shadow-black/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
      aria-label="Chatear por WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={1.75} />
    </a>
  )
}
