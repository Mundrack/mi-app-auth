import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Proteger rutas de super admin
  if (req.nextUrl.pathname.startsWith('/super-admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Verificar si es super admin
    const { data: user } = await supabase
      .from('dim_users')
      .select('is_super_admin')
      .eq('id', session.user.id)
      .single()

    if (!user?.is_super_admin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/super-admin/:path*'],
}