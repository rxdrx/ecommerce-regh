import { getUserFavorites } from '@/features/favorites/actions'
import { ProductCard } from '@/components/shared/product-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mis Favoritos' }

export default async function FavoritesPage() {
  const { products, error } = await getUserFavorites()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Heart className="h-6 w-6 text-red-500" /> Mis Favoritos</h1>
          <p className="text-sm text-muted-foreground">{products.length} producto{products.length !== 1 ? 's' : ''} guardado{products.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">💜</p>
          <h2 className="text-xl font-semibold mb-2">No tenés favoritos</h2>
          <p className="text-muted-foreground mb-6">Explorá productos y guardá los que te interesen.</p>
          <Link href="/products"><Button>Explorar productos</Button></Link>
        </div>
      )}
    </div>
  )
}
