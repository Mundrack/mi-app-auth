import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mi App</h1>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-32 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestión Multi-Organizacional
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Conecta empresas y profesionales en una sola plataforma.
            Crea tu organización o únete a una existente.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register/owner"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Crear Organización
            </Link>
            <Link
              href="/register/member"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Unirme a una Empresa
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Múltiples Organizaciones
            </h3>
            <p className="text-gray-600">
              Pertenece a varias empresas simultáneamente
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Gestión de Equipos
            </h3>
            <p className="text-gray-600">
              Administra empleados y solicitudes fácilmente
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