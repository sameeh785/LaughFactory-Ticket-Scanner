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

const TicketsScreen = ({ route, navigation }) => {
      const { show, show_id, show_date_id } = route.params || {};
      const [tickets, setTickets] = useState([]);
      const [filteredTickets, setFilteredTickets] = useState([]);
      const [searchQuery, setSearchQuery] = useState('');
      const [loading, setLoading] = useState(true);
      const getStatusColor = (isScanned) => {
            return isScanned ? colors.success : colors.warning;
      };

      const getStatusIcon = (isScanned) => {
            return isScanned ? '✅' : '⏳';
      };

      const getStatusText = (isScanned) => {
            return isScanned ? 'SCANNED' : 'PENDING';
      };

      // Search functionality
      const handleSearch = (query) => {
            setSearchQuery(query);
            if (!query.trim()) {
                  setFilteredTickets(tickets);
                  return;
            }
            
            const filtered = tickets.filter(ticket => 
                  ticket.attendee.toLowerCase().includes(query.toLowerCase()) ||
                  ticket.ticket_id.toString().includes(query) ||
                  ticket.ticket_code.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredTickets(filtered);
      };

      const clearSearch = () => {
            setSearchQuery('');
            setFilteredTickets(tickets);
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
                  // For now, using mock data from your API response
                  // Replace this with actual API call when ready
                  const mockTickets = [
                        {
                              "ticket_id": 13,
                              "ticket_code": "557bfabd-7e89-442a-94e9-4e81b46eb217",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "John Smith"
                        },
                        {
                              "ticket_id": 14,
                              "ticket_code": "ded00f7d-63d6-4b87-bf4e-8b10fda2a0f6",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "Sarah Johnson"
                        },
                        {
                              "ticket_id": 15,
                              "ticket_code": "065b7d6d-ed02-4ae7-9b3f-eb1a18ed5c73",
                              "is_scanned": true,
                              "scanned_at": "2024-01-15T10:30:00Z",
                              "attendee": "Mike Davis"
                        },
                        {
                              "ticket_id": 16,
                              "ticket_code": "278054ec-fc06-4b3f-ab7c-e50f5930059e",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "Emily Wilson"
                        },
                        {
                              "ticket_id": 17,
                              "ticket_code": "e89dd17a-2c41-4dcc-b8d1-6a1681f8470d",
                              "is_scanned": true,
                              "scanned_at": "2024-01-15T11:15:00Z",
                              "attendee": "David Brown"
                        },
                        {
                              "ticket_id": 18,
                              "ticket_code": "6550dd72-1d50-455a-8699-f8a316f87797",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "Lisa Anderson"
                        },
                        {
                              "ticket_id": 19,
                              "ticket_code": "960d5257-e6bd-4770-9ab9-8f9bd2ae3109",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "Robert Taylor"
                        },
                        {
                              "ticket_id": 20,
                              "ticket_code": "d3af71d4-080d-4dc9-861c-1a45801b67f5",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "Jennifer Lee"
                        },
                        {
                              "ticket_id": 21,
                              "ticket_code": "402e1cf8-0483-4f0f-b8c0-92785291aaae",
                              "is_scanned": true,
                              "scanned_at": "2024-01-15T09:45:00Z",
                              "attendee": "Michael Chen"
                        },
                        {
                              "ticket_id": 22,
                              "ticket_code": "db6ad52f-32a7-46f9-b413-7afa3e7c856b",
                              "is_scanned": false,
                              "scanned_at": null,
                              "attendee": "Amanda Garcia"
                        }
                  ];
                  setTickets(mockTickets);
                  setFilteredTickets(mockTickets);
            } catch (error) {
                  console.error('Error fetching tickets:', error);
            } finally {
                  setLoading(false);
            }
      };
      useEffect(() => {
            fetchTickets();
      }, []);

      if (loading) {
            return <LoadingSpinner text="Loading tickets..." />;
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
