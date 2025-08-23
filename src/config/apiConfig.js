/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */
export const API_CONFIG = {
      // Base URLs
      BASE_URL: process.env.EXPO_PUBLIC_API_URL,
      TIMEOUT: process.env.EXPO_PUBLIC_API_TIMEOUT || 10000,
      BASIC_AUTH_USERNAME: process.env.EXPO_PUBLIC_BASIC_AUTH_USERNAME,
      BASIC_AUTH_PASSWORD: process.env.EXPO_PUBLIC_BASIC_AUTH_PASSWORD,

      // API Endpoints
      ENDPOINTS: {
            // Authentication endpoints
            LOGIN: '/login',
            FORGOT_PASSWORD: '/auth/forgot-password',
            UPDATE_PASSWORD: '/auth/update-password',

            // App endpoints
            SHOWS: '/get-shows-by-club',
            SHOW_TICKETS: '/all-show-tickets',
            SCAN_TICKET: '/scan-ticket',
            STATS: '/dashboard/stats',
            PROFILE: '/user/profile',

            // Dummy endpoints for development (using JSONPlaceholder)
            DUMMY: {
                  LOGIN: '/users/1', // Simulate login
                  USERS: '/users',
                  POSTS: '/posts', // Will use as events
            }
      },

      // Headers
      DEFAULT_HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
      },

      // HTTP Status Codes
      STATUS_CODES: {
            SUCCESS: 200,
            CREATED: 201,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            SERVER_ERROR: 500,
      }
};

/**
 * Get API URL based on environment
 * This function allows easy switching between development and production APIs
 */
export const getApiUrl = (endpoint, isDummy = __DEV__) => {
      if (isDummy && API_CONFIG.ENDPOINTS.DUMMY[endpoint.toUpperCase()]) {
            return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DUMMY[endpoint.toUpperCase()]}`;
      }
      return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint.toUpperCase()]}`;
};

/**
 * Update base URL dynamically
 * Useful when backend APIs are ready and you need to switch
 */
export const updateApiBaseUrl = (newBaseUrl) => {
      API_CONFIG.BASE_URL = newBaseUrl;
};

export default API_CONFIG;
