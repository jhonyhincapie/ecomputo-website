'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, MessageCircle, Monitor } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { daysSince } from '@/lib/utils'
import type { Product } from '@/types'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const isNew = daysSince(product.created_at) < 15
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const reducedMotion = useRef<boolean | null>(null)

  const prefersReducedMotion = () => {
    if (reducedMotion.current === null) {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return reducedMotion.current
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRotation({
      x: (y - rect.height / 2) / 14,
      y: (rect.width / 2 - x) / 14,
    })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        className="card-tech rounded-xl overflow-hidden group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            hovered && !reducedMotion.current
              ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.03)`
              : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: hovered ? 'transform 120ms ease-out' : 'transform 400ms ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Link href={`/producto/${product.slug}`} className="block relative h-48 bg-navy-deep">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Monitor size={40} className="text-navy-light" strokeWidth={1.5} />
            </div>
          )}
          {isNew && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-accent to-accent-light text-white shadow-[0_0_12px_-2px_rgba(125,184,232,0.45)]">NUEVO</Badge>
          )}
          {product.is_featured && !isNew && (
            <Badge className="absolute top-2 left-2 bg-accent text-white">HOT</Badge>
          )}

          {/* Action overlay: fades in over the photo on hover */}
          <div className="absolute inset-0 flex items-end justify-center gap-2 pb-3 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="btn-ghost-tech inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3.5 py-2 rounded-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <Eye size={14} strokeWidth={2} /> Ver detalles
            </span>
            <span className="btn-electric inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3.5 py-2 rounded-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              <MessageCircle size={14} strokeWidth={2} /> Cotizar
            </span>
          </div>
        </Link>

        <div className="p-4">
          <h3 className="font-semibold text-gray-100 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-white font-bold text-xl mt-2">
            {formatCOP(product.price)} <span className="text-accent-light text-xs font-semibold">COP</span>
          </p>
          <Link
            href={`/producto/${product.slug}`}
            className="btn-electric mt-3 block w-full text-center text-white text-sm font-medium py-2 rounded-lg"
          >
            Cotizar
          </Link>
        </div>
      </div>
    </div>
  )
}
