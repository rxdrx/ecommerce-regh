import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserProducts } from '@/features/products/services'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatPrice, timeAgo } from '@/lib/utils'
import { Plus, Edit, Eye, EyeOff, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { DashboardActions } from './dashboard-actions'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { products } = await getUserProducts(user.id)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mis Publicaciones</h1>
          <p className="text-sm text-muted-foreground">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Publicar</Button>
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product: any) => (
            <Card key={product.id} className="p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="128px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><span className="text-2xl">📦</span></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                      <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>
                    <Badge variant={product.is_active ? 'success' : 'secondary'}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{product.categories?.name} · {timeAgo(product.created_at)} · {product.views_count} visitas</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Link href={`/dashboard/edit/${product.id}`}>
                      <Button variant="outline" size="sm" className="gap-1"><Edit className="h-3 w-3" /> Editar</Button>
                    </Link>
                    <DashboardActions productId={product.id} isActive={product.is_active} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📦</p>
          <h2 className="text-xl font-semibold mb-2">No tenés publicaciones</h2>
          <p className="text-muted-foreground mb-6">Empezá a vender publicando tu primer producto.</p>
          <Link href="/dashboard/new"><Button className="gap-2"><Plus className="h-4 w-4" /> Publicar producto</Button></Link>
        </div>
      )}
    </div>
  )
}
