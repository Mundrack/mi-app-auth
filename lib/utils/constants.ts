import type { Database } from './database'

// Alias para las tablas
export type User = Database['public']['Tables']['dim_users']['Row']
export type Organization = Database['public']['Tables']['dim_organizations']['Row']
export type Membership = Database['public']['Tables']['fact_memberships']['Row']
export type JoinRequest = Database['public']['Tables']['fact_join_requests']['Row']
export type Industry = Database['public']['Tables']['dim_industries']['Row']
export type Position = Database['public']['Tables']['dim_positions']['Row']
export type Location = Database['public']['Tables']['dim_locations']['Row']

// Tipos de rol
export type UserRole = 'owner' | 'admin' | 'member' | 'super_admin'

// Tipos de estado
export type RequestStatus = 'pending' | 'approved' | 'rejected'

// Datos completos de usuario con organización
export interface UserWithOrganization extends User {
  organization?: Organization
  membership?: Membership
  position?: Position
}

// Datos completos de organización
export interface OrganizationFull {
  id: string
  name: string
  slug: string
  logo_url: string | null
  is_active: boolean
  size: string | null
  website: string | null
  phone: string | null
  description: string | null
  industry_name: string | null
  city: string | null
  country: string | null
  member_count: number
  created_at: string
}

// Solicitud con datos de usuario
export interface JoinRequestWithUser extends JoinRequest {
  user?: User
  position?: Position
}

// Formulario de registro Owner
export interface RegisterOwnerForm {
  // Datos personales
  full_name: string
  email: string
  password: string
  phone?: string
  // Datos de organización
  organization_name: string
  industry_id: string
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+'
  city: string
  country: string
  website?: string
}

// Formulario de registro Member
export interface RegisterMemberForm {
  full_name: string
  email: string
  phone?: string
  organizations: {
    organization_id: string
    position_id: string
    message?: string
  }[]
}

// Props comunes de componentes
export interface PageProps {
  params: { [key: string]: string }
  searchParams: { [key: string]: string | string[] | undefined }
}