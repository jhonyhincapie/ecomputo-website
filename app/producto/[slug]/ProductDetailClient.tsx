'use client'
import { useState } from 'react'
import Image from 'next/image'
import { QuotationModal } from '@/components/products/QuotationModal'
import type { Product } from '@/types'

function formatCOP(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

export function ProductDetailClient({
  product,
  waNumber,
}: {
  product: Product
  waNumber: string
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const specs = product.specs as Record<string, string>
  const waMsg = encodeURIComponent(`Hola! Me interesa: *${product.name}*`)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 bg-navy">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative h-80 bg-navy-light/30 rounded-2xl overflow-hidden border border-border-subtle">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-6"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-8xl select-none">
              {product.category?.icon || '🖥️'}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-muted-foreground text-sm mb-2 font-medium uppercase tracking-wide">
              {product.category.icon} {product.category.name}
            </p>
          )}
          <h1 className="text-2xl font-bold text-white leading-tight">{product.name}</h1>
          <p className="text-4xl font-extrabold text-white mt-4">
            {formatCOP(product.price)} <span className="text-accent-light text-sm font-semibold">COP</span>
          </p>

          {product.description && (
            <p className="text-gray-400 mt-4 leading-relaxed">{product.description}</p>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-lg transition-colors"
            >
              Cotizar este producto
            </button>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border-subtle hover:border-accent text-white px-4 py-3 rounded-lg transition-colors text-lg"
                aria-label="WhatsApp"
              >
                💬
              </a>
            )}
          </div>
        </div>
      </div>

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

      {modalOpen && (
        <QuotationModal
          product={product}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
