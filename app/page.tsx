import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Building2, Users, ArrowRight, CheckCircle, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo size="md" showText />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors rounded-lg hover:bg-slate-100"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register/member"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-200"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-20 lg:py-28">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-sm font-medium text-indigo-700 mb-6">
            <Zap className="w-4 h-4" />
            Plataforma Multi-Tenant Profesional
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Gestiona tu Empresa<br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              de Forma Profesional
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Invita a tu equipo, gestiona empleados y lleva el control de tu organización en un solo lugar
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register/owner"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 flex items-center gap-2"
            >
              Crear Empresa
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register/member"
              className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg transition-all font-semibold"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Seguro y Confiable</h3>
            <p className="text-slate-600">
              Tus datos están protegidos con las mejores prácticas de seguridad
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Gestión de Equipos</h3>
            <p className="text-slate-600">
              Invita y administra a tu equipo fácilmente con links únicos
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Rápido y Eficiente</h3>
            <p className="text-slate-600">
              Interfaz moderna y rápida para gestionar tu organización
            </p>
          </div>
        </div>

        {/* CTA Sections */}
        <div className="grid md:grid-cols-2 gap-8 py-16">
          {/* Para Empresas */}
          <Link
            href="/register/owner"
            className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Para Empresas</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Crea tu organización y gestiona tu equipo de trabajo de forma profesional
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>Invita empleados por link único</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>Gestión completa de permisos</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <span>Dashboard de análisis</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg group-hover:gap-3 transition-all">
                Crear Empresa
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </Link>

          {/* Para Empleados */}
          <Link
            href="/register/member"
            className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-10 border-2 border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Para Empleados</h3>
              <p className="text-slate-600 mb-6 text-lg">
                Crea tu cuenta y únete cuando recibas una invitación de tu empresa
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Registro rápido y sencillo</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Acceso con link de invitación</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span>Dashboard personalizado</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-purple-600 font-bold text-lg group-hover:gap-3 transition-all">
                Crear Cuenta
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="py-12 border-t border-slate-200 text-center">
          <Logo size="md" showText href="/" />
          <p className="text-slate-600 mt-4">
            © 2025 Mi App. Plataforma Multi-Tenant Profesional
          </p>
        </div>
      </main>
    </div>
  )
}