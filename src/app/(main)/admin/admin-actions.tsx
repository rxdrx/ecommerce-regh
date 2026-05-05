'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { deleteCategory } from '@/features/categories/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function AdminCategoryActions({ categoryId }: { categoryId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategory(categoryId)
      if (!result.error) router.refresh()
      setShowConfirm(false)
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/categories/edit/${categoryId}`}>
        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
      </Link>
      {showConfirm ? (
        <>
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>Sí</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>No</Button>
        </>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(true)} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
