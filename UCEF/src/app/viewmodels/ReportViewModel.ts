// —— ReportViewModel.ts ——
// Isolates heavy administrative data aggregation to background workers to maintain main database performance

import { AppServiceProtocol } from '../protocols/AppServiceProtocol';
import { BackgroundWorkerProtocol } from '../protocols/BackgroundWorkerProtocol';

export class ReportViewModel {
  // Injected protocols to decouple the ViewModel from concrete database and worker implementations
  private dbService!: AppServiceProtocol;
  private backgroundWorker!: BackgroundWorkerProtocol;

  public reportData: any | null = null;
  public isGenerating = false;

  // Routes computationally expensive university-level aggregation to a background worker
  generateAggregateReport = async (): Promise<void> => {
    this.isGenerating = true;
    try {
      // Executes the heavy calculation asynchronously to keep the Admin UI responsive
      this.reportData = await this.backgroundWorker.buildAggregateReport({ type: 'university_aggregate' });
    } catch (error) {
      throw new Error("Failed to generate aggregate report.");
    } finally {
      this.isGenerating = false;
    }
  };

  // Scopes the aggregate data query to specific academic terms to optimize database read times
  // FIXME: Ensure timezones are normalized to UTC before querying the background worker
  filterByDateRange = async (start: Date, end: Date): Promise<void> => {
    this.isGenerating = true;
    try {
      this.reportData = await this.backgroundWorker.buildAggregateReport({
        type: 'university_aggregate',
        startDate: start,
        endDate: end
      });
    } catch (error) {
      throw new Error("Failed to filter report.");
    } finally {
      this.isGenerating = false;
    }
  };

  // Retrieves the generated report securely for University Administrators to download
  // TODO: Connect this to the FileStorageProtocol to provide a secure CSV/PDF download link
  exportReport = async (): Promise<void> => {
    if (!this.reportData) throw new Error("No report data available to export.");
    console.log("Exporting report:", this.reportData);
  };
}
