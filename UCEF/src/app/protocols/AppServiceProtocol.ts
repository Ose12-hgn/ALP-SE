// —— AppServiceProtocol.ts ——
// Abstraction for CRUD operations to isolate the UI from database technical details

export interface AppServiceProtocol {
  // Records new documents to maintain the single source of truth for the system
  saveRecord(collectionName: string, data: any): Promise<void>;

  // Retrieves existing documents safely via query parameters
  fetchRecords(params: { collection: string; query?: any }): Promise<any[]>;

  // Modifies existing records by unique ID to track status changes across layers
  updateRecord(id: string, collectionName: string, data: any): Promise<void>;

  // Removes outdated or invalid documents from the main database
  deleteRecord(id: string): Promise<void>;

  // Fetches specific results to efficiently support read-heavy search directory features
  queryWithFilter(collectionName: string, field: string, value: any): Promise<any[]>;
}
