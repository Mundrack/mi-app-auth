import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-semibold text-gray-900">Mi App</div>
          <Link
            href="/login"
            className="px-4 py-2 text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sistema Multi-Tenant
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Crea tu organización y gestiona tu equipo de manera eficiente.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/register/owner"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Crear Organización
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Los empleados se unen mediante invitaciones de sus organizaciones
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16 border-t border-gray-200 mt-20">
          <div className="text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Múltiples Organizaciones
            </h3>
            <p className="text-gray-600">
              Gestiona múltiples empresas desde un solo lugar
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gestión de Equipos
            </h3>
            <p className="text-gray-600">
              Invita y administra a tu equipo fácilmente
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Seguridad Total
            </h3>
            <p className="text-gray-600">
              Datos protegidos con autenticación robusta
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 text-sm">
          © 2024 Mi App. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}