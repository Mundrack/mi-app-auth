'use client'

import { useUser } from '@/lib/hooks/useUser'
import Link from 'next/link'
import { Building2, Users, Mail, UserCircle, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { userWithOrg, role } = useUser()

  if (!userWithOrg) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Cargando información...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {userWithOrg.full_name}! 👋
        </h1>
        <p className="text-indigo-100">
          {role === 'owner' ? 'Gestiona tu organización desde aquí' : 'Tu panel de control personal'}
        </p>
      </div>

      {/* Stats Grid */}
      {(role === 'owner' || role === 'admin') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-1">Total Empleados</p>
            <p className="text-3xl font-bold text-slate-900">24</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-yellow-600 font-semibold">Pendientes</span>
            </div>
            <p className="text-slate-600 text-sm mb-1">Invitaciones</p>
            <p className="text-3xl font-bold text-slate-900">5</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">Activa</span>
            </div>
            <p className="text-slate-600 text-sm mb-1">Organización</p>
            <p className="text-lg font-bold text-slate-900 truncate">{userWithOrg.organization?.name}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Owner/Admin Links */}
          {(role === 'owner' || role === 'admin') && (
            <>
              <Link
                href="/dashboard/organization"
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-indigo-300 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Mi Organización</h3>
                <p className="text-sm text-slate-600">
                  Ver información de tu empresa
                </p>
              </Link>

              <Link
                href="/dashboard/members"
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-purple-300 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Empleados</h3>
                <p className="text-sm text-slate-600">
                  Gestionar tu equipo de trabajo
                </p>
              </Link>

              <Link
                href="/dashboard/invitations"
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Invitaciones</h3>
                <p className="text-sm text-slate-600">
                  Invitar nuevos miembros
                </p>
              </Link>
            </>
          )}

          {/* Common Link */}
          <Link
            href="/dashboard/profile"
            className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-green-300 transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Mi Perfil</h3>
            <p className="text-sm text-slate-600">
              Ver y editar tu información
            </p>
          </Link>
        </div>
      </div>

      {/* Info Card - Para Members */}
      {role === 'member' && userWithOrg?.organization && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Tu Organización
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-600">Empresa:</span>
              <p className="font-medium text-slate-900">
                {userWithOrg.organization.name}
              </p>
            </div>
            {userWithOrg.position && (
              <div>
                <span className="text-sm text-slate-600">Tu Puesto:</span>
                <p className="font-medium text-slate-900">
                  {userWithOrg.position.title}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-slate-600">Rol:</span>
              <p className="font-medium text-slate-900 capitalize">
                {role === 'owner' ? 'Propietario' : 
                 role === 'admin' ? 'Administrador' : 'Miembro'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}