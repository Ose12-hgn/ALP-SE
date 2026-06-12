/**
 * src/app/screens/student/VacancyDirectoryView.tsx
 * Primary dashboard for student users to browse opportunities.
 */

import React from 'react';
import { User, Calendar } from 'lucide-react';
import { EventCard } from '../components/EventCard';

export const VacancyDirectoryView = ({ user, events }: { user: any, events: any[] }) => {
  // Logic to determine the greeting based on the current time [4]
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="relative min-h-[100dvh] bg-background px-6 pt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{getGreeting()},</h1>
          <h1 className="text-4xl font-semibold text-primary">{user?.name || 'Student'}</h1>
        </div>
        <button className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <User className="text-primary w-8 h-8" />
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard 
            key={event.id}
            title={event.title}
            description={event.description}
            icon={<Calendar className="text-primary" />}
            color="primary"
          />
        ))}
      </div>
    </div>
  );
};