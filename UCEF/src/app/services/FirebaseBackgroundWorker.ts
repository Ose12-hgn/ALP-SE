// —— FirebaseBackgroundWorker.ts ——
// Routes heavy computations to serverless functions to keep UI responsive

import { functions } from '../config/firebase';
import { httpsCallable } from 'firebase/functions';
import { BackgroundWorkerProtocol } from '../protocols/BackgroundWorkerProtocol';

export class FirebaseBackgroundWorker implements BackgroundWorkerProtocol {
  // Compiles historical data into a PDF portfolio without blocking the main thread
  generatePDF = async (payload: any): Promise<string> => {
    const generateFn = httpsCallable(functions, 'generatePortfolioPDF');
    const result: any = await generateFn(payload);
    return result.data.downloadUrl;
  };

  // Aggregates massive university-level data securely
  buildAggregateReport = async (params: any): Promise<any> => {
    const reportFn = httpsCallable(functions, 'buildUniversityReport');
    const result = await reportFn(params);
    return result.data;
  };

  // Queues an asynchronous computation task to the background worker
  // TODO: Connect this to Google Cloud Tasks or an async queue
  dispatch = async (job: any): Promise<void> => {
    console.log("Job dispatched:", job);
  };

  // Triggers a callback action once the heavy background task finishes execution
  onComplete = (callback: (result: string) => void): void => {
    // Execution hook implementation goes here
  };
}