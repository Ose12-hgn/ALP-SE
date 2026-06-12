// —— SelectionViewModel.ts ——
// Manages the organizer selection flow using the Observer and Retry patterns

import { ApplicationModel, ApplicationStatus } from '../models/types';
import { AppServiceProtocol } from '../protocols/AppServiceProtocol';
import { NotificationServiceProtocol } from '../protocols/NotificationServiceProtocol';

export class SelectionViewModel {
  // Dependencies injected via protocols to decouple logic from Firebase
  private dbService!: AppServiceProtocol;
  private notifService!: NotificationServiceProtocol;

  public applicantQueue: ApplicationModel[] = [];
  public sortedApplicants: ApplicationModel[] = [];
  public isLoading = false;

  // Fetches pending applications and CVs from the database to load the current queue
  loadApplicants = async (vacancyId: string): Promise<void> => {
    this.isLoading = true;
    this.applicantQueue = await this.dbService.fetchRecords({ 
      collection: 'applications', 
      query: { vacancyId } 
    });
    this.sortBySkillMatch();
    this.isLoading = false;
  };

  // Ranks applicants based on skill alignment scores to assist organizer decisions
  sortBySkillMatch = (): void => {
    this.sortedApplicants = [...this.applicantQueue].sort((a, b) => 
      b.skillMatchScore - a.skillMatchScore
    );
  };

  // Processes an accepted decision and automatically adds the student to the shift roster
  approveApplicant = async (applicationId: string): Promise<void> => {
    await this.updateApplicationStatus(applicationId, 'accepted');
    const app = this.applicantQueue.find(a => a.id === applicationId);
    if (app) {
      // FIXME: Ensure roster array update logic properly merges with existing shift roster data
      await this.dbService.updateRecord(app.shiftId, "shifts", { roster: [app.studentId] });
    }
  };

  // Processes a rejected decision and notifies the student asynchronously
  rejectApplicant = async (applicationId: string): Promise<void> => {
    await this.updateApplicationStatus(applicationId, 'rejected');
  };

  // Transitions an application to waitlisted status if the shift quota is currently full
  waitlistApplicant = async (applicationId: string): Promise<void> => {
    await this.updateApplicationStatus(applicationId, 'waitlisted');
  };

  // Handles status transitions and triggers the Observer notification hook with a Retry fallback
  private updateApplicationStatus = async (id: string, status: ApplicationStatus): Promise<void> => {
    await this.dbService.updateRecord(id, "applications", { status, updatedAt: new Date() });
    
    try {
      this.notifService.sendInAppAlert(id, `Your application status: ${status}`);
    } catch (error) {
      await this.dbService.saveRecord("notif_queue", { applicationId: id, status });
    }
  };
}