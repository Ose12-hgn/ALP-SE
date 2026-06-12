/**
 * src/app/components/EventCard.tsx
 * Reusable card component for displaying event summaries.
 */

import React from 'react';
import { motion } from 'motion/react';

interface EventCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary';
  onClick?: () => void;
};

// Renders an animated glassmorphic card for event listings
export const EventCard = ({ icon, title, description, color, onClick }: EventCardProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }} 
      whileTap={{ scale: 0.98 }} 
      onClick={onClick} 
      className="relative overflow-hidden cursor-pointer" 
      style={{ borderRadius: '24px' }}
    >
      <div 
        className="absolute inset-0 backdrop-blur-xl" 
        style={{ 
          background: color === 'primary' 
            ? 'linear-gradient(135deg, rgba(141, 212, 195, 0.15) 0%, rgba(141, 212, 195, 0.05) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 184, 148, 0.15) 0%, rgba(255, 184, 148, 0.05) 100%)', 
          border: '1px solid rgba(255, 255, 255, 0.3)', 
        }} 
      />
      <div className="relative p-6 flex items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};