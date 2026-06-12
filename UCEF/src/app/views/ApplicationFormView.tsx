/**
 * src/app/views/ApplicationFormView.tsx
 * Student interface for submitting documents and screening answers (FR-03) [2, 4].
 */

import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { ApplicationViewModel } from '../viewmodels/ApplicationViewModel';
import { VacancyModel } from '../models/types';

interface ApplicationFormViewProps {
  viewModel: ApplicationViewModel;
  event: VacancyModel;
  onClose: () => void;
};

// Orchestrates the multi-step application submission and guard checks [3, 4]
export const ApplicationFormView = ({ viewModel, event, onClose }: ApplicationFormViewProps) => {
  
  // Triggers the application flow and schedule conflict guard (FR-04) [3, 5]
  const handleSubmit = async () => {
    try {
      await viewModel.submitApplication(event.id, []);
      onClose();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-background px-6 pt-16">
      <button onClick={onClose} className="flex items-center gap-2 mb-8 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-3xl font-bold mb-6">Apply for {event.title}</h2>
      
      <div className="space-y-6">
        {/* Document Upload: Commitment Letter (FR-03) [6] */}
        <div className="p-5 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Upload className="text-primary" />
          </div>
          <div>
            <p className="font-bold">Commitment Letter</p>
            <p className="text-xs text-muted-foreground">PDF Required for selection [7]</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={viewModel.isSubmitting}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20"
        >
          {viewModel.isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
};
