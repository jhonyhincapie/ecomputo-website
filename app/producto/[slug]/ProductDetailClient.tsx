'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Check,
  ChevronRight,
  Minus,
  MessageCircle,
  Monitor,
  Plus,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react'
import { QuotationModal } from '@/components/products/QuotationModal'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

const trustItems = [
  { icon: Truck, label: 'Envíos a toda Colombia' },
  { icon: ShieldCheck, label: '12 meses de garantía' },
  { icon: RotateCcw, label: 'Soporte técnico 24h' },
]

function availabilityBadge(stock: number | null) {
  if (stock === null || stock > 5)
    return { label: 'Disponible', cls: 'text-green-400 bg-green-400/10 border-green-400/25', dot: 'bg-green-400' }
  if (stock > 0)
    return { label: `Pocas unidades (${stock})`, cls: 'text-amber-400 bg-amber-400/10 border-amber-400/25', dot: 'bg-amber-400' }
  return { label: 'Agotado', cls: 'text-red-400 bg-red-400/10 border-red-400/25', dot: 'bg-red-400' }
}

export function ProductDetailClient({
  product,
  waNumber,
  related = [],
}: {
  product: Product
  waNumber: string
  related?: Product[]
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState('')
  const specs = product.specs as Record<string, string>

  const gallery = [product.image_url, ...(product.images || [])].filter(Boolean) as string[]
  const [activeImage, setActiveImage] = useState(0)

  const availability = availabilityBadge(product.stock)
  const soldOut = product.stock === 0

  const extras = [
    qty > 1 ? `Cantidad: ${qty}` : '',
    color ? `Color: ${color}` : '',
  ].filter(Boolean)
  const waMsg = encodeURIComponent(
    `Hola! Me interesa: *${product.name}*${extras.length ? ` (${extras.join(', ')})` : ''}`
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-navy">
      {/* Breadcrumbs */}
      <nav aria-label="Ruta de navegación" className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-accent-light transition-colors">Inicio</Link>
        <ChevronRight size={14} className="text-[#5a6b8f]" />
        <Link href="/productos" className="hover:text-accent-light transition-colors">Productos</Link>
        {product.category && (
          <>
            <ChevronRight size={14} className="text-[#5a6b8f]" />
            <Link href={`/categoria/${product.category.slug}`} className="hover:text-accent-light transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} className="text-[#5a6b8f]" />
        <span className="text-gray-300 truncate max-w-[220px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="card-tech relative h-80 rounded-2xl overflow-hidden">
            {gallery.length > 0 ? (
              <Image
                key={gallery[activeImage]}
                src={gallery[activeImage]}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain p-6"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Monitor size={64} className="text-navy-light" strokeWidth={1.25} />
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 mt-3">
              {gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden bg-navy-deep border transition-all duration-300 cursor-pointer ${
                    i === activeImage
                      ? 'border-accent shadow-[0_0_14px_-4px_rgba(74,143,212,0.6)]'
                      : 'border-border-subtle opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <Image src={img} alt="" fill sizes="64px" className="object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {product.category && (
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
                {product.category.name}
              </p>
            )}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${availability.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse-green ${availability.dot}`} />
              {availability.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">{product.name}</h1>

          {product.rating !== null && product.rating > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star
                    key={n}
                    size={15}
                    className={n <= Math.round(product.rating!) ? 'text-accent-light fill-accent-light' : 'text-navy-light'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)}</span>
            </div>
          )}

          <p className="text-4xl font-extrabold text-white mt-4">
            {formatCOP(product.price)} <span className="text-accent-light text-sm font-semibold">COP</span>
          </p>

          {product.description && (
            <p className="text-gray-400 mt-4 leading-relaxed">{product.description}</p>
          )}

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <span className="text-sm font-semibold text-gray-300">
                Color{color ? `: ${color}` : ''}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(color === c ? '' : c)}
                    className={`px-3.5 py-1.5 rounded-full text-sm border transition-all duration-300 cursor-pointer ${
                      color === c
                        ? 'bg-accent text-white border-accent shadow-[0_0_14px_-4px_rgba(74,143,212,0.6)] font-medium'
                        : 'bg-navy-deep/70 text-gray-300 border-border-subtle hover:border-accent/50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector: travels with the quotation request */}
          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm font-semibold text-gray-300">Cantidad</span>
            <div className="flex items-center rounded-lg border border-border-subtle bg-navy-deep/70 overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="px-3 py-2 text-gray-300 hover:bg-navy-light/40 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                aria-label="Disminuir cantidad"
              >
                <Minus size={14} strokeWidth={2} />
              </button>
              <span className="w-10 text-center text-white font-semibold text-sm tabular-nums select-none">
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(99, q + 1))}
                className="px-3 py-2 text-gray-300 hover:bg-navy-light/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Aumentar cantidad"
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setModalOpen(true)}
              disabled={soldOut}
              className="btn-electric flex-1 text-white font-bold py-3 rounded-lg cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {soldOut ? 'Producto agotado' : 'Cotizar este producto'}
            </button>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-tech text-white px-4 py-3 rounded-lg flex items-center"
                aria-label="Consultar por WhatsApp"
              >
                <MessageCircle size={20} strokeWidth={1.75} />
              </a>
            )}
          </div>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-border-subtle/60">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5">
                <Icon size={20} strokeWidth={1.5} className="text-accent-light" />
                <span className="text-xs text-muted-foreground leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlighted features */}
      {product.features?.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Características destacadas</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {product.features.map(f => (
              <li key={f} className="flex items-start gap-2.5 text-gray-300 text-sm">
                <span className="mt-0.5 w-4.5 h-4.5 shrink-0 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <Check size={11} strokeWidth={2.5} className="text-accent-light" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications */}
      {Object.keys(specs).length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Especificaciones técnicas</h2>
          <div className="rounded-xl border border-border-subtle overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(specs).map(([key, val], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-navy-light/20' : 'bg-navy-light/40'}>
                    <td className="py-3 px-4 font-semibold text-gray-300 w-44 border-r border-border-subtle">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-white mb-5">
            <span className="text-chrome">También te puede interesar</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <QuotationModal
          product={product}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialMessage={extras.join(' · ')}
        />
      )}
    </div>
  )
}
