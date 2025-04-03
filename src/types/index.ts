export type User = {
    id: string;
    username: string;
    specialization: string[];
    experience_level: 'Beginner' | 'Intermediate' | 'Expert';
    profile_image?: string;
    created_at: string;
  };
  
  export type Connection = {
    id: string;
    user_id: string;
    connected_user_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
  };