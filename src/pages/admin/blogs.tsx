import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { isAuthenticated, adminFetch } from '../../utils/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiSearch, 
  FiFilter,
  FiStar,
  FiCalendar,
  FiClock,
  FiExternalLink
} from 'react-icons/fi';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTime?: number;
  views: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  featuredImage: string;
  publishedAt?: string;
  createdAt: string;
  author: {
    username: string;
    email: string;
  };
}

export default function BlogsAdmin() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 20
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    fetchBlogs();
  }, [mounted, router]);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await adminFetch('/api/admin/blogs');
      setBlogs(response.blogs || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(blog => blog.category === categoryFilter);
    }

    setFilteredBlogs(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await adminFetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE'
      });
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('Failed to delete blog post');
    }
  };

  const getUniqueCategories = () => {
    const categories = Array.from(new Set(blogs.map(blog => blog.category)));
    return categories.filter(Boolean);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'draft': return 'text-yellow-400 bg-yellow-400/20';
      case 'archived': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Blog Posts - Admin Dashboard</title>
      </Head>

      <ModernAdminLayout activeTab="BLOGS">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
              <p className="text-gray-400">Manage your blog articles and insights</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/admin/blogs/new')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
            >
              <FiPlus size={20} />
              New Blog Post
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="all">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center px-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg">
              <span className="text-gray-400">
                {filteredBlogs.length} of {blogs.length} posts
              </span>
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              <AnimatePresence>
                {filteredBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group"
                  >
                    {/* Featured Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiEye size={32} className="text-gray-600" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {blog.featured && (
                        <div className="absolute top-3 right-3">
                          <FiStar className="text-yellow-400" size={20} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-2">
                        <span className="text-xs text-purple-400 uppercase tracking-wider">
                          {blog.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiEye size={14} />
                          <span>{blog.views || 0} views</span>
                        </div>
                        
                        {blog.readingTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FiClock size={14} />
                            <span>{blog.readingTime} min read</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiCalendar size={14} />
                          <span>
                            {blog.publishedAt 
                              ? new Date(blog.publishedAt).toLocaleDateString()
                              : new Date(blog.createdAt).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/admin/blogs/edit/${blog._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                        >
                          <FiEdit3 size={16} />
                          Edit
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                          className="flex items-center justify-center p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          <FiExternalLink size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(blog._id)}
                          className="flex items-center justify-center p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <FiEye size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No blog posts found</h3>
              <p className="text-gray-500 mb-6">
                {blogs.length === 0 
                  ? "Get started by creating your first blog post"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {blogs.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/admin/blogs/new')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
                >
                  Create First Blog Post
                </motion.button>
              )}
            </div>
          )}
        </div>
      </ModernAdminLayout>
    </>
  );
}
