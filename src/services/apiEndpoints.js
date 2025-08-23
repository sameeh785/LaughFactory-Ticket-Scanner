import apiService from './apiService';
import { API_CONFIG } from '../config/apiConfig';

/**
 * Authentication API calls
 */
export const authAPI = {
      /**
       * User login
       * @param {string} email - User email
       * @param {string} password - User password
       */
      login: async (email, password) => {
            try {
                  // Real API call (when backend is ready)
                  return await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, {
                        email,
                        password
                  }, {
                        isLoginScreen: true
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Login failed'
                  };
            }
      },

      /**
       * Forgot password
       * @param {string} email - User email
       */
      forgotPassword: async (email) => {
            try {
                  if (__DEV__) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return {
                              success: true,
                              data: { message: 'Password reset email sent successfully' }
                        };
                  }

                  return await apiService.post(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
                        email
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to send reset email'
                  };
            }
      },

      /**
       * Update password
       * @param {string} currentPassword - Current password
       * @param {string} newPassword - New password
       */
      updatePassword: async (currentPassword, newPassword) => {
            try {
                  if (__DEV__) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return {
                              success: true,
                              data: { message: 'Password updated successfully' }
                        };
                  }

                  return await apiService.put(API_CONFIG.ENDPOINTS.UPDATE_PASSWORD, {
                        currentPassword,
                        newPassword
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to update password'
                  };
            }
      },

      /**
       * Logout user
       */
      logout: async () => {
            try {
                  await apiService.removeAuthToken();
                  return {
                        success: true,
                        data: { message: 'Logged out successfully' }
                  };
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Logout failed'
                  };
            }
      }
};

/**
 * Dashboard API calls
 */
export const dashboardAPI = {
      /**
       * Get dashboard statistics
       */
      getStats: async () => {
            try {
                  if (__DEV__) {
                        await new Promise(resolve => setTimeout(resolve, 800));
                        return {
                              success: true,
                              data: {
                                    totalEvents: 12,
                                    scannedTickets: 1247,
                                    todayScans: 89,
                                    successRate: 98.5,
                                    recentActivity: [
                                          { id: 1, event: 'Comedy Night Special', scans: 45, time: '2 hours ago' },
                                          { id: 2, event: 'Stand-up Championship', scans: 32, time: '4 hours ago' },
                                          { id: 3, event: 'Open Mic Night', scans: 12, time: '6 hours ago' }
                                    ]
                              }
                        };
                  }

                  return await apiService.get(API_CONFIG.ENDPOINTS.STATS);
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to fetch statistics'
                  };
            }
      }
};

/**
 * Events API calls
 */
export const showAPI = {
      /**
       * Get all events
       */
      getShowsByClub: async (clubId) => {
            try {

                  return await apiService.get(`${API_CONFIG.ENDPOINTS.SHOWS}/${clubId}`, {
                        includeAuth: true,
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to fetch events'
                  };
            }
      },
      getTicketsByShow: async (show_id, show_date_id) => {
            try {
                  return await apiService.post(`${API_CONFIG.ENDPOINTS.SHOW_TICKETS}`, {
                        show_id: 2,
                        show_date_id: 2,
                  }, {
                        includeAuth: true,
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to fetch tickets'
                  };
            }
      },

};

/**
 * Ticket scanning API calls
 */
export const scanAPI = {
      /**
       * Scan ticket QR code
       * @param {number} show_id - Show ID
       * @param {number} show_date_id - Show date ID
       * @param {string} ticket_code - Ticket code
       */
      scanTicket: async (show_id, show_date_id, ticket_code) => {
            try {


                  return await apiService.post(API_CONFIG.ENDPOINTS.SCAN_TICKET, {
                        show_id,
                        show_date_id,
                        ticket_code,
                    }, {
                        includeAuth: true,
                  }
                  );
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to scan ticket'
                  };
            }
      }
};

/**
 * User profile API calls
 */
export const profileAPI = {
      /**
       * Get user profile
       */
      getProfile: async () => {
            try {
                  if (__DEV__) {
                        await new Promise(resolve => setTimeout(resolve, 800));
                        return {
                              success: true,
                              data: {
                                    id: 1,
                                    name: 'John Doe',
                                    email: 'john.doe@laughfactory.com',
                                    phone: '+1234567890',
                                    role: 'Scanner',
                                    department: 'Event Management',
                                    joinDate: '2024-01-15',
                                    lastLogin: new Date().toISOString(),
                                    permissions: ['scan_tickets', 'view_events', 'view_stats']
                              }
                        };
                  }

                  return await apiService.get(API_CONFIG.ENDPOINTS.PROFILE);
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to fetch profile'
                  };
            }
      },

      /**
       * Update user profile
       * @param {object} profileData - Profile data to update
       */
      updateProfile: async (profileData) => {
            try {
                  if (__DEV__) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return {
                              success: true,
                              data: {
                                    ...profileData,
                                    message: 'Profile updated successfully'
                              }
                        };
                  }

                  return await apiService.put(API_CONFIG.ENDPOINTS.PROFILE, profileData);
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to update profile'
                  };
            }
      }
};
