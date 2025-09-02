// User profile component with social features
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiUser, FiBook, FiUsers, FiSettings, FiEdit } from 'react-icons/fi';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  reading_goal: number;
  books_read: number;
}

interface UserActivity {
  id: number;
  activity_type: string;
  activity_data: any;
  created_at: string;
}

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchActivities();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setEditForm({
        username: data.username || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
        website: data.website || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username,
          full_name: editForm.full_name,
          bio: editForm.bio,
          website: editForm.website,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile({
        ...profile,
        ...editForm
      } as UserProfile);
      
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-800 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="h-64 bg-gray-800 rounded-xl"></div>
              </div>
              <div className="md:col-span-2">
                <div className="h-96 bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 pt-24">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <p className="text-gray-400 mb-6">Please complete your profile setup</p>
          <Button variant="secondary">Create Profile</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 pt-24">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="bg-gray-700 rounded-full w-32 h-32 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username} 
                  className="rounded-full w-32 h-32"
                />
              ) : (
                <FiUser className="text-6xl text-gray-400" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    {profile.full_name || profile.username}
                  </h1>
                  {profile.username && profile.username !== profile.full_name && (
                    <p className="text-gray-400">@{profile.username}</p>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setEditing(!editing)}
                  className="mt-4 md:mt-0"
                >
                  <FiEdit className="mr-2" />
                  {editing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={editForm.website}
                      onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <Button onClick={updateProfile} className="w-full">
                    Save Changes
                  </Button>
                </div>
              ) : (
                <>
                  {profile.bio && (
                    <p className="text-gray-300 mb-4">{profile.bio}</p>
                  )}
                  
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center mb-4"
                    >
                      {profile.website}
                    </a>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{profile.books_read || 0}</p>
                      <p className="text-gray-400">Books Read</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {profile.reading_goal ? `${Math.round((profile.books_read || 0) / profile.reading_goal * 100)}%` : '0%'}
                      </p>
                      <p className="text-gray-400">of Goal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-gray-400">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">42</p>
                      <p className="text-gray-400">Followers</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <FiBook className="text-4xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex items-start pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                      <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                        <FiBook className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.activity_type === 'book_added' && 'Added a book to library'}
                          {activity.activity_type === 'book_finished' && 'Finished reading a book'}
                          {activity.activity_type === 'review_added' && 'Wrote a review'}
                          {activity.activity_type === 'challenge_joined' && 'Joined a reading challenge'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
          
          <div>
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Reading Goal</h2>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="8"
                      strokeDasharray={`${(profile.books_read || 0) / (profile.reading_goal || 1) * 283} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{profile.books_read || 0}</span>
                    <span className="text-gray-400 text-sm">of {profile.reading_goal || 12}</span>
                  </div>
                </div>
                <Button variant="secondary" className="w-full">
                  Update Goal
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <FiBook className="text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-400">Achievement {i}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}