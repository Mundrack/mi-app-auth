'use client'

import { useUser } from '@/lib/hooks/useUser'
import { Building2, MapPin, Globe, Users, Briefcase, Calendar, Edit } from 'lucide-react'

export default function OrganizationPage() {
  const { userWithOrg } = useUser()

  if (!userWithOrg?.organization) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No estás asociado a ninguna organización</p>
      </div>
    )
  }

  const org = userWithOrg.organization

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mi Organización</h1>
          <p className="text-slate-600 mt-1">Información de tu empresa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>

      {/* Organization Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-4">
            {org.logo_url ? (
              <img src={org.logo_url} alt={org.name} className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur" />
            ) : (
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold">{org.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h2 className="text-3xl font-bold mb-1">{org.name}</h2>
              <p className="text-indigo-100">@{org.slug}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Description */}
          {userWithOrg.organization_details?.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Descripción</h3>
              <p className="text-slate-700">{userWithOrg.organization_details.description}</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Industry */}
            {userWithOrg.industry && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Industria</p>
                  <p className="font-semibold text-slate-900">{userWithOrg.industry.name}</p>
                </div>
              </div>
            )}

            {/* Size */}
            {userWithOrg.organization_details?.size && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Tamaño</p>
                  <p className="font-semibold text-slate-900">{userWithOrg.organization_details.size} empleados</p>
                </div>
              </div>
            )}

            {/* Location */}
            {userWithOrg.location && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Ubicación</p>
                  <p className="font-semibold text-slate-900">
                    {userWithOrg.location.city}, {userWithOrg.location.country}
                  </p>
                </div>
              </div>
            )}

            {/* Website */}
            {userWithOrg.organization_details?.website && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Sitio Web</p>
                  <a 
                    href={userWithOrg.organization_details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {userWithOrg.organization_details.website}
                  </a>
                </div>
              </div>
            )}

            {/* Created Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Creada</p>
                <p className="font-semibold text-slate-900">
                  {new Date(org.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${org.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                <Building2 className={`w-5 h-5 ${org.is_active ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className="text-sm text-slate-600">Estado</p>
                <p className={`font-semibold ${org.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {org.is_active ? 'Activa' : 'Inactiva'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}