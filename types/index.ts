export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order_index: number
}

export interface Product {
  id: string
  name: string
  slug: string
  category_id: string | null
  category?: Category
  price: number
  description: string | null
  specs: Record<string, string>
  image_url: string | null
  /** Fotos adicionales para la galería (image_url es la principal) */
  images: string[]
  /** Características destacadas mostradas con checkmarks */
  features: string[]
  /** Colores disponibles del producto */
  colors: string[]
  /** Unidades disponibles; null = disponible sin control de stock */
  stock: number | null
  /** Calificación 0-5 mostrada en la ficha (opcional) */
  rating: number | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface Quotation {
  id: string
  product_id: string | null
  product_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  message: string | null
  channel: 'email' | 'whatsapp'
  status: 'pending' | 'replied' | 'closed'
  created_at: string
}

export interface Setting {
  key: string
  value: string | null
  updated_at: string
}
