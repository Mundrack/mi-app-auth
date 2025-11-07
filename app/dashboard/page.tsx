'use client'

import { useUser } from '@/lib/hooks/useUser'
import { useOrganization } from '@/lib/hooks/useOrganization'
import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  Building2, 
  FileText, 
  ArrowRight,
  UserCircle,
  Crown,
  Shield,
  Briefcase
} from 'lucide-react'

export default function DashboardPage() {
  const { userWithOrg, role, loading: userLoading } = useUser()
  const { stats, loading: orgLoading } = useOrganization(userWithOrg?.organization?.id || null)

  if (userLoading || orgLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header con gradiente */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            ¡Hola, {userWithOrg?.full_name}! 👋
          </h1>
          <p className="text-indigo-100">
            Bienvenido a tu dashboard profesional
          </p>
        </div>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Stats Cards - Solo para Owner/Admin */}
      {(role === 'owner' || role === 'admin') && userWithOrg?.organization && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Total Empleados</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalMembers}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Owners</p>
            <p className="text-3xl font-bold text-slate-900">{stats.owners}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Administradores</p>
            <p className="text-3xl font-bold text-slate-900">{stats.admins}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-1">Miembros</p>
            <p className="text-3xl font-bold text-slate-900">{stats.members}</p>
          </div>
        </div>
      )}

      {/* Accesos Rápidos */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Para todos */}
          <Link
            href="/dashboard/profile"
            className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                <UserCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Mi Perfil</h3>
            <p className="text-sm text-slate-600">
              Ver y editar tu información personal
            </p>
          </Link>

          {/* Solo Owner/Admin */}
          {(role === 'owner' || role === 'admin') && (
            <>
              <Link
                href="/dashboard/organization"
                className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Mi Organización
                </h3>
                <p className="text-sm text-slate-600">
                  Ver información de tu empresa
                </p>
              </Link>

              <Link
                href="/dashboard/members"
                className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Empleados</h3>
                <p className="text-sm text-slate-600">
                  Gestionar tu equipo de trabajo
                </p>
              </Link>
            </>
          )}

          {/* Solo Owner */}
          {role === 'owner' && (
            <Link
              href="/dashboard/requests"
              className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Solicitudes</h3>
              <p className="text-sm text-slate-600">
                Revisar solicitudes de acceso
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Info Card - Para Members */}
      {role === 'member' && userWithOrg?.organization && (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Tu Organización
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-sm text-slate-600">Empresa:</span>
                <p className="font-semibold text-slate-900">
                  {userWithOrg.organization.name}
                </p>
              </div>
            </div>
            {userWithOrg.position && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <div>
                  <span className="text-sm text-slate-600">Tu Puesto:</span>
                  <p className="font-semibold text-slate-900">
                    {userWithOrg.position.title}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-pink-600" />
              <div>
                <span className="text-sm text-slate-600">Rol:</span>
                <p className="font-semibold text-slate-900 capitalize">
                  {role === 'owner' ? 'Propietario' : 
                   role === 'admin' ? 'Administrador' : 'Miembro'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}