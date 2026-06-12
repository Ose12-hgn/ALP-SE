/**
 * src/app/views/PortfolioView.tsx
 * UI for students to view volunteer history and download portfolios (UC5, FR-09).
 */

import React, { useEffect } from 'react';
import { FileText, Download, Clock, Calendar, AlertCircle } from 'lucide-react';
import { PortfolioViewModel } from '../viewmodels/PortfolioViewModel';

interface PortfolioViewProps {
  viewModel: PortfolioViewModel;
  studentId: string;
};

export const PortfolioView = ({ viewModel, studentId }: PortfolioViewProps) => {
  
  // Logic Tier: Load history via Repository Pattern on mount (Test Case 23) [5]
  useEffect(() => {
    viewModel.loadHistory(studentId);
  }, [viewModel, studentId]);

  /**
   * Triggers the asynchronous background PDF generation (FR-09) [6, 7].
   */
  const handleDownloadRequest = async () => {
    try {
      await viewModel.requestPortfolioGeneration(studentId);
    } catch (error: any) {
      // Empty Portfolio Guard: Handled by Logic Tier (Test Case 21) [8]
      alert(error.message);
    }
  };

  return (
    <div className="px-6 pt-16 pb-24 bg-background min-h-screen">
      {/* Header aligned with NFR-05 Usability (Flat UI Hierarchy) [9] */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Your Portfolio</h1>
        <p className="text-muted-foreground mt-1">Verified volunteer history</p>
      </div>

      {/* History List: Renders PortfolioEntry structures from the Data Tier [1] */}
      <div className="space-y-4 mb-8">
        {viewModel.portfolioHistory.length > 0 ? (
          viewModel.portfolioHistory.map((entry, index) => (
            <div key={index} className="p-5 bg-white border border-border rounded-3xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">{entry.eventName}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-lg">
                  {entry.role}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{entry.hoursWorked} Hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(entry.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="font-medium">No events completed yet.</p>
          </div>
        )}
      </div>

      {/* Footer Action: Implements Async Background Worker pattern (FR-09) [6, 7] */}
      <div className="fixed bottom-8 left-6 right-6">
        <button 
          onClick={handleDownloadRequest}
          disabled={viewModel.isGenerating}
          className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {viewModel.isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Preparing PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download Official Portfolio</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};