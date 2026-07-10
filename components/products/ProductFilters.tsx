'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCallback, useEffect, useRef } from 'react'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  currentSlug?: string
}

export function ProductFilters({ categories, currentSlug }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      router.push(`${pathname}?${next.toString()}`)
    },
    [params, pathname, router]
  )

  // Debounce free-text search so we don't navigate on every keystroke
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const updateSearch = useCallback(
    (value: string) => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
      searchTimer.current = setTimeout(() => update('q', value), 350)
    },
    [update]
  )
  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
  }, [])

  return (
    <aside className="space-y-6">
      <div>
        <Label className="text-sm font-semibold text-gray-300 mb-2 block">Buscar</Label>
        <Input
          placeholder="Nombre del producto..."
          defaultValue={params.get('q') || ''}
          onChange={e => updateSearch(e.target.value)}
          className="bg-navy-deep/70 border-border-subtle text-white placeholder:text-[#5a6b8f] focus:ring-accent"
        />
      </div>

      {!currentSlug && (
        <div>
          <Label className="text-sm font-semibold text-gray-300 mb-2 block">Categoría</Label>
          <div className="space-y-1">
            <button
              onClick={() => update('cat', '')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!params.get('cat') ? 'bg-accent text-white font-medium' : 'hover:bg-navy-light/40 text-gray-300'}`}
            >
              Todas las categorías
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => update('cat', c.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${params.get('cat') === c.slug ? 'bg-accent text-white font-medium' : 'hover:bg-navy-light/40 text-gray-300'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label className="text-sm font-semibold text-gray-300 mb-2 block">Ordenar por</Label>
        <select
          onChange={e => update('sort', e.target.value)}
          defaultValue={params.get('sort') || ''}
          className="w-full bg-navy-deep/70 border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
        >
          <option value="">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>
      </div>
    </aside>
  )
}
