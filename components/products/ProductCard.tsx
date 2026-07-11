import Link from 'next/link'
import Image from 'next/image'
import { Monitor } from 'lucide-react'
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

  return (
    <div className="card-tech rounded-xl overflow-hidden group">
      <Link href={`/producto/${product.slug}`} className="block relative h-48 bg-navy-deep">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
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
  )
}
