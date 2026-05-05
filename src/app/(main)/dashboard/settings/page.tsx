'use client'

import { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { updateProfile } from '@/features/profile/actions'
import { createClient } from '@/lib/supabase/client'
import { User } from 'lucide-react'
import type { Profile } from '@/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const form = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateProfile(form)
      if (result.error) setError(result.error)
      else setSuccess(true)
    })
  }

  if (loading) return <div className="mx-auto max-w-2xl px-4 py-8"><div className="h-96 skeleton rounded-xl" /></div>

  if (!profile) return null

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold flex items-center gap-2"><User className="h-5 w-5" /> Configuración de Perfil</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 rounded-[var(--radius)] bg-destructive/10 text-destructive text-sm">{error}</div>}
            {success && <div className="p-3 rounded-[var(--radius)] bg-success/10 text-success text-sm">Perfil actualizado correctamente.</div>}

            <Input label="Nombre completo" name="full_name" defaultValue={profile.full_name || ''} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Bio</label>
              <textarea name="bio" rows={3} defaultValue={profile.bio || ''} placeholder="Contá algo sobre vos..."
                className="w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm focus-ring resize-none" />
            </div>
            <Input label="Teléfono (WhatsApp)" name="phone" defaultValue={profile.phone || ''} placeholder="5491112345678" hint="Número completo con código de país, sin +"/>
            <Input label="Email público" name="email_public" type="email" defaultValue={profile.email_public || ''} placeholder="contacto@ejemplo.com" />

            <div className="flex items-center gap-3">
              <input type="hidden" name="is_public" value="false" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_public" value="true" defaultChecked={profile.is_public}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm">Perfil público</span>
              </label>
              <span className="text-xs text-muted-foreground">Si está desactivado, solo vos podés ver tu perfil.</span>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isPending}>Guardar Cambios</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
