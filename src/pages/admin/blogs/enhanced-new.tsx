import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../../components/admin/ModernAdminLayout';
import { FormField, FormSection, TagInput, ImageUpload, FormActions } from '../../../components/admin/forms';
import { adminFetch } from '../../../utils/adminApi';
import { motion } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { 
  FiFileText, 
  FiSettings,
  FiImage,
  FiTag,
  FiEdit3,
  FiEye,
  FiCalendar
} from 'react-icons/fi';

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: string;
  featured: boolean;
}

export default function EnhancedNewBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: '',
    status: 'draft',
    featured: false
  });

  const tagSuggestions = [
    'Web Development', 'Mobile Apps', 'UI/UX Design', 'React', 'Next.js',
    'Node.js', 'JavaScript', 'TypeScript', 'API Development', 'Database',
    'Cloud Computing', 'DevOps', 'Security', 'Performance', 'SEO'
  ];

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 20) {
      newErrors.excerpt = 'Excerpt must be at least 20 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    const response = await adminFetch('/api/admin/blogs/upload', {
      method: 'POST',
      body: formDataUpload,
    });
    
    return response.imageUrl;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await adminFetch('/api/admin/blogs', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Failed to create blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <Head>
        <title>Create New Blog Post - Admin Dashboard</title>
      </Head>

      <ModernAdminLayout activeTab="BLOGS">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                <FiEdit3 size={24} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Create New Blog Post</h1>
                <p className="text-gray-400">Share your insights with the world</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information */}
              <FormSection
                title="Basic Information"
                description="The core details of your blog post"
                icon={<FiFileText size={20} />}
              >
                <div className="space-y-6">
                  <FormField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={(value) => updateFormData('title', value)}
                    placeholder="Enter an engaging title for your blog post"
                    required
                    error={errors.title}
                    success={formData.title.length >= 5 && !errors.title}
                    hint="A good title is clear, descriptive, and under 60 characters"
                  />

                  <FormField
                    label="Excerpt"
                    name="excerpt"
                    type="textarea"
                    value={formData.excerpt}
                    onChange={(value) => updateFormData('excerpt', value)}
                    placeholder="Write a compelling excerpt that summarizes your post"
                    required
                    rows={4}
                    error={errors.excerpt}
                    success={formData.excerpt.length >= 20 && !errors.excerpt}
                    hint="This appears in search results and social media previews"
                  />
                </div>
              </FormSection>

              {/* Content */}
              <FormSection
                title="Content"
                description="The main body of your blog post"
                icon={<FiEdit3 size={20} />}
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Content *
                  </label>
                  <div className="border border-[#2a2b35] rounded-lg overflow-hidden">
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      value={formData.content}
                      onEditorChange={(content: string) => updateFormData('content', content)}
                      init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'help', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #0a0b0d; color: #ffffff; }',
                        skin: 'oxide-dark',
                        content_css: 'dark'
                      }}
                    />
                  </div>
                  {errors.content && (
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <FiEdit3 size={14} />
                      {errors.content}
                    </p>
                  )}
                </div>
              </FormSection>

              {/* Tags */}
              <FormSection
                title="Tags"
                description="Help readers discover your content"
                icon={<FiTag size={20} />}
              >
                <TagInput
                  label="Blog Tags"
                  tags={formData.tags}
                  onChange={(tags) => updateFormData('tags', tags)}
                  suggestions={tagSuggestions}
                  maxTags={10}
                  placeholder="Add relevant tags to improve discoverability"
                />
              </FormSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <FormSection
                title="Featured Image"
                description="Visual representation of your post"
                icon={<FiImage size={20} />}
              >
                <ImageUpload
                  label="Upload Image"
                  value={formData.featuredImage}
                  onChange={(url) => updateFormData('featuredImage', url)}
                  onUpload={handleImageUpload}
                  placeholder="Upload a featured image"
                  maxSize={5}
                />
              </FormSection>

              {/* Settings */}
              <FormSection
                title="Publication Settings"
                description="Control how and when your post is published"
                icon={<FiSettings size={20} />}
              >
                <div className="space-y-6">
                  <FormField
                    label="Category"
                    name="category"
                    type="select"
                    value={formData.category}
                    onChange={(value) => updateFormData('category', value)}
                    placeholder="Select a category"
                    required
                    error={errors.category}
                    options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                  />

                  <FormField
                    label="Status"
                    name="status"
                    type="select"
                    value={formData.status}
                    onChange={(value) => updateFormData('status', value)}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'published', label: 'Published' },
                      { value: 'archived', label: 'Archived' }
                    ]}
                    icon={<FiCalendar size={16} />}
                  />

                  <div className="flex items-center gap-3 p-4 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => updateFormData('featured', e.target.checked)}
                      className="w-5 h-5 text-cyan-500 bg-[#252630] border-gray-600 rounded focus:ring-2 focus:ring-cyan-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-300 cursor-pointer flex-1">
                      Featured Post
                      <p className="text-xs text-gray-500 mt-1">
                        Featured posts appear prominently on the blog homepage
                      </p>
                    </label>
                  </div>
                </div>
              </FormSection>

              {/* Preview */}
              <FormSection
                title="Quick Preview"
                description="How your post will appear"
                icon={<FiEye size={20} />}
                collapsible
                defaultExpanded={false}
              >
                <div className="space-y-4">
                  <div className="p-4 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg">
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
                      {formData.title || 'Your blog title will appear here'}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {formData.excerpt || 'Your excerpt will appear here...'}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      {formData.category && (
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {formData.category}
                        </span>
                      )}
                      {formData.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          {/* Form Actions */}
          <FormActions
            onSave={handleSave}
            onCancel={handleCancel}
            saving={loading}
            saveText="Publish Blog Post"
            cancelText="Cancel"
            disabled={Object.keys(errors).length > 0}
          />
        </div>
      </ModernAdminLayout>
    </>
  );
}