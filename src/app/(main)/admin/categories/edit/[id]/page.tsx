'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { updateCategory } from '@/features/categories/actions'
import { createClient } from '@/lib/supabase/client'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditCategoryPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').eq('id', id).single()
      setCategory(data)
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateCategory(id, form)
      if (result.error) setError(result.error)
      else router.push('/admin')
    })
  }

  if (loading) return <div className="mx-auto max-w-lg px-4 py-8"><div className="h-64 skeleton rounded-xl" /></div>
  if (!category) return null

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader><h1 className="text-xl font-bold">Editar Categoría</h1></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-[var(--radius)] bg-destructive/10 text-destructive text-sm">{error}</div>}
            <Input label="Nombre" name="name" required defaultValue={category.name} />
            <Input label="Ícono (nombre Lucide)" name="icon" defaultValue={category.icon || ''} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Descripción</label>
              <textarea name="description" rows={2} defaultValue={category.description || ''}
                className="w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm focus-ring resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" value="true" defaultChecked={category.is_active}
                  className="h-4 w-4 rounded" />
                <span className="text-sm">Activa</span>
              </label>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" isLoading={isPending}>Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
