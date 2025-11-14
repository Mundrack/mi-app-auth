'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { Building2, Mail, Briefcase, CheckCircle, XCircle, Loader2, User, Phone, Lock } from 'lucide-react'

interface InvitationData {
  email: string
  organization: {
    name: string
    logo_url: string | null
  }
  position: {
    title: string
  } | null
}

export default function InvitationPage({ params }: { params: { token: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [error, setError] = useState('')
  const [needsAccount, setNeedsAccount] = useState(false)

  // Form data para crear cuenta
  const [formData, setFormData] = useState({
    full_name: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })

  useEffect(() => {
    validateInvitation()
  }, [params.token])

  const validateInvitation = async () => {
    try {
      const response = await fetch('/api/invitations/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invitación no válida')
        return
      }

      setInvitation(data.invitation)

      // Si NO está logueado, necesita crear cuenta
      if (!user) {
        setNeedsAccount(true)
      }
    } catch (err: any) {
      setError('Error al validar invitación')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setAccepting(true)
    setError('')

    try {
      // Si necesita cuenta, validar datos
      if (needsAccount) {
        if (!formData.full_name || !formData.password) {
          setError('Por favor completa todos los campos requeridos')
          setAccepting(false)
          return
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden')
          setAccepting(false)
          return
        }
        if (formData.password.length < 8) {
          setError('La contraseña debe tener al menos 8 caracteres')
          setAccepting(false)
          return
        }
      }

      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          user_data: needsAccount ? formData : null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al aceptar invitación')
      }

      // Si necesitaba login, redirigir a login
      if (data.requires_login) {
        router.push('/login?message=Cuenta creada. Inicia sesión para continuar')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Error al aceptar invitación')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Validando invitación...</p>
        </div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invitación no válida</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Tienes una invitación!</h1>
          <p className="text-indigo-100">Has sido invitado a unirte a una organización</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {invitation && (
            <>
              {/* Info de la invitación */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-slate-600">Organización</p>
                    <p className="font-semibold text-slate-900">{invitation.organization.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-slate-600">Email</p>
                    <p className="font-semibold text-slate-900">{invitation.email}</p>
                  </div>
                </div>

                {invitation.position && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="text-xs text-slate-600">Puesto</p>
                      <p className="font-semibold text-slate-900">{invitation.position.title}</p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Si ya tiene cuenta */}
              {!needsAccount && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Ya tienes una cuenta. Acepta la invitación para unirte.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAccept()}
                    disabled={accepting}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                  >
                    {accepting ? 'Aceptando...' : 'Aceptar Invitación'}
                  </button>
                </div>
              )}

              {/* Si necesita crear cuenta */}
              {needsAccount && (
                <form onSubmit={handleAccept} className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                      Crea tu cuenta para aceptar la invitación
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Mínimo 8 caracteres</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={accepting}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                  >
                    {accepting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creando cuenta...
                      </span>
                    ) : (
                      'Crear Cuenta y Aceptar'
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}