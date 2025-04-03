'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Github, MessageSquare } from 'lucide-react'; // Using MessageSquare instead, or you can use any other icon
import { motion } from 'framer-motion';

export default function Login() {
  const { signInWithProvider } = useAuth();

  return (
    <div className="min-h-screen bg-dark-navy flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/30 p-8 rounded-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-text-light mb-8 text-center">
          Welcome to CTF Connect
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={() => signInWithProvider('github')}
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white p-3 rounded-lg hover:bg-[#24292F]/90 transition"
          >
            <Github size={20} />
            Continue with GitHub
          </button>
          
          <button
            onClick={() => signInWithProvider('discord')}
            className="w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white p-3 rounded-lg hover:bg-[#5865F2]/90 transition"
          >
            <MessageSquare size={20} /> {/* Using MessageSquare as a temporary replacement */}
            Continue with Discord
          </button>
        </div>
      </motion.div>
    </div>
  );
}