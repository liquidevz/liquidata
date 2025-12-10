import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../../components/admin/ModernAdminLayout';
import { adminFetch } from '../../../utils/adminApi';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { 
  FiSave, 
  FiArrowLeft, 
  FiUpload,
  FiX,
  FiPlus
} from 'react-icons/fi';

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

export default function NewBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    featuredImage: string;
    status: string;
    featured: boolean;
  }>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: '',
    status: 'draft',
    featured: false
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminFetch('/api/admin/blog-categories');
      setCategories(response || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await adminFetch('/api/admin/blogs/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      setFormData(prev => ({ ...prev, featuredImage: response.imageUrl }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await adminFetch('/api/admin/blogs', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog:', error);
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>New Blog Post - Admin Dashboard</title>
      </Head>

      <ModernAdminLayout activeTab="BLOGS">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-3xl font-bold text-white">New Blog Post</h1>
                <p className="text-gray-400">Create a new blog article</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              <FiSave size={20} />
              {loading ? 'Saving...' : 'Save Blog Post'}
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* Basic Info */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter blog post title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      placeholder="Brief excerpt for listings and SEO"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content *
                    </label>
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      value={formData.content}
                      onEditorChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
                      init={{
                        height: 400,
                        menubar: false,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Tags</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Add tag"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTag}
                      className="px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      <FiPlus size={20} />
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              {/* Featured Image */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Featured Image</h3>
                
                {formData.featuredImage ? (
                  <div className="space-y-4">
                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-[#2a2b35] rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
                      <FiUpload size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400">Click to upload image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Category & Status */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-cyan-500 bg-[#0a0b0d] border-[#2a2b35] rounded focus:ring-cyan-500"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-300">
                      Featured blog post
                    </label>
                  </div>
                </div>
              </div>

              {/* Categories Management */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Available Categories</h3>
                
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-[#0a0b0d]"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-300">{category.name}</span>
                    </div>
                  ))}
                  
                  {categories.length === 0 && (
                    <p className="text-sm text-gray-500">No categories available</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModernAdminLayout>
    </>
  );
}
