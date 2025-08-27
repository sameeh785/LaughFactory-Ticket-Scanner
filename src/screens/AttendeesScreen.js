import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      TouchableOpacity,
      RefreshControl,
      Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, commonStyles } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/apiService';

const AttendeesScreen = () => {
      const navigation = useNavigation();
      const route = useRoute();
      const { show } = route.params || {};
      
      // Handle case where show is not provided
      if (!show) {
            return (
                  <View style={styles.container}>
                        <View style={styles.header}>
                              <Text style={styles.title}>🎫 Attendees</Text>
                              <Text style={styles.subtitle}>Show not found</Text>
                        </View>
                  </View>
            );
      }
      
      const [attendees, setAttendees] = useState([]);
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);

      const fetchAttendees = async () => {
            try {
                  setLoading(true);
                  // TODO: Replace with actual API endpoint
                  const response = await apiService.get(`/shows/${show.id}/attendees`);
                  setAttendees(response.data || []);
            } catch (error) {
                  console.error('Error fetching attendees:', error);
                  // For development, show mock data instead of error
                  setAttendees([
                        {
                              id: 1,
                              name: 'John Doe',
                              ticket_number: 'TKT-001',
                              email: 'john@example.com',
                              check_in_time: new Date().toISOString()
                        },
                        {
                              id: 2,
                              name: 'Jane Smith',
                              ticket_number: 'TKT-002',
                              email: 'jane@example.com',
                              check_in_time: new Date(Date.now() - 30 * 60 * 1000).toISOString()
                        }
                  ]);
            } finally {
                  setLoading(false);
            }
      };

      const onRefresh = async () => {
            setRefreshing(true);
            await fetchAttendees();
            setRefreshing(false);
      };

      useEffect(() => {
            fetchAttendees();
      }, [show.id]);

      const renderAttendeeItem = ({ item, index }) => (
            <View style={styles.attendeeItem}>
                  <View style={styles.attendeeInfo}>
                        <Text style={styles.attendeeName}>{item.name}</Text>
                        <Text style={styles.ticketNumber}>Ticket: {item.ticket_number}</Text>
                        {item.email && (
                              <Text style={styles.attendeeEmail}>{item.email}</Text>
                        )}
                  </View>
                  <View style={styles.checkInInfo}>
                        <Text style={styles.checkInTime}>
                              {new Date(item.check_in_time).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                              })}
                        </Text>
                        <Text style={styles.checkInDate}>
                              {new Date(item.check_in_time).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                              })}
                        </Text>
                  </View>
            </View>
      );

      if (loading) {
            return <LoadingSpinner />;
      }

      return (
            <View style={styles.container}>
                  <View style={styles.header}>
                        <Text style={styles.title}>🎫 Attendees</Text>
                        <Text style={styles.subtitle}>{show.title}</Text>
                        <Text style={styles.attendeeCount}>
                              {attendees.length} {attendees.length === 1 ? 'Attendee' : 'Attendees'} Checked In
                        </Text>
                  </View>

                  <FlatList
                        data={attendees}
                        renderItem={renderAttendeeItem}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                              <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={[colors.primary]}
                                    tintColor={colors.primary}
                              />
                        }
                        ListEmptyComponent={
                              <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyEmoji}>🎫</Text>
                                    <Text style={styles.emptyTitle}>No Attendees Yet</Text>
                                    <Text style={styles.emptyText}>
                                          No one has checked in for this show yet.
                                    </Text>
                              </View>
                        }
                  />
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: colors.background,
      },
      header: {
            padding: 20,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
      },
      subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 8,
      },
      attendeeCount: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
      },
      listContainer: {
            padding: 16,
      },
      attendeeItem: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            ...commonStyles.shadow,
      },
      attendeeInfo: {
            flex: 1,
      },
      attendeeName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
      },
      ticketNumber: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '500',
            marginBottom: 2,
      },
      attendeeEmail: {
            fontSize: 14,
            color: colors.textSecondary,
      },
      checkInInfo: {
            marginLeft: 12,
            alignItems: 'flex-end',
      },
      checkInTime: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.success,
            marginBottom: 2,
      },
      checkInDate: {
            fontSize: 12,
            color: colors.textSecondary,
      },
      emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 60,
      },
      emptyEmoji: {
            fontSize: 48,
            marginBottom: 16,
      },
      emptyTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
      },
      emptyText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            paddingHorizontal: 32,
      },
});

export default AttendeesScreen;
