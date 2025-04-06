'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-dark-navy flex items-center justify-center p-4"
    >
      <div className="bg-black/20 rounded-2xl p-8 max-w-md w-full border border-[#0095FF]/30">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#0095FF]/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#0095FF]" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            Verify Your Email
          </h1>
          
          <p className="text-gray-400 mb-6">
            We've sent a verification email to:<br />
            <span className="text-white font-medium">{email}</span>
          </p>
          
          <div className="space-y-4 w-full">
            <p className="text-sm text-gray-400">
              Please check your email and click the verification link to activate your account.
              The link will expire in 24 hours.
            </p>
            
            <div className="border-t border-gray-700 pt-4 mt-4">
              <p className="text-sm text-gray-400 mb-4">
                Didn't receive the email? Check your spam folder or try logging in again to resend the verification email.
              </p>
              
              <Link
                href="/login"
                className="block w-full bg-[#0095FF] text-white py-3 rounded-lg font-medium hover:bg-[#0095FF]/90 transition-colors text-center"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}