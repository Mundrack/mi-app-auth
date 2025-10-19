import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerSupabaseClient()
    
    // Intercambiar el código por una sesión
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir al dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}