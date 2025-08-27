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
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Login failed'
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
                        show_id,
                        show_date_id,
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
      getGuestListByShow: async (show) => {
            try {
                  return await apiService.post(`${API_CONFIG.ENDPOINTS.GUEST_LIST_BY_SHOW}`, {
                        show_id: show.id,
                        show_date_id: show.date_id

                  }, {
                        includeAuth: true,
                  });
            } catch (error) {
                  return {
                        success: false,
                        error: error.message || 'Failed to fetch guest list'
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