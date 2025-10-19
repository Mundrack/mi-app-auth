'use client'

import { useUser } from '@/lib/hooks/useUser'
import { useOrganization } from '@/lib/hooks/useOrganization'
import Link from 'next/link'

export default function DashboardPage() {
  const { userWithOrg, role, loading: userLoading } = useUser()
  const { stats, loading: orgLoading } = useOrganization(userWithOrg?.organization?.id || null)

  if (userLoading || orgLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {userWithOrg?.full_name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu dashboard
        </p>
      </div>

      {/* Stats Cards - Solo para Owner/Admin */}
      {(role === 'owner' || role === 'admin') && userWithOrg?.organization && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Total Empleados
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.totalMembers}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Owners
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.owners}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Administradores
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.admins}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Miembros
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.members}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Para todos */}
          <Link
            href="/dashboard/profile"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            <div className="text-2xl mb-3">👤</div>
            <h3 className="font-semibold text-gray-900 mb-2">Mi Perfil</h3>
            <p className="text-sm text-gray-600">
              Ver y editar tu información personal
            </p>
          </Link>

          {/* Solo Owner/Admin */}
          {(role === 'owner' || role === 'admin') && (
            <>
              <Link
                href="/dashboard/organization"
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-3">🏢</div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Mi Organización
                </h3>
                <p className="text-sm text-gray-600">
                  Ver información de tu empresa
                </p>
              </Link>

              <Link
                href="/dashboard/members"
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
              >
                <div className="text-2xl mb-3">👥</div>
                <h3 className="font-semibold text-gray-900 mb-2">Empleados</h3>
                <p className="text-sm text-gray-600">
                  Gestionar tu equipo de trabajo
                </p>
              </Link>
            </>
          )}

          {/* Solo Owner */}
          {role === 'owner' && (
            <Link
              href="/dashboard/requests"
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            >
              <div className="text-2xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">Solicitudes</h3>
              <p className="text-sm text-gray-600">
                Revisar solicitudes de acceso
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Info Card - Para Members */}
      {role === 'member' && userWithOrg?.organization && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tu Organización
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Empresa:</span>
              <p className="font-medium text-gray-900">
                {userWithOrg.organization.name}
              </p>
            </div>
            {userWithOrg.position && (
              <div>
                <span className="text-sm text-gray-600">Tu Puesto:</span>
                <p className="font-medium text-gray-900">
                  {userWithOrg.position.title}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-600">Rol:</span>
              <p className="font-medium text-gray-900 capitalize">
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