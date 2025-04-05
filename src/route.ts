import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    await supabase.auth.exchangeCodeForSession(code)

    // Check if user exists in the users table
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      // If user doesn't exist in users table, redirect to onboarding
      if (!userData) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  // If user exists, redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url))
}