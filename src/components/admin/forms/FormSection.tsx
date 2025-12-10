import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  collapsible = false,
  defaultExpanded = true,
  className = ''
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#1e1f26] border border-[#2a2b35] rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div 
        className={`p-6 border-b border-[#2a2b35] ${
          collapsible ? 'cursor-pointer hover:bg-[#252630] transition-colors' : ''
        }`}
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              {description && (
                <p className="text-gray-400 text-sm mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {collapsible && (
            <motion.div
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <FiChevronUp size={20} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{
          height: expanded ? 'auto' : 0,
          opacity: expanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};