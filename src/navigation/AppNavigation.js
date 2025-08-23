import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EventsScreen from '../screens/EventsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import helpers
import { colors } from '../utils/helpers';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
const TabNavigator = () => {
      return (
            <Tab.Navigator
                  screenOptions={{
                        tabBarActiveTintColor: colors.primary,
                        tabBarInactiveTintColor: colors.textSecondary,
                        tabBarStyle: {
                              backgroundColor: colors.background,
                              borderTopColor: colors.border,
                              borderTopWidth: 1,
                              paddingTop: 8,
                              paddingBottom: 8,
                              height: 60,
                        },
                        tabBarLabelStyle: {
                              fontSize: 12,
                              fontWeight: '500',
                              marginTop: 4,
                        },
                        headerStyle: {
                              backgroundColor: colors.background,
                              borderBottomColor: colors.border,
                              borderBottomWidth: 1,
                        },
                        headerTitleStyle: {
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: colors.text,
                        },
                        headerTintColor: colors.primary,
                  }}
            >
                  <Tab.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{
                              tabBarLabel: 'Dashboard',
                              tabBarIcon: ({ color, size }) => (
                                    <TabIcon emoji="📊" color={color} size={size} />
                              ),
                              headerTitle: '📊 Dashboard',
                        }}
                  />
                  <Tab.Screen
                        name="Events"
                        component={EventsScreen}
                        options={{
                              tabBarLabel: 'Events',
                              tabBarIcon: ({ color, size }) => (
                                    <TabIcon emoji="🎭" color={color} size={size} />
                              ),
                              headerTitle: '🎭 Events',
                        }}
                  />
                  <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options={{
                              tabBarLabel: 'Profile',
                              tabBarIcon: ({ color, size }) => (
                                    <TabIcon emoji="👤" color={color} size={size} />
                              ),
                              headerTitle: '👤 Profile',
                        }}
                  />
            </Tab.Navigator>
      );
};

// Custom Tab Icon Component
const TabIcon = ({ emoji, color, size }) => {
      return (
            <Text style={{ fontSize: size * 0.8, opacity: color === colors.primary ? 1 : 0.6 }}>
                  {emoji}
            </Text>
      );
};

// Auth Stack for unauthenticated users
const AuthStack = () => {
      return (
            <Stack.Navigator
                  screenOptions={{
                        headerStyle: {
                              backgroundColor: colors.background,
                              borderBottomColor: colors.border,
                              borderBottomWidth: 1,
                        },
                        headerTitleStyle: {
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: colors.text,
                        },
                        headerTintColor: colors.primary,
                        headerBackTitleVisible: false,
                  }}
            >
                  <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                              headerShown: false,
                        }}
                  />
                  <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPasswordScreen}
                        options={{
                              title: 'Reset Password',
                              headerTitle: '🔑 Reset Password',
                        }}
                  />
            </Stack.Navigator>
      );
};

// Main Stack for authenticated users
const MainStack = () => {
      return (
            <Stack.Navigator
                  screenOptions={{
                        headerStyle: {
                              backgroundColor: colors.background,
                              borderBottomColor: colors.border,
                              borderBottomWidth: 1,
                        },
                        headerTitleStyle: {
                              fontSize: 18,
                              fontWeight: 'bold',
                              color: colors.text,
                        },
                        headerTintColor: colors.primary,
                        headerBackTitleVisible: false,
                  }}
            >
                  <Stack.Screen
                        name="MainTabs"
                        component={TabNavigator}
                        options={{
                              headerShown: false,
                        }}
                  />
                  <Stack.Screen
                        name="QRScanner"
                        component={QRScannerScreen}
                        options={{
                              headerShown: false,
                              presentation: 'modal',
                        }}
                  />
                  <Stack.Screen
                        name="EventDetails"
                        component={EventDetailsPlaceholder}
                        options={({ route }) => ({
                              title: route.params?.event?.title || 'Event Details',
                              headerTitle: `🎭 ${route.params?.event?.title || 'Event Details'}`,
                        })}
                  />
                  <Stack.Screen
                        name="ChangePassword"
                        component={ChangePasswordPlaceholder}
                        options={{
                              title: 'Change Password',
                              headerTitle: '🔑 Change Password',
                        }}
                  />
            </Stack.Navigator>
      );
};

// Placeholder components for screens not yet implemented
const EventDetailsPlaceholder = ({ route }) => {
      const { event } = route.params;
      return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                  <Text style={{ fontSize: 24, marginBottom: 16 }}>🎭</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                        {event.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
                        Event details screen coming soon!
                  </Text>
            </View>
      );
};

const ChangePasswordPlaceholder = () => {
      return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                  <Text style={{ fontSize: 24, marginBottom: 16 }}>🔑</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                        Change Password
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
                        Change password screen coming soon!
                  </Text>
            </View>
      );
};

// Main Navigation Component
const AppNavigation = () => {
      const { isAuthenticated, loading } = useAuth();

      if (loading) {
            return <LoadingSpinner text="Loading..." />;
      }

      return (
            <NavigationContainer>
                  {isAuthenticated ? <MainStack /> : <AuthStack />}
            </NavigationContainer>
      );
};

export default AppNavigation;
