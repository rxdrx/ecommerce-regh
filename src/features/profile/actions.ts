'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Profile } from '@/types'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  const fullName = formData.get('full_name') as string
  const bio = formData.get('bio') as string
  const phone = formData.get('phone') as string
  const emailPublic = formData.get('email_public') as string
  const isPublic = formData.get('is_public') === 'true'
  const avatarUrl = formData.get('avatar_url') as string | null

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      bio,
      phone,
      email_public: emailPublic,
      is_public: isPublic,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  revalidatePath(`/profile`)
  return { success: true }
}

export async function getProfile(username: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  return { profile: data as Profile | null, error: error?.message }
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { profile: null }

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { profile: data as Profile | null }
}
