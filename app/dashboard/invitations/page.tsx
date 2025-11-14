'use client'

import { useState } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { Mail, Copy, Check, Plus, Send, Clock, AlertCircle } from 'lucide-react'

export default function InvitationsPage() {
  const { userWithOrg, role } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const [copiedLink, setCopiedLink] = useState('')
  const [invitationLink, setInvitationLink] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    position_id: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setSuccess('')
    setInvitationLink('')

    try {
      const response = await fetch('/api/invitations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar invitación')
      }

      setSuccess(`✅ Invitación enviada a ${formData.email}`)
      setInvitationLink(data.invitation_link)
      setFormData({ email: '', position_id: '' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(link)
    setTimeout(() => setCopiedLink(''), 2000)
  }

  if (role !== 'owner' && role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invitaciones</h1>
          <p className="text-slate-600 mt-1">Invita nuevos miembros a tu organización</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nueva Invitación
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Send className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Enviadas</p>
          <p className="text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Pendientes</p>
          <p className="text-3xl font-bold text-slate-900">0</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Aceptadas</p>
          <p className="text-3xl font-bold text-slate-900">0</p>
        </div>
      </div>

      {/* Formulario de invitación */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Enviar Nueva Invitación</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {invitationLink && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Link de invitación generado:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={invitationLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm font-mono"
                />
                <button
                  onClick={() => copyLink(invitationLink)}
                  className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  title="Copiar link"
                >
                  {copiedLink === invitationLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                💡 Copia este link y envíalo por email, WhatsApp o Slack. Expira en 7 días.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email del invitado *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ejemplo@email.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Puesto (opcional)
              </label>
              <select
                value={formData.position_id}
                onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Seleccionar puesto...</option>
                <option value="">CEO</option>
                <option value="">Director de Marketing</option>
                <option value="">Desarrollador</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                El puesto puede asignarse después desde el panel de empleados
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setError('')
                  setSuccess('')
                  setInvitationLink('')
                }}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Invitación
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-600" />
          Cómo funciona el sistema de invitaciones
        </h3>
        <ol className="space-y-2 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-indigo-600 min-w-[20px]">1.</span>
            <span>Haz clic en "Nueva Invitación" y escribe el email de la persona que deseas invitar</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-indigo-600 min-w-[20px]">2.</span>
            <span>Se generará un link único y seguro que expira en 7 días</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-indigo-600 min-w-[20px]">3.</span>
            <span>Copia el link y envíalo por email, WhatsApp, Slack o cualquier medio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-indigo-600 min-w-[20px]">4.</span>
            <span>La persona hace clic en el link y si no tiene cuenta, la crea en ese momento</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-indigo-600 min-w-[20px]">5.</span>
            <span>Una vez aceptada, la persona se integra automáticamente a tu organización</span>
          </li>
        </ol>
      </div>
    </div>
  )
}