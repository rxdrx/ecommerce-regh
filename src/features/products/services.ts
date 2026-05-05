import { createClient } from '@/lib/supabase/server'
import type { ProductFull, Category } from '@/types'
import { PRODUCTS_PER_PAGE } from '@/lib/constants'

interface GetProductsParams {
  page?: number
  category?: string
  search?: string
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc'
  userId?: string
}

export async function getProducts({
  page = 1,
  category,
  search,
  sort = 'newest',
  userId,
}: GetProductsParams = {}) {
  const supabase = await createClient()
  const from = (page - 1) * PRODUCTS_PER_PAGE
  const to = from + PRODUCTS_PER_PAGE - 1

  let query = supabase
    .from('products')
    .select('*, categories(*), profiles(*)', { count: 'exact' })
    .eq('is_active', true)

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  if (search) {
    query = query.textSearch('fts', search, { type: 'websearch', config: 'spanish' })
  }

  if (userId) {
    query = query.eq('user_id', userId)
  }

  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, count, error } = await query.range(from, to)

  return {
    products: (data as ProductFull[]) || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / PRODUCTS_PER_PAGE),
    error: error?.message,
  }
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), profiles(*)')
    .eq('id', id)
    .single()

  if (error) return { product: null, error: error.message }

  // Increment views
  await supabase
    .from('products')
    .update({ views_count: (data.views_count || 0) + 1 })
    .eq('id', id)

  return { product: data as ProductFull, error: null }
}

export async function getUserProducts(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return {
    products: data || [],
    error: error?.message,
  }
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return { categories: (data as Category[]) || [], error: error?.message }
}
