import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  FiHome,
  FiSettings,
  FiFileText,
  FiTrendingUp,
  FiShield,
  FiMessageSquare,
  FiLock,
  FiDatabase,
  FiStar,
  FiMenu,
  FiX,
  FiChevronRight,
  FiBarChart
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ModernAdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({ children, activeTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: "overview", label: "OVERVIEW", icon: FiHome, href: "/admin" },
    { id: "calculator", label: "CALCULATOR", icon: FiSettings, href: "/admin/calculator" },
    { id: "calc-submissions", label: "CALCULATOR LEADS", icon: FiTrendingUp, href: "/admin/calculator-submissions" },
    { id: "contact", label: "CONTACT LEADS", icon: FiFileText, href: "/admin/submissions" },
    { id: "case-studies", label: "CASE STUDIES", icon: FiStar, href: "/admin/case-studies" },
    { id: "blogs", label: "BLOGS", icon: FiMessageSquare, href: "/admin/blogs" },
    { id: "seed-data", label: "SEED DATA", icon: FiDatabase, href: "/admin/seed-data" },
    { id: "admin-users", label: "ADMIN USERS", icon: FiLock, href: "/admin/users" },
    { id: "security", label: "SECURITY", icon: FiShield, href: "/admin/api-test" },
  ];

  return (
    <div className="flex h-screen bg-[#0a0b0d] text-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isMobile ? (sidebarOpen ? 280 : 0) : (sidebarOpen ? 280 : 80),
          x: 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-[#13141a] border-r border-[#1e1f26] z-20 flex flex-col h-full overflow-hidden ${
          isMobile ? 'fixed' : 'relative'
        }`}
      >
        {/* Logo */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-6 border-b border-[#1e1f26] flex-shrink-0">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <span className="text-xl lg:text-2xl font-bold text-white tracking-wider">L.I.Q.U.I.</span>
                <span className="text-[9px] lg:text-[10px] text-cyan-400 tracking-widest uppercase">The System Dashboard</span>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#1e1f26] rounded-lg transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </motion.button>
        </div>

        {/* Tools Label */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 lg:px-6 py-3 lg:py-4 border-b border-[#1e1f26] flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Tools</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 py-2 lg:py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a2b35] scrollbar-track-transparent">
          {navItems.map((item) => {
            const isActive = activeTab === item.label || 
                           (item.id === "overview" && activeTab === "Dashboard") ||
                           (item.id === "case-studies" && activeTab === "CASE STUDIES") ||
                           (item.id === "blogs" && activeTab === "BLOGS");
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  router.push(item.href);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 transition-all group relative ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#1e1f26]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-full bg-cyan-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={20} className={isActive ? "text-cyan-400" : ""} />
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-xs font-semibold tracking-wider uppercase flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && sidebarOpen && (
                  <FiChevronRight className="text-cyan-400" size={14} />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Admin Settings */}
        <div className="border-t border-[#1e1f26] p-3 lg:p-4 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              router.push('/admin/login');
              if (isMobile) setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg bg-[#1e1f26] hover:bg-[#252630] transition-colors group"
          >
            <FiLock size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xs font-semibold tracking-wider uppercase text-gray-400 group-hover:text-cyan-400 transition-colors"
                >
                  Admin Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* User Section */}
        <div className="border-t border-[#1e1f26] p-3 lg:p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs lg:text-sm font-bold">A</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-white truncate">ADMIN</p>
                  <p className="text-xs text-gray-500 truncate">admin@liquidata.com</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 lg:h-20 bg-[#13141a] border-b border-[#1e1f26] px-4 lg:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-[#1e1f26] rounded-lg transition-colors"
              >
                <FiMenu size={20} className="text-gray-400" />
              </button>
            )}
            
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-2xl font-bold text-white tracking-wider uppercase truncate">{activeTab}</h1>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Last updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Live Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#1e1f26] rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400 tracking-wider uppercase hidden lg:inline">System Online</span>
              <span className="text-xs font-semibold text-green-400 tracking-wider uppercase lg:hidden">Online</span>
            </div>

            {/* Date Time */}
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-lg lg:text-2xl font-bold text-cyan-400 font-mono">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-[#0a0b0d] via-[#0f1014] to-[#13141a] p-4 lg:p-6 xl:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

