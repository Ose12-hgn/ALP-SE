// —— FirebaseRBACService.ts ——
// Concrete implementation of RBACServiceProtocol using Firebase Auth and Firestore

import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RBACServiceProtocol } from '../protocols/RBACServiceProtocol';

export class FirebaseRBACService implements RBACServiceProtocol {
  // Rejects non-university emails immediately at the domain level
  verifyDomain = (email: string): boolean => {
    const CIPUTRA_DOMAIN = "@ciputra.ac.id";
    return email.endsWith(CIPUTRA_DOMAIN);
  };

  // Verifies user roles directly against the Firestore single source of truth
  verifyRole = async (userId: string, requiredRole: string): Promise<boolean> => {
    const userSnap = await getDoc(doc(db, "users", userId));
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data();
    return userData.role === requiredRole;
  };

  // Prevents deactivated users from accessing any system features
  checkAccountStatus = async (userId: string): Promise<string> => {
    const userSnap = await getDoc(doc(db, "users", userId));
    const status = userSnap.data()?.isActive ? "active" : "inactive";
    if (status === "inactive") throw new Error("Account deactivated.");
    return status;
  };

  // Resolves token-based stateless sessions to ensure secure API requests
  // FIXME: Integrate with actual Firebase Auth token decoding
  validateSession = async (token: string): Promise<any> => {
    return { token, isValid: true };
  };
}