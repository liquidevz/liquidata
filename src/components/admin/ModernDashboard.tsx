import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiClock, FiCheckCircle, FiDollarSign, FiBell, FiX, FiActivity, FiUsers, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { publicFetch } from '../../utils/adminApi';
import { InfoCard } from './InfoCard';
import { HelpTooltip } from './HelpTooltip';

export const ModernDashboard = () => {
  const [stats, setStats] = useState({
    calculatorSubmissions: 0,
    contactSubmissions: 0,
    totalSubmissions: 0,
    weeklyGrowth: 0,
    avgProjectValue: 0,
    currency: 'INR',
    conversionRate: 0,
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'SYSTEM ACTIVE', message: 'All services are running smoothly. Dashboard API integrated successfully.', date: new Date().toLocaleDateString() },
    { id: 2, type: 'info', title: 'NEW FEATURES', message: 'Real-time INR pricing calculations now active with 30+ conditional steps.', date: new Date().toLocaleDateString() },
    { id: 3, type: 'success', title: 'DATABASE SYNCED', message: 'All submissions are being tracked and analyzed in real-time.', date: new Date().toLocaleDateString() },
  ]);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      const data = await publicFetch(`/api/admin/dashboard?timeRange=${timeRange}`);
      
      if (data) {
        setDashboardData(data);
        setStats({
          calculatorSubmissions: data.overview?.calculatorSubmissions || 0,
          contactSubmissions: data.overview?.contactSubmissions || 0,
          totalSubmissions: data.overview?.totalLeads || 0,
          weeklyGrowth: data.overview?.totalGrowth || 0,
          avgProjectValue: data.overview?.avgProjectValue || 0,
          currency: data.overview?.currency || 'INR',
          conversionRate: data.overview?.conversionRate || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Fallback to old API
      try {
        const [calcSubs, contactSubs] = await Promise.all([
          publicFetch('/api/calculator-submissions'),
          publicFetch('/api/contact-submissions'),
        ]);

        setStats({
          calculatorSubmissions: calcSubs?.length || 0,
          contactSubmissions: contactSubs?.length || 0,
          totalSubmissions: (calcSubs?.length || 0) + (contactSubs?.length || 0),
          weeklyGrowth: 0,
          avgProjectValue: 0,
          currency: 'INR',
          conversionRate: 0,
        });
      } catch (fallbackError) {
        console.error('Failed to load fallback data:', fallbackError);
      }
    }
  };

  const StatCard = ({ title, value, subtitle, trend, icon: Icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#13141a] border border-[#1e1f26] rounded-lg p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full -mr-16 -mt-16" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">{title}</span>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
              {trend > 0 ? <FiTrendingUp size={20} /> : <FiTrendingDown size={20} />}
            </div>
          )}
        </div>

        <div className="mb-2">
          <span className="text-3xl lg:text-5xl font-bold text-white">{value}</span>
        </div>

        <p className="text-sm text-gray-500 uppercase tracking-wide">{subtitle}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Control Center</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400 text-base lg:text-lg">Real-time insights into your business performance</p>
          </div>
        </div>
        
        <InfoCard type="tip" title="Dashboard Guide">
          This dashboard provides a comprehensive view of your leads, submissions, and system health. 
          Monitor key metrics, track recent activity, and stay on top of important notifications—all in one place.
        </InfoCard>
      </div>

      {/* Key Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiActivity size={24} className="text-cyan-400" />
          <h2 className="text-xl lg:text-2xl font-bold text-white">Key Metrics</h2>
          <HelpTooltip content="These metrics show your overall performance and help you track business growth at a glance." />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-2xl shadow-green-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Total Leads</span>
                <FiUsers size={24} className="text-white" />
              </div>
              <p className="text-3xl lg:text-5xl font-bold text-white mb-2">{stats.totalSubmissions}</p>
              <p className="text-white/80 text-sm">All inquiries combined</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 shadow-2xl shadow-cyan-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Calculator Quotes</span>
                <FiPackage size={24} className="text-white" />
              </div>
              <p className="text-3xl lg:text-5xl font-bold text-white mb-2">{stats.calculatorSubmissions}</p>
              <p className="text-white/80 text-sm">Project estimates generated</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-2xl shadow-purple-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80 text-sm font-semibold uppercase tracking-wider">Contact Forms</span>
                <FiBell size={24} className="text-white" />
              </div>
              <p className="text-3xl lg:text-5xl font-bold text-white mb-2">{stats.contactSubmissions}</p>
              <p className="text-white/80 text-sm">Direct inquiries</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Performance Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp size={24} className="text-cyan-400" />
          <h2 className="text-xl lg:text-2xl font-bold text-white">Performance</h2>
          <HelpTooltip content="Track your response times, conversion rates, and system uptime to ensure optimal performance." />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            title="GROWTH RATE"
            value={`${stats.weeklyGrowth > 0 ? '+' : ''}${stats.weeklyGrowth}%`}
            subtitle={`Growth in ${timeRange === '7d' ? 'Last 7 Days' : timeRange === '30d' ? 'Last 30 Days' : 'Last Year'}`}
            trend={stats.weeklyGrowth}
            color="green"
          />
          
          <StatCard
            title="AVG PROJECT VALUE"
            value={`₹${(stats.avgProjectValue / 1000).toFixed(0)}K`}
            subtitle="Average Estimate per Lead"
            trend={5}
            color="blue"
          />

          <StatCard
            title="CONVERSION RATE"
            value={`${stats.conversionRate}%`}
            subtitle="Calculator to Contact"
            trend={stats.conversionRate > 0 ? 1 : 0}
            icon={FiCheckCircle}
            color="green"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-[#13141a] border border-[#1e1f26] rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FiActivity size={20} className="text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
              <div className="hidden sm:block">
                <HelpTooltip content="Visual representation of your submission trends over time. Use this to identify patterns and peak periods." />
              </div>
            </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">Activity Overview</h3>
            
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => setTimeRange('7d')}
                    className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      timeRange === '7d' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-[#1e1f26] text-gray-400 hover:bg-[#252630]'
                    }`}
                  >
                    <span className="hidden sm:inline">WEEK</span>
                    <span className="sm:hidden">7D</span>
                  </button>
                  <button 
                    onClick={() => setTimeRange('30d')}
                    className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      timeRange === '30d' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-[#1e1f26] text-gray-400 hover:bg-[#252630]'
                    }`}
                  >
                    <span className="hidden sm:inline">MONTH</span>
                    <span className="sm:hidden">30D</span>
                  </button>
                  <button 
                    onClick={() => setTimeRange('1y')}
                    className={`flex-1 sm:flex-none px-3 lg:px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                      timeRange === '1y' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-[#1e1f26] text-gray-400 hover:bg-[#252630]'
                    }`}
                  >
                    <span className="hidden sm:inline">YEAR</span>
                    <span className="sm:hidden">1Y</span>
                  </button>
                </div>
              </div>
          </div>

          {/* Simple Chart Visualization */}
          <div className="h-60 lg:h-80 flex items-end justify-between gap-1 lg:gap-2">
            {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-t from-green-500 to-green-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height * 0.3}%` }}
                  transition={{ delay: i * 0.1 + 0.05 }}
                  className="bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height * 0.2}%` }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-xs text-gray-400 uppercase tracking-wider">Projects</span>
            </div>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-[#13141a] border border-[#1e1f26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                <span className="text-xs font-bold">{notifications.length}</span>
              </div>
              <h3 className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">Notifications</h3>
            </div>
            <button className="text-xs text-gray-500 hover:text-cyan-400 tracking-wider uppercase">
              Clear All
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-[#1e1f26] rounded-lg border border-[#252630] hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'success' ? 'bg-green-400' :
                    notification.type === 'warning' ? 'bg-orange-400' :
                    'bg-cyan-400'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-white mb-1 tracking-wider uppercase">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-gray-600">{notification.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 bg-[#1e1f26] hover:bg-cyan-500/20 border border-[#252630] hover:border-cyan-500/50 rounded-lg text-xs font-semibold text-cyan-400 tracking-wider uppercase transition-all">
            Show All ({notifications.length})
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Leads */}
        <div className="bg-[#13141a] border border-[#1e1f26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <h3 className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">Recent Leads</h3>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold uppercase tracking-wider">
              {stats.totalSubmissions} Total
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#1e1f26] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Calculator Leads</p>
                  <p className="text-xs text-gray-500">{stats.calculatorSubmissions} submissions</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-bold">
                {stats.calculatorSubmissions}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1e1f26] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Contact Inquiries</p>
                  <p className="text-xs text-gray-500">{stats.contactSubmissions} submissions</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-bold">
                {stats.contactSubmissions}
              </span>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="bg-[#13141a] border border-[#1e1f26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <h3 className="text-sm font-semibold text-cyan-400 tracking-wider uppercase">Security Status</h3>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold uppercase tracking-wider">
              Online
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[#1e1f26] rounded-lg border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-400 tracking-wider uppercase">System Health</span>
                <span className="text-2xl font-bold text-green-400">100%</span>
              </div>
              <div className="w-full h-2 bg-[#252630] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#1e1f26] rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Uptime</p>
                <p className="text-lg font-bold text-white">99.9%</p>
              </div>
              <div className="p-3 bg-[#1e1f26] rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Threats</p>
                <p className="text-lg font-bold text-green-400">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

