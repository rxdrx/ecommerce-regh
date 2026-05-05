'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect } from 'react'

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const debouncedQuery = useDebounce(query, 400)

  const updateSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
      params.delete('page')
    } else {
      params.delete('search')
    }
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  useEffect(() => {
    updateSearch(debouncedQuery)
  }, [debouncedQuery, updateSearch])

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-10 pl-10 pr-10 rounded-[var(--radius)] border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus-ring"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
