// Content creation/editing page
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiBook, FiHeadphones, FiUpload, FiSave, FiX } from 'react-icons/fi';

interface Author {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Publisher {
  id: number;
  name: string;
}

interface ContentFormData {
  title: string;
  subtitle: string;
  description: string;
  content_type: 'ebook' | 'audiobook';
  price: number;
  author_id: number;
  category_id: number;
  publisher_id: number;
  isbn: string;
  pages: number;
  duration: number;
  language: string;
  tags: string;
  is_active: boolean;
  cover_url: string;
}

export default function ContentForm() {
  const router = useRouter();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    subtitle: '',
    description: '',
    content_type: 'ebook',
    price: 0,
    author_id: 0,
    category_id: 0,
    publisher_id: 0,
    isbn: '',
    pages: 0,
    duration: 0,
    language: 'en',
    tags: '',
    is_active: true,
    cover_url: ''
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch dropdown data
      const [authorsRes, categoriesRes, publishersRes] = await Promise.all([
        supabase.from('authors').select('id, name').order('name'),
        supabase.from('categories').select('id, name').order('name'),
        supabase.from('publishers').select('id, name').order('name')
      ]);

      if (authorsRes.error) throw authorsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (publishersRes.error) throw publishersRes.error;

      setAuthors(authorsRes.data || []);
      setCategories(categoriesRes.data || []);
      setPublishers(publishersRes.data || []);

      // If editing, fetch content data
      if (isEditMode && id) {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title,
            subtitle: data.subtitle || '',
            description: data.description || '',
            content_type: data.content_type,
            price: data.price,
            author_id: data.author_id,
            category_id: data.category_id,
            publisher_id: data.publisher_id || 0,
            isbn: data.isbn || '',
            pages: data.pages || 0,
            duration: data.duration || 0,
            language: data.language || 'en',
            tags: data.tags?.join(', ') || '',
            is_active: data.is_active,
            cover_url: data.cover_url || ''
          });

          if (data.cover_url) {
            setCoverPreview(data.cover_url);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
        // In a real implementation, you would upload the file to storage
        // and set the cover_url to the storage URL
        setFormData(prev => ({ ...prev, cover_url: 'temp-preview-url' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const contentData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (isEditMode) {
        // Update existing content
        const { error } = await supabase
          .from('content')
          .update({
            ...contentData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('content')
          .insert([contentData]);

        if (error) throw error;
      }

      router.push('/admin/content');
      router.refresh();
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 h-96"></div>
            <div className="bg-gray-800/50 rounded-lg p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Content' : 'Add New Content'}
          </h1>
          <p className="text-gray-400">
            {isEditMode ? 'Update existing content' : 'Create new book or audiobook'}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => router.push('/admin/content')}
        >
          <FiX className="mr-2" />
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Basic info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Basic Information</h2>
              
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              
              <Input
                label="Subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
              />
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Content Type"
                  name="content_type"
                  type="select"
                  value={formData.content_type}
                  onChange={handleChange}
                >
                  <option value="ebook">Ebook</option>
                  <option value="audiobook">Audiobook</option>
                </Input>
                
                <Input
                  label="Price ($)"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price.toString()}
                  onChange={handleChange}
                  required
                />
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Content Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Author"
                  name="author_id"
                  type="select"
                  value={formData.author_id.toString()}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Author</option>
                  {authors.map(author => (
                    <option key={author.id} value={author.id.toString()}>
                      {author.name}
                    </option>
                  ))}
                </Input>
                
                <Input
                  label="Category"
                  name="category_id"
                  type="select"
                  value={formData.category_id.toString()}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </Input>
              </div>
              
              <Input
                label="Publisher"
                name="publisher_id"
                type="select"
                value={formData.publisher_id.toString()}
                onChange={handleChange}
              >
                <option value="">Select Publisher</option>
                {publishers.map(publisher => (
                  <option key={publisher.id} value={publisher.id.toString()}>
                    {publisher.name}
                  </option>
                ))}
              </Input>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="ISBN"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                />
                
                {formData.content_type === 'ebook' ? (
                  <Input
                    label="Pages"
                    name="pages"
                    type="number"
                    value={formData.pages.toString()}
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    label="Duration (seconds)"
                    name="duration"
                    type="number"
                    value={formData.duration.toString()}
                    onChange={handleChange}
                  />
                )}
                
                <Input
                  label="Language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
              
              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma-separated tags"
              />
            </Card>
          </div>
          
          {/* Right column - Media and settings */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Cover Image</h2>
              
              <div className="mb-4">
                {coverPreview ? (
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg w-full h-64 flex items-center justify-center">
                    <FiBook className="text-gray-600 text-4xl" />
                  </div>
                )}
              </div>
              
              <label className="cursor-pointer">
                <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center">
                  <FiUpload className="inline mr-2" />
                  Upload Cover
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              
              <p className="text-gray-400 text-sm mt-2 text-center">
                JPG, PNG, or GIF (max 5MB)
              </p>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Active Status</h3>
                  <p className="text-gray-400 text-sm">
                    Make this content available to users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </Card>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/admin/content')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}