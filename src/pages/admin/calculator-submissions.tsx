import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { InfoCard } from '../../components/admin/InfoCard';
import { FiTrendingUp, FiDownload, FiSearch, FiFilter, FiX, FiCalendar, FiDollarSign, FiPackage, FiLayers, FiUsers, FiClock, FiTarget, FiCode, FiMail } from 'react-icons/fi';
import { isAuthenticated, adminFetch } from '../../utils/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorSubmission {
  _id: string;
  selections: {
    projectType?: string;
    selectedIndustries?: string[];
    selectedServices?: string[];
    selectedFeatures?: string[];
    scope?: string;
    team?: string;
    timeline?: string;
    budget?: string;
    [key: string]: any;
  };
  result: {
    finalPrice: number;
    totalWithGST: number;
    currency: string;
    formattedTotal: string;
    estimateRange: string;
  };
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  createdAt: string;
}

export default function CalculatorSubmissionsManagement() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<CalculatorSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<CalculatorSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<CalculatorSubmission | null>(null);
  const [filterProjectType, setFilterProjectType] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    loadSubmissions();
  }, [mounted, router]);

  useEffect(() => {
    filterSubmissions();
  }, [searchTerm, filterProjectType, sortBy, submissions]);

  const loadSubmissions = async () => {
    try {
      const data = await adminFetch('/api/calculator-submissions');
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.contactInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.contactInfo?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.selections?.projectType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Project type filter
    if (filterProjectType !== 'all') {
      filtered = filtered.filter(sub => sub.selections?.projectType === filterProjectType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return (b.result?.totalWithGST || 0) - (a.result?.totalWithGST || 0);
        case 'lowest':
          return (a.result?.totalWithGST || 0) - (b.result?.totalWithGST || 0);
        default:
          return 0;
      }
    });

    setFilteredSubmissions(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Project Type', 'Estimate Range', 'Total with GST', 'Created At'];
    const rows = filteredSubmissions.map(sub => [
      sub.contactInfo?.name || 'N/A',
      sub.contactInfo?.email || 'N/A',
      sub.contactInfo?.phone || 'N/A',
      sub.contactInfo?.company || 'N/A',
      sub.selections?.projectType || 'N/A',
      sub.result?.estimateRange || 'N/A',
      sub.result?.totalWithGST || 'N/A',
      new Date(sub.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculator-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getAveragePrice = () => {
    if (filteredSubmissions.length === 0) return 0;
    const sum = filteredSubmissions.reduce((acc, sub) => acc + (sub.result?.totalWithGST || 0), 0);
    return sum / filteredSubmissions.length;
  };

  const getTotalValue = () => {
    return filteredSubmissions.reduce((acc, sub) => acc + (sub.result?.totalWithGST || 0), 0);
  };

  const getProjectTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      'website': 'from-green-500 to-green-600',
      'web-app': 'from-blue-500 to-blue-600',
      'mobile-app': 'from-purple-500 to-purple-600',
      'desktop-app': 'from-orange-500 to-orange-600',
      'api-backend': 'from-cyan-500 to-cyan-600',
    };
    return colors[type || ''] || 'from-gray-500 to-gray-600';
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 uppercase tracking-wider text-sm">Loading project estimates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Calculator Submissions - Admin</title>
      </Head>
      <ModernAdminLayout activeTab="CALCULATOR_SUBMISSIONS">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Project Estimates</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Calculator Submissions</h1>
                <p className="text-gray-400 text-lg">Project quotes generated through your pricing calculator</p>
              </div>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30 font-semibold"
              >
                <FiDownload size={20} />
                Export CSV
              </button>
            </div>

            <InfoCard type="info" title="About Calculator Submissions">
              These are project estimates generated by users through your smart calculator. 
              Each submission includes detailed project requirements, selected options, and calculated pricing. 
              Use this data to understand customer needs and follow up on potential leads.
            </InfoCard>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-2xl shadow-cyan-500/30">
              <div className="flex items-center gap-3 mb-3">
                <FiPackage className="text-white" size={24} />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Total Quotes</span>
              </div>
              <p className="text-4xl font-bold text-white">{filteredSubmissions.length}</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-2xl shadow-green-500/30">
              <div className="flex items-center gap-3 mb-3">
                <FiDollarSign className="text-white" size={24} />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Total Value</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {getTotalValue().toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-2xl shadow-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <FiTrendingUp className="text-white" size={24} />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Average Quote</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {getAveragePrice().toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-2xl shadow-orange-500/30">
              <div className="flex items-center gap-3 mb-3">
                <FiCalendar className="text-white" size={24} />
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">This Month</span>
              </div>
              <p className="text-4xl font-bold text-white">
                {submissions.filter(s => new Date(s.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, company, or project type..."
                className="w-full pl-12 pr-4 py-4 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-center gap-2 px-6 bg-[#1e1f26] border border-[#252630] rounded-lg">
              <FiFilter className="text-gray-500" />
              <select
                value={filterProjectType}
                onChange={(e) => setFilterProjectType(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#1e1f26]">All Project Types</option>
                <option value="website" className="bg-[#1e1f26]">Website</option>
                <option value="web-app" className="bg-[#1e1f26]">Web Application</option>
                <option value="mobile-app" className="bg-[#1e1f26]">Mobile App</option>
                <option value="desktop-app" className="bg-[#1e1f26]">Desktop App</option>
                <option value="api-backend" className="bg-[#1e1f26]">API & Backend</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-6 bg-[#1e1f26] border border-[#252630] rounded-lg">
              <FiTrendingUp className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#1e1f26]">Newest First</option>
                <option value="oldest" className="bg-[#1e1f26]">Oldest First</option>
                <option value="highest" className="bg-[#1e1f26]">Highest Price</option>
                <option value="lowest" className="bg-[#1e1f26]">Lowest Price</option>
              </select>
            </div>
          </div>

          {/* Submissions Grid */}
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <FiPackage size={48} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm || filterProjectType !== 'all' ? 'No matching submissions' : 'No submissions yet'}
              </h3>
              <p className="text-gray-400">
                {searchTerm || filterProjectType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Calculator submissions will appear here'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#13141a] border border-[#1e1f26] rounded-xl overflow-hidden hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  {/* Card Header */}
                  <div className={`p-6 bg-gradient-to-r ${getProjectTypeColor(submission.selections?.projectType)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">
                          {submission.contactInfo?.company || submission.contactInfo?.name || 'Anonymous'}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {submission.selections?.projectType?.replace('-', ' ').toUpperCase() || 'Project'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
                      <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Total Estimate</p>
                      <p className="text-3xl font-bold text-white">
                        {submission.result?.totalWithGST?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </p>
                      {submission.result?.estimateRange && (
                        <p className="text-white/70 text-xs mt-1">Range: {submission.result.estimateRange}</p>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Contact Info */}
                    {submission.contactInfo && (
                      <div className="space-y-2">
                        {submission.contactInfo.name && (
                          <div className="flex items-center gap-2 text-sm">
                            <FiUsers className="text-cyan-400 flex-shrink-0" size={14} />
                            <span className="text-gray-400">{submission.contactInfo.name}</span>
                          </div>
                        )}
                        {submission.contactInfo.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <FiMail className="text-green-400 flex-shrink-0" size={14} />
                            <span className="text-gray-400 truncate">{submission.contactInfo.email}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="pt-4 border-t border-[#1e1f26] space-y-3">
                      {submission.selections?.scope && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Scope</span>
                          <span className="text-sm text-white font-semibold capitalize">{submission.selections.scope}</span>
                        </div>
                      )}
                      {submission.selections?.timeline && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Timeline</span>
                          <span className="text-sm text-white font-semibold capitalize">{submission.selections.timeline}</span>
                        </div>
                      )}
                      {submission.selections?.team && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">Team</span>
                          <span className="text-sm text-white font-semibold capitalize">{submission.selections.team}</span>
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="pt-4 border-t border-[#1e1f26] flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(submission.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <button className="text-xs text-cyan-400 font-semibold uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Detail Modal */}
        <AnimatePresence>
          {selectedSubmission && (
            <div 
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedSubmission(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#13141a] rounded-2xl border border-cyan-500/30 max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20"
              >
                {/* Modal Header */}
                <div className={`sticky top-0 bg-gradient-to-r ${getProjectTypeColor(selectedSubmission.selections?.projectType)} px-8 py-6 flex items-center justify-between`}>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {selectedSubmission.contactInfo?.company || 'Project Estimate'}
                    </h2>
                    <p className="text-white/80 text-sm flex items-center gap-2">
                      <FiCalendar size={14} />
                      {new Date(selectedSubmission.createdAt).toLocaleString('en-US', {
                        dateStyle: 'long',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="p-3 hover:bg-white/20 rounded-lg transition-colors text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                  {/* Contact Information */}
                  {selectedSubmission.contactInfo && (
                    <div className="p-6 bg-[#1e1f26] rounded-xl border border-cyan-500/20">
                      <h3 className="text-lg font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FiUsers size={20} />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubmission.contactInfo.name && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
                            <p className="text-white font-medium">{selectedSubmission.contactInfo.name}</p>
                          </div>
                        )}
                        {selectedSubmission.contactInfo.email && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                            <a href={`mailto:${selectedSubmission.contactInfo.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                              {selectedSubmission.contactInfo.email}
                            </a>
                          </div>
                        )}
                        {selectedSubmission.contactInfo.phone && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                            <a href={`tel:${selectedSubmission.contactInfo.phone}`} className="text-green-400 hover:text-green-300 transition-colors font-medium">
                              {selectedSubmission.contactInfo.phone}
                            </a>
                          </div>
                        )}
                        {selectedSubmission.contactInfo.company && (
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Company</p>
                            <p className="text-white font-medium">{selectedSubmission.contactInfo.company}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="p-6 bg-[#1e1f26] rounded-xl border border-[#252630]">
                    <h3 className="text-lg font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FiLayers size={20} />
                      Project Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(selectedSubmission.selections || {}).map(([key, value]) => {
                        if (!value || key === '__typename') return null;
                        
                        return (
                          <div key={key} className="p-4 bg-[#13141a] rounded-lg border border-[#252630]">
                            <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2 font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            {Array.isArray(value) ? (
                              <div className="space-y-1">
                                {value.map((item, i) => (
                                  <p key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    {item}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-white font-medium capitalize">{String(value)}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border-2 border-cyan-500/30">
                    <h3 className="text-lg font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FiDollarSign size={20} />
                      Pricing Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-[#1e1f26] rounded-lg">
                        <span className="text-gray-400 font-medium">Base Price</span>
                        <span className="text-white text-lg font-bold">
                          {selectedSubmission.result?.finalPrice?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-[#1e1f26] rounded-lg">
                        <span className="text-gray-400 font-medium flex items-center gap-2">
                          Total (with GST)
                          <span className="text-xs text-gray-600">+18%</span>
                        </span>
                        <span className="text-cyan-400 text-2xl font-bold">
                          {selectedSubmission.result?.totalWithGST?.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {selectedSubmission.result?.estimateRange && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                          <p className="text-xs text-orange-400 uppercase tracking-wider mb-1 font-semibold">Estimate Range</p>
                          <p className="text-white text-lg font-bold">{selectedSubmission.result.estimateRange}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {selectedSubmission.contactInfo?.email && (
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedSubmission.contactInfo.email}?subject=Your Project Estimate&body=Hi ${selectedSubmission.contactInfo.name || 'there'},%0D%0A%0D%0AThank you for using our calculator!%0D%0A%0D%0A`}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/50 font-semibold transition-all"
                      >
                        <FiMail size={20} />
                        Send Follow-up Email
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </ModernAdminLayout>
    </>
  );
}
