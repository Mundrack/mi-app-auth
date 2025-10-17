/**
 * Funciones de formateo de datos
 */

/**
 * Formatea una fecha a formato legible
 * @example formatDate('2024-01-15') => '15 de enero, 2024'
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }
  
  return new Intl.DateTimeFormat('es-ES', defaultOptions).format(dateObj)
}

/**
 * Formatea fecha relativa (hace X días)
 * @example formatRelativeTime('2024-01-10') => 'hace 5 días'
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
  }
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return `hace ${interval} ${unit}${interval > 1 ? 's' : ''}`
    }
  }
  
  return 'hace un momento'
}

/**
 * Genera slug desde texto
 * @example generateSlug('Mi Empresa S.A.') => 'mi-empresa-sa'
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
}

/**
 * Trunca texto largo
 * @example truncateText('Lorem ipsum...', 10) => 'Lorem ipsu...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitaliza primera letra
 * @example capitalize('hola mundo') => 'Hola mundo'
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Formatea nombre completo
 * @example formatFullName('  juan  ', '  pérez  ') => 'Juan Pérez'
 */
export function formatFullName(firstName: string, lastName?: string): string {
  const first = capitalize(firstName.trim())
  const last = lastName ? capitalize(lastName.trim()) : ''
  return [first, last].filter(Boolean).join(' ')
}

/**
 * Formatea número de teléfono
 * @example formatPhone('0987654321') => '098-765-4321'
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Obtiene iniciales de nombre
 * @example getInitials('Juan Pérez') => 'JP'
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Formatea tamaño de organización
 * @example formatOrgSize('51-200') => '51-200 empleados'
 */
export function formatOrgSize(size: string): string {
  if (size === '500+') return 'Más de 500 empleados'
  return `${size} empleados`
}

/**
 * Genera color aleatorio consistente para avatar
 * @example getAvatarColor('juan@email.com') => '#FF5733'
 */
export function getAvatarColor(seed: string): string {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#33FFF5',
    '#F5FF33', '#FF8C33', '#8C33FF', '#33FF8C', '#FF3333',
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}