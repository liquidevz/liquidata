import React, { useState } from 'react';
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

export default function NewCaseStudy() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    excerpt: string;
    client: string;
    industry: string;
    projectType: string;
    duration: string;
    teamSize: string;
    technologies: string[];
    featuredImage: string;
    liveUrl: string;
    githubUrl: string;
    status: string;
    featured: boolean;
    content: string;
    metrics: Array<{ label: string; value: string; description: string }>;
  }>({
    title: '',
    subtitle: '',
    description: '',
    excerpt: '',
    client: '',
    industry: '',
    projectType: '',
    duration: '',
    teamSize: '',
    technologies: [],
    featuredImage: '',
    liveUrl: '',
    githubUrl: '',
    status: 'draft',
    featured: false,
    content: '',
    metrics: []
  });

  const [newTech, setNewTech] = useState('');
  const [newMetric, setNewMetric] = useState({ label: '', value: '', description: '' });

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
      const response = await adminFetch('/api/admin/case-studies/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      setFormData(prev => ({ ...prev, featuredImage: response.imageUrl }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    }
  };

  const addTechnology = () => {
    if (newTech.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addMetric = () => {
    if (newMetric.label && newMetric.value) {
      setFormData(prev => ({
        ...prev,
        metrics: [...prev.metrics, { ...newMetric }]
      }));
      setNewMetric({ label: '', value: '', description: '' });
    }
  };

  const removeMetric = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.client || !formData.industry) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await adminFetch('/api/admin/case-studies', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      router.push('/admin/case-studies');
    } catch (error) {
      console.error('Failed to create case study:', error);
      alert('Failed to create case study');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>New Case Study - Admin Dashboard</title>
      </Head>

      <ModernAdminLayout activeTab="CASE STUDIES">
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
                <h1 className="text-3xl font-bold text-white">New Case Study</h1>
                <p className="text-gray-400">Create a new portfolio case study</p>
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
              {loading ? 'Saving...' : 'Save Case Study'}
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
                      placeholder="Enter case study title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      placeholder="Enter project description"
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
                      placeholder="Brief excerpt for listings"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Project Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client *
                    </label>
                    <input
                      type="text"
                      name="client"
                      value={formData.client}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Industry type"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type *
                    </label>
                    <input
                      type="text"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g., Web Application"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g., 3 months"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Size
                    </label>
                    <input
                      type="text"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g., 5 developers"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Detailed Content</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content
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

              {/* Technologies */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Technologies</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      className="flex-1 px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Add technology"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTechnology}
                      className="px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                    >
                      <FiPlus size={20} />
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
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

              {/* Status & Settings */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                
                <div className="space-y-4">
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
                      Featured case study
                    </label>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModernAdminLayout>
    </>
  );
}
