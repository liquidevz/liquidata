import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiImage, FiLoader, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  placeholder?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  onUpload,
  placeholder = 'Click to upload or drag and drop',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please use: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return `File size too large. Maximum size is ${maxSize}MB`;
    }
    
    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        <div className="flex items-center gap-2">
          <FiImage size={16} />
          {label}
        </div>
      </label>

      <div className="space-y-4">
        {/* Current Image */}
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-[#2a2b35] group-hover:border-cyan-500/50 transition-colors">
                <img
                  src={value}
                  alt="Uploaded"
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={removeImage}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              {/* Success indicator */}
              <div className="absolute top-2 right-2 p-2 bg-green-500 text-white rounded-full">
                <FiCheck size={16} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Area */}
        {!value && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
              ${dragOver 
                ? 'border-cyan-500 bg-cyan-500/10' 
                : 'border-[#2a2b35] hover:border-cyan-500/50 hover:bg-[#252630]'
              }
              ${uploading ? 'pointer-events-none' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">
              {uploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto w-12 h-12 text-cyan-400"
                >
                  <FiLoader size={48} />
                </motion.div>
              ) : (
                <FiUpload size={48} className="mx-auto text-gray-400" />
              )}

              <div>
                <p className="text-gray-300 font-medium">
                  {uploading ? 'Uploading...' : placeholder}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} up to {maxSize}MB
                </p>
              </div>
            </div>

            {/* Drag overlay */}
            <AnimatePresence>
              {dragOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-500 rounded-lg flex items-center justify-center"
                >
                  <div className="text-cyan-400 text-lg font-semibold">
                    Drop image here
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3"
            >
              <FiAlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};