// App configuration constants
export const APP_NAME = 'ReGH Marketplace'
export const APP_DESCRIPTION = 'Tu marketplace comunitario para comprar y vender productos.'

// Images
export const MAX_IMAGES_PER_PRODUCT = 4
export const MAX_IMAGE_SIZE_MB = 2
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Storage bucket names
export const BUCKET_PRODUCT_IMAGES = 'product-images-regh'
export const BUCKET_AVATARS = 'avatars-regh'

// Contact
export const DEFAULT_CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || '5491100000000'

// Currency
export const DEFAULT_CURRENCY = 'ARS'
export const CURRENCY_SYMBOL: Record<string, string> = {
  ARS: '$',
  USD: 'US$',
}

// Pagination
export const PRODUCTS_PER_PAGE = 12

// Product conditions
export const PRODUCT_CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'usado_como_nuevo', label: 'Usado - Como nuevo' },
  { value: 'usado', label: 'Usado' },
  { value: 'reacondicionado', label: 'Reacondicionado' },
] as const
