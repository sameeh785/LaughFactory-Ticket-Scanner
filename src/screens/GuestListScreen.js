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

const GuestListScreen = () => {
      const navigation = useNavigation();
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
                  setLoading(true);
                  // TODO: Replace with actual API endpoint
                  const response = await apiService.get(`/shows/${show.id}/guests`);
                  setGuests(response.data || []);
            } catch (error) {
                  console.error('Error fetching guest list:', error);
                  // For development, show mock data instead of error
                  setGuests([
                        {
                              id: 1,
                              name: 'John Doe',
                              email: 'john@example.com',
                              phone: '+1 (555) 123-4567',
                              status: 'confirmed'
                        },
                        {
                              id: 2,
                              name: 'Jane Smith',
                              email: 'jane@example.com',
                              phone: '+1 (555) 987-6543',
                              status: 'pending'
                        }
                  ]);
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
            // fetchGuestList();
      }, [show.id]);

      const renderGuestItem = ({ item, index }) => (
            <View style={styles.guestItem}>
                  <View style={styles.guestInfo}>
                        <Text style={styles.guestName}>{item.name}</Text>
                        <Text style={styles.guestEmail}>{item.email}</Text>
                        {item.phone && (
                              <Text style={styles.guestPhone}>{item.phone}</Text>
                        )}
                  </View>
                  <View style={styles.guestStatus}>
                        <Text style={[
                              styles.statusText,
                              { color: item.status === 'confirmed' ? colors.success : colors.warning }
                        ]}>
                              {item.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
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
                        <Text style={styles.title}>👥 Guest List</Text>
                        <Text style={styles.subtitle}>{show.title}</Text>
                        <Text style={styles.guestCount}>
                              {guests.length} {guests.length === 1 ? 'Guest' : 'Guests'}
                        </Text>
                  </View>

                  <FlatList
                        data={guests}
                        renderItem={renderGuestItem}
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

export default GuestListScreen;
