'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import UserCard from '@/components/UserCard';
import { Search, Filter, LogOut } from 'lucide-react'; // Added LogOut icon

export default function Dashboard() {
  const { user, signOut } = useAuth(); // Added signOut from useAuth
  const [users, setUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: usersData } = await supabase
        .from('users')
        .select('*');
      
      const { data: connectionsData } = await supabase
        .from('connections')
        .select('*')
        .or(`user_id.eq.${user?.id},connected_user_id.eq.${user?.id}`);

      if (usersData) setUsers(usersData);
      if (connectionsData) {
        setConnections(new Set(connectionsData.map(c => 
          c.user_id === user?.id ? c.connected_user_id : c.user_id
        )));
      }
    };

    fetchUsers();

    // Set up real-time subscription for connections
    const subscription = supabase
      .channel('connections_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'connections' 
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
      u.specialization.includes(selectedSpecialization);
    const matchesLevel = !selectedLevel || u.experience_level === selectedLevel;
    return matchesSearch && matchesSpecialization && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-dark-navy p-6">

      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/30 rounded-lg text-text-light"
            />
          </div>
          
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="bg-black/30 rounded-lg px-4 py-2 text-text-light"
          >
            <option value="">All Specializations</option>
            <option value="Cryptography">Cryptography</option>
            <option value="Web Exploitation">Web Exploitation</option>
            <option value="Reverse Engineering">Reverse Engineering</option>
            {/* Add other specializations */}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-black/30 rounded-lg px-4 py-2 text-text-light"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              currentUserId={user?.id || ''}
              isConnected={connections.has(u.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}