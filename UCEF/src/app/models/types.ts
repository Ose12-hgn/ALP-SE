/**
 * src/app/models/types.ts
 * Unified Data Tier models aligned with UCEF Architectural Class Diagrams.
 */

// Defines primary roles supported by the RBAC middleware [4, 5]
export type UserRole = 'student' | 'organizer' | 'admin' | null;

// Status options for volunteer applications (FR-03) [6, 7]
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';

// Supported notification channels for the Observer Pattern (FR-06) [1, 8]
export type NotificationType = 'in-app' | 'email';

/**
 * UserModel: Identity and profile for authenticated university users [9, 10].
 */
export interface UserModel {
  id: string; 
  name: string;
  email: string;
  nim: string; // Linked to university SSO identity [11]
  role: UserRole;
  isActive: boolean; // For Inactive Status Guard [12]
  major?: string;
  createdAt: Date;
};

/**
 * ShiftModel: Details for specific volunteer work windows [9, 10].
 */
export interface ShiftModel {
  id: string;
  vacancyId: string;
  startTime: Date;
  endTime: Date;
  location: string;
  quota: number;
};

/**
 * VacancyModel: Volunteer opportunities created via Template Method [10, 13].
 */
export interface VacancyModel {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  quota: number;
  deadline: Date;
  shifts: ShiftModel[]; 
  status: 'published' | 'draft';
  shareableUrl?: string;
  createdAt: Date;
};

/**
 * ApplicationModel: Records and tracking for volunteer candidates [6, 7].
 */
export interface ApplicationModel {
  id: string;
  studentId: string;
  vacancyId: string;
  shiftId: string;
  screeningAnswers: string[];
  status: ApplicationStatus;
  skillMatchScore: number;
  appliedAt: Date;
  updatedAt?: Date; // For audit logs in SelectionViewModel [14]
};

/**
 * AttendanceModel: Logs for manual presence verification (UC4) [6, 15].
 */
export interface AttendanceModel {
  id: string;
  studentId: string;
  vacancyId: string;
  shiftId: string;
  confirmedBy: string; // ID of the Event Organizer
  timestamp: Date; // For Time Window Guard [16]
};

/**
 * PortfolioEntry: Granular event record for the final report [1, 15].
 */
export interface PortfolioEntry {
  eventName: string;
  divisionName: string;
  role: string;
  hoursWorked: number; // Linked to shift_duration from UC4 [16]
  completedAt: Date;
};

/**
 * PortfolioModel: Summary and download metadata for UC5 reporting [1, 2].
 */
export interface PortfolioModel {
  id: string;
  studentId: string;
  events: PortfolioEntry[];
  totalHours: number; // Aggregate total for Credit Points (KP) [1, 16]
  generatedAt: Date;
  downloadUrl: string; // URI from FileStorageProtocol [17]
};

/**
 * NotificationModel: Messaging for status changes and reminders [1, 8].
 */
export interface NotificationModel {
  id: string;
  recipientId: string;
  type: NotificationType;
  message: string;
  relatedId: string; // e.g., ApplicationId or VacancyId
  isRead: boolean;
  createdAt: Date;
};