'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

/* Imagen de producto con respaldo visual.

   Las fotos viven en Supabase Storage. Cuando ese servicio no responde, el
   optimizador de Next devuelve 502 y el navegador deja un hueco: una tienda
   sin fotos de producto. Este componente convierte ese fallo en un marcador
   con los colores de la marca, para que la página siga leyéndose.

   No reemplaza a arreglar el origen — es la red que evita que un fallo
   externo se vea como un sitio roto. */

interface Props {
  src: string | null | undefined
  alt: string
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  /** Texto opcional bajo el ícono cuando no hay foto */
  fallbackLabel?: string
  /** Marcador propio. Si se pasa, reemplaza al genérico —útil donde ya
      existe un ícono de categoría que encaja mejor. */
  fallback?: React.ReactNode
  /** Marco que solo se dibuja si la foto carga. Evita que quede un
      recuadro vacío cuando la imagen falla. */
  frameClassName?: string
}

export function ProductImage({
  src,
  alt,
  fill,
  sizes,
  width,
  height,
  className,
  priority,
  fallbackLabel,
  fallback,
  frameClassName,
}: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    if (fallback) return <>{fallback}</>
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-deep"
        role="img"
        aria-label={`${alt} — imagen no disponible`}
      >
        <ImageOff size={28} strokeWidth={1.5} className="text-[#4a8fd4]/50" />
        {fallbackLabel && (
          <span className="px-3 text-center text-[11px] leading-tight text-[#9fb1d1]">
            {fallbackLabel}
          </span>
        )}
      </div>
    )
  }

  const img = (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  )

  return frameClassName ? <div className={frameClassName}>{img}</div> : img
}
