-- =============================================
-- Migration: Storage Buckets & Policies
-- =============================================

-- Create buckets (run in Supabase Dashboard if SQL doesn't work)
-- Buckets ya creados manualmente: product-images-regh y avatars-regh

-- Product images: public read
CREATE POLICY "Imágenes públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images-regh');

-- Product images: authenticated upload to own folder
CREATE POLICY "Subir imágenes propias"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images-regh'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Product images: delete own images
CREATE POLICY "Eliminar imágenes propias"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images-regh'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars: public read
CREATE POLICY "Avatars públicos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars-regh');

-- Avatars: authenticated upload to own folder
CREATE POLICY "Subir avatar propio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars-regh'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatars: delete own avatar
CREATE POLICY "Eliminar avatar propio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars-regh'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
