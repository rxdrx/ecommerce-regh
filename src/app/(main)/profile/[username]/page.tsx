import { getProfile } from '@/features/profile/actions'
import { getProducts } from '@/features/products/services'
import { ProductCard } from '@/components/shared/product-card'
import { Badge } from '@/components/ui/badge'
import { User, Calendar, MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'
import { timeAgo } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const { profile } = await getProfile(username)
  return { title: profile ? `${profile.full_name || profile.username}` : 'Perfil no encontrado' }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const { profile } = await getProfile(username)
  if (!profile) notFound()

  const { products } = await getProducts({ userId: profile.id })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="h-12 w-12 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          {profile.bio && <p className="mt-2 text-sm max-w-lg">{profile.bio}</p>}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground justify-center sm:justify-start">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Miembro desde {timeAgo(profile.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <h2 className="text-xl font-bold mb-6">Publicaciones ({products.length})</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center py-10 text-muted-foreground">Este usuario no tiene publicaciones.</p>
      )}
    </div>
  )
}
