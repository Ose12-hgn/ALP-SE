// —— PortfolioViewModel.ts ——
// Orchestrates asynchronous portfolio generation and abstracts historical data access

import { PortfolioEntry, PortfolioModel } from '../models/types';
import { AppServiceProtocol } from '../protocols/AppServiceProtocol';
import { BackgroundWorkerProtocol } from '../protocols/BackgroundWorkerProtocol';
import { FileStorageProtocol } from '../protocols/FileStorageProtocol';

export class PortfolioViewModel {
  // Injected protocols to decouple logic from the database and background job runners
  private dbService!: AppServiceProtocol;
  private backgroundWorker!: BackgroundWorkerProtocol;
  private storageService!: FileStorageProtocol;

  public portfolioHistory: PortfolioEntry[] = [];
  public isGenerating = false;
  public downloadUrl: string | null = null;

  // Retrieves validated volunteer history via the abstraction layer to prevent direct UI-to-DB queries
  loadHistory = async (studentId: string): Promise<void> => {
    this.portfolioHistory = await this.dbService.fetchRecords({
      collection: 'portfolio_entries',
      query: { studentId }
    });
  };

  // Delegates computationally expensive PDF compilation to an async worker to keep the UI responsive
  requestPortfolioGeneration = async (studentId: string): Promise<void> => {
    // Guard Clause: Stops execution immediately if the student has no completed events
    if (this.portfolioHistory.length === 0) {
      throw new Error("Portfolio is empty, no PDF can be generated.");
    }

    this.isGenerating = true;
    try {
      const payload: PortfolioModel = {
        id: crypto.randomUUID(),
        studentId,
        events: this.portfolioHistory,
        totalHours: this.portfolioHistory.reduce((acc, curr) => acc + curr.hoursWorked, 0),
        generatedAt: new Date(),
        downloadUrl: ""
      };

      // Executes the heavy background task asynchronously
      this.downloadUrl = await this.backgroundWorker.generatePDF(payload);
    } catch (e) {
      throw new Error("Failed to generate portfolio.");
    } finally {
      this.isGenerating = false;
    }
  };

  // Polls the background worker to confirm when the asynchronous generation task finishes
  // TODO: Implement polling mechanism or WebSocket listener for real-time status updates
  checkGenerationStatus = async (): Promise<void> => {
    if (this.downloadUrl) {
      this.isGenerating = false;
    }
  };

  // Retrieves the secure URL from the File Storage Tier to prompt the actual document download
  // FIXME: Add logic to trigger the browser's native file download prompt safely
  downloadPortfolio = async (): Promise<void> => {
    if (!this.downloadUrl) throw new Error("Document not ready.");
    const url = await this.storageService.getDownloadUrl(this.downloadUrl);
    console.log("Downloading from:", url);
  };
}