'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Edit2, Trophy } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    specialization: [] as string[],
    experience_level: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUser(data);
        setEditForm({
          username: data.username,
          specialization: data.specialization,
          experience_level: data.experience_level
        });
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update(editForm)
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, ...editForm });
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark-navy p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-black/30 rounded-lg p-8"
      >
        <div className="flex items-center gap-6">
          <Image
            src={user.profile_image || '/default-avatar.png'}
            alt={user.username}
            width={120}
            height={120}
            className="rounded-full"
          />
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                className="bg-dark-navy p-2 rounded text-2xl font-bold text-text-light"
              />
            ) : (
              <h1 className="text-3xl font-bold text-text-light">{user.username}</h1>
            )}
            
            <p className="text-gray-400 mt-2">{user.experience_level}</p>
            
            {currentUser?.id === user.id && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 flex items-center gap-2 text-cyber-blue"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Add more profile sections and editing capabilities */}
      </motion.div>
    </div>
  );
}