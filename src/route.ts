import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
    }

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Exchange code for session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        return NextResponse.redirect(new URL('/login?error=session_error', request.url))
      }

      if (session) {
        // Check if user exists in users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found" error
          console.error('User data error:', userError)
          return NextResponse.redirect(new URL('/login?error=user_error', request.url))
        }

        // If user doesn't exist in users table, redirect to onboarding
        if (!userData) {
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // Existing user - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Fallback redirect if something goes wrong
    console.error('No code or session found')
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in callback:', error)
    return NextResponse.redirect(new URL('/login?error=unexpected', request.url))
  }
}