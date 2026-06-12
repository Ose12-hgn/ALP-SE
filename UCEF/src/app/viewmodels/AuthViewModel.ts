// —— AuthViewModel.ts ——
// Orchestrates SSO login flows and session persistence while enforcing domain security rules

import { UserModel, UserRole } from '../models/types';
import { CIPUTRA_DOMAIN, CURRENT_USER_KEY } from '../constants/storage';

export class AuthViewModel {
  public currentUser: UserModel | null = null;
  public errorMessage: string | null = null;

  // Validates domain and account status before SSO forwarding to prevent unauthorized system access
  loginUser = async (email: string, password: string): Promise<void> => {
    if (!email.endsWith(CIPUTRA_DOMAIN)) {
      this.errorMessage = "Invalid domain. Only @ciputra.ac.id accounts are allowed.";
      return;
    }

    try {
      const user: UserModel = await this.performSSOLogin(email, password);
      
      if (!user.isActive) {
        this.errorMessage = "Account deactivated.";
        return;
      }

      this.currentUser = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
      this.errorMessage = "Authentication failed.";
    }
  };

  // Retrieves existing session tokens from local storage to allow seamless user re-entry
  // FIXME: Connect restoreSession to API Gateway for actual backend token validation
  restoreSession = async (token: string): Promise<void> => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  };

  // Simulates university SSO gateway response to retrieve authenticated user data
  private performSSOLogin = async (email: string, pass: string): Promise<UserModel> => {
    return {
      id: 'u-1',
      name: 'Test Student',
      email,
      nim: '0706012410016',
      role: 'student' as UserRole,
      isActive: true,
      createdAt: new Date()
    };
  };
}
