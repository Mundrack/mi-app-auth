'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSuperAdmin } from '@/lib/hooks/useSuperAdmin'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading, signOut } = useAuth()
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Redirigir si no está autenticado o no es super admin
    if (!authLoading && !superAdminLoading) {
      if (!user) {
        router.push('/login')
      } else if (!isSuperAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, isSuperAdmin, authLoading, superAdminLoading, router])

  if (authLoading || superAdminLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Verificando permisos...</div>
      </div>
    )
  }

  if (!user || !isSuperAdmin) return null

  const links = [
    { href: '/super-admin', label: 'Dashboard', icon: '📊' },
    { href: '/super-admin/organizations', label: 'Organizaciones', icon: '🏢' },
    { href: '/super-admin/users', label: 'Usuarios', icon: '👥' },
    { href: '/super-admin/activity', label: 'Actividad', icon: '📋' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Super Admin
            </div>
            <div className="text-xs text-gray-500">Panel de Control</div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-gray-200 py-4 bg-white">
            <nav className="px-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span>👤</span>
                  <span>Ir a Mi Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <span>🚪</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Super Admin
            </div>
            <div className="text-xs text-gray-500 mt-1">Panel de Control</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 w-full transition-colors"
            >
              <span>👤</span>
              <span>Mi Dashboard</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Content */}
      <main className="lg:hidden px-4 py-6">
        {children}
      </main>
    </div>
  )
}