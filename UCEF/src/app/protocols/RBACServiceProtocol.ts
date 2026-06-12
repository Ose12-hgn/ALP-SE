// —— RBACServiceProtocol.ts ——
// Abstraction for middleware validating user roles and account statuses before executing actions

export interface RBACServiceProtocol {
  // Enforces Role-Based Access Control to prevent unauthorized data access
  verifyRole(userId: string, requiredRole: string): Promise<boolean>;

  // Acts as an early exit guard to immediately block deactivated accounts
  checkAccountStatus(userId: string): Promise<string>;

  // Validates session tokens to ensure stateless and secure authentication flows
  validateSession(token: string): Promise<any>;
}
