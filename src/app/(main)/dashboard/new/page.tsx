import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCategories } from '@/features/products/services'
import { ProductForm } from '@/features/products/components/product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Publicar Producto' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { categories } = await getCategories()

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <ProductForm categories={categories} userId={user.id} />
    </div>
  )
}
