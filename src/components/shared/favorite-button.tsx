'use client'

import { Heart } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toggleFavorite } from '@/features/favorites/actions'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  productId: string
  initialFavorited?: boolean
  size?: 'sm' | 'md'
}

export function FavoriteButton({ productId, initialFavorited = false, size = 'md' }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setFavorited(!favorited) // Optimistic update

    startTransition(async () => {
      const result = await toggleFavorite(productId)
      if (result.error) {
        setFavorited(favorited) // Revert on error
      } else {
        setFavorited(result.favorited ?? !favorited)
      }
    })
  }

  const sizeClasses = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        'rounded-full flex items-center justify-center border border-border hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 focus-ring',
        sizeClasses,
        favorited && 'border-red-300 bg-red-50 dark:bg-red-950/30',
        isPending && 'opacity-50'
      )}
      aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        className={cn(
          iconSize,
          'transition-all',
          favorited ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground'
        )}
      />
    </button>
  )
}
