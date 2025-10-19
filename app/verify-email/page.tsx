export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verifica tu email
        </h1>
        
        <p className="text-gray-600 mb-8">
          Te hemos enviado un correo de confirmación. Por favor revisa tu bandeja de entrada y haz click en el enlace para activar tu cuenta.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">¿No recibiste el email?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Revisa tu carpeta de spam</li>
            <li>• Verifica que el email sea correcto</li>
            <li>• El enlace expira en 24 horas</li>
          </ul>
        </div>

        <div className="mt-8 animate-pulse">
          <p className="text-sm text-gray-500">
            Esperando confirmación...
          </p>
        </div>
      </div>
    </div>
  )
}