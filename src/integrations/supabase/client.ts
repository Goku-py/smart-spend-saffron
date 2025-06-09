// This file is now deprecated - Firebase is the primary authentication provider
// Keeping minimal structure for backward compatibility only

export const supabase = null;

export const isSupabaseConfigured = () => {
  return false; // Supabase is no longer used as primary provider
};

// Legacy compatibility - all functions now return null/false
export const legacySupabaseNote = `
This project has been migrated to use Firebase as the primary authentication provider.
Supabase integration has been removed to simplify the architecture and improve security.
All authentication now flows through Firebase with comprehensive security features.
`;