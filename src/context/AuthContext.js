import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/apiEndpoints';
import apiService from '../services/apiService';

// Initial state
const initialState = {
      isAuthenticated: false,
      user: null,
      loading: true,
      error: null,
};

// Action types
const ActionTypes = {
      SET_LOADING: 'SET_LOADING',
      LOGIN_SUCCESS: 'LOGIN_SUCCESS',
      LOGIN_FAILURE: 'LOGIN_FAILURE',
      LOGOUT: 'LOGOUT',
      UPDATE_USER: 'UPDATE_USER',
      CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
      switch (action.type) {
            case ActionTypes.SET_LOADING:
                  return {
                        ...state,
                        loading: action.payload,
                  };
            case ActionTypes.LOGIN_SUCCESS:
                  return {
                        ...state,
                        isAuthenticated: true,
                        user: action.payload.user,
                        loading: false,
                        error: null,
                  };
            case ActionTypes.LOGIN_FAILURE:
                  return {
                        ...state,
                        isAuthenticated: false,
                        user: null,
                        loading: false,
                        error: action.payload,
                  };
            case ActionTypes.LOGOUT:
                  return {
                        ...state,
                        isAuthenticated: false,
                        user: null,
                        loading: false,
                        error: null,
                  };
            case ActionTypes.UPDATE_USER:
                  return {
                        ...state,
                        user: { ...state.user, ...action.payload },
                  };
            case ActionTypes.CLEAR_ERROR:
                  return {
                        ...state,
                        error: null,
                  };
            default:
                  return state;
      }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
      const [state, dispatch] = useReducer(authReducer, initialState);

      // Check if user is already logged in when app starts
      useEffect(() => {
            checkAuthStatus();
      }, []);

      const checkAuthStatus = async () => {
            try {
                  const token = await apiService.getAuthToken();
                  if (token) {
                        // Verify token is still valid by fetching user profile
                        const response = await authAPI.getProfile?.() || { success: false };
                        if (response.success) {
                              dispatch({
                                    type: ActionTypes.LOGIN_SUCCESS,
                                    payload: { user: response.data },
                              });
                        } else {
                              // Token is invalid, remove it
                              await apiService.removeAuthToken();
                              dispatch({ type: ActionTypes.SET_LOADING, payload: false });
                        }
                  } else {
                        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
                  }
            } catch (error) {
                  console.error('Auth status check failed:', error);
                  dispatch({ type: ActionTypes.SET_LOADING, payload: false });
            }
      };

      const login = async (email, password) => {
            try {
                  dispatch({ type: ActionTypes.SET_LOADING, payload: true });

                  const response = await authAPI.login(email, password);

                  if (response.success) {
                        dispatch({
                              type: ActionTypes.LOGIN_SUCCESS,
                              payload: response.data,
                        });

                        // set token in async storage
                        await apiService.setAuthToken(response?.data?.data?.token);

                        return { success: true };
                  } else {
                        dispatch({
                              type: ActionTypes.LOGIN_FAILURE,
                              payload: response.error,
                        });
                        return { success: false, error: response.error };
                  }
            } catch (error) {
                  const errorMessage = error.message || 'Login failed';
                  dispatch({
                        type: ActionTypes.LOGIN_FAILURE,
                        payload: errorMessage,
                  });
                  return { success: false, error: errorMessage };
            }
      };

      const logout = async () => {
            try {
                  await authAPI.logout();
                  dispatch({ type: ActionTypes.LOGOUT });
                  return { success: true };
            } catch (error) {
                  console.error('Logout error:', error);
                  // Even if logout API fails, clear local state
                  dispatch({ type: ActionTypes.LOGOUT });
                  return { success: true };
            }
      };

      const updateUser = (userData) => {
            dispatch({
                  type: ActionTypes.UPDATE_USER,
                  payload: userData,
            });
      };

      const clearError = () => {
            dispatch({ type: ActionTypes.CLEAR_ERROR });
      };

      const forgotPassword = async (email) => {
            try {
                  const response = await authAPI.forgotPassword(email);
                  return response;
            } catch (error) {
                  return { success: false, error: error.message || 'Failed to send reset email' };
            }
      };

      const updatePassword = async (currentPassword, newPassword) => {
            try {
                  const response = await authAPI.updatePassword(currentPassword, newPassword);
                  return response;
            } catch (error) {
                  return { success: false, error: error.message || 'Failed to update password' };
            }
      };

      const value = {
            ...state,
            login,
            logout,
            updateUser,
            clearError,
            forgotPassword,
            updatePassword,
      };

      return (
            <AuthContext.Provider value={value}>
                  {children}
            </AuthContext.Provider>
      );
};

// Custom hook to use auth context
export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
};

export default AuthContext;
