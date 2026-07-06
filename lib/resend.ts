import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'cotizaciones@ecomputo.com'
const TO = process.env.EMAIL_TO || 'admin@ecomputo.com'

interface QuotationData {
  product_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message?: string | null
}

export async function sendQuotationEmails(data: QuotationData) {
  const { product_name, customer_name, customer_email, customer_phone, message } = data

  const [clientResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: customer_email,
      subject: `Cotización recibida: ${product_name} — ECOMPUTO`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a1628; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #f5a623; margin: 0; font-size: 24px;">ECOMPUTO</h1>
            <p style="color: #9ca3af; margin: 4px 0 0;">TECNOLOGÍA • SOLUCIONES • FUTURO</p>
          </div>
          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #0a1628; margin: 0 0 16px;">¡Hola, ${customer_name}!</h2>
            <p style="color: #374151;">Hemos recibido tu solicitud de cotización para <strong>${product_name}</strong>.</p>
            <p style="color: #374151;">Nuestro equipo te contactará pronto al número <strong>${customer_phone}</strong>.</p>
            ${message ? `<div style="background: white; border-left: 4px solid #f5a623; padding: 12px; margin: 16px 0;"><p style="color: #6b7280; margin: 0; font-style: italic;">"${message}"</p></div>` : ''}
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 14px; margin: 0;">Comercializadora ECOMPUTO — Medellín, Colombia</p>
          </div>
        </div>
      `,
    }),
    resend.emails.send({
      from: FROM,
      to: TO,
      subject: `🛍️ Nueva cotización: ${product_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a1628; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #f5a623; margin: 0; font-size: 20px;">Nueva solicitud de cotización</h1>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280; width: 140px; font-size: 14px;">Producto</td><td style="padding: 8px 0; font-weight: bold; color: #0a1628;">${product_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Cliente</td><td style="padding: 8px 0; color: #374151;">${customer_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${customer_email}" style="color: #f5a623;">${customer_email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Teléfono</td><td style="padding: 8px 0;"><a href="tel:${customer_phone}" style="color: #f5a623;">${customer_phone}</a></td></tr>
              ${message ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Mensaje</td><td style="padding: 8px 0; color: #374151;">${message}</td></tr>` : ''}
            </table>
          </div>
        </div>
      `,
    }),
  ])

  if (clientResult.status === 'rejected') {
    console.error('Failed to send client email:', clientResult.reason)
  }
  if (adminResult.status === 'rejected') {
    console.error('Failed to send admin email:', adminResult.reason)
  }
}
