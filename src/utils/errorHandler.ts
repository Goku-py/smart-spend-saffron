export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handleAuthError(error: any): AppError {
    if (error?.message?.includes('Invalid login credentials')) {
      return {
        message: 'Invalid email or password. Please check your credentials.',
        code: 'INVALID_CREDENTIALS'
      };
    }
    
    if (error?.message?.includes('User already registered')) {
      return {
        message: 'An account with this email already exists. Please sign in instead.',
        code: 'USER_EXISTS'
      };
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      return {
        message: 'Please check your email and click the confirmation link.',
        code: 'EMAIL_NOT_CONFIRMED'
      };
    }
    
    if (error?.message?.includes('Network')) {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }
    
    return {
      message: error?.message || 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }

  static handleDatabaseError(error: any): AppError {
    if (error?.code === 'PGRST301') {
      return {
        message: 'Database connection failed. Using demo mode.',
        code: 'DB_CONNECTION_FAILED'
      };
    }
    
    if (error?.message?.includes('permission denied')) {
      return {
        message: 'You do not have permission to perform this action.',
        code: 'PERMISSION_DENIED'
      };
    }
    
    return {
      message: 'Database error occurred. Please try again.',
      code: 'DATABASE_ERROR',
      details: error
    };
  }

  static handleNetworkError(error: any): AppError {
    if (error?.message?.includes('ERR_BLOCKED_BY_RESPONSE')) {
      return {
        message: 'Service temporarily unavailable. Using demo mode.',
        code: 'SERVICE_BLOCKED'
      };
    }
    
    if (error?.message?.includes('Failed to fetch')) {
      return {
        message: 'Network connection failed. Please check your internet.',
        code: 'NETWORK_FAILED'
      };
    }
    
    return {
      message: 'Network error occurred. Please try again.',
      code: 'NETWORK_ERROR',
      details: error
    };
  }

  static logError(error: AppError, context?: string) {
    console.error(`[${context || 'APP'}] Error:`, {
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString()
    });
  }
}