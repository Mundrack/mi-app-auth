'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/lib/hooks/useAuth'
import { useUser } from '@/lib/hooks/useUser'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UserCircle, 
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
  Mail
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading, signOut } = useAuth()
  const { role, userWithOrg, loading: userLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  // Links del menú según rol (SIN SOLICITUDES)
  const ownerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/organization', label: 'Mi Organización', icon: Building2 },
    { href: '/dashboard/members', label: 'Empleados', icon: Users },
    { href: '/dashboard/invitations', label: 'Invitaciones', icon: Mail },
    { href: '/dashboard/profile', label: 'Mi Perfil', icon: UserCircle },
  ]

  const memberLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Mi Perfil', icon: UserCircle },
  ]

  const links = role === 'owner' || role === 'admin' ? ownerLinks : memberLinks

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo y toggle mobile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Logo size="md" showText href="/dashboard" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {userWithOrg?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900">{userWithOrg?.full_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Mi Perfil</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Configuración</span>
                    </Link>
                    <hr className="my-2 border-slate-200" />
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        signOut()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200">
              <Logo size="md" showText />
            </div>
            <nav className="p-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-slate-200">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Organization Info */}
          {userWithOrg?.organization && (
            <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Organización</p>
              <p className="font-semibold text-slate-900">{userWithOrg.organization.name}</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 text-xs text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema activo</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}