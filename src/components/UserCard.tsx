'use client';

import { User } from '@/types';
import { motion } from 'framer-motion';
import { MessageSquare, UserPlus, Check } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UserCardProps {
  user: User;
  currentUserId: string;
  isConnected?: boolean;
}

export default function UserCard({ user, currentUserId, isConnected }: UserCardProps) {
  const [isPending, setIsPending] = useState(false);

  const handleConnect = async () => {
    if (isConnected || user.id === currentUserId) return;
    
    setIsPending(true);
    const { error } = await supabase
      .from('connections')
      .insert({
        user_id: currentUserId,
        connected_user_id: user.id,
        status: 'pending'
      });
    setIsPending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 p-6 rounded-lg"
    >
      <div className="flex items-center gap-4">
        <Image
          src={user.profile_image || '/default-avatar.png'}
          alt={user.username}
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-text-light">{user.username}</h3>
          <p className="text-gray-400">{user.experience_level}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {user.specialization.map((spec) => (
            <span
              key={spec}
              className="bg-cyber-blue/20 text-cyber-blue px-3 py-1 rounded-full text-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleConnect}
          disabled={isConnected || user.id === currentUserId || isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isConnected
              ? 'bg-green-500/20 text-green-500'
              : 'bg-cyber-blue hover:bg-cyber-blue/90 text-white'
          }`}
        >
          {isConnected ? (
            <>
              <Check size={18} />
              Connected
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Connect
            </>
          )}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition">
          <MessageSquare size={18} />
          Message
        </button>
      </div>
    </motion.div>
  );
}