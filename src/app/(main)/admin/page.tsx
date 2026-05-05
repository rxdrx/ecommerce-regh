import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllCategories } from '@/features/categories/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AdminCategoryActions } from './admin-actions'

export const metadata: Metadata = { title: 'Admin - Categorías' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as { data: { role: string } | null }
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const { categories } = await getAllCategories()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Panel de Admin</h1>
            <p className="text-sm text-muted-foreground">Gestión de categorías</p>
          </div>
        </div>
        <Link href="/admin/categories/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Nueva Categoría</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {categories.map((cat: any) => (
          <Card key={cat.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                {cat.icon ? '📦' : '📁'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <Badge variant={cat.is_active ? 'success' : 'secondary'}>{cat.is_active ? 'Activa' : 'Inactiva'}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">/{cat.slug} · Orden: {cat.sort_order}</p>
              </div>
            </div>
            <AdminCategoryActions categoryId={cat.id} />
          </Card>
        ))}
      </div>
    </div>
  )
}
