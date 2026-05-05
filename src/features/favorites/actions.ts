'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFavorite(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id)
    revalidatePath('/dashboard/favorites')
    return { favorited: false }
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, product_id: productId })
    revalidatePath('/dashboard/favorites')
    return { favorited: true }
  }
}

export async function getUserFavorites() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { products: [], error: 'No autenticado' }

  const { data, error } = await supabase
    .from('favorites')
    .select('*, products(*, categories(*), profiles(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return {
    products: data?.map((f: any) => f.products) || [],
    error: error?.message,
  }
}

export async function checkIsFavorited(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  return !!data
}
