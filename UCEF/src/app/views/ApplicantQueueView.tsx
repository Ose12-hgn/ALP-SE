/**
 * src/app/views/ApplicantQueueView.tsx
 * Dashboard for Event Organizers to review and select applicants (UC3, FR-05).
 */

import React, { useEffect } from 'react';
import { Check, X, User, Star } from 'lucide-react';
import { SelectionViewModel } from '../viewmodels/SelectionViewModel';

interface ApplicantQueueViewProps {
  viewModel: SelectionViewModel;
  vacancyId: string;
};

export const ApplicantQueueView = ({ viewModel, vacancyId }: ApplicantQueueViewProps) => {
  
  // Logic Tier: Load and sort applicants on component mount (FR-05)
  useEffect(() => {
    viewModel.loadApplicants(vacancyId);
  }, [viewModel, vacancyId]);

  /**
   * Triggers the approveApplicant command and automated roster allocation (Test Case 13).
   */
  const handleApprove = async (id: string) => {
    try {
      await viewModel.approveApplicant(id);
      alert("Applicant accepted and added to roster.");
    } catch (e: any) {
      alert(e.message);
    }
  };

  /**
   * Triggers the rejectApplicant command and Observer notification hook (Test Case 14).
   */
  const handleReject = async (id: string) => {
    await viewModel.rejectApplicant(id);
  };

  return (
    <div className="px-6 pt-16 pb-24 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Applicant Queue</h1>
        <p className="text-muted-foreground mt-1">Reviewing for {vacancyId}</p>
      </div>

      <div className="space-y-4">
        {viewModel.isLoading ? (
          <p>Loading queue...</p>
        ) : (
          viewModel.sortedApplicants.map((app) => (
            <div key={app.id} className="p-6 bg-white border border-border rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <User className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Student ID: {app.studentId}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                      <Star className="w-3 h-3 fill-secondary" />
                      <span>Match Score: {app.skillMatchScore}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Logic Tier: Execute status update and notification hook */}
                  <button 
                    onClick={() => handleReject(app.id)}
                    className="p-3 bg-zinc-100 text-zinc-500 rounded-2xl hover:bg-zinc-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleApprove(app.id)}
                    className="p-3 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/20 hover:scale-105 transition-transform"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-zinc-50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Screening Answers</p>
                <p className="text-sm text-zinc-600 line-clamp-2">{app.screeningAnswers || "No response provided."}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};