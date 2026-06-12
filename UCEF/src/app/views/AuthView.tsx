/**
 * src/app/screens/auth/AuthView.tsx
 * Manages the university login and registration flow with domain guards.
 */

import React, { useState } from 'react';
import { Calendar, Eye, EyeOff, Mail, Lock, User, GraduationCap, Hash } from 'lucide-react';

const CIPUTRA_DOMAIN = "@ciputra.ac.id"; // SCREAMING_SNAKE_CASE constant [3]

export const AuthView = ({ onLogin }: { onLogin: (role: string, user: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  // Validates university domain before proceeding to AuthViewModel logic [1, 2]
  const handleSubmit = () => {
    if (!formData.email.endsWith(CIPUTRA_DOMAIN)) {
      alert("Invalid domain. Only @ciputra.ac.id accounts are allowed.");
      return;
    }
    // Proceed with authentication...
    onLogin('student', formData); 
  };

  return (
    <div className="h-full bg-background px-6 pt-20">
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-primary/10 border border-primary/20">
          <Calendar className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">UCEF</h1>
        <p className="text-muted-foreground text-sm">University Ciputra Event Finder</p>
      </div>
      {/* Form Inputs... */}
      <button 
        onClick={handleSubmit}
        className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20"
      >
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
    </div>
  );
};
