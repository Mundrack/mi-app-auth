'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { useAuth } from '@/lib/hooks/useAuth'
import { supabase } from '@/lib/supabase/client'
import { User, Mail, Phone, Building2, Briefcase, Calendar, Edit, Save, X, CheckCircle } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const { userWithOrg, role } = useUser()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  })

  useEffect(() => {
    if (userWithOrg) {
      setFormData({
        full_name: userWithOrg.full_name || '',
        phone: userWithOrg.phone || ''
      })
    }
  }, [userWithOrg])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const { error: updateError } = await supabase
        .from('dim_users')
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null
        })
        .eq('id', user?.id)

      if (updateError) throw updateError

      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: userWithOrg?.full_name || '',
      phone: userWithOrg?.phone || ''
    })
    setEditing(false)
    setError('')
  }

  if (!userWithOrg) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Cargando perfil...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-600 mt-1">Gestiona tu información personal</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Perfil
          </button>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800 font-medium">Perfil actualizado exitosamente</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <span className="text-4xl font-bold">
                {userWithOrg.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-1">{userWithOrg.full_name}</h2>
              <p className="text-indigo-100 mb-2">{userWithOrg.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                role === 'owner' ? 'bg-yellow-400 text-yellow-900' :
                role === 'admin' ? 'bg-blue-400 text-blue-900' :
                'bg-white/20 text-white'
              }`}>
                {role === 'owner' ? '👑 Propietario' : 
                 role === 'admin' ? '🛡️ Administrador' : 
                 '💼 Miembro'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {editing ? (
            // Edit Form
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Nombre Completo
                </label>
                <input
                  type="text"
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

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Nombre Completo</p>
                  <p className="font-semibold text-slate-900">{userWithOrg.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-semibold text-slate-900">{userWithOrg.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Phone className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Teléfono</p>
                  <p className="font-semibold text-slate-900">
                    {userWithOrg.phone || 'No especificado'}
                  </p>
                </div>
              </div>

              {userWithOrg.organization && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Organización</p>
                    <p className="font-semibold text-slate-900">{userWithOrg.organization.name}</p>
                  </div>
                </div>
              )}

              {userWithOrg.position && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Puesto</p>
                    <p className="font-semibold text-slate-900">{userWithOrg.position.title}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Miembro desde</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(userWithOrg.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Información de la Cuenta</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600">ID de Usuario</span>
            <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-700">
              {user?.id.slice(0, 8)}...
            </code>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600">Email Verificado</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              user?.email_confirmed_at 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user?.email_confirmed_at ? '✓ Verificado' : '⚠ Pendiente'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600">Última Sesión</span>
            <span className="text-slate-900 font-medium">
              {user?.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleString('es-ES')
                : 'Primera sesión'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}