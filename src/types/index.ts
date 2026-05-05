import type { Database } from './database'

// Convenience types extracted from the database schema
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Favorite = Database['public']['Tables']['favorites']['Row']
export type FavoriteInsert = Database['public']['Tables']['favorites']['Insert']

// Extended types with relations
export type ProductWithCategory = Product & {
  categories: Category
}

export type ProductWithSeller = Product & {
  profiles: Profile
}

export type ProductFull = Product & {
  categories: Category
  profiles: Profile
}

// Condition labels in Spanish
export const CONDITION_LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  usado_como_nuevo: 'Usado - Como nuevo',
  usado: 'Usado',
  reacondicionado: 'Reacondicionado',
}
