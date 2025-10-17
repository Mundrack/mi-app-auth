/**
 * Types generados desde el esquema de Supabase
 * Coincide con el modelo Snowflake Schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dim_users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dim_organizations: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      dim_locations: {
        Row: {
          id: string
          city: string
          state: string | null
          country: string
          postal_code: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          city: string
          state?: string | null
          country: string
          postal_code?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          city?: string
          state?: string | null
          country?: string
          postal_code?: string | null
          address?: string | null
          created_at?: string
        }
      }
      dim_industries: {
        Row: {
          id: string
          name: string
          category: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          description?: string | null
          created_at?: string
        }
      }
      dim_positions: {
        Row: {
          id: string
          title: string
          level: 'junior' | 'mid' | 'senior' | 'manager' | 'director' | 'executive'
          department: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          level: 'junior' | 'mid' | 'senior' | 'manager' | 'director' | 'executive'
          department?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          level?: 'junior' | 'mid' | 'senior' | 'manager' | 'director' | 'executive'
          department?: string | null
          created_at?: string
        }
      }
      fact_memberships: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          position_id: string | null
          role: 'owner' | 'admin' | 'member'
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          position_id?: string | null
          role: 'owner' | 'admin' | 'member'
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          position_id?: string | null
          role?: 'owner' | 'admin' | 'member'
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      fact_organization_details: {
        Row: {
          organization_id: string
          industry_id: string | null
          location_id: string | null
          size: '1-10' | '11-50' | '51-200' | '201-500' | '500+' | null
          website: string | null
          phone: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          organization_id: string
          industry_id?: string | null
          location_id?: string | null
          size?: '1-10' | '11-50' | '51-200' | '201-500' | '500+' | null
          website?: string | null
          phone?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          organization_id?: string
          industry_id?: string | null
          location_id?: string | null
          size?: '1-10' | '11-50' | '51-200' | '201-500' | '500+' | null
          website?: string | null
          phone?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fact_join_requests: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          position_id: string | null
          status: 'pending' | 'approved' | 'rejected'
          message: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          position_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          message?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          position_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          message?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          recipient_email: string
          email_type: string
          subject: string | null
          status: 'pending' | 'sent' | 'failed'
          error_message: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          recipient_email: string
          email_type: string
          subject?: string | null
          status?: 'pending' | 'sent' | 'failed'
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          recipient_email?: string
          email_type?: string
          subject?: string | null
          status?: 'pending' | 'sent' | 'failed'
          error_message?: string | null
          sent_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      v_organizations_full: {
        Row: {
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
          industry_category: string | null
          city: string | null
          state: string | null
          country: string | null
          address: string | null
          member_count: number
          created_at: string
          updated_at: string
        }
      }
      v_user_memberships: {
        Row: {
          user_id: string
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          organization_id: string
          organization_name: string
          organization_slug: string
          role: 'owner' | 'admin' | 'member'
          position_title: string | null
          position_level: string | null
          department: string | null
          start_date: string
          end_date: string | null
          is_active: boolean
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}