// Reading challenges component
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiBook, FiTarget, FiCalendar, FiCheckCircle } from 'react-icons/fi';

interface Challenge {
  id: number;
  name: string;
  description: string;
  target_books: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface ChallengeProgress {
  id: number;
  challenge_id: number;
  user_id: string;
  books_read: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function ReadingChallenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<ChallengeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningChallenge, setJoiningChallenge] = useState<number | null>(null);
  const [completingChallenge, setCompletingChallenge] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchChallenges();
      fetchUserProgress();
    }
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const joinChallenge = async (challengeId: number) => {
    if (!user) return;
    
    setJoiningChallenge(challengeId);
    
    try {
      const { error } = await supabase
        .from('challenge_progress')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          books_read: 0,
          completed: false
        });
      
      if (error) throw error;
      
      // Refresh progress
      fetchUserProgress();
    } catch (error) {
      console.error('Error joining challenge:', error);
    } finally {
      setJoiningChallenge(null);
    }
  };

  const incrementProgress = async (progressId: number, challengeId: number) => {
    if (!user) return;
    
    const progress = userProgress.find(p => p.id === progressId);
    if (!progress) return;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;
    
    // Check if already completed
    if (progress.completed) return;
    
    const newBooksRead = progress.books_read + 1;
    const completed = newBooksRead >= challenge.target_books;
    
    try {
      const { error } = await supabase
        .from('challenge_progress')
        .update({
          books_read: newBooksRead,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', progressId);
      
      if (error) throw error;
      
      // Refresh progress
      fetchUserProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(challenge => {
    const now = new Date();
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    return now >= start && now <= end;
  });

  const userActiveChallenges = userProgress.filter(progress => {
    const challenge = challenges.find(c => c.id === progress.challenge_id);
    if (!challenge) return false;
    
    const now = new Date();
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    return now >= start && now <= end;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reading Challenges</h2>
        <Button variant="secondary">
          <FiTarget className="mr-2" />
          Create Challenge
        </Button>
      </div>
      
      {userActiveChallenges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Your Active Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userActiveChallenges.map(progress => {
              const challenge = challenges.find(c => c.id === progress.challenge_id);
              if (!challenge) return null;
              
              const progressPercentage = Math.min(
                (progress.books_read / challenge.target_books) * 100,
                100
              );
              
              return (
                <Card key={progress.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg">{challenge.name}</h4>
                    {progress.completed ? (
                      <FiCheckCircle className="text-green-500 text-xl" />
                    ) : (
                      <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>
                        {progress.books_read} of {challenge.target_books} books
                      </span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      <FiCalendar className="inline mr-1" />
                      {getDaysRemaining(challenge.end_date)} days left
                    </div>
                    
                    {!progress.completed && (
                      <Button 
                        size="sm"
                        onClick={() => incrementProgress(progress.id, challenge.id)}
                        disabled={progress.books_read >= challenge.target_books}
                      >
                        Book Completed
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold mb-4">
          {activeChallenges.length > 0 ? 'Available Challenges' : 'No Active Challenges'}
        </h3>
        
        {activeChallenges.length === 0 ? (
          <Card className="text-center py-8">
            <FiBook className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              There are no active challenges right now. Check back later!
            </p>
            <Button variant="secondary">Suggest a Challenge</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChallenges.map(challenge => {
              const userProgressItem = userProgress.find(
                p => p.challenge_id === challenge.id
              );
              
              return (
                <Card key={challenge.id} className="p-4">
                  <h4 className="font-bold text-lg mb-2">{challenge.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <FiTarget className="mr-2" />
                    Goal: {challenge.target_books} books
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <FiCalendar className="mr-2" />
                    {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
                  </div>
                  
                  {userProgressItem ? (
                    userProgressItem.completed ? (
                      <div className="text-green-500 flex items-center">
                        <FiCheckCircle className="mr-2" />
                        Challenge completed!
                      </div>
                    ) : (
                      <div className="text-indigo-400">
                        Already joined - {userProgressItem.books_read} books read
                      </div>
                    )
                  ) : (
                    <Button 
                      onClick={() => joinChallenge(challenge.id)}
                      disabled={joiningChallenge === challenge.id}
                      className="w-full"
                    >
                      {joiningChallenge === challenge.id ? 'Joining...' : 'Join Challenge'}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}