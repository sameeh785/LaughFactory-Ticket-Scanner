import { Dimensions, Platform } from 'react-native';

/**
 * Screen dimensions utility
 */
export const screenDimensions = Dimensions.get('window');

/**
 * Check if device is iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if device is Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 */
export const formatDate = (date, format = 'short') => {
      const dateObj = new Date(date);

      switch (format) {
            case 'short':
                  return dateObj.toLocaleDateString();
            case 'long':
                  return dateObj.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                  });
            case 'time':
                  return dateObj.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                  });
            case 'datetime':
                  return `${formatDate(date, 'short')} ${formatDate(date, 'time')}`;
            default:
                  return dateObj.toLocaleDateString();
      }
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 */
export const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 */
export const validatePassword = (password) => {
      if (!password) return { isValid: false, message: 'Password is required' };
      if (password.length < 6) return { isValid: false, message: 'Password must be at least 6 characters' };

      return { isValid: true, message: 'Password is valid' };
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
export const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
};

/**
 * Generate random ID
 */
export const generateId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format number with commas
 * @param {number} number - Number to format
 */
export const formatNumber = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 */
export const calculatePercentage = (value, total) => {
      if (total === 0) return 0;
      return Math.round((value / total) * 100);
};

/**
 * Show toast message (placeholder for toast implementation)
 * @param {string} message - Message to show
 * @param {string} type - Toast type ('success', 'error', 'info')
 */
export const showToast = (message, type = 'info') => {
      // This would be implemented with a toast library like react-native-toast-message
      console.log(`Toast [${type}]: ${message}`);
};

/**
 * Handle API errors consistently
 * @param {object} error - Error object from API
 */
export const handleApiError = (error) => {
      let message = 'Something went wrong. Please try again.';

      if (error.error) {
            message = error.error;
      } else if (error.message) {
            message = error.message;
      }

      showToast(message, 'error');
      return message;
};

/**
 * Check if string is valid QR code format
 * @param {string} qrData - QR code data
 */
export const isValidQRCode = (qrData) => {
      if (!qrData || typeof qrData !== 'string') return false;

      // Basic validation - QR code should have minimum length and format
      return qrData.length >= 10 && qrData.includes('-');
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = () => {
      const hour = new Date().getHours();

      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
};

/**
 * Colors used throughout the app
 */
export const colors = {
      primary: '#FF6B35',     // Orange
      secondary: '#F7931E',   // Light orange
      accent: '#4ECDC4',      // Teal
      background: '#FFFFFF',  // White
      surface: '#F8F9FA',     // Light gray
      text: '#2C3E50',        // Dark blue-gray
      textSecondary: '#7F8C8D', // Gray
      success: '#27AE60',     // Green
      warning: '#F39C12',     // Yellow
      error: '#E74C3C',       // Red
      border: '#E1E8ED',      // Light border
      shadow: '#000000',      // Shadow
};

/**
 * Common app styles
 */
export const commonStyles = {
      container: {
            flex: 1,
            backgroundColor: colors.background,
      },
      centerContent: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
      },
      padding: {
            padding: 16,
      },
      marginBottom: {
            marginBottom: 16,
      },
      shadow: {
            shadowColor: colors.shadow,
            shadowOffset: {
                  width: 0,
                  height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
      },
};
