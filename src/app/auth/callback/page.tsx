'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Starting auth callback handling...');
        
        // Get the hash from the URL if present
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          console.error('URL contains error:', error, errorDescription);
          router.push('/login');
          return;
        }

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session check result:', session ? 'Session exists' : 'No session', sessionError);
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/login');
          return;
        }

        if (!session) {
          console.log('No session found, refreshing...');
          // Try to refresh the session
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Session refresh failed:', refreshError);
            router.push('/login');
            return;
          }
        }

        // Get the session again after potential refresh
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          console.error('Still no session after refresh');
          router.push('/login');
          return;
        }

        console.log('User ID:', currentSession.user.id);

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        console.log('Profile check result:', profile ? 'Profile exists' : 'No profile', profileError);

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
          router.push('/login');
          return;
        }

        if (!profile) {
          console.log('Redirecting to onboarding...');
          router.push('/onboarding');
        } else {
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
        }

      } catch (error) {
        console.error('Callback handling error:', error);
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-navy flex items-center justify-center">
      <div className="text-white">Completing authentication...</div>
    </div>
  );
}