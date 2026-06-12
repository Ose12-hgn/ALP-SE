// —— NotificationServiceProtocol.ts ——
// Abstraction for asynchronous notifications to decouple alerts from the main selection flow

export interface NotificationServiceProtocol {
  // Dispatches an email to notify students when their application status changes [2]
  sendEmail(to: string, subject: string, body: string): void;

  // Triggers an internal system alert for users currently active within the app [2]
  sendInAppAlert(userId: string, message: string): void;

  // Defers notification delivery to a background queue if the external service is down [2]
  queueNotification(payload: any): void;

  // Re-attempts sending queued messages (Retry Pattern) to ensure reliable delivery [2, 7]
  retryFailed(): void;
}