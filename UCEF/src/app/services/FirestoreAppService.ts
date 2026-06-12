// —— FirestoreAppService.ts ——
// Concrete implementation of AppServiceProtocol using Firebase Firestore

import { db } from '../config/firebase'; 
import { collection, addDoc, getDocs, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { AppServiceProtocol } from '../protocols/AppServiceProtocol';

export class FirestoreAppService implements AppServiceProtocol {
  // Records new documents to maintain the single source of truth for the system
  saveRecord = async (collectionName: string, data: any): Promise<void> => {
    await addDoc(collection(db, collectionName), { ...data, createdAt: new Date() });
  };

  // Fetches and maps database records with explicit typing
  fetchRecords = async (params: { collection: string; query?: any }): Promise<any[]> => {
    const q = params.query 
      ? query(collection(db, params.collection), params.query)
      : collection(db, params.collection);
    
    const snapshot = await getDocs(q as any);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  };

  // Updates records by unique ID to process volunteer applications and attendance
  updateRecord = async (id: string, collectionName: string, data: any): Promise<void> => {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, { ...data, updatedAt: new Date() });
  };

  // Removes outdated or invalid documents from the main database
  // FIXME: Pass the full path (e.g., "vacancies/123") as the ID since the protocol omits the collectionName
  deleteRecord = async (path: string): Promise<void> => {
    await deleteDoc(doc(db, path));
  };

  // Filters search queries to efficiently support VacancyDirectoryView rendering
  queryWithFilter = async (collectionName: string, field: string, value: any): Promise<any[]> => {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  };
}
