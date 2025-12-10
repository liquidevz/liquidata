import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../../components/admin/ModernAdminLayout';
import { FormField, FormSection, TagInput, ImageUpload, FormActions } from '../../../components/admin/forms';
import { adminFetch } from '../../../utils/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Editor } from '@tinymce/tinymce-react';
import { 
  FiStar, 
  FiSettings,
  FiImage,
  FiCode,
  FiBarChart,
  FiLink,
  FiPlus,
  FiX,
  FiTrendingUp
} from 'react-icons/fi';

interface FormData {
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
}

interface Metric {
  label: string;
  value: string;
  description: string;
}

export default function EnhancedNewCaseStudy() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
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

  const [newMetric, setNewMetric] = useState<Metric>({ label: '', value: '', description: '' });

  const techSuggestions = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Docker',
    'Kubernetes', 'TypeScript', 'JavaScript', 'Python', 'Java',
    'GraphQL', 'REST API', 'Microservices', 'Tailwind CSS', 'SCSS'
  ];

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'other', label: 'Other' }
  ];

  const projectTypeOptions = [
    { value: 'web-app', label: 'Web Application' },
    { value: 'mobile-app', label: 'Mobile Application' },
    { value: 'website', label: 'Website' },
    { value: 'api', label: 'API Development' },
    { value: 'desktop-app', label: 'Desktop Application' },
    { value: 'consulting', label: 'Consulting Project' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type';
    }

    if (formData.liveUrl && !isValidUrl(formData.liveUrl)) {
      newErrors.liveUrl = 'Please enter a valid URL';
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    const response = await adminFetch('/api/admin/case-studies/upload', {
      method: 'POST',
      body: formDataUpload,
    });
    
    return response.imageUrl;
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

  const updateMetric = (field: keyof Metric, value: string) => {
    setNewMetric(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await adminFetch('/api/admin/case-studies', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      router.push('/admin/case-studies');
    } catch (error) {
      console.error('Failed to create case study:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <Head>
        <title>Create New Case Study - Admin Dashboard</title>
      </Head>

      <ModernAdminLayout activeTab="CASE STUDIES">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 flex items-center justify-center">
                <FiStar size={24} className="text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Create New Case Study</h1>
                <p className="text-gray-400">Showcase your amazing project</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information */}
              <FormSection
                title="Project Overview"
                description="Core information about your project"
                icon={<FiStar size={20} />}
              >
                <div className="space-y-6">
                  <FormField
                    label="Project Title"
                    name="title"
                    value={formData.title}
                    onChange={(value) => updateFormData('title', value)}
                    placeholder="Enter a compelling project title"
                    required
                    error={errors.title}
                    success={formData.title.length > 0 && !errors.title}
                  />

                  <FormField
                    label="Subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={(value) => updateFormData('subtitle', value)}
                    placeholder="A brief tagline for your project"
                    hint="Optional: A catchy subtitle that complements the title"
                  />

                  <FormField
                    label="Project Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={(value) => updateFormData('description', value)}
                    placeholder="Describe what this project is about and what problems it solves"
                    required
                    rows={4}
                    error={errors.description}
                    success={formData.description.length > 0 && !errors.description}
                  />

                  <FormField
                    label="Excerpt"
                    name="excerpt"
                    type="textarea"
                    value={formData.excerpt}
                    onChange={(value) => updateFormData('excerpt', value)}
                    placeholder="A brief summary for listings and previews"
                    rows={3}
                    hint="This appears in case study listings and search results"
                  />
                </div>
              </FormSection>

              {/* Project Details */}
              <FormSection
                title="Project Details"
                description="Specific information about the project scope and execution"
                icon={<FiBarChart size={20} />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Client"
                    name="client"
                    value={formData.client}
                    onChange={(value) => updateFormData('client', value)}
                    placeholder="Client or company name"
                    required
                    error={errors.client}
                    success={formData.client.length > 0 && !errors.client}
                  />

                  <FormField
                    label="Industry"
                    name="industry"
                    type="select"
                    value={formData.industry}
                    onChange={(value) => updateFormData('industry', value)}
                    placeholder="Select industry"
                    required
                    error={errors.industry}
                    options={industryOptions}
                  />

                  <FormField
                    label="Project Type"
                    name="projectType"
                    type="select"
                    value={formData.projectType}
                    onChange={(value) => updateFormData('projectType', value)}
                    placeholder="Select project type"
                    required
                    error={errors.projectType}
                    options={projectTypeOptions}
                  />

                  <FormField
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={(value) => updateFormData('duration', value)}
                    placeholder="e.g., 3 months, 6 weeks"
                    hint="How long did the project take?"
                  />

                  <FormField
                    label="Team Size"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={(value) => updateFormData('teamSize', value)}
                    placeholder="e.g., 5 developers, 1 designer"
                    hint="Size and composition of the team"
                  />
                </div>
              </FormSection>

              {/* Technologies */}
              <FormSection
                title="Technologies Used"
                description="Technical stack and tools"
                icon={<FiCode size={20} />}
              >
                <TagInput
                  label="Tech Stack"
                  tags={formData.technologies}
                  onChange={(technologies) => updateFormData('technologies', technologies)}
                  suggestions={techSuggestions}
                  maxTags={15}
                  placeholder="Add technologies used in this project"
                />
              </FormSection>

              {/* Content */}
              <FormSection
                title="Detailed Case Study"
                description="In-depth content about the project"
                icon={<FiStar size={20} />}
                collapsible
                defaultExpanded={false}
              >
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Detailed Content
                  </label>
                  <div className="border border-[#2a2b35] rounded-lg overflow-hidden">
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      value={formData.content}
                      onEditorChange={(content: string) => updateFormData('content', content)}
                      init={{
                        height: 400,
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
                </div>
              </FormSection>

              {/* Project Metrics */}
              <FormSection
                title="Project Metrics"
                description="Key performance indicators and results"
                icon={<FiTrendingUp size={20} />}
                collapsible
                defaultExpanded={false}
              >
                <div className="space-y-6">
                  {/* Add New Metric */}
                  <div className="p-4 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-4">Add New Metric</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Label"
                        name="metricLabel"
                        value={newMetric.label}
                        onChange={(value) => updateMetric('label', value as string)}
                        placeholder="e.g., Performance Improvement"
                      />
                      <FormField
                        label="Value"
                        name="metricValue"
                        value={newMetric.value}
                        onChange={(value) => updateMetric('value', value as string)}
                        placeholder="e.g., 40%"
                      />
                      <div className="flex items-end">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addMetric}
                          disabled={!newMetric.label || !newMetric.value}
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <FiPlus size={18} />
                          Add Metric
                        </motion.button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <FormField
                        label="Description"
                        name="metricDescription"
                        value={newMetric.description}
                        onChange={(value) => updateMetric('description', value as string)}
                        placeholder="Brief description of this metric"
                      />
                    </div>
                  </div>

                  {/* Existing Metrics */}
                  <AnimatePresence>
                    {formData.metrics.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <h4 className="text-sm font-medium text-gray-300">Project Metrics</h4>
                        {formData.metrics.map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-semibold text-white">{metric.label}</span>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-bold">
                                  {metric.value}
                                </span>
                              </div>
                              {metric.description && (
                                <p className="text-sm text-gray-400">{metric.description}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMetric(index)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <FiX size={16} />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FormSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <FormSection
                title="Featured Image"
                description="Visual representation of your project"
                icon={<FiImage size={20} />}
              >
                <ImageUpload
                  label="Project Image"
                  value={formData.featuredImage}
                  onChange={(url) => updateFormData('featuredImage', url)}
                  onUpload={handleImageUpload}
                  placeholder="Upload project screenshot or mockup"
                  maxSize={5}
                />
              </FormSection>

              {/* Project Links */}
              <FormSection
                title="Project Links"
                description="External links to the project"
                icon={<FiLink size={20} />}
              >
                <div className="space-y-4">
                  <FormField
                    label="Live URL"
                    name="liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={(value) => updateFormData('liveUrl', value)}
                    placeholder="https://example.com"
                    error={errors.liveUrl}
                    icon={<FiLink size={16} />}
                  />

                  <FormField
                    label="GitHub URL"
                    name="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={(value) => updateFormData('githubUrl', value)}
                    placeholder="https://github.com/username/repo"
                    error={errors.githubUrl}
                    icon={<FiCode size={16} />}
                  />
                </div>
              </FormSection>

              {/* Settings */}
              <FormSection
                title="Publication Settings"
                description="Control visibility and status"
                icon={<FiSettings size={20} />}
              >
                <div className="space-y-6">
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
                  />

                  <div className="flex items-center gap-3 p-4 bg-[#0a0b0d] border border-[#2a2b35] rounded-lg">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => updateFormData('featured', e.target.checked)}
                      className="w-5 h-5 text-purple-500 bg-[#252630] border-gray-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-300 cursor-pointer flex-1">
                      Featured Case Study
                      <p className="text-xs text-gray-500 mt-1">
                        Featured case studies appear prominently on the portfolio page
                      </p>
                    </label>
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
            saveText="Create Case Study"
            cancelText="Cancel"
            disabled={Object.keys(errors).length > 0}
          />
        </div>
      </ModernAdminLayout>
    </>
  );
}