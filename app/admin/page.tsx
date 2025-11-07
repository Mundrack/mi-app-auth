'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSuperAdmin } from '@/lib/hooks/useSuperAdmin'
import Link from 'next/link'
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Power,
  Crown,
  Shield,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react'

export default function SuperAdminPage() {
  const { user, loading: authLoading } = useAuth()
  const { organizations, globalStats, loading, refresh, toggleOrganizationStatus } = useSuperAdmin()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Verificar si es super admin (por ahora solo verificamos que esté logueado)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  // Filtrar organizaciones
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? org.is_active :
      !org.is_active
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Panel de Super Admin</h1>
                <p className="text-sm text-slate-600">Gestión y monitoreo del sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Actualizar datos"
              >
                <RefreshCw className="w-5 h-5 text-slate-600" />
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Ir al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Organizaciones</p>
            <p className="text-3xl font-bold text-slate-900">{globalStats?.total_organizations || 0}</p>
            <p className="text-xs text-green-600 mt-1">
              {globalStats?.active_organizations || 0} activas
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Usuarios Totales</p>
            <p className="text-3xl font-bold text-slate-900">{globalStats?.total_users || 0}</p>
            <p className="text-xs text-purple-600 mt-1">
              {globalStats?.active_users || 0} activos
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-sm text-slate-600 mb-1">Solicitudes</p>
            <p className="text-3xl font-bold text-slate-900">{globalStats?.total_requests || 0}</p>
            <p className="text-xs text-orange-600 mt-1">
              {globalStats?.pending_requests || 0} pendientes
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar organización..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Inactivas
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Organizaciones */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Organización
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Miembros
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Owners
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Admins
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Solicitudes
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {org.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{org.name}</p>
                          <p className="text-xs text-slate-500">@{org.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {org.is_active ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">{org.total_members}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-slate-900">{org.owners}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-slate-900">{org.admins}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {org.pending_requests > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          <AlertCircle className="w-3 h-3" />
                          {org.pending_requests}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">
                      {new Date(org.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleOrganizationStatus(org.id, org.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            org.is_active
                              ? 'hover:bg-red-100 text-red-600'
                              : 'hover:bg-green-100 text-green-600'
                          }`}
                          title={org.is_active ? 'Desactivar' : 'Activar'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/organization/${org.id}`}
                          className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrgs.length === 0 && (
            <div className="py-12 text-center">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No se encontraron organizaciones</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
```

---

## 🔑 **CREDENCIALES DEL SISTEMA**

Basándome en lo que vimos antes, estas son las credenciales:

### **Super Admin:**
```
Email: mateopugam75@hotmail.com
Password: M1Password5eguro2024!
```

### **Owner de RADICAL (si lo creaste):**
```
Email: [el email que pusiste al crear RADICAL]
Password: [la contraseña que pusiste]
```

### **Member (si creaste alguno):**
```
Email: [el email del member]
Password: [la contraseña que el member creó]