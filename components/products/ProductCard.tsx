import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
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
  const daysSince = Math.floor(
    (Date.now() - new Date(product.created_at).getTime()) / 86400000
  )
  const isNew = daysSince < 15

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/producto/${product.slug}`} className="block relative h-48 bg-gray-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl select-none">
            {product.category?.icon || '🖥️'}
          </div>
        )}
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white">NUEVO</Badge>
        )}
        {product.is_featured && !isNew && (
          <Badge className="absolute top-2 left-2 bg-gold text-navy">HOT</Badge>
        )}
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-gold font-bold text-xl mt-2">{formatCOP(product.price)}</p>
        <Link
          href={`/producto/${product.slug}`}
          className="mt-3 block w-full text-center bg-navy hover:bg-navy-light text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Cotizar
        </Link>
      </div>
    </div>
  )
}
