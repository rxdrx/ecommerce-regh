import { Suspense } from 'react'
import { getProducts, getCategories } from '@/features/products/services'
import { ProductCard, ProductCardSkeleton } from '@/components/shared/product-card'
import { SearchBar } from '@/components/shared/search-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Explorá todos los productos disponibles en el marketplace.',
}

interface Props {
  searchParams: Promise<{ category?: string; search?: string; sort?: string; page?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const sort = (params.sort || 'newest') as 'newest' | 'oldest' | 'price_asc' | 'price_desc'

  const [{ products, total, totalPages }, { categories }] = await Promise.all([
    getProducts({ page, category: params.category, search: params.search, sort }),
    getCategories(),
  ])

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'price_asc', label: 'Menor precio' },
    { value: 'price_desc', label: 'Mayor precio' },
    { value: 'oldest', label: 'Más antiguos' },
  ]

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    const merged = { category: params.category, search: params.search, sort: params.sort, page: params.page, ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/products?${p.toString()}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">{total} producto{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
        </div>
        <SearchBar />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link href={buildUrl({ category: undefined, page: undefined })}>
          <Badge variant={!params.category ? 'primary' : 'outline'} className="cursor-pointer hover:bg-primary/20 px-3 py-1.5">
            Todos
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={buildUrl({ category: cat.slug, page: undefined })}>
            <Badge variant={params.category === cat.slug ? 'primary' : 'outline'} className="cursor-pointer hover:bg-primary/20 px-3 py-1.5">
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Ordenar:</span>
        <div className="flex gap-1.5">
          {sortOptions.map((opt) => (
            <Link key={opt.value} href={buildUrl({ sort: opt.value, page: undefined })}>
              <Badge variant={sort === opt.value ? 'primary' : 'outline'} className="cursor-pointer text-xs px-2 py-1">
                {opt.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold mb-2">No se encontraron productos</h2>
          <p className="text-muted-foreground">Probá con otros filtros o una búsqueda diferente.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link href={buildUrl({ page: String(page - 1) })}>
              <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" /> Anterior</Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground px-4">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildUrl({ page: String(page + 1) })}>
              <Button variant="outline" size="sm">Siguiente <ChevronRight className="h-4 w-4" /></Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
