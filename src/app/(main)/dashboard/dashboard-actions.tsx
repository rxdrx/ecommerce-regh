'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import { toggleProductActive, deleteProduct } from '@/features/products/actions'
import { useRouter } from 'next/navigation'

interface DashboardActionsProps {
  productId: string
  isActive: boolean
}

export function DashboardActions({ productId, isActive }: DashboardActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleToggle = () => {
    startTransition(async () => {
      await toggleProductActive(productId, !isActive)
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProduct(productId)
      router.refresh()
      setShowConfirm(false)
    })
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleToggle} disabled={isPending} className="gap-1">
        {isActive ? <><EyeOff className="h-3 w-3" /> Desactivar</> : <><Eye className="h-3 w-3" /> Activar</>}
      </Button>

      {showConfirm ? (
        <div className="flex items-center gap-1">
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>Confirmar</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>Cancelar</Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setShowConfirm(true)} className="gap-1 text-destructive hover:text-destructive">
          <Trash2 className="h-3 w-3" /> Eliminar
        </Button>
      )}
    </>
  )
}
