// —— BackgroundWorkerProtocol.ts ——
// Abstraction for heavy asynchronous tasks to prevent blocking the main thread

export interface BackgroundWorkerProtocol {
  // Queues an asynchronous computation task to the background worker
  dispatch(job: any): Promise<void>;

  // Compiles historical data into a PDF portfolio to keep the main UI responsive
  generatePDF(payload: any): Promise<string>;

  // Aggregates massive university-level data securely without affecting main database performance
  buildAggregateReport(params: any): Promise<any>;

  // Triggers a callback action once the heavy background task finishes execution
  onComplete(callback: (result: string) => void): void;
}