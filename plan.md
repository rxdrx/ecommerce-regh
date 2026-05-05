Actúa como un Arquitecto de Software Senior. Necesito planificar el desarrollo de un MVP de un Marketplace Comunitario utilizando Next.js (App Router) y Supabase. 

El objetivo es tener una plataforma funcional y escalable en 3 semanas.

### 1. Especificaciones Técnicas
- Frontend: Next.js, Tailwind CSS, Lucide React para iconos.
- Backend/BaaS: Supabase (Auth, PostgreSQL, Storage, RLS).
- Gestión de Estado: React Context o Zustand (priorizar simplicidad).

### 2. Alcance del MVP (Core Features)
- Sistema de Autenticación: Registro, login y perfiles de usuario (Público/Privado).
- Flujo de Productos: 
    - Vista de catálogo con filtros por categoría y búsqueda.
    - Dashboard de usuario para crear, editar y eliminar publicaciones (CRUD).
    - Subida de imágenes a Supabase Storage.
- Interacción Social: Sistema de "Favoritos" y un botón de contacto vía WhatsApp/Email.

### 3. Entregables Esperados del Plan
1. Estructura de Tablas SQL: Definición para el editor de Supabase (tablas: profiles, products, categories).
2. Políticas de Seguridad (RLS): Definir quién puede leer y quién puede escribir.
3. Arquitectura de Carpetas: Organización en Next.js (components, hooks, lib, services).
4. Roadmap de Implementación: Dividido por hitos diarios o fases lógicas.

### 4. Restricciones
- El código debe ser modular y seguir principios de Clean Code.
- Optimizar la carga de imágenes usando el componente <Image /> de Next.js.
- Priorizar el diseño "Mobile First".