/**
 * src/app/constants/storage.ts
 * Centralized constants for persistence keys and domain guards.
 */

// Domain restriction for the university SSO guard (FR-01)
export const CIPUTRA_DOMAIN = '@ciputra.ac.id';

// Storage key for the collection of all registered users
export const USERS_KEY = 'UCEF_users';

// Storage key for the active session (Session Persistence)
export const CURRENT_USER_KEY = 'UCEF_currentUser';

// Storage key for all published volunteer vacancies (FR-02)
export const EVENTS_KEY = 'UCEF_publishedEvents';