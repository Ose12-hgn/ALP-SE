// —— VacancyFormView.tsx ——
// Organizer interface for creating volunteer opportunities 

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { VacancyViewModel } from '../viewmodels/VacancyViewModel';

interface VacancyFormViewProps {
  viewModel: VacancyViewModel;
  isOpen: boolean;
  onClose: () => void;
}

export const VacancyFormView = ({ viewModel, isOpen, onClose }: VacancyFormViewProps) => {
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '' });

  // Executes the Template Method to validate and publish a vacancy to the main database
  const handlePublish = async () => {
    if (!formData.title || !formData.date) {
      alert("Validation Error: Missing required fields");
      return;
    }
    
    await viewModel.createVacancy(formData as any);
    onClose();
  };

  // Triggers the draft variation of the Template Method to isolate incomplete vacancies from search
  const handleSaveDraft = async () => {
    await viewModel.saveDraft(formData as any);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-background px-6 pt-16 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Upload Event</h2>
        <button onClick={onClose} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold ml-1">Event Title</label>
          <input 
            placeholder="e.g., Tech Career Fair 2026" 
            className="w-full p-4 bg-zinc-50 rounded-2xl border-none ring-1 ring-zinc-200 focus:ring-2 focus:ring-secondary"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={handlePublish}
            className="w-full py-4 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-secondary/20"
          >
            Publish Opportunity
          </button>
          
          <button 
            onClick={handleSaveDraft}
            className="w-full py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-colors"
          >
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
};
