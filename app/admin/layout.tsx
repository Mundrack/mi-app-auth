'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si hay sesión de admin en sessionStorage
    const adminSession = sessionStorage.getItem('admin_session')
    if (!adminSession) {
      router.push('/login')
    } else {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Verificando acceso...</div>
      </div>
    )
  }

  if (!authenticated) return null

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/organizations', label: 'Organizaciones', icon: '🏢' },
    { href: '/admin/users', label: 'Usuarios', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <header className="lg:hidden bg-red-600 text-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            Admin Panel
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-red-700 py-4">
            <nav className="px-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'bg-red-700'
                      : 'hover:bg-red-700'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-700 rounded-lg transition-colors"
              >
                <span>🚪</span>
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="lg:flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-red-600 text-white">
          <div className="flex items-center h-16 px-6 border-b border-red-700">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              🔐 Admin Panel
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-red-700'
                    : 'hover:bg-red-700'
                }`}
              >
                <span>{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-red-700 p-4">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Super Admin</p>
                <p className="text-xs text-red-200">Control Total</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-700 rounded-lg transition-colors"
            >
              <span>🚪</span>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:pl-64 flex-1">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}