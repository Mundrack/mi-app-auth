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

    // Obtener estadísticas
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: totalOrgs },
      { count: activeOrgs },
      { count: totalMemberships },
      { count: pendingInvitations }
    ] = await Promise.all([
      supabaseAdmin.from('dim_users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('dim_users').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('dim_organizations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('dim_organizations').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('fact_memberships').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('invitation_tokens').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    // Usuarios por rol
    const { data: roleStats } = await supabaseAdmin
      .from('fact_memberships')
      .select('role')

    const roleCount = {
      owner: roleStats?.filter(r => r.role === 'owner').length || 0,
      admin: roleStats?.filter(r => r.role === 'admin').length || 0,
      member: roleStats?.filter(r => r.role === 'member').length || 0
    }

    // Organizaciones creadas en los últimos 30 días
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: recentOrgs } = await supabaseAdmin
      .from('dim_organizations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString())

    return NextResponse.json({
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        inactive: (totalUsers || 0) - (activeUsers || 0)
      },
      organizations: {
        total: totalOrgs || 0,
        active: activeOrgs || 0,
        inactive: (totalOrgs || 0) - (activeOrgs || 0),
        recent: recentOrgs || 0
      },
      memberships: {
        total: totalMemberships || 0,
        owners: roleCount.owner,
        admins: roleCount.admin,
        members: roleCount.member
      },
      invitations: {
        pending: pendingInvitations || 0
      }
    })

  } catch (error: any) {
    console.error('Error getting stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}