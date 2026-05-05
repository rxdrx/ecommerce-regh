-- =============================================
-- Seed: Initial Categories
-- =============================================

INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
  ('Electrónica', 'electronica', 'Smartphone', 1),
  ('Ropa y Accesorios', 'ropa-accesorios', 'Shirt', 2),
  ('Hogar y Jardín', 'hogar-jardin', 'Home', 3),
  ('Deportes', 'deportes', 'Dumbbell', 4),
  ('Vehículos', 'vehiculos', 'Car', 5),
  ('Libros y Educación', 'libros-educacion', 'BookOpen', 6),
  ('Servicios', 'servicios', 'Wrench', 7),
  ('Otros', 'otros', 'Package', 8)
ON CONFLICT (slug) DO NOTHING;
