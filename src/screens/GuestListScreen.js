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

const GuestListScreen = () => {
      const route = useRoute();
      const { show } = route.params || {};
      
      // Handle case where show is not provided
      if (!show) {
            return (
                  <View style={styles.container}>
                        <View style={styles.header}>
                              <Text style={styles.title}>👥 Guest List</Text>
                              <Text style={styles.subtitle}>Show not found</Text>
                        </View>
                  </View>
            );
      }
      
      const [guests, setGuests] = useState([]);
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);

      const fetchGuestList = async () => {
            try {
                  const response = await showAPI.getGuestListByShow(show);
                  const payload = response?.data?.data ?? response?.data ?? [];
                  const normalized = Array.isArray(payload) ? payload : (payload ? [payload] : []);
                  setGuests(normalized);
            } catch (error) {
                  console.error('Error fetching guest list:', error);
            } finally {
                  setLoading(false);
            }
      };

      const onRefresh = async () => {
            setRefreshing(true);
            await fetchGuestList();
            setRefreshing(false);
      };

      useEffect(() => {
            fetchGuestList();
      }, [show.id]);

      const renderGuestItem = ({ item, index }) => (
            <View style={[
                  styles.guestItem,
                  item.is_scanned ? styles.guestItemChecked : styles.guestItemPending
            ]}>
                  <View style={styles.guestInfo}>
                  <View style={styles.fieldRow}>
                              <Text style={styles.labelBold}>Name:</Text>
                              <Text style={styles.fieldValue}>{item.vip_guest.name || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldRow}>
                              <Text style={styles.labelBold}>Email:</Text>
                              <Text style={styles.fieldValue}>{item.vip_guest.email || 'N/A'}</Text>
                        </View>
                        <View style={styles.fieldRow}>
                              <Text style={styles.labelBold}>Phone:</Text>
                              <Text style={styles.fieldValue}>{item.vip_guest.phone || 'N/A'}</Text>
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
                  <View style={styles.guestStatus}>
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

      const scannedCount = guests.filter(g => g?.is_scanned).length;

      return (
            <View style={styles.container}>
                  <View style={styles.header}>
                        <Text style={styles.title}>👥 Guest List</Text>
                        <Text style={styles.subtitle}>{show.title}</Text>
                        <View style={styles.countsRow}>
                              <Text style={styles.countBadge}>
                                    Total: {guests.length}
                              </Text>
                              <Text style={[styles.countBadge, styles.countBadgeScanned]}>
                                    Scanned: {scannedCount}
                              </Text>
                        </View>
                  </View>

                  <FlatList
                        data={guests}
                        renderItem={renderGuestItem}
                        keyExtractor={(item, index) => item.ticket_id?.toString() || item.id?.toString() || index.toString()}
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
                                    <Text style={styles.emptyEmoji}>👥</Text>
                                    <Text style={styles.emptyTitle}>No Guests Yet</Text>
                                    <Text style={styles.emptyText}>
                                          The guest list for this show is empty.
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
      guestItem: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            ...commonStyles.shadow,
            position: 'relative',
      },
      guestItemChecked: {
            borderWidth: 1,
            borderColor: colors.primary,
      },
      guestItemPending: {
            borderWidth: 1,
            borderColor: colors.border,
      },
      guestInfo: {
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
      guestStatus: {
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

export default GuestListScreen;
