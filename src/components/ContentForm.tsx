// Content management form component
'use client';

import { useState, useEffect } from 'react';
import { AdminService } from '@/services/admin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { FiBook, FiHeadphones, FiUpload } from 'react-icons/fi';

interface ContentFormProps {
  contentId?: number;
  onSuccess?: () => void;
}

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

export default function ContentForm({ contentId, onSuccess }: ContentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    content_type: 'ebook' as 'ebook' | 'audiobook',
    price: 0,
    author_id: 0,
    category_id: 0,
    publisher_id: 0,
    isbn: '',
    pages: 0,
    duration: 0,
    language: 'en',
    tags: '',
    is_active: true
  });
  
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    loadDropdownData();
    
    if (contentId) {
      loadContentData();
    }
  }, [contentId]);

  const loadDropdownData = async () => {
    try {
      const [authorsData, categoriesData, publishersData] = await Promise.all([
        AdminService.getAuthors(),
        AdminService.getCategories(),
        AdminService.getPublishers()
      ]);
      
      setAuthors(authorsData);
      setCategories(categoriesData);
      setPublishers(publishersData);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  const loadContentData = async () => {
    if (!contentId) return;
    
    try {
      const content = await AdminService.getContentById(contentId);
      if (content) {
        setFormData({
          title: content.title,
          subtitle: content.subtitle || '',
          description: content.description || '',
          content_type: content.content_type,
          price: content.price,
          author_id: content.author_id,
          category_id: content.category_id,
          publisher_id: content.publisher_id || 0,
          isbn: content.isbn || '',
          pages: content.pages || 0,
          duration: content.duration || 0,
          language: content.language || 'en',
          tags: content.tags?.join(', ') || '',
          is_active: content.is_active
        });
        
        if (content.cover_url) {
          setCoverPreview(content.cover_url);
        }
      }
    } catch (error) {
      console.error('Error loading content data:', error);
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const contentData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (contentId) {
        // Update existing content
        const result = await AdminService.updateContent(contentId, contentData);
        if (result) {
          alert('Content updated successfully');
          onSuccess?.();
        }
      } else {
        // Create new content
        const result = await AdminService.createContent(contentData);
        if (result) {
          alert('Content created successfully');
          // Reset form
          setFormData({
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
            is_active: true
          });
          setCoverPreview(null);
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">
        {contentId ? 'Edit Content' : 'Add New Content'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
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
            
            <div className="grid grid-cols-2 gap-4">
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
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Author"
                name="author_id"
                type="select"
                value={formData.author_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </Input>
              
              <Input
                label="Category"
                name="category_id"
                type="select"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Input>
            </div>
            
            <Input
              label="Publisher"
              name="publisher_id"
              type="select"
              value={formData.publisher_id}
              onChange={handleChange}
            >
              <option value="">Select Publisher</option>
              {publishers.map(publisher => (
                <option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </option>
              ))}
            </Input>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                {coverPreview ? (
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg w-32 h-48 flex items-center justify-center">
                    <FiBook className="text-gray-600 text-2xl" />
                  </div>
                )}
                
                <div>
                  <label className="cursor-pointer">
                    <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center">
                      <FiUpload className="inline mr-2" />
                      Upload
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-gray-400 text-sm mt-2">
                    JPG, PNG, or GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={formData.content_type === 'ebook' ? 'Pages' : 'Duration (seconds)'}
                name={formData.content_type === 'ebook' ? 'pages' : 'duration'}
                type="number"
                value={formData.content_type === 'ebook' ? formData.pages : formData.duration}
                onChange={handleChange}
              />
              
              <Input
                label="ISBN"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleChange}
              />
              
              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma-separated tags"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="ml-2 text-gray-300">
                Active (visible to users)
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (contentId ? 'Update Content' : 'Create Content')}
          </Button>
        </div>
      </form>
    </Card>
  );
}