-- =============================================
-- Migration: RLS Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Perfiles públicos visibles"
  ON public.profiles FOR SELECT
  USING (is_public = true);

CREATE POLICY "Ver propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Actualizar propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CATEGORIES
CREATE POLICY "Categorías activas visibles"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin ver todas las categorías"
  ON public.categories FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin crear categorías"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin actualizar categorías"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin eliminar categorías"
  ON public.categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PRODUCTS
CREATE POLICY "Productos activos visibles"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Ver propios productos"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Crear productos"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Actualizar propios productos"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Eliminar propios productos"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- FAVORITES
CREATE POLICY "Ver propios favoritos"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Agregar favoritos"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Quitar favoritos"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);
