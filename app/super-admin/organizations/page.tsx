'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { 
  Building2, 
  Users, 
  MapPin,
  Globe,
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  CheckCircle,
  XCircle,
  MoreVertical,
  AlertCircle,
  Briefcase
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  is_active: boolean
  created_at: string
  member_count: number
  dim_industries: { name: string } | null
  dim_locations: { city: string; country: string } | null
  dim_organization_details: {
    website: string | null
    size: string | null
  } | null
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      const response = await fetch('/api/super-admin/organizations')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar organizaciones')
      }

      setOrganizations(data.organizations)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && org.is_active) ||
                          (filterStatus === 'inactive' && !org.is_active)
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: organizations.length,
    active: organizations.filter(o => o.is_active).length,
    inactive: organizations.filter(o => !o.is_active).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/super-admin"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <Logo size="md" showText={false} />
            <div>
              <h1 className="text-xl font-bold text-white">Organizaciones</h1>
              <p className="text-sm text-purple-200">Gestión de empresas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/30 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-300" />
              </div>
            </div>
            <p className="text-purple-200 text-sm mb-1">Total</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-300" />
              </div>
            </div>
            <p className="text-green-200 text-sm mb-1">Activas</p>
            <p className="text-3xl font-bold text-white">{stats.active}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/30 rounded-lg">
                <XCircle className="w-5 h-5 text-red-300" />
              </div>
            </div>
            <p className="text-red-200 text-sm mb-1">Inactivas</p>
            <p className="text-3xl font-bold text-white">{stats.inactive}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Buscar por nombre o slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Activas
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Inactivas
              </button>
            </div>
          </div>
        </div>

        {/* Organizations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-12 text-center">
            <Building2 className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No se encontraron organizaciones</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {org.logo_url ? (
                      <img
                        src={org.logo_url}
                        alt={org.name}
                        className="w-12 h-12 rounded-lg bg-white/10"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {org.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                      <p className="text-sm text-white/50">@{org.slug}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-white/70" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    org.is_active
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {org.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {org.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="space-y-3">
                  {org.dim_industries && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-purple-300" />
                      <span className="text-white/70">{org.dim_industries.name}</span>
                    </div>
                  )}

                  {org.dim_locations && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-300" />
                      <span className="text-white/70">
                        {org.dim_locations.city}, {org.dim_locations.country}
                      </span>
                    </div>
                  )}

                  {org.dim_organization_details?.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-green-300" />
                      
                        href={org.dim_organization_details.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-300 hover:text-green-200 transition-colors"
                      >
                        {org.dim_organization_details.website}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-yellow-300" />
                    <span className="text-white/70">{org.member_count} miembros</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-pink-300" />
                    <span className="text-white/70">
                      Creada {new Date(org.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}