import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiLock, FiUser, FiAlertCircle, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { publicFetch } from '../../utils/adminApi';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    // Check if admin setup is needed
    const checkSetup = async () => {
      try {
        console.log('Checking admin setup status...');
        const data = await publicFetch('/api/admin/setup/check');
        console.log('Setup check response:', data);

        if (data.needsSetup) {
          console.log('Setup needed, redirecting to setup page...');
          // Redirect to setup page
          router.push('/admin/setup');
        } else {
          console.log('Setup already completed');
        }
      } catch (error) {
        console.log('Setup check failed (this is normal if setup endpoint doesn\'t exist):', error);
        // If setup check fails, assume setup is complete and allow login
        // This handles cases where the backend doesn't have a setup endpoint
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSetup();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login...');
      console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001');
      console.log('Login endpoint:', '/api/admin/login');

      const data = await publicFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response:', data);

      if (data.token) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));

        console.log('Login successful, redirecting to dashboard...');
        // Redirect to dashboard
        router.push('/admin');
      } else {
        throw new Error('No token received from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);

      // Provide more specific error messages
      let errorMessage = 'Failed to connect to server';

      if (err.message) {
        errorMessage = err.message;
      }

      if (err.message?.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to API server. Please check your connection.';
      }

      if (err.message?.includes('CORS')) {
        errorMessage = 'CORS error: API server is not allowing requests from this origin.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 uppercase tracking-wider text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Login - Liquidata</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0b0d] via-[#0f1014] to-[#13141a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-[#13141a] rounded-2xl shadow-2xl border border-[#1e1f26] p-8 backdrop-blur-xl">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50 relative overflow-hidden">
                  <FiShield className="text-white z-10" size={40} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-50 -z-10 animate-pulse" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-center text-white mb-2 tracking-wider">
                L.I.Q.U.I.
              </h1>
              <p className="text-center text-cyan-400 mb-2 text-xs uppercase tracking-widest font-semibold">
                System Access Control
              </p>
              <p className="text-center text-gray-500 mb-8 text-sm">
                Authorized Personnel Only
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
              >
                <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Username or Email
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-white placeholder-gray-600"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#1e1f26] border border-[#252630] rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-white placeholder-gray-600"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/70 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    'Access System'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </motion.button>
            </form>

            {/* Default Credentials Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
            >
              <p className="text-xs text-cyan-400 text-center">
                <FiAlertCircle className="inline mr-1" size={14} />
                <strong>NOTICE:</strong> Use authorized credentials only
              </p>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="uppercase tracking-wider">Secure Connection Established</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
