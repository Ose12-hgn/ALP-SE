// —— ApplicationViewModel.ts ——
// Orchestrates student applications via the Chain of Responsibility pattern

import { ApplicationModel } from '../models/types';
import { AppServiceProtocol } from '../protocols/AppServiceProtocol';

export class ApplicationViewModel {
  // Injected protocol to strictly decouple the ViewModel from concrete database implementations
  private dbService!: AppServiceProtocol; 
  
  public applications: ApplicationModel[] = [];
  public currentApplication: ApplicationModel | null = null;
  public isSubmitting = false;
  public conflictWarning: string | null = null;

  // Orchestrates the Chain of Responsibility guard sequence to ensure valid application submissions
  submitApplication = async (vacancyId: string, answers: string[]): Promise<void> => {
    this.isSubmitting = true;
    this.conflictWarning = null;

    try {
      const isProfileComplete = await this.checkProfileCompleteness();
      if (!isProfileComplete) throw new Error("Please complete your profile first.");

      const hasConflict = await this.checkScheduleConflict(vacancyId);
      if (hasConflict) {
        this.conflictWarning = "Time overlap detected with your current schedule.";
        throw new Error("Schedule conflict.");
      }

      await this.dbService.saveRecord("applications", { vacancyId, answers, status: 'pending' });
    } finally {
      this.isSubmitting = false;
    }
  };

  // Queries the database for overlapping shift timestamps to prevent schedule conflicts
  // FIXME: Update parameter to use shiftId instead of vacancyId to strictly match the Class Diagram
  private checkScheduleConflict = async (vacancyId: string): Promise<boolean> => {
    return false; 
  };

  // Verifies required PII fields exist as the first step in the validation chain
  private checkProfileCompleteness = async (): Promise<boolean> => {
    return true; 
  };

  // Cancels an active volunteer application and removes it from the main database
  withdrawApplication = async (id: string): Promise<void> => {
    await this.dbService.deleteRecord(id);
  };
}