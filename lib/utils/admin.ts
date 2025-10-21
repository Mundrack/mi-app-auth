/**
 * Utilidades para Super Admin
 * Validación y gestión de credenciales de admin
 */

/**
 * Verifica si un email es admin
 */
export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.error('ADMIN_EMAIL no está definido en .env.local')
    return false
  }
  return email.toLowerCase() === adminEmail.toLowerCase()
}

/**
 * Valida credenciales de admin
 * Para desarrollo: compara con variable de entorno
 * Para producción: usar hash bcrypt
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminEmail || !adminPassword) {
    console.error('Credenciales de admin no configuradas en .env.local')
    return false
  }
  
  // Validación simple (desarrollo)
  const isEmailValid = email.toLowerCase() === adminEmail.toLowerCase()
  const isPasswordValid = password === adminPassword
  
  return isEmailValid && isPasswordValid
}

/**
 * Verifica si el usuario actual es admin
 * (Usar en Server Components o API Routes)
 */
export async function checkIsAdmin(userId: string, userEmail: string): Promise<boolean> {
  // Verificar por email
  return isAdminEmail(userEmail)
}

/**
 * Middleware para proteger rutas de admin
 * Usar en API Routes
 */
export function requireAdmin(email: string) {
  if (!isAdminEmail(email)) {
    throw new Error('Unauthorized: Admin access required')
  }
}

// Constantes de admin
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/dashboard',
  '/admin/organizations',
  '/admin/users',
] as const

/**
 * Verifica si una ruta es de admin
 */
export function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}