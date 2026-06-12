// —— FileStorageProtocol.ts ——
// Abstraction for managing binary file operations separate from text database queries

export interface FileStorageProtocol {
  // Uploads binary files like PDFs and CVs securely to the storage server
  uploadFile(data: any, path: string): Promise<string>;

  // Removes specified binary files from the storage bucket to free up space
  deleteFile(path: string): Promise<void>;

  // Retrieves a secure URL allowing users to download their generated portfolios and reports
  getDownloadUrl(path: string): Promise<string>;
}
