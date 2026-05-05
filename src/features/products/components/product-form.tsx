'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ImageUploader } from '@/components/shared/image-uploader'
import { PRODUCT_CONDITIONS } from '@/lib/constants'
import { createProduct, updateProduct } from '@/features/products/actions'
import type { Category, Product } from '@/types'

interface ProductFormProps {
  categories: Category[]
  userId: string
  product?: Product
}

export function ProductForm({ categories, userId, product }: ProductFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEdit = !!product

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    form.set('images', JSON.stringify(images))

    const result = isEdit
      ? await updateProduct(product.id, form)
      : await createProduct(form)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // redirect happens in the action
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold">{isEdit ? 'Editar Producto' : 'Publicar Producto'}</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-[var(--radius)] bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Input label="Título" name="title" required defaultValue={product?.title} placeholder="Ej: iPhone 14 Pro Max 256GB" />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description || ''}
              placeholder="Describí tu producto en detalle..."
              className="w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm focus-ring resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Precio (ARS)" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} placeholder="0.00" />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Categoría</label>
              <select name="category_id" required defaultValue={product?.category_id}
                className="h-10 rounded-[var(--radius)] border border-input bg-background px-3 text-sm focus-ring">
                <option value="">Seleccionar...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Condición</label>
              <select name="condition" required defaultValue={product?.condition}
                className="h-10 rounded-[var(--radius)] border border-input bg-background px-3 text-sm focus-ring">
                <option value="">Seleccionar...</option>
                {PRODUCT_CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <Input label="Ubicación" name="location" defaultValue={product?.location || ''} placeholder="Ej: Buenos Aires, CABA" />
          </div>

          <ImageUploader images={images} onChange={setImages} userId={userId} productId={product?.id} />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit" isLoading={loading}>{isEdit ? 'Guardar Cambios' : 'Publicar'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
