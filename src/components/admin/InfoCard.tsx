import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiAlertTriangle, FiCheckCircle, FiZap } from 'react-icons/fi';

interface InfoCardProps {
  type?: 'info' | 'warning' | 'success' | 'tip';
  title?: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ type = 'info', title, children }) => {
  const icons = {
    info: FiInfo,
    warning: FiAlertTriangle,
    success: FiCheckCircle,
    tip: FiZap
  };

  const colors = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'text-blue-400'
    },
    warning: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: 'text-orange-400'
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: 'text-green-400'
    },
    tip: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      icon: 'text-cyan-400'
    }
  };

  const Icon = icons[type];
  const color = colors[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${color.bg} border ${color.border} rounded-lg p-4`}
    >
      <div className="flex gap-3">
        <Icon className={`${color.icon} flex-shrink-0 mt-0.5`} size={20} />
        <div className="flex-1">
          {title && (
            <h4 className={`text-sm font-semibold ${color.text} mb-1 uppercase tracking-wide`}>
              {title}
            </h4>
          )}
          <div className="text-sm text-gray-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

