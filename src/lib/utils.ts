import { CURRENCY_SYMBOL, DEFAULT_CURRENCY } from './constants'

/**
 * Merge class names conditionally (lightweight cn utility)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = DEFAULT_CURRENCY): string {
  const symbol = CURRENCY_SYMBOL[currency] || '$'
  return `${symbol} ${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Generate WhatsApp contact link
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

/**
 * Generate mailto link
 */
export function getEmailLink(email: string, subject?: string): string {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${params}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Get relative time string in Spanish
 */
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 30) return past.toLocaleDateString('es-AR')
  if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffMinutes > 0) return `hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`
  return 'hace un momento'
}
