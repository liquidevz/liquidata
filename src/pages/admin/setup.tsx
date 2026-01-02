import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { publicFetch } from '../../utils/adminApi';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiShield, FiCheckCircle } from 'react-icons/fi';

export default function AdminSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const data = await publicFetch('/api/admin/setup/check');
      
      if (data.needsSetup) {
        setSetupNeeded(true);
      } else {
        // Admin already exists, redirect to login
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Setup check error:', error);
      setError('Failed to check setup status');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const response = await publicFetch('/api/admin/setup/first', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.token) {
        // Save token and user
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.admin));
        
        setSuccess(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Setup error:', error);
      setError(error.message || 'Failed to create admin account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 uppercase tracking-wider text-sm">Checking setup status...</p>
        </div>
      </div>
    );
  }

  if (!setupNeeded) {
    return null; // Will redirect
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Setup Complete! 🎉</h1>
            <p className="text-white/90 mb-4">
              Your admin account has been created successfully.
            </p>
            <p className="text-sm text-white/80">
              Redirecting to dashboard...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>First-Time Admin Setup - Liquidata</title>
      </Head>
      
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/50">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">First-Time Setup</h1>
            <p className="text-gray-400">Create your super admin account to get started</p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#13141a] border border-[#1e1f26] rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="admin@liquidata.dev"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-cyan-400">
                  <strong className="font-semibold">Note:</strong> This account will have full super admin privileges. 
                  Keep your credentials secure.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  'Create Admin Account'
                )}
              </button>
            </form>
          </motion.div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/admin/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

