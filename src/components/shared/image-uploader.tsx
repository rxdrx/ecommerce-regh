'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_IMAGES_PER_PRODUCT, MAX_IMAGE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES, BUCKET_PRODUCT_IMAGES } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  userId: string
  productId?: string
}

export function ImageUploader({ images, onChange, userId, productId }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files: FileList | File[]) => {
    const remaining = MAX_IMAGES_PER_PRODUCT - images.length
    if (remaining <= 0) return

    const validFiles = Array.from(files)
      .filter(f => ACCEPTED_IMAGE_TYPES.includes(f.type) && f.size <= MAX_IMAGE_SIZE_BYTES)
      .slice(0, remaining)

    if (validFiles.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of validFiles) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/${productId || 'new'}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from(BUCKET_PRODUCT_IMAGES)
        .upload(path, file, { upsert: true })

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_PRODUCT_IMAGES)
          .getPublicUrl(path)
        newUrls.push(publicUrl)
      }
    }

    onChange([...images, ...newUrls])
    setUploading(false)
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Imágenes ({images.length}/{MAX_IMAGES_PER_PRODUCT})
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-[var(--radius)] overflow-hidden border border-border group">
            <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" sizes="150px" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES_PER_PRODUCT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            disabled={uploading}
            className={cn(
              'aspect-square rounded-[var(--radius)] border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary cursor-pointer',
              dragOver && 'border-primary bg-primary/5',
              uploading && 'opacity-50 cursor-wait'
            )}
          >
            {uploading ? (
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-xs">Subir</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">JPG, PNG o WebP. Máximo {MAX_IMAGES_PER_PRODUCT} imágenes de 2MB cada una.</p>
    </div>
  )
}
