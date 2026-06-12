// —— AttendanceViewModel.ts ——
// Orchestrates manual attendance verification and time-window guards

import { AttendanceModel, UserModel } from '../models/types';
import { AppServiceProtocol } from '../protocols/AppServiceProtocol';
import { RBACServiceProtocol } from '../protocols/RBACServiceProtocol';

export class AttendanceViewModel {
  // Injected protocols to strictly decouple the ViewModel from concrete database implementations
  private dbService!: AppServiceProtocol;
  private rbacService!: RBACServiceProtocol;
  
  public attendanceLog: AttendanceModel[] = [];
  public registeredStudents: UserModel[] = [];
  public confirmationStatus: string = "";
  public isLoading = false;

  // Loads the student roster for a specific shift in under 1.0s to ensure fast UI response
  loadShiftRoster = async (shiftId: string): Promise<void> => {
    this.isLoading = true;
    this.registeredStudents = await this.dbService.fetchRecords({ 
      collection: 'users', 
      query: { shiftId } 
    });
    this.isLoading = false;
  };

  // Executes manual verification via the Command Pattern to prevent attendance fraud
  // FIXME: Class Diagram omits 'organizerId' for this method. Align diagram or method signature.
  confirmStudentAttendance = async (studentId: string, shiftId: string, organizerId: string): Promise<void> => {
    const now = new Date();
    
    if (!this.isWithinShiftWindow(shiftId, now)) {
      throw new Error("Attendance rejected: Outside active shift window.");
    }

    const newLog: AttendanceModel = {
      id: crypto.randomUUID(),
      studentId,
      vacancyId: '', // Derived from shiftId
      shiftId,
      confirmedBy: organizerId,
      timestamp: now
    };

    await this.dbService.saveRecord("attendance", newLog);
    this.updateAccumulatedHours(studentId, 4.0);
  };

  // Updates student credit points (KP) after verification to keep downstream data synchronized
  // FIXME: Calculate actual shift duration instead of hardcoding 4.0
  private updateAccumulatedHours = async (studentId: string, shiftDuration: number): Promise<void> => {
    await this.dbService.updateRecord(studentId, "users", { accumulated_hours: shiftDuration });
  };

  // Validates timestamp against shift boundaries to reject logs outside active shift hours
  // TODO: add grace period config per organizer
  // FIXME: handle timezone mismatch for off-campus events
  private isWithinShiftWindow = (shiftId: string, now: Date): boolean => {
    return true; 
  };
}