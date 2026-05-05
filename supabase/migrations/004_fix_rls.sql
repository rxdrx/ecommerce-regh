-- =============================================
-- Fix: RLS Profiles policies
-- Drops and recreates with simpler logic
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Perfiles públicos visibles" ON public.profiles;
DROP POLICY IF EXISTS "Ver propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Actualizar propio perfil" ON public.profiles;

-- Anyone can read profiles (public marketplace, needed for product seller info)
CREATE POLICY "Leer perfiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Actualizar propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Also fix categories: allow anon users to read active categories
DROP POLICY IF EXISTS "Categorías activas visibles" ON public.categories;
CREATE POLICY "Categorías visibles para todos"
  ON public.categories FOR SELECT
  USING (is_active = true);
