import { ImageResponse } from 'next/og'

/* Vista previa que ven WhatsApp, Facebook y X al compartir un enlace del sitio.
   Antes no existía: los enlaces llegaban como texto plano, justo en el canal
   por el que este negocio vende. Se genera en el servidor con la paleta de marca. */

export const alt = 'ECOMPUTO — Tecnología con garantía y envíos a toda Colombia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const NAVY = '#1e3459'
const NAVY_DEEP = '#101e35'
const ACCENT = '#4a8fd4'
const ACCENT_LIGHT = '#7db8e8'
const SILVER = '#e2e8f0'
const SILVER_MUTED = '#a7b6d8'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: `radial-gradient(ellipse 90% 70% at 22% 8%, #2b4470 0%, ${NAVY} 55%, ${NAVY_DEEP} 100%)`,
          padding: '72px 88px',
          position: 'relative',
        }}
      >
        {/* Corchete de la marca: mismo motivo biselado del logo */}
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 56,
            bottom: 56,
            width: 40,
            borderLeft: `2px solid ${ACCENT}`,
            borderTop: `2px solid ${ACCENT}`,
            borderBottom: `2px solid ${ACCENT}`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 56,
            top: 56,
            bottom: 56,
            width: 40,
            borderRight: `2px solid ${ACCENT}`,
            borderTop: `2px solid ${ACCENT}`,
            borderBottom: `2px solid ${ACCENT}`,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 8,
            color: SILVER_MUTED,
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          TECNOLOGÍA · CONFIANZA · SOLUCIONES
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 800,
            color: SILVER,
            letterSpacing: -3,
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          ECOMPUTO
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 34,
            color: SILVER_MUTED,
            lineHeight: 1.35,
            maxWidth: 780,
          }}
        >
          Computadores, portátiles y celulares con garantía. Envíos a toda Colombia desde
          Medellín.
        </div>

        {/* Respaldos: los cuatro hechos verificables del negocio */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 52,
            paddingTop: 32,
            borderTop: `1px solid rgba(125, 184, 232, 0.25)`,
            fontSize: 22,
            color: ACCENT_LIGHT,
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex' }}>Garantía 12 meses</div>
          <div style={{ display: 'flex', color: SILVER_MUTED }}>·</div>
          <div style={{ display: 'flex' }}>Envío rastreable</div>
          <div style={{ display: 'flex', color: SILVER_MUTED }}>·</div>
          <div style={{ display: 'flex' }}>Asesoría por WhatsApp</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
