/**
 * src/app/views/ProfileView.tsx
 * Consolidated profile view for Students and Organizers (FR-25).
 */

import React from 'react';
import { X, LogOut, User, Mail, GraduationCap, Hash } from 'lucide-react';
import { UserModel } from '../models/types';

interface ProfileViewProps {
  user: UserModel | null;
  onLogout: () => void;
  onClose: () => void;
};

/**
 * Renders the user profile and manages session termination (NFR-01, FR-25).
 */
export const ProfileView = ({ user, onLogout, onClose }: ProfileViewProps) => {
  // Executes a total session teardown and resets navigation (FR-25)
  const handleSignOut = () => {
    onLogout(); // Clears USERS_KEY and session tokens [1, 5]
    onClose();
  };

  if (!user) return null;

  const isOrganizer = user.role === 'organizer';

  return (
    <div className={`absolute inset-0 z-50 overflow-y-auto ${isOrganizer ? 'bg-secondary' : 'bg-primary'} text-white`}>
      <div className="relative min-h-full px-6 pt-16 pb-8">
        {/* Close Button: Facilitates NFR-05 flat UI navigation */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.4)' }}
        >
          <X className="w-6 h-6 text-white" strokeWidth={2} />
        </button>

        {/* Profile Identity Section */}
        <div className="flex flex-col items-center mt-12 mb-12 text-center">
          <div className="w-32 h-32 rounded-3xl bg-white/20 flex items-center justify-center mb-6 border border-white/30 backdrop-blur-md">
            <User className="w-16 h-16 text-white/80" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
          <p className="opacity-70 mt-1 uppercase tracking-widest text-xs font-bold">
            {user.role} Account
          </p>
        </div>

        {/* Data Tier Details (UserModel) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-4">
              <Mail className="w-5 h-5 opacity-60" />
              <div>
                <p className="text-[10px] opacity-60 font-bold uppercase tracking-wider">Email</p>
                <p className="font-semibold text-sm">{user.email}</p>
              </div>
            </div>
            
            {user.role === 'student' && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <Hash className="w-5 h-5 opacity-60" />
                  <div>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-wider">NIM</p>
                    <p className="font-semibold text-sm">{user.nim}</p> {/* Aligned with UserModel [6] */}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <GraduationCap className="w-5 h-5 opacity-60" />
                  <div>
                    <p className="text-[10px] opacity-60 font-bold uppercase tracking-wider">Major</p>
                    <p className="font-semibold text-sm">{user.major || 'Informatics'}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Session Teardown Action (FR-25) */}
          <button 
            onClick={handleSignOut}
            className="w-full mt-8 p-5 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center gap-3 font-bold hover:bg-white/20 transition-all active:scale-95"
          >
            <LogOut className="w-6 h-6" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};