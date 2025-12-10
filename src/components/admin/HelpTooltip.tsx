import React, { useState } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpTooltipProps {
  content: string;
  title?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ content, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-cyan-400 transition-colors"
        type="button"
      >
        <FiHelpCircle size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64"
          >
            <div className="bg-[#1e1f26] border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 p-4">
              {title && (
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">{title}</h4>
              )}
              <p className="text-xs text-gray-300 leading-relaxed">{content}</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-[#1e1f26] border-r border-b border-cyan-500/30 transform rotate-45" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

