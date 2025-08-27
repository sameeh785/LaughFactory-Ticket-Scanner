import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, commonStyles } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { showAPI } from '../services/apiEndpoints';

const AttendeesScreen = () => {
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
                  const response = await showAPI.getTicketsByShow(show.id, show.date_id);
                  const payload = response?.data?.data ?? response?.data ?? [];
                  const normalized = Array.isArray(payload) ? payload : (payload ? [payload] : []);
                  setAttendees(normalized);
            } catch (error) {
                  console.error('Error fetching guest list:', error);
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
            <View style={styles.guestItem}>
                  <View style={styles.guestInfo}>
                        <Text style={styles.guestName}>{item.attendee || 'Unnamed Guest'}</Text>
                        {item.ticket_code ? (
                              <Text style={styles.guestEmail}>Ticket: {item.ticket_code}</Text>
                        ) : null}
                        <Text style={styles.guestPhone}>
                              {item.is_scanned
                                    ? (item.scanned_at ? `Scanned at: ${new Date(item.scanned_at).toLocaleString()}` : 'Scanned')
                                    : 'Scan pending'}
                        </Text>
                  </View>
                  <View style={styles.guestStatus}>
                        <Text style={[
                              styles.statusText,
                              { color: item.is_scanned ? colors.success : colors.warning }
                        ]}>
                              {item.is_scanned ? '✅ Scanned' : '⏳ Not Scanned'}
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
      guestCount: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
      },
      listContainer: {
            padding: 16,
      },
      guestItem: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            ...commonStyles.shadow,
      },
      guestInfo: {
            flex: 1,
      },
      guestName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
      },
      guestEmail: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 2,
      },
      guestPhone: {
            fontSize: 14,
            color: colors.textSecondary,
      },
      guestStatus: {
            marginLeft: 12,
      },
      statusText: {
            fontSize: 12,
            fontWeight: '600',
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
