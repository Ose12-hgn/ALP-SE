// —— FirebaseStorageService.ts ——
// Concrete implementation of FileStorageProtocol using Firebase Storage

import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FileStorageProtocol } from '../protocols/FileStorageProtocol';

export class FirebaseStorageService implements FileStorageProtocol {
  // Uploads binary files securely to the storage server and returns the access URL
  uploadFile = async (data: File, path: string): Promise<string> => {
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytes(fileRef, data);
    return await getDownloadURL(snapshot.ref);
  };

  // Retrieves a secure URL allowing users to download their generated portfolios
  getDownloadUrl = async (path: string): Promise<string> => {
    return await getDownloadURL(ref(storage, path));
  };

  // Removes binary files from the storage bucket to free up space
  deleteFile = async (path: string): Promise<void> => {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  };
}
