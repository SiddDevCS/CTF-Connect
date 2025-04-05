import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return NextResponse.redirect(new URL('/login?error=session', request.url));
      }

      if (session) {
        try {
          // Check if user exists in users table
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!userData) {
            // Create new user profile
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'user',
                specialization: [],
                experience_level: 'Beginner',
                profile_image: session.user.user_metadata.avatar_url,
                created_at: new Date().toISOString()
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
              return NextResponse.redirect(new URL('/onboarding', request.url));
            }
          }

          return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (error) {
          console.error('User profile error:', error);
          return NextResponse.redirect(new URL('/login?error=profile', request.url));
        }
      }
    }

    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/login?error=unknown', request.url));
  }
}