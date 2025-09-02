// Authors management component with fixed types
'use client';

import { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Author {
  id: number;
  name: string;
  bio: string;
  photo_url: string;
  website: string;
  created_at: string;
}

export default function AuthorsManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    photo_url: ''
  });

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const data = await AdminService.getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error('Error loading authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const newAuthor = await AdminService.createAuthor(formData);
      if (newAuthor) {
        setAuthors([...authors, newAuthor]);
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating author:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingAuthor) return;
    
    try {
      // For now, we'll just refresh the list since we don't have an update method for authors
      loadAuthors();
      resetForm();
      setEditingAuthor(null);
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this author?')) return;
    
    try {
      // For now, we'll just refresh the list since we don't have a delete method for authors
      loadAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      website: '',
      photo_url: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuthor) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3"></div>
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
        <h2 className="text-2xl font-bold">Authors Management</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <FiPlus className="mr-2" />
          {showForm ? 'Cancel' : 'Add Author'}
        </Button>
      </div>
      
      {showForm && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">
            {editingAuthor ? 'Edit Author' : 'Add New Author'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              placeholder="https://example.com"
            />
            
            <Input
              label="Photo URL"
              value={formData.photo_url}
              onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
            
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAuthor(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingAuthor ? 'Update Author' : 'Create Author'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Card key={author.id} className="p-4">
            <div className="flex items-start">
              {author.photo_url ? (
                <img 
                  src={author.photo_url} 
                  alt={author.name} 
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
              ) : (
                <div className="bg-gray-700 rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                  <div className="text-2xl font-bold">
                    {author.name.charAt(0)}
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-bold">{author.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {author.bio}
                </p>
                
                {author.website && (
                  <a 
                    href={author.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm block mt-1"
                  >
                    Website
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingAuthor(author);
                    setFormData({
                      name: author.name,
                      bio: author.bio || '',
                      website: author.website || '',
                      photo_url: author.photo_url || ''
                    });
                    setShowForm(true);
                  }}
                >
                  <FiEdit />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(author.id)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}