'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const categoryId = formData.get('category_id') as string
  const condition = formData.get('condition') as string
  const location = formData.get('location') as string
  const imagesJson = formData.get('images') as string
  const images = imagesJson ? JSON.parse(imagesJson) : []

  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      title,
      description,
      price,
      category_id: categoryId,
      condition,
      location,
      images,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const categoryId = formData.get('category_id') as string
  const condition = formData.get('condition') as string
  const location = formData.get('location') as string
  const imagesJson = formData.get('images') as string
  const images = imagesJson ? JSON.parse(imagesJson) : []

  const { error } = await supabase
    .from('products')
    .update({
      title,
      description,
      price,
      category_id: categoryId,
      condition,
      location,
      images,
    })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/dashboard')
  revalidatePath(`/products/${productId}`)
  redirect('/dashboard')
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/products')
  return { success: true }
}
