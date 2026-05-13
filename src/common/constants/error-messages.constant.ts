export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    ACCOUNT_NOT_VERIFIED: 'Please verify your email before logging in.',
    ACCOUNT_SUSPENDED: 'Your account has been suspended. Contact support.',
    TOKEN_EXPIRED: 'Session expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    MFA_REQUIRED: 'Multi-factor authentication is required.',
    INVALID_OTP: 'Invalid or expired OTP.',
  },
  USER: {
    NOT_FOUND: 'User not found.',
    EMAIL_TAKEN: 'An account with this email already exists.',
    USERNAME_TAKEN: 'This username is already taken.',
    AGE_RESTRICTION: 'You must be at least 13 years old to register.',
  },
  DIETITIAN: {
    NOT_FOUND: 'Dietitian not found.',
    ALREADY_REGISTERED: 'You are already registered as a dietitian.',
    PENDING_APPROVAL: 'Your account is pending admin approval.',
    NOT_APPROVED: 'This dietitian has not been approved yet.',
  },
  MEAL_PLAN: {
    NOT_FOUND: 'Meal plan not found.',
  },
  RECIPE: {
    NOT_FOUND: 'Recipe not found.',
  },
  CONSULTATION: {
    NOT_FOUND: 'Consultation not found.',
    SLOT_UNAVAILABLE: 'The selected time slot is no longer available.',
  },
  PAYMENT: {
    FAILED: 'Payment processing failed. Please try again.',
    NOT_FOUND: 'Transaction not found.',
  },
  FOOD_DIARY: {
    NOT_FOUND: 'Food diary entry not found.',
  },
  WATER_LOG: {
    NOT_FOUND: 'Water log entry not found.',
  },
  NOTIFICATION: {
    NOT_FOUND: 'Notification not found.',
  },
  REVIEW: {
    NOT_FOUND: 'Review not found.',
  },
  SOCIAL_LINK: {
    NOT_FOUND: 'Social link not found.',
  },
  SUBSCRIPTION: {
    NOT_FOUND: 'Subscription not found.',
  },
  GENERIC: {
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
    VALIDATION_FAILED: 'Validation failed.',
    NOT_FOUND: 'Resource not found.',
    FORBIDDEN: 'Access forbidden.',
  },
} as const;
