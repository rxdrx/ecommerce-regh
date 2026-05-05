import Link from 'next/link'
import { ShoppingBag, Search, Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Comprá y vendé en tu{' '}
              <span className="gradient-text">comunidad</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              {APP_NAME} es el marketplace donde podés publicar tus productos,
              descubrir ofertas cerca tuyo y conectar con vendedores de confianza.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  <Search className="h-5 w-5" />
                  Explorar productos
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  Empezar a vender
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: 'Publicá tus productos',
                description: 'Creá tu publicación con fotos, descripción y precio en minutos. Es gratis y fácil.',
              },
              {
                icon: Search,
                title: 'Descubrí ofertas',
                description: 'Buscá por categoría, filtrá por precio y encontrá exactamente lo que necesitás.',
              },
              {
                icon: Heart,
                title: 'Conectá con vendedores',
                description: 'Guardá tus favoritos y contactá vendedores directamente por WhatsApp o Email.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg group"
              >
                <div className="mx-auto h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Registrate gratis y empezá a publicar tus productos hoy mismo.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Crear mi cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
