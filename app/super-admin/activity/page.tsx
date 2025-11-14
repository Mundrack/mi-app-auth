'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { 
  Activity,
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Building2,
  Settings,
  AlertCircle
} from 'lucide-react'

export default function ActivityPage() {
  // Mock data - en producción conectar a una tabla de logs
  const activities = [
    {
      id: 1,
      type: 'user_created',
      user: 'Juan Pérez',
      description: 'Nuevo usuario registrado',
      timestamp: new Date().toISOString(),
      icon: User,
      color: 'blue'
    },
    {
      id: 2,
      type: 'org_created',
      user: 'María García',
      description: 'Nueva organización "Tech Corp" creada',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      icon: Building2,
      color: 'purple'
    },
    {
      id: 3,
      type: 'settings_changed',
      user: 'Admin',
      description: 'Configuración del sistema actualizada',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      icon: Settings,
      color: 'green'
    }
  ]

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
              <h1 className="text-xl font-bold text-white">Log de Actividad</h1>
              <p className="text-sm text-purple-200">Actividad del sistema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className={`p-2 bg-${activity.color}-500/20 rounded-lg`}>
                    <Icon className={`w-5 h-5 text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{activity.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {activity.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(activity.timestamp).toLocaleString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Coming Soon */}
          <div className="mt-8 p-6 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-center">
            <AlertCircle className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
            <p className="text-yellow-200 font-medium">Sistema de logs completo en desarrollo</p>
            <p className="text-yellow-200/70 text-sm mt-1">Próximamente con filtros avanzados y exportación</p>
          </div>
        </div>
      </main>
    </div>
  )
}