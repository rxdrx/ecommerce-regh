import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getCategories } from '@/features/products/services'
import { ProductForm } from '@/features/products/components/product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Editar Producto' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!product) notFound()

  const { categories } = await getCategories()

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <ProductForm categories={categories} userId={user.id} product={product} />
    </div>
  )
}
