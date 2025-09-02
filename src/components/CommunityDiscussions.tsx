// Community discussions component
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiMessageSquare, FiUser, FiSend, FiBookmark, FiShare2 } from 'react-icons/fi';

interface Discussion {
  id: number;
  user_id: string;
  content_id: number | null;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
  content: {
    title: string;
  } | null;
  comment_count: number;
}

interface Comment {
  id: number;
  discussion_id: number;
  user_id: string;
  parent_comment_id: number | null;
  body: string;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
}

export default function CommunityDiscussions() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionBody, setNewDiscussionBody] = useState('');
  const [creatingDiscussion, setCreatingDiscussion] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  useEffect(() => {
    if (selectedDiscussion) {
      fetchComments(selectedDiscussion);
    }
  }, [selectedDiscussion]);

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select(`
          id,
          user_id,
          content_id,
          title,
          body,
          created_at,
          updated_at,
          profiles (username, avatar_url),
          content (title),
          comment_count
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (discussionId: number) => {
    try {
      const { data, error } = await supabase
        .from('discussion_comments')
        .select(`
          id,
          discussion_id,
          user_id,
          parent_comment_id,
          body,
          created_at,
          updated_at,
          profiles (username, avatar_url)
        `)
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createDiscussion = async () => {
    if (!user || !newDiscussionTitle.trim() || !newDiscussionBody.trim()) return;
    
    setCreatingDiscussion(true);
    
    try {
      const { error } = await supabase
        .from('discussions')
        .insert({
          user_id: user.id,
          title: newDiscussionTitle,
          body: newDiscussionBody
        });
      
      if (error) throw error;
      
      // Reset form
      setNewDiscussionTitle('');
      setNewDiscussionBody('');
      
      // Refresh discussions
      fetchDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
    } finally {
      setCreatingDiscussion(false);
    }
  };

  const postComment = async () => {
    if (!user || !selectedDiscussion || !newComment.trim()) return;
    
    setPostingComment(true);
    
    try {
      const { error } = await supabase
        .from('discussion_comments')
        .insert({
          discussion_id: selectedDiscussion,
          user_id: user.id,
          body: newComment
        });
      
      if (error) throw error;
      
      // Reset form
      setNewComment('');
      
      // Refresh comments
      fetchComments(selectedDiscussion);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setPostingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Discussions</h2>
      </div>
      
      {user && (
        <Card className="p-4">
          <h3 className="font-bold mb-3">Start a New Discussion</h3>
          <div className="mb-3">
            <input
              type="text"
              value={newDiscussionTitle}
              onChange={(e) => setNewDiscussionTitle(e.target.value)}
              placeholder="Discussion title"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
            />
            <textarea
              value={newDiscussionBody}
              onChange={(e) => setNewDiscussionBody(e.target.value)}
              placeholder="What would you like to discuss?"
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Button 
            onClick={createDiscussion}
            disabled={creatingDiscussion || !newDiscussionTitle.trim() || !newDiscussionBody.trim()}
            className="w-full"
          >
            {creatingDiscussion ? 'Creating...' : 'Create Discussion'}
          </Button>
        </Card>
      )}
      
      <div className="space-y-4">
        {discussions.map(discussion => (
          <Card 
            key={discussion.id} 
            className="p-4 cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => setSelectedDiscussion(discussion.id)}
          >
            <div className="flex items-start mb-3">
              <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                {discussion.profiles?.avatar_url ? (
                  <img 
                    src={discussion.profiles.avatar_url} 
                    alt={discussion.profiles.username || 'User'} 
                    className="rounded-full w-10 h-10"
                  />
                ) : (
                  <FiUser className="text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className="font-bold truncate">
                    {discussion.profiles?.username || 'Anonymous'}
                  </h4>
                  <span className="text-gray-500 text-sm whitespace-nowrap ml-2">
                    {formatDate(discussion.created_at)}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mt-1 mb-2">{discussion.title}</h3>
                
                <p className="text-gray-400 line-clamp-2 mb-3">
                  {discussion.body}
                </p>
                
                {discussion.content && (
                  <div className="inline-block bg-gray-700/50 px-2 py-1 rounded text-sm mb-3">
                    About: {discussion.content.title}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiMessageSquare className="mr-1" />
                    {discussion.comment_count || 0} comments
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-indigo-400">
                      <FiBookmark />
                    </button>
                    <button className="text-gray-500 hover:text-indigo-400">
                      <FiShare2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {selectedDiscussion && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Discussion</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDiscussion(null)}
              >
                Close
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {comments.map(comment => (
                <Card key={comment.id} className="mb-4 p-4">
                  <div className="flex items-start">
                    <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                      {comment.profiles?.avatar_url ? (
                        <img 
                          src={comment.profiles.avatar_url} 
                          alt={comment.profiles.username || 'User'} 
                          className="rounded-full w-8 h-8"
                        />
                      ) : (
                        <FiUser className="text-gray-400 text-sm" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold">
                          {comment.profiles?.username || 'Anonymous'}
                        </h4>
                        <span className="text-gray-500 text-sm">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mt-2">{comment.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {user && (
              <div className="p-4 border-t border-gray-800">
                <div className="flex">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mr-2"
                  />
                  <Button 
                    onClick={postComment}
                    disabled={postingComment || !newComment.trim()}
                  >
                    <FiSend />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}