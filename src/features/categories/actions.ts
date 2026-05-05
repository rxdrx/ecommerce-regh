'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('categories').insert({
    name,
    slug: slugify(name),
    icon,
    description,
    created_by: user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  return { success: true }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const name = formData.get('name') as string
  const icon = formData.get('icon') as string
  const description = formData.get('description') as string
  const isActive = formData.get('is_active') === 'true'

  const { error } = await supabase
    .from('categories')
    .update({ name, slug: slugify(name), icon, description, is_active: isActive })
    .eq('id', categoryId)

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)
  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function getAllCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  return { categories: (data as Category[]) || [], error: error?.message }
}
