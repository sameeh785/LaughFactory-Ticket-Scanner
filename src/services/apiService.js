import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/apiConfig';

/**
 * API Service Class
 * Centralized service for all API calls with authentication, error handling, and request/response interceptors
 */
class ApiService {
      constructor() {
            this.baseURL = API_CONFIG.BASE_URL;
            this.timeout = API_CONFIG.TIMEOUT;
            this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
            this.username = API_CONFIG.BASIC_AUTH_USERNAME;
            this.password = API_CONFIG.BASIC_AUTH_PASSWORD;
            this.onUnauthorized = null; // Callback for 401 errors
      }

      /**
       * Get authentication token from secure storage
       */
      async getAuthToken() {
            try {
                  return await SecureStore.getItemAsync('authToken');
            } catch (error) {
                  console.error('Error getting auth token:', error);
                  return null;
            }
      }

      /**
       * Set authentication token in secure storage
       */
      async setAuthToken(token) {
            try {
                  await SecureStore.setItemAsync('authToken', token);
            } catch (error) {
                  console.error('Error setting auth token:', error);
            }
      }

      /**
       * Remove authentication token from secure storage
       */
      async removeAuthToken() {
            try {
                  await SecureStore.deleteItemAsync('authToken');
            } catch (error) {
                  console.error('Error removing auth token:', error);
            }
      }

      /**
       * Set callback for unauthorized (401) errors
       */
      setUnauthorizedCallback(callback) {
            this.onUnauthorized = callback;
      }

      /**
       * Get headers with authentication
       */
      async getHeaders(includeAuth = true, isLoginScreen = false) {
            const headers = { ...this.defaultHeaders };
            if(isLoginScreen){
                  const credentials = btoa(`${this.username}:${this.password}`);
                  headers.Authorization = `Basic ${credentials}`;
            }
            if (includeAuth) {

                  const token = await this.getAuthToken();
                  if (token) {
                        headers.Authorization = `Bearer ${token}`;
                  }
            }

            return headers;
      }

      /**
       * Generic API request method
       */
      async request(url, options = {}) {
            try {
                  const { method = 'GET', body, includeAuth = true,isLoginScreen = false, ...otherOptions } = options;
                  const headers = await this.getHeaders(includeAuth,isLoginScreen);

                  const config = {
                        method,
                        headers,
                        ...otherOptions,
                  };

                  if (body && method !== 'GET') {
                        config.body = JSON.stringify(body);
                  }

                  const controller = new AbortController();
                  const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                  config.signal = controller.signal;

                  const response = await fetch(url, config);
                  clearTimeout(timeoutId);
                   // if error is 401, remove auth token and call unauthorized callback
                   if (response.status === 401) {
                        await this.removeAuthToken();
                        // Call the unauthorized callback if set
                        if (this.onUnauthorized) {
                              this.onUnauthorized();
                        }
                        return {
                              success: false,
                              error: 'Unauthorized',
                              status: 401,
                        };
                  }
                  const responseData = await response.json();

                  if (!response.ok) {
                        throw new Error(responseData.message || `HTTP Error: ${response.status}`);
                  }

                  return {
                        success: true,
                        data: responseData,
                        status: response.status,
                  };
            } catch (error) {   
                  return {
                        success: false,
                        error: error.message || 'Network request failed',
                        status: error.status || 500,
                  };
            }
      }

      /**
       * GET request
       */
      async get(endpoint, options = {}) {
            const url = `${this.baseURL}${endpoint}`;
            return this.request(url, { method: 'GET', ...options });
      }

      /**
       * POST request
       */
      async post(endpoint, body, options = {}) {
            const url = `${this.baseURL}${endpoint}`;
            return this.request(url, { method: 'POST', body, ...options });
      }

      /**
       * PUT request
       */
      async put(endpoint, body, options = {}) {
            const url = `${this.baseURL}${endpoint}`;
            return this.request(url, { method: 'PUT', body, ...options });
      }

      /**
       * DELETE request
       */
      async delete(endpoint, options = {}) {
            const url = `${this.baseURL}${endpoint}`;
            return this.request(url, { method: 'DELETE', ...options });
      }

      /**
       * Update base URL (useful when switching between development and production)
       */
      updateBaseURL(newBaseURL) {
            this.baseURL = newBaseURL;
      }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
