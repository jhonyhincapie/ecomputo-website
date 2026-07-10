import { Monitor, Laptop, Smartphone, Headphones, Package } from 'lucide-react'

export const categoryIcons: Record<string, typeof Monitor> = {
  computadores: Monitor,
  portatiles: Laptop,
  celulares: Smartphone,
  accesorios: Headphones,
}

export function iconForSlug(slug: string) {
  return categoryIcons[slug] || Package
}
