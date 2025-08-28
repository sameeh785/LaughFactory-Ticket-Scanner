import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      RefreshControl,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
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

      const getInitials = (name) => {
            if (!name || typeof name !== 'string') return '?';
            const parts = name.trim().split(/\s+/).filter(Boolean);
            const first = parts[0]?.[0] || '';
            const second = parts[1]?.[0] || '';
            return `${first}${second}`.toUpperCase() || '?';
      };

      const renderAttendeeItem = ({ item, index }) => (
            <View style={[
                  styles.attendeeItem,
                  item.is_scanned ? styles.attendeeItemChecked : styles.attendeeItemPending
            ]}>
                  <View style={styles.attendeeInfo}>
                        <View style={styles.fieldRow}>
                              <Text style={styles.labelBold}>Name:</Text>
                              <Text style={styles.fieldValue}>{item.attendee.name || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldRow}>
                              <Text style={styles.labelBold}>Email:</Text>
                              <Text style={styles.fieldValue}>{item.attendee.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldRow}>
                              <Text style={styles.labelBold}>Phone:</Text>
                              <Text style={styles.fieldValue}>{item.attendee.phone || 'N/A'}</Text>
                        </View>

                        {item.ticket_code ? (
                              <View style={styles.fieldRow}>
                                    <Text style={styles.labelBold}>Ticket:</Text>
                                    <Text style={styles.ticketCode}>{item.ticket_code}</Text>
                              </View>
                        ) : null}
                        <Text style={styles.metaText}>
                              {item.is_scanned
                                    ? (item.scanned_at ? `Scanned at: ${new Date(item.scanned_at).toLocaleString()}` : 'Scanned')
                                    : 'Scan pending'}
                        </Text>
                  </View>
                  <View style={styles.attendeeStatus}>
                        <View style={[
                              styles.statusBadge,
                              item.is_scanned ? styles.statusBadgePrimary : styles.statusBadgeWarning
                        ]}>
                              <Text style={[
                                    styles.statusBadgeText,
                                    item.is_scanned ? styles.statusBadgeTextPrimary : styles.statusBadgeTextWarning
                              ]}>
                                    {item.is_scanned ? '✅ Checked In' : '⏳ Not Scanned'}
                              </Text>
                        </View>
                  </View>
            </View>
      );

      if (loading) {
            return <LoadingSpinner />;
      }

      const scannedCount = attendees.filter(a => a?.is_scanned).length;

      return (
            <View style={styles.container}>
                  <View style={styles.header}>
                        <Text style={styles.title}>🎫 Attendees</Text>
                        <Text style={styles.subtitle}>{show.title}</Text>
                        <View style={styles.countsRow}>
                              <Text style={styles.countBadge}>
                                    Total: {attendees.length}
                              </Text>
                              <Text style={[styles.countBadge, styles.countBadgeScanned]}>
                              Checked In: {scannedCount}
                              </Text>
                        </View>
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
      countsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
      },
      countBadge: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
            fontSize: 14,
            fontWeight: '600',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            overflow: 'hidden',
      },
      countBadgeScanned: {
            borderColor: colors.primary,
            color: colors.primary,
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
            position: 'relative',
      },
      attendeeItemChecked: {
            borderWidth: 1,
            borderColor: colors.primary,
      },
      attendeeItemPending: {
            borderWidth: 1,
            borderColor: colors.border,
      },
      avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
      },
      avatarChecked: {
            borderColor: colors.primary,
      },
      avatarPending: {
            borderColor: colors.border,
      },
      avatarText: {
            fontSize: 14,
            fontWeight: '700',
            color: colors.text,
      },
      attendeeInfo: {
            flex: 1,
      },
      fieldRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 2,
            flexWrap: 'wrap',
            gap: 6,
      },
      labelBold: {
            fontWeight: '700',
            color: colors.text,
      },
      attendeeStatus: {
            position: 'absolute',
            right: 4,
            top: 4,
      },
      statusBadge: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1,
      },
      statusBadgePrimary: {
            borderColor: colors.primary,
            backgroundColor: 'transparent',
      },
      statusBadgeWarning: {
            borderColor: colors.warning,
            backgroundColor: 'transparent',
      },
      statusBadgeText: {
            fontSize: 12,
            fontWeight: '700',
      },
      statusBadgeTextPrimary: {
            color: colors.primary,
      },
      statusBadgeTextWarning: {
            color: colors.warning,
      },
      fieldValue: {
            fontSize: 14,
            color: colors.text,
      },
      ticketCode: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '700',
      },
      metaText: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 6,
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
