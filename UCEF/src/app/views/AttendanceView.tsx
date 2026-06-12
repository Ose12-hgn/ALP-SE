/**
 * src/app/views/AttendanceView.tsx
 * UI for organizers to manually verify student presence (FR-07, FR-08).
 */

import React, { useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { AttendanceViewModel } from '../viewmodels/AttendanceViewModel';

export const AttendanceView = ({ viewModel, organizerId, shiftId }: { 
  viewModel: AttendanceViewModel, 
  organizerId: string, 
  shiftId: string 
}) => {
  
  useEffect(() => {
    viewModel.loadShiftRoster(shiftId);
  }, [viewModel, shiftId]);

  return (
    <div className="px-6 pt-16 pb-24 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-2 tracking-tight">Attendance List</h1>
      <p className="text-muted-foreground mb-8">Verify students for the current shift.</p>

      <div className="space-y-3">
        {viewModel.registeredStudents.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-5 bg-white border border-border rounded-3xl shadow-sm">
            <div>
              <p className="font-bold text-lg">{student.name}</p>
              <p className="text-sm text-muted-foreground">NIM: {student.nim}</p> {/* Uses nim from UserModel [13] */}
            </div>
            
            <button 
              onClick={() => viewModel.confirmStudentAttendance(student.id, shiftId, organizerId)}
              className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <CheckCircle2 className="w-7 h-7" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};