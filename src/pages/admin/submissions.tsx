import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { InfoCard } from '../../components/admin/InfoCard';
import { FiMail, FiPhone, FiCalendar, FiX, FiTrash2, FiExternalLink, FiMessageSquare, FiUser, FiClock, FiSearch, FiFilter, FiTarget, FiDollarSign } from 'react-icons/fi';
import { Building2 } from 'lucide-react';
import { isAuthenticated, adminFetch } from '../../utils/adminApi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactSubmissions() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

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

  const loadSubmissions = async () => {
    try {
      const data = await adminFetch('/api/contact-submissions');
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      await adminFetch(`/api/contact-submissions/${id}`, {
        method: 'DELETE',
      });
      
      setSubmissions(submissions.filter(s => s._id !== id));
      if (selectedSubmission?._id === id) {
        setSelectedSubmission(null);
      }
    } catch (error) {
      alert('Failed to delete submission. Delete endpoint may not be implemented yet.');
      console.error('Delete error:', error);
    }
  };

  const filteredSubmissions = submissions
    .filter(sub => 
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.goal?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 uppercase tracking-wider text-sm">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Form Submissions - Admin</title>
      </Head>
      <ModernAdminLayout activeTab="SUBMISSIONS">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Inbox</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Contact Form Submissions</h1>
                <p className="text-gray-400 text-lg">Messages from your website contact form</p>
              </div>
              
              {/* Stats Badge */}
              <div className="text-center">
                <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-2xl shadow-cyan-500/30">
                  <p className="text-5xl font-bold text-white mb-1">{filteredSubmissions.length}</p>
                  <p className="text-sm text-white/80 uppercase tracking-wider">Total Messages</p>
                </div>
              </div>
            </div>

            <InfoCard type="info" title="About Contact Submissions">
              These are direct inquiries from your website's contact form. 
              Each submission includes contact details and the user's message. 
              Make sure to respond promptly to maintain good customer relations.
            </InfoCard>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or message..."
                className="w-full pl-12 pr-4 py-4 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-center gap-2 px-6 bg-[#1e1f26] border border-[#252630] rounded-lg">
              <FiFilter className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#1e1f26]">Newest First</option>
                <option value="oldest" className="bg-[#1e1f26]">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Submissions Grid */}
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <FiMessageSquare size={48} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm ? 'No matching submissions' : 'No submissions yet'}
              </h3>
              <p className="text-gray-400">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Contact form submissions will appear here'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission, index) => (
                <motion.div
                  key={submission._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#13141a] border border-[#1e1f26] rounded-xl p-6 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-cyan-500/30">
                        {submission.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                          {submission.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FiClock size={12} />
                          {new Date(submission.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-sm">
                      <FiMail className="text-cyan-400 flex-shrink-0" size={16} />
                      <span className="text-gray-400 truncate">{submission.email}</span>
                    </div>
                    {submission.company && (
                      <div className="flex items-center gap-3 text-sm">
                        <Building2 className="text-purple-400 flex-shrink-0" size={16} />
                        <span className="text-gray-400">{submission.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Message/Goal/Details Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {submission.details || submission.goal || submission.message || 'No message'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-[#1e1f26]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubmission(submission);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-semibold border border-cyan-500/30"
                    >
                      <FiExternalLink size={14} />
                      View Full
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSubmission(submission._id);
                      }}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
                      title="Delete submission"
                    >
                      <FiTrash2 size={16} />
                    </button>
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
                className="bg-[#13141a] rounded-2xl border border-cyan-500/30 max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {selectedSubmission.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedSubmission.name}</h2>
                      <p className="text-white/80 text-sm flex items-center gap-2 mt-1">
                        <FiCalendar size={14} />
                        {new Date(selectedSubmission.createdAt).toLocaleString('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
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
                  {/* Contact Information Card */}
                  <div className="p-6 bg-[#1e1f26] rounded-xl border border-cyan-500/20">
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FiUser size={16} />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                          <FiMail size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                          <a 
                            href={`mailto:${selectedSubmission.email}`}
                            className="text-white hover:text-cyan-400 transition-colors font-medium"
                          >
                            {selectedSubmission.email}
                          </a>
                        </div>
                      </div>

                      {selectedSubmission.company && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Company</p>
                            <p className="text-white font-medium">{selectedSubmission.company}</p>
                          </div>
                        </div>
                      )}

                      {selectedSubmission.budget && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                            <FiDollarSign size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Budget</p>
                            <p className="text-white font-medium">{selectedSubmission.budget}</p>
                          </div>
                        </div>
                      )}

                      {selectedSubmission.date && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 flex-shrink-0">
                            <FiCalendar size={18} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Project Date</p>
                            <p className="text-white font-medium">{selectedSubmission.date}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Goal/Project Type */}
                  {selectedSubmission.goal && (
                    <div className="p-6 bg-[#1e1f26] rounded-xl border border-[#252630]">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FiTarget size={16} />
                        Project Goal
                      </h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedSubmission.goal}
                      </p>
                    </div>
                  )}

                  {/* Details/Message Card */}
                  {(selectedSubmission.details || selectedSubmission.message) && (
                    <div className="p-6 bg-[#1e1f26] rounded-xl border border-[#252630]">
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FiMessageSquare size={16} />
                        Additional Details
                      </h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedSubmission.details || selectedSubmission.message}
                      </p>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: Your inquiry&body=Hi ${selectedSubmission.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/50 font-semibold transition-all"
                    >
                      <FiMail size={20} />
                      Reply via Email
                    </a>
                    <button
                      onClick={() => {
                        deleteSubmission(selectedSubmission._id);
                        setSelectedSubmission(null);
                      }}
                      className="px-6 py-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-semibold border border-red-500/30"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </ModernAdminLayout>
    </>
  );
}

