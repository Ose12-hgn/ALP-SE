/**
 * src/app/components/EventModal.tsx
 * Modal overlay for detailed event requirements.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface EventDetails {
  title: string;
  description: string;
  color: 'primary' | 'secondary';
  requirements: string[];
  icon: React.ReactNode;
}

interface EventModalProps {
  event: EventDetails | null;
  onClose: () => void;
  onApply: () => void;
}

// Displays a full-screen blurred overlay with event details and application trigger
export const EventModal = ({ event, onClose, onApply }: EventModalProps) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: '100%' }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: '100%' }} 
        transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
        className="absolute inset-0 z-50 overflow-y-auto" 
        style={{ 
          background: event.color === 'primary' 
            ? 'linear-gradient(135deg, rgba(141, 212, 195, 0.98) 0%, rgba(141, 212, 195, 0.95) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 184, 148, 0.98) 0%, rgba(255, 184, 148, 0.95) 100%)', 
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-transform hover:scale-110" 
          style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)' }}
        >
          <X className="w-6 h-6 text-white" strokeWidth={2} />
        </button>
        {/* Content goes here */}
      </motion.div>
    </AnimatePresence>
  );
};
