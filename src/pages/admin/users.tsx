import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ModernAdminLayout } from '../../components/admin/ModernAdminLayout';
import { InfoCard } from '../../components/admin/InfoCard';
import { isAuthenticated, adminFetch, getAdminUser } from '../../utils/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiShield, FiMail, FiUser, FiLock, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi';

interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getAdminUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    loadAdmins();
  }, [mounted, router]);

  const loadAdmins = async () => {
    try {
      const data = await adminFetch('/api/admin/users');
      setAdmins(data.admins || []);
    } catch (error: any) {
      console.error('Failed to load admins:', error);
      if (error.message.includes('super admin')) {
        setError('Only super admins can view admin users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await adminFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      setShowCreateModal(false);
      setFormData({ username: '', email: '', password: '', role: 'admin' });
      loadAdmins();
    } catch (error: any) {
      setError(error.message || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    setError('');
    setSubmitting(true);

    try {
      await adminFetch(`/api/admin/users/${selectedAdmin._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          role: formData.role
        })
      });

      setShowEditModal(false);
      setSelectedAdmin(null);
      setFormData({ username: '', email: '', password: '', role: 'admin' });
      loadAdmins();
    } catch (error: any) {
      setError(error.message || 'Failed to update admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    if (!confirm(`Are you sure you want to delete ${admin.username}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminFetch(`/api/admin/users/${admin._id}`, {
        method: 'DELETE'
      });
      loadAdmins();
    } catch (error: any) {
      alert(error.message || 'Failed to delete admin');
    }
  };

  const handleToggleActive = async (admin: Admin) => {
    try {
      await adminFetch(`/api/admin/users/${admin._id}/toggle-active`, {
        method: 'PATCH'
      });
      loadAdmins();
    } catch (error: any) {
      alert(error.message || 'Failed to toggle admin status');
    }
  };

  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      role: admin.role
    });
    setShowEditModal(true);
    setError('');
  };

  const isSuperAdmin = currentUser?.role === 'super_admin';

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 uppercase tracking-wider text-sm">Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Users Management</title>
      </Head>
      <ModernAdminLayout activeTab="ADMIN_USERS">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">User Management</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin Users</h1>
              <p className="text-gray-400 text-lg">Manage administrator accounts and permissions</p>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => {
                  setFormData({ username: '', email: '', password: '', role: 'admin' });
                  setShowCreateModal(true);
                  setError('');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-semibold shadow-lg shadow-cyan-500/30"
              >
                <FiPlus size={20} />
                Create Admin
              </button>
            )}
          </div>

          <InfoCard type="info" title="About Admin Management">
            Manage administrator accounts, roles, and permissions. Only super admins can create, edit, or delete admin users.
          </InfoCard>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
            <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-2xl shadow-cyan-500/30">
              <FiUsers className="text-white mb-3" size={32} />
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Total Admins</p>
              <p className="text-4xl font-bold text-white mt-1">{admins.length}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-2xl shadow-green-500/30">
              <FiShield className="text-white mb-3" size={32} />
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Super Admins</p>
              <p className="text-4xl font-bold text-white mt-1">
                {admins.filter(a => a.role === 'super_admin').length}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-2xl shadow-purple-500/30">
              <FiToggleRight className="text-white mb-3" size={32} />
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Active</p>
              <p className="text-4xl font-bold text-white mt-1">
                {admins.filter(a => a.isActive).length}
              </p>
            </div>
          </div>

          {/* Admin List */}
          {admins.length === 0 ? (
            <div className="text-center py-20">
              <FiUsers size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No admin users found</h3>
              <p className="text-gray-400">Create your first admin user to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {admins.map((admin, index) => (
                <motion.div
                  key={admin._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#13141a] border border-[#1e1f26] rounded-xl p-6 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        admin.role === 'super_admin' 
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                          : 'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        <FiShield className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{admin.username}</h3>
                        <p className="text-sm text-gray-400">{admin.email}</p>
                      </div>
                    </div>
                    {admin.isActive ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold border border-green-500/30">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold border border-red-500/30">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiShield size={16} />
                      <span className="capitalize">{admin.role.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FiUser size={16} />
                      <span>Created {new Date(admin.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {isSuperAdmin && currentUser.id !== admin._id && (
                    <div className="flex gap-2 pt-4 border-t border-[#1e1f26]">
                      <button
                        onClick={() => openEditModal(admin)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"
                      >
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(admin)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all border border-purple-500/30"
                      >
                        {admin.isActive ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}

                  {currentUser.id === admin._id && (
                    <div className="pt-4 border-t border-[#1e1f26]">
                      <span className="text-sm text-gray-500 italic">This is your account</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#13141a] rounded-2xl border border-cyan-500/30 max-w-md w-full p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Admin User</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Password (min. 8 chars)</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                      minLength={8}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all"
                  >
                    {submitting ? 'Creating...' : 'Create Admin'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && selectedAdmin && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#13141a] rounded-2xl border border-cyan-500/30 max-w-md w-full p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit Admin User</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpdateAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 transition-all"
                  >
                    {submitting ? 'Updating...' : 'Update Admin'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </ModernAdminLayout>
    </>
  );
}

