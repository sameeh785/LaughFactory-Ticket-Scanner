import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import ShowsScreen from '../screens/ShowsScreen';
import LogoutScreen from '../screens/LogoutScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import TicketsScreen from '../screens/TicketsScreen';
import GuestListScreen from '../screens/GuestListScreen';
import AttendeesScreen from '../screens/AttendeesScreen';


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
                        name="Shows"
                        component={ShowsScreen}
                        options={{
                              tabBarLabel: 'Shows',
                              tabBarIcon: ({ focused }) => (
                                    <Text style={{ fontSize: 20 }}>{focused ? '🎭' : '🎪'}</Text>
                              ),
                        }}
                  />
                  <Tab.Screen
                        name="Logout"
                        component={LogoutScreen}
                        options={{
                              tabBarLabel: 'Logout',
                              tabBarIcon: ({ focused }) => (
                                    <Text style={{ fontSize: 20 }}>{focused ? '🚪' : '🚪'}</Text>
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
                              animation: 'slide_from_bottom',
                        }}
                  />
                  <Stack.Screen
                        name="TicketsScreen"
                        component={TicketsScreen}
                        options={{
                              presentation: 'card',
                        }}
                  />
                  <Stack.Screen
                        name="GuestList"
                        component={GuestListScreen}
                        options={{
                              presentation: 'card',
                              headerShown: true,
                              title: 'Guest List',
                        }}
                  />
                  <Stack.Screen
                        name="Attendees"
                        component={AttendeesScreen}
                        options={{
                              presentation: 'card',
                              headerShown: true,
                              title: 'Attendees',
                        }}
                  />
            </Stack.Navigator>
      );
};

// Root Navigator
const RootNavigator = () => {
      const { isAuthenticated, loading } = useAuth();

      if (loading) {
            return <LoadingSpinner />;
      }

      return (
            <NavigationContainer>
                  {isAuthenticated ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
      );
};

export default RootNavigator;
