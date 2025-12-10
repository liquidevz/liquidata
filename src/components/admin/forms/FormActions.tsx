import React from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiLoader, FiCheck } from 'react-icons/fi';

interface FormActionsProps {
  onSave: () => void;
  onCancel?: () => void;
  saving?: boolean;
  saveText?: string;
  cancelText?: string;
  disabled?: boolean;
  className?: string;
  sticky?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  saving = false,
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  disabled = false,
  className = '',
  sticky = true
}) => {
  const containerClasses = `
    ${sticky ? 'sticky bottom-0 z-10' : ''}
    bg-gradient-to-r from-[#13141a] via-[#1e1f26] to-[#13141a] 
    border-t border-[#2a2b35] p-4 sm:p-6
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center max-w-7xl mx-auto">
        {/* Cancel Button */}
        <div className="order-2 sm:order-1">
          {onCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#1e1f26] text-gray-300 rounded-lg hover:bg-[#252630] hover:text-white transition-all border border-[#2a2b35] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowLeft size={18} />
              <span className="font-medium">{cancelText}</span>
            </motion.button>
          )}
        </div>

        {/* Save Button */}
        <div className="order-1 sm:order-2">
          <motion.button
            whileHover={!disabled && !saving ? { scale: 1.02 } : {}}
            whileTap={!disabled && !saving ? { scale: 0.98 } : {}}
            type="button"
            onClick={onSave}
            disabled={disabled || saving}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 font-semibold disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <FiLoader size={20} />
                </motion.div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={20} />
                <span>{saveText}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Progress indicator */}
      {saving && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 origin-left"
        />
      )}
    </div>
  );
};