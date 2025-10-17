import { z } from 'zod'

/**
 * Esquemas de validación con Zod
 * Usar en formularios y API routes
 */

// Validación de email
export const emailSchema = z
  .string()
  .email('Email inválido')
  .min(1, 'Email requerido')

// Validación de password
export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener una mayúscula')
  .regex(/[a-z]/, 'Debe contener una minúscula')
  .regex(/[0-9]/, 'Debe contener un número')

// Validación de teléfono (opcional)
export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, 'Teléfono debe tener 10 dígitos')
  .optional()
  .or(z.literal(''))

// Schema de registro Owner
export const registerOwnerSchema = z.object({
  // Datos personales
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  
  // Datos de organización
  organization_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  industry_id: z.string().uuid('Selecciona una industria'),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']),
  city: z.string().min(2, 'Mínimo 2 caracteres'),
  country: z.string().min(2, 'Mínimo 2 caracteres'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

// Schema de registro Member
export const registerMemberSchema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: emailSchema,
  phone: phoneSchema,
  organizations: z.array(
    z.object({
      organization_id: z.string().uuid(),
      position_id: z.string().uuid(),
      message: z.string().max(500).optional(),
    })
  ).min(1, 'Selecciona al menos una organización'),
})

// Schema de login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password requerido'),
})

// Schema de actualizar perfil
export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: phoneSchema,
  avatar_url: z.string().url().optional().or(z.literal('')),
})

// Schema de crear solicitud
export const createRequestSchema = z.object({
  organization_id: z.string().uuid(),
  position_id: z.string().uuid(),
  message: z.string().max(500).optional(),
})

// Schema de aprobar/rechazar solicitud
export const reviewRequestSchema = z.object({
  request_id: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
})

// Schema de crear organización
export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  industry_id: z.string().uuid(),
  location_id: z.string().uuid(),
  size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']),
  website: z.string().url().optional().or(z.literal('')),
  phone: phoneSchema,
  description: z.string().max(500).optional(),
})

// Helper: Validar y retornar errores
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string> = {}
  result.error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  
  return { success: false, errors }
}