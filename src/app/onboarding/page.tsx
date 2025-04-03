'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const specializations = [
  'Cryptography',
  'Web Exploitation',
  'Reverse Engineering',
  'Binary Exploitation',
  'Forensics',
  'OSINT'
];

const experienceLevels = ['Beginner', 'Intermediate', 'Expert'];

export default function Onboarding() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user?.user_metadata?.full_name || '',
    specializations: [] as string[],
    experienceLevel: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        username: formData.username,
        specialization: formData.specializations,
        experience_level: formData.experienceLevel,
        profile_image: user.user_metadata.avatar_url
      });

    if (!error) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-dark-navy p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-black/30 p-8 rounded-lg"
      >
        <h1 className="text-3xl font-bold text-text-light mb-8">Complete Your Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-light mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-3 rounded-lg bg-dark-navy border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-text-light mb-2">Specializations</label>
            <div className="grid grid-cols-2 gap-2">
              {specializations.map(spec => (
                <label key={spec} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(spec)}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        specializations: e.target.checked
                          ? [...prev.specializations, spec]
                          : prev.specializations.filter(s => s !== spec)
                      }));
                    }}
                    className="rounded"
                  />
                  <span className="text-text-light">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-text-light mb-2">Experience Level</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
              className="w-full p-3 rounded-lg bg-dark-navy border border-gray-700"
            >
              <option value="">Select Level</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-cyber-blue text-white p-3 rounded-lg hover:bg-cyber-blue/90 transition"
          >
            Complete Profile
          </button>
        </form>
      </motion.div>
    </div>
  );
}