'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Github } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const DiscordIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function Login() {
  const { signInWithProvider } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginStatus, setLoginStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setLoginStatus('Please verify your email before logging in.');
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
          return;
        }
        setLoginStatus(error.message);
        return;
      }

      if (data?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!userData) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      setLoginStatus('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-dark-navy flex items-center justify-center p-4"
    >
      <div className="bg-black/20 rounded-2xl overflow-hidden w-full max-w-4xl flex border border-[#0095FF]/30">
        {/* Left Side stays the same */}
        <div className="bg-[#0095FF] p-12 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Connect. Hack. Win.
          </h1>
          <p className="text-white/80 text-lg">
            Join the community and collaborate on innovative projects.
          </p>
        </div>

        {/* Right Side - Login Section */}
        <div className="p-12 flex-1 bg-black/40">
          <h2 className="text-2xl font-semibold text-white mb-8">
            Login
          </h2>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 rounded-lg border border-[#0095FF]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#0095FF] transition-colors"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-black/30 rounded-lg border border-[#0095FF]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#0095FF] transition-colors"
                />
              </div>

              {loginStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg text-sm bg-red-500/20 text-red-500"
                >
                  {loginStatus}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0095FF] text-white py-3 rounded-lg font-medium hover:bg-[#0095FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <p className="text-gray-400 text-sm text-center mb-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#0095FF] hover:underline">
              Register
            </Link>
          </p>

          <div className="space-y-3">
            <button
              onClick={() => signInWithProvider('github')}
              className="w-full flex items-center justify-center gap-3 bg-black/30 text-white p-3 rounded-lg hover:bg-[#0095FF]/20 transition-colors border border-[#0095FF]/30"
            >
              <Github size={20} />
              Continue with GitHub
            </button>
            
            <button
              onClick={() => signInWithProvider('discord')}
              className="w-full flex items-center justify-center gap-3 bg-black/30 text-white p-3 rounded-lg hover:bg-[#0095FF]/20 transition-colors border border-[#0095FF]/30"
            >
              <DiscordIcon />
              Continue with Discord
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}