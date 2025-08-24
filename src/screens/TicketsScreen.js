import React, { useEffect, useState } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      TouchableOpacity,
      Alert,
      TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../utils/helpers';
import { showAPI } from '../services/apiEndpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import { useIsFocused } from '@react-navigation/native';

const TicketsScreen = ({ route, navigation }) => {
      const { show } = route.params || {};
      const [tickets, setTickets] = useState([]);
      const [filteredTickets, setFilteredTickets] = useState([]);
      const [searchQuery, setSearchQuery] = useState('');
      const [loading, setLoading] = useState(true);
      const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'scanned'
      const isFocused = useIsFocused();

      const getStatusColor = (isScanned) => {
            return isScanned ? colors.success : colors.warning;
      };

      const getStatusIcon = (isScanned) => {
            return isScanned ? '✅' : '⏳';
      };

      const getStatusText = (isScanned) => {
            return isScanned ? 'SCANNED' : 'PENDING';
      };

      // Filter tickets by status
      const filterTicketsByStatus = (status) => {
            setActiveFilter(status);
            let filtered = tickets;
            
            if (status === 'pending') {
                  filtered = tickets.filter(ticket => !ticket.is_scanned);
            } else if (status === 'scanned') {
                  filtered = tickets.filter(ticket => ticket.is_scanned);
            }
            
            // Apply search filter if there's a search query
            if (searchQuery.trim()) {
                  filtered = filtered.filter(ticket => 
                        ticket.attendee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ticket.ticket_id.toString().includes(searchQuery) ||
                        ticket.ticket_code.toLowerCase().includes(searchQuery.toLowerCase())
                  );
            }
            
            setFilteredTickets(filtered);
      };

      // Search functionality
      const handleSearch = (query) => {
            setSearchQuery(query);
            if (!query.trim()) {
                  // If no search query, apply only status filter
                  if (activeFilter === 'pending') {
                        setFilteredTickets(tickets.filter(ticket => !ticket.is_scanned));
                  } else if (activeFilter === 'scanned') {
                        setFilteredTickets(tickets.filter(ticket => ticket.is_scanned));
                  } else {
                        setFilteredTickets(tickets);
                  }
                  return;
            }
            
            let filtered = tickets;
            
            // Apply status filter first
            if (activeFilter === 'pending') {
                  filtered = tickets.filter(ticket => !ticket.is_scanned);
            } else if (activeFilter === 'scanned') {
                  filtered = tickets.filter(ticket => ticket.is_scanned);
            }
            
            // Then apply search filter
            filtered = filtered.filter(ticket => 
                  ticket.attendee.toLowerCase().includes(query.toLowerCase()) ||
                  ticket.ticket_id.toString().includes(query) ||
                  ticket.ticket_code.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredTickets(filtered);
      };

      const clearSearch = () => {
            setSearchQuery('');
            // Reapply status filter
            filterTicketsByStatus(activeFilter);
      };


      const handleScanTicket = (ticket) => {
            Alert.alert(
                  'Scan Ticket',
                  `Scan ticket #${ticket.ticket_id} for ${ticket.attendee}?`,
                  [
                        {
                              text: 'Cancel',
                              style: 'cancel',
                        },
                        {
                              text: 'Scan',
                              onPress: () => {
                                    // Navigate to QR Scanner with ticket info
                                    navigation.navigate('QRScanner', { 
                                          show, 
                                          ticket,
                                          mode: 'scan_ticket'
                                    });
                              },
                        },
                  ]
            );
      };

      const handleViewTicketDetails = (ticket) => {
            Alert.alert(
                  'Ticket Details',
                  `Ticket ID: ${ticket.ticket_id}\nAttendee: ${ticket.attendee}\nCode: ${ticket.ticket_code}\nStatus: ${ticket.is_scanned ? 'Scanned' : 'Not Scanned'}${ticket.scanned_at ? `\nScanned at: ${new Date(ticket.scanned_at).toLocaleString()}` : ''}`,
                  [{ text: 'OK' }]
            );
      };

      const renderTicket = ({ item }) => (
            <TouchableOpacity
                  style={[styles.ticketCard, commonStyles.shadow]}
                  onPress={() => handleViewTicketDetails(item)}
            >
                  <View style={styles.ticketHeader}>
                        <View style={styles.ticketInfo}>
                              <Text style={styles.ticketNumber}>#{item.ticket_id}</Text>
                              <Text style={styles.customerName}>{item.attendee}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.is_scanned) }]}>
                              <Text style={styles.statusIcon}>{getStatusIcon(item.is_scanned)}</Text>
                              <Text style={styles.statusText}>{getStatusText(item.is_scanned)}</Text>
                        </View>
                  </View>

                  <View style={styles.ticketDetails}>
                        <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Ticket Code:</Text>
                              <Text style={styles.detailValue} numberOfLines={1}>{item.ticket_code}</Text>
                        </View>
                        {item.is_scanned && item.scanned_at && (
                              <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Scanned At:</Text>
                                    <Text style={styles.detailValue}>{new Date(item.scanned_at).toLocaleString()}</Text>
                              </View>
                        )}
                  </View>

                  {!item.is_scanned && (
                        <TouchableOpacity
                              style={styles.scanButton}
                              onPress={() => handleScanTicket(item)}
                        >
                              <Text style={styles.scanButtonText}>📱 Scan Ticket</Text>
                        </TouchableOpacity>
                  )}
            </TouchableOpacity>
      );

      const EmptyState = () => (
            <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🎫</Text>
                  <Text style={styles.emptyTitle}>
                        {searchQuery ? 'No matching tickets found' : 'No tickets found'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                        {searchQuery 
                              ? 'Try adjusting your search terms'
                              : 'Tickets will appear here when they are available'
                        }
                  </Text>
            </View>
      );


      const fetchTickets = async () => {
            try {
                 const response = await showAPI.getTicketsByShow(show.id, show.date_id);
                  if(response?.data?.data){
                        setTickets(response.data.data);
                        // Initialize with all tickets (default filter)
                        setFilteredTickets(response.data.data);
                  }
            } catch (error) {
                  console.error('Error fetching tickets:', error);
            } finally {
                  setLoading(false);
            }
      };
      useEffect(() => {
            fetchTickets();
      }, [isFocused]);

      if (loading) {
            return <LoadingSpinner />;
      }
      return (
            <SafeAreaView style={styles.container}>
                  <View style={styles.header}>
                        <TouchableOpacity
                              style={styles.backButton}
                              onPress={() => navigation.goBack()}
                        >
                              <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                              <Text style={styles.headerTitle}>🎫 Tickets</Text>
                              <Text style={styles.showTitle}>{show?.title || 'Show Tickets'}</Text>
                              <Text style={styles.headerSubtitle}>
                                    {filteredTickets.length} of {tickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} shown
                              </Text>
                        </View>
                  </View>

                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                              <Text style={styles.searchIcon}>🔍</Text>
                              <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search by name, ticket ID, or code..."
                                    placeholderTextColor={colors.textSecondary}
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                              />
                              {searchQuery.length > 0 && (
                                    <TouchableOpacity
                                          style={styles.clearButton}
                                          onPress={clearSearch}
                                    >
                                          <Text style={styles.clearButtonText}>✕</Text>
                                    </TouchableOpacity>
                              )}
                        </View>
                  </View>

                  {/* Filter Buttons */}
                  <View style={styles.filtersContainer}>
                        <View style={styles.filtersContent}>
                              <TouchableOpacity
                                    style={[
                                          styles.filterButton,
                                          activeFilter === 'all' && styles.filterButtonActive
                                    ]}
                                    onPress={() => filterTicketsByStatus('all')}
                              >
                                    <Text style={[
                                          styles.filterIcon,
                                          activeFilter === 'all' && styles.filterTextActive
                                    ]}>📋</Text>
                                    <Text style={[
                                          styles.filterText,
                                          activeFilter === 'all' && styles.filterTextActive
                                    ]}>All</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                    style={[
                                          styles.filterButton,
                                          activeFilter === 'pending' && styles.filterButtonActive
                                    ]}
                                    onPress={() => filterTicketsByStatus('pending')}
                              >
                                    <Text style={[
                                          styles.filterIcon,
                                          activeFilter === 'pending' && styles.filterTextActive
                                    ]}>⏳</Text>
                                    <Text style={[
                                          styles.filterText,
                                          activeFilter === 'pending' && styles.filterTextActive
                                    ]}>Pending</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                    style={[
                                          styles.filterButton,
                                          activeFilter === 'scanned' && styles.filterButtonActive
                                    ]}
                                    onPress={() => filterTicketsByStatus('scanned')}
                              >
                                    <Text style={[
                                          styles.filterIcon,
                                          activeFilter === 'scanned' && styles.filterTextActive
                                    ]}>✅</Text>
                                    <Text style={[
                                          styles.filterText,
                                          activeFilter === 'scanned' && styles.filterTextActive
                                    ]}>Scanned</Text>
                              </TouchableOpacity>
                        </View>
                  </View>

                  {/* Tickets List */}
                  <FlatList
                        data={filteredTickets}
                        renderItem={renderTicket}
                        keyExtractor={(item) => item.ticket_id.toString()}
                        ListEmptyComponent={EmptyState}
                        contentContainerStyle={
                              filteredTickets.length === 0 ? styles.emptyListContainer : styles.listContainer
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
      backButton: {
            marginBottom: 12,
      },
      backButtonText: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: '500',
      },
      headerContent: {
            alignItems: 'center',
      },
      headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
      },
      showTitle: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: '600',
            marginBottom: 4,
      },
      headerSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
      },
      searchContainer: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      searchInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.border,
      },
      searchIcon: {
            fontSize: 16,
            marginRight: 8,
            color: colors.textSecondary,
      },
      searchInput: {
            flex: 1,
            fontSize: 16,
            color: colors.text,
            paddingVertical: 12,
      },
      clearButton: {
            padding: 4,
            marginLeft: 8,
      },
      clearButtonText: {
            fontSize: 16,
            color: colors.textSecondary,
            fontWeight: 'bold',
      },
      filtersContainer: {
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      filtersContent: {
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
      },
      filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            flex: 1,
            marginHorizontal: 4,
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
      ticketCard: {
            backgroundColor: colors.background,
            borderRadius: 12,
            marginHorizontal: 16,
            marginVertical: 8,
            overflow: 'hidden',
      },
      ticketHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      ticketInfo: {
            flex: 1,
      },
      ticketNumber: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
      },
      customerName: {
            fontSize: 14,
            color: colors.textSecondary,
      },
      statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
      },
      statusIcon: {
            fontSize: 12,
            marginRight: 4,
      },
      statusText: {
            fontSize: 10,
            fontWeight: '600',
            color: colors.background,
      },
      ticketDetails: {
            padding: 16,
      },
      detailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
      },
      detailLabel: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.textSecondary,
      },
      detailValue: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
      },
      scanButton: {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
      },
      scanButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.background,
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
});

export default TicketsScreen;
