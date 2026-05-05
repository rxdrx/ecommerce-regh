import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Eye } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, timeAgo, truncate } from '@/lib/utils'
import { CONDITION_LABELS } from '@/types'
import type { ProductFull } from '@/types'
import { FavoriteButton } from '@/components/shared/favorite-button'

interface ProductCardProps {
  product: ProductFull
  showFavorite?: boolean
}

export function ProductCard({ product, showFavorite = true }: ProductCardProps) {
  const mainImage = product.images?.[0]

  return (
    <Card hover className="overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-4xl">📦</span>
            </div>
          )}
          {product.condition && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
            >
              {CONDITION_LABELS[product.condition]}
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary">
              {product.title}
            </h3>
          </Link>
          {showFavorite && <FavoriteButton productId={product.id} size="sm" />}
        </div>

        <p className="text-lg font-bold text-primary mt-2">
          {formatPrice(product.price, product.currency)}
        </p>

        {product.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {product.location && (
              <>
                <MapPin className="h-3 w-3" />
                <span>{truncate(product.location, 15)}</span>
              </>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo(product.created_at)}</span>
        </div>
      </div>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[var(--radius)] border border-border overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 skeleton" />
        <div className="h-6 w-1/3 skeleton" />
        <div className="h-3 w-full skeleton" />
        <div className="flex justify-between pt-3 border-t border-border">
          <div className="h-3 w-20 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
      </div>
    </div>
  )
}
