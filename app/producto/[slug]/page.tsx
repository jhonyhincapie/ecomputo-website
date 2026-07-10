import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ProductDetailClient } from './ProductDetailClient'
import type { Product } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: product } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) return {}

  const description =
    product.description?.slice(0, 160) ||
    `Cotiza ${product.name} con garantía y soporte técnico en Medellín.`

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const [{ data: product }, { data: waSettings }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(id, name, slug, icon, order_index)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single(),
    supabase.from('settings').select('value').eq('key', 'whatsapp_number').single(),
  ])

  if (!product) notFound()

  return (
    <ProductDetailClient
      product={product as Product}
      waNumber={waSettings?.value || ''}
    />
  )
}
