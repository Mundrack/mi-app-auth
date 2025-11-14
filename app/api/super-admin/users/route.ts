import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar que sea super admin
    const { data: userData } = await supabaseAdmin
      .from('dim_users')
      .select('is_super_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_super_admin) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    // Obtener usuarios con sus organizaciones
    const { data: users, error } = await supabaseAdmin
      .from('dim_users')
      .select(`
        *,
        fact_memberships!inner(
          role,
          is_active,
          dim_organizations(id, name),
          dim_positions(title)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ users })

  } catch (error: any) {
    console.error('Error getting users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}