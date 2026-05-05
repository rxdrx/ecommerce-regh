'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { createCategory } from '@/features/categories/actions'

export default function NewCategoryPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createCategory(form)
      if (result.error) setError(result.error)
      else router.push('/admin')
    })
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader><h1 className="text-xl font-bold">Nueva Categoría</h1></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-[var(--radius)] bg-destructive/10 text-destructive text-sm">{error}</div>}
            <Input label="Nombre" name="name" required placeholder="Ej: Electrónica" />
            <Input label="Ícono (nombre Lucide)" name="icon" placeholder="Ej: Smartphone" hint="Nombre del ícono de lucide-react" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Descripción</label>
              <textarea name="description" rows={2} className="w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm focus-ring resize-none" />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" isLoading={isPending}>Crear</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
