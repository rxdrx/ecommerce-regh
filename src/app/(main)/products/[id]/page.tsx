import { getProductById } from '@/features/products/services'
import { checkIsFavorited } from '@/features/favorites/actions'
import { FavoriteButton } from '@/components/shared/favorite-button'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, timeAgo, getWhatsAppLink, getEmailLink } from '@/lib/utils'
import { CONDITION_LABELS } from '@/types'
import { DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { MapPin, Eye, Calendar, MessageCircle, Mail, User, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { product } = await getProductById(id)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: product.title,
    description: product.description?.slice(0, 160) || `${product.title} - ${formatPrice(product.price)}`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const { product, error } = await getProductById(id)

  if (!product || error) notFound()

  const isFavorited = await checkIsFavorited(product.id)
  const sellerPhone = product.profiles?.phone || DEFAULT_CONTACT_PHONE
  const sellerEmail = product.profiles?.email_public
  const whatsappMessage = `Hola, me interesa tu producto "${product.title}" publicado en ReGH Marketplace.`

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="text-6xl">📦</span></div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image src={img} alt={`${product.title} ${i + 2}`} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{product.title}</h1>
              <FavoriteButton productId={product.id} initialFavorited={isFavorited} />
            </div>
            <p className="text-3xl font-bold text-primary mt-3">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.condition && <Badge variant="secondary">{CONDITION_LABELS[product.condition]}</Badge>}
            {product.categories && <Badge variant="primary">{product.categories.name}</Badge>}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {product.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{product.location}</span>}
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{product.views_count} visitas</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{timeAgo(product.created_at)}</span>
          </div>

          {product.description && (
            <div>
              <h2 className="font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={getWhatsAppLink(sellerPhone, whatsappMessage)} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" className="w-full gap-2 bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-5 w-5" /> WhatsApp
              </Button>
            </a>
            {sellerEmail && (
              <a href={getEmailLink(sellerEmail, `Consulta: ${product.title}`)} className="flex-1">
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Mail className="h-5 w-5" /> Email
                </Button>
              </a>
            )}
          </div>

          {/* Seller Card */}
          {product.profiles && (
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <Link href={`/profile/${product.profiles.username}`} className="font-semibold hover:text-primary">
                    {product.profiles.full_name || product.profiles.username}
                  </Link>
                  <p className="text-sm text-muted-foreground">@{product.profiles.username}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
