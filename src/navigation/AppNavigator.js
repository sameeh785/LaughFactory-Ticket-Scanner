import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator (for login, forgot password, etc.)
const AuthStack = () => {
      return (
            <Stack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
            >
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </Stack.Navigator>
      );
};

// Main Tab Navigator (for authenticated users)
const MainTabs = () => {
      return (
            <Tab.Navigator
                  screenOptions={{
                        headerShown: false,
                        tabBarStyle: {
                              backgroundColor: '#FFFFFF',
                              borderTopWidth: 1,
                              borderTopColor: '#E1E8ED',
                              paddingBottom: 8,
                              paddingTop: 8,
                              height: 88,
                        },
                        tabBarActiveTintColor: '#FF6B35',
                        tabBarInactiveTintColor: '#7F8C8D',
                        tabBarLabelStyle: {
                              fontSize: 12,
                              fontWeight: '500',
                        },
                  }}
            >
                  <Tab.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{
                              tabBarLabel: 'Dashboard',
                              tabBarIcon: ({ focused }) => (
                                    <Text style={{ fontSize: 20 }}>{focused ? '📊' : '📈'}</Text>
                              ),
                        }}
                  />
                  <Tab.Screen
                        name="Events"
                        component={EventsScreen}
                        options={{
                              tabBarLabel: 'Events',
                              tabBarIcon: ({ focused }) => (
                                    <Text style={{ fontSize: 20 }}>{focused ? '🎭' : '🎪'}</Text>
                              ),
                        }}
                  />
                  <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                              tabBarLabel: 'Profile',
                              tabBarIcon: ({ focused }) => (
                                    <Text style={{ fontSize: 20 }}>{focused ? '👤' : '👥'}</Text>
                              ),
                        }}
                  />
            </Tab.Navigator>
      );
};

// Main App Stack Navigator
const AppStack = () => {
      return (
            <Stack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
            >
                  <Stack.Screen name="MainTabs" component={MainTabs} />
                  <Stack.Screen
                        name="QRScanner"
                        component={QRScannerScreen}
                        options={{
                              presentation: 'modal',
                        }}
                  />
            </Stack.Navigator>
      );
};

// Root Navigator
const RootNavigator = () => {
      const { isAuthenticated, loading } = useAuth();

      if (loading) {
            return <LoadingSpinner text="Loading app..." />;
      }

      return (
            <NavigationContainer>
                  {isAuthenticated ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
      );
};

export default RootNavigator;
