import Link from 'next/link'

export default function RequestSentPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Solicitudes Enviadas!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Tus solicitudes han sido enviadas exitosamente. Los propietarios de las organizaciones revisarán tu perfil y te notificarán su decisión por email.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">¿Qué sigue?</h3>
          <ol className="text-sm text-gray-600 space-y-2">
            <li>1. Los propietarios revisarán tu solicitud</li>
            <li>2. Recibirás un email con su decisión</li>
            <li>3. Si eres aprobado, podrás establecer tu contraseña</li>
            <li>4. Luego podrás iniciar sesión normalmente</li>
          </ol>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}