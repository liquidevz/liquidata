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
  FiUser,
  FiExternalLink
} from 'react-icons/fi';

interface CaseStudy {
  _id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  projectType: string;
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

export default function CaseStudiesAdmin() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [filteredCaseStudies, setFilteredCaseStudies] = useState<CaseStudy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
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

    fetchCaseStudies();
  }, [mounted, router]);

  useEffect(() => {
    filterCaseStudies();
  }, [caseStudies, searchTerm, statusFilter, industryFilter]);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await adminFetch('/api/admin/case-studies');
      setCaseStudies(response.caseStudies || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCaseStudies = () => {
    let filtered = [...caseStudies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cs => 
        cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cs => cs.status === statusFilter);
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(cs => cs.industry === industryFilter);
    }

    setFilteredCaseStudies(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;

    try {
      await adminFetch(`/api/admin/case-studies/${id}`, {
        method: 'DELETE'
      });
      fetchCaseStudies();
    } catch (error) {
      console.error('Failed to delete case study:', error);
      alert('Failed to delete case study');
    }
  };

  const getUniqueIndustries = () => {
    const industries = Array.from(new Set(caseStudies.map(cs => cs.industry)));
    return industries.filter(Boolean);
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
        <title>Case Studies - Admin Dashboard</title>
      </Head>

      <ModernAdminLayout activeTab="CASE STUDIES">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Case Studies</h1>
              <p className="text-gray-400">Manage your portfolio case studies</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/admin/case-studies/new')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
            >
              <FiPlus size={20} />
              New Case Study
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search case studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Industry Filter */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Industries</option>
              {getUniqueIndustries().map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center px-4 py-3 bg-[#1e1f26] border border-[#2a2b35] rounded-lg">
              <span className="text-gray-400">
                {filteredCaseStudies.length} of {caseStudies.length} case studies
              </span>
            </div>
          </div>

          {/* Case Studies Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              <AnimatePresence>
                {filteredCaseStudies.map((caseStudy, index) => (
                  <motion.div
                    key={caseStudy._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#1e1f26] border border-[#2a2b35] rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
                  >
                    {/* Featured Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                      {caseStudy.featuredImage ? (
                        <img
                          src={caseStudy.featuredImage}
                          alt={caseStudy.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiEye size={32} className="text-gray-600" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseStudy.status)}`}>
                          {caseStudy.status}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {caseStudy.featured && (
                        <div className="absolute top-3 right-3">
                          <FiStar className="text-yellow-400" size={20} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {caseStudy.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiUser size={14} />
                          <span>{caseStudy.client}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiFilter size={14} />
                          <span>{caseStudy.industry} • {caseStudy.projectType}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiCalendar size={14} />
                          <span>
                            {caseStudy.publishedAt 
                              ? new Date(caseStudy.publishedAt).toLocaleDateString()
                              : new Date(caseStudy.createdAt).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/admin/case-studies/edit/${caseStudy._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                        >
                          <FiEdit3 size={16} />
                          Edit
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(`/case-studies/${caseStudy.slug}`, '_blank')}
                          className="flex items-center justify-center p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        >
                          <FiExternalLink size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(caseStudy._id)}
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
          {!loading && filteredCaseStudies.length === 0 && (
            <div className="text-center py-12">
              <FiStar size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No case studies found</h3>
              <p className="text-gray-500 mb-6">
                {caseStudies.length === 0 
                  ? "Get started by creating your first case study"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {caseStudies.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/admin/case-studies/new')}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  Create First Case Study
                </motion.button>
              )}
            </div>
          )}
        </div>
      </ModernAdminLayout>
    </>
  );
}
