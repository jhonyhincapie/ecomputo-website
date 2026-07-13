import { supabase } from '@/lib/supabase'
import { CommerceHero, type CommerceHeroCategory } from '@/components/ui/commerce-hero'
import type { Category } from '@/types'

/* Server wrapper: fetches hero copy + categories (with a real product
   photo as cover, same rule as CategoriesGrid) and feeds the client hero. */
export async function CommerceHeroSection() {
  const [{ data: settings }, { data: categories }, { data: withImages }] = await Promise.all([
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_title', 'hero_subtitle', 'whatsapp_number']),
    supabase.from('categories').select('*').order('order_index').limit(4),
    supabase
      .from('products')
      .select('category_id, image_url')
      .eq('is_active', true)
      .not('image_url', 'is', null)
      .order('created_at', { ascending: false }),
  ])

  const s = Object.fromEntries((settings || []).map(r => [r.key, r.value || '']))
  const title = s.hero_title || 'Tecnología para tu negocio y hogar'
  const subtitle = s.hero_subtitle || 'Los mejores equipos al mejor precio, con envíos a toda Colombia'
  const waNumber = s.whatsapp_number || ''
  const waMsg = encodeURIComponent('Hola! Quiero información sobre sus productos.')
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${waMsg}` : null

  /* First (newest) product photo per category = its reference image */
  const coverByCategory = new Map<string, string>()
  for (const p of withImages || []) {
    if (p.category_id && p.image_url && !coverByCategory.has(p.category_id)) {
      coverByCategory.set(p.category_id, p.image_url)
    }
  }

  const cats: CommerceHeroCategory[] = ((categories as Category[]) || []).map(cat => ({
    title: cat.name,
    href: `/categoria/${cat.slug}`,
    image: coverByCategory.get(cat.id) || null,
    slug: cat.slug,
  }))

  return (
    <CommerceHero title={title} subtitle={subtitle} waHref={waHref} categories={cats} />
  )
}
