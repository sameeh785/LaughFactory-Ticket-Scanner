import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      RefreshControl,
      TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showAPI } from '../services/apiEndpoints';
import ShowCard from '../components/ShowCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';
import { colors, commonStyles, debounce } from '../utils/helpers';

const ShowsScreen = ({ navigation }) => {
      const [shows, setShows] = useState([]);
      const [filteredShows, setFilteredShows] = useState([]);
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);
      const [searchQuery, setSearchQuery] = useState('');


      useEffect(() => {
            fetchShows();
      }, []);

      useEffect(() => {
            filterShows();
      }, [shows, searchQuery]);

      const fetchShows = async () => {
            try {
                  const response = await showAPI.getShowsByClub(process.env.EXPO_PUBLIC_CLUB_ID);
                  if (response?.success && response?.data?.data?.length > 0) {
                        setShows(response.data.data);
                  } else {
                        console.error('Failed to fetch shows:', response.error);
                  }
            } catch (error) {
                  console.error('Error fetching shows:', error);
            } finally {
                  setLoading(false);
            }
      };

      const onRefresh = async () => {
            setRefreshing(true);
            await fetchShows();
            setRefreshing(false);
      };

      const filterShows = () => {
            let filtered = [...shows];
            // Apply search filter
            if (searchQuery.trim()) {
                  const query = searchQuery.toLowerCase();
                  filtered = filtered.filter(show =>
                        show.title.toLowerCase().includes(query) ||
                        show.description.toLowerCase().includes(query) ||
                        (show.comedians && show.comedians.some(comedian => 
                              comedian.name.toLowerCase().includes(query)
                        ))
                  );
            }

            setFilteredShows(filtered);
      };

      const debouncedSearch = debounce((query) => {
            setSearchQuery(query);
      }, 300);

      const handleViewTickets = (show) => {
            // Navigate to tickets screen with static data for now
            navigation.navigate('TicketsScreen', { 
                  show,
                  show_date_id: show.date_id,
                  show_id: show.id,
                  tickets: [
                        {
                              id: 1,
                              ticket_number: 'TKT-001',
                              customer_name: 'John Doe',
                              seat_number: 'A1',
                              status: 'valid',
                              purchase_date: '2025-01-15',
                              price: '$25.00'
                        },
                        {
                              id: 2,
                              ticket_number: 'TKT-002',
                              customer_name: 'Jane Smith',
                              seat_number: 'A2',
                              status: 'valid',
                              purchase_date: '2025-01-15',
                              price: '$25.00'
                        },
                        {
                              id: 3,
                              ticket_number: 'TKT-003',
                              customer_name: 'Mike Johnson',
                              seat_number: 'B1',
                              status: 'scanned',
                              purchase_date: '2025-01-14',
                              price: '$25.00'
                        },
                        {
                              id: 4,
                              ticket_number: 'TKT-004',
                              customer_name: 'Sarah Wilson',
                              seat_number: 'B2',
                              status: 'valid',
                              purchase_date: '2025-01-16',
                              price: '$25.00'
                        },
                        {
                              id: 5,
                              ticket_number: 'TKT-005',
                              customer_name: 'David Brown',
                              seat_number: 'C1',
                              status: 'valid',
                              purchase_date: '2025-01-13',
                              price: '$25.00'
                        }
                  ]
            });
      };

      const renderShow = ({ item }) => (
            <ShowCard
                  show={item}
                  onViewTickets={() => handleViewTickets(item)}
            />
      );

      const EmptyState = () => (
            <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🎭</Text>
                  <Text style={styles.emptyTitle}>
                        {searchQuery ? 'No shows found' : 'No shows available'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                        {searchQuery
                              ? 'Try adjusting your search or filter criteria'
                              : 'Shows will appear here when they are created'
                        }
                  </Text>
                  {searchQuery && (
                        <TouchableOpacity
                              style={styles.clearSearchButton}
                              onPress={() => {
                                    setSearchQuery('');
                                    setSelectedFilter('all');
                              }}
                        >
                              <Text style={styles.clearSearchText}>Clear Search</Text>
                        </TouchableOpacity>
                  )}
            </View>
      );

      if (loading) {
            return <LoadingSpinner text="Loading shows..." />;
      }

      return (
            <SafeAreaView style={styles.container}>
                  <View style={styles.header}>
                        <Text style={styles.headerTitle}>🎭 Shows</Text>
                        <Text style={styles.headerSubtitle}>
                              {filteredShows.length} show{filteredShows.length !== 1 ? 's' : ''} found
                        </Text>
                  </View>

                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                        <Input
                              placeholder="Search shows, comedians..."
                              onChangeText={debouncedSearch}
                              leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
                              style={styles.searchInput}
                        />
                  </View>
  

                  {/* Shows List */}
                  <FlatList
                        data={filteredShows}
                        renderItem={renderShow}
                        keyExtractor={(_) => Math.random().toString(36).substring(2, 15)}
                        refreshControl={
                              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        ListEmptyComponent={EmptyState}
                        contentContainerStyle={
                              filteredShows.length === 0 ? styles.emptyListContainer : styles.listContainer
                        }
                        showsVerticalScrollIndicator={false}
                  />
            </SafeAreaView>
      );
};

const styles = StyleSheet.create({
      container: {
            ...commonStyles.container,
      },
      header: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
      },
      headerSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginTop: 4,
      },
      searchContainer: {
            paddingHorizontal: 20,
            paddingVertical: 12,
      },
      searchInput: {
            marginBottom: 0,
      },
      searchIcon: {
            fontSize: 18,
      },
      filtersContainer: {
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      filtersContent: {
            paddingHorizontal: 20,
      },
      filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 12,
            borderRadius: 20,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
      },
      filterButtonActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
      },
      filterIcon: {
            fontSize: 16,
            marginRight: 6,
      },
      filterText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
      },
      filterTextActive: {
            color: colors.background,
      },
      listContainer: {
            paddingTop: 8,
            paddingBottom: 20,
      },
      emptyListContainer: {
            flex: 1,
      },
      emptyContainer: {
            flex: 1,
            ...commonStyles.centerContent,
            paddingHorizontal: 40,
      },
      emptyIcon: {
            fontSize: 64,
            marginBottom: 20,
      },
      emptyTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 8,
      },
      emptySubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
      },
      clearSearchButton: {
            marginTop: 20,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor: colors.primary,
      },
      clearSearchText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.background,
      },
});

export default  ShowsScreen;
