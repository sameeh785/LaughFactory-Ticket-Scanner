import React, { useEffect, useState } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      TouchableOpacity,
      Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../utils/helpers';
import { showAPI } from '../services/apiEndpoints';
import LoadingSpinner from '../components/LoadingSpinner';

const TicketsScreen = ({ route, navigation }) => {
      const { show, tickets, show_id, show_date_id } = route.params;
      const [_tickets, setTickets] = useState([]);
      const [loading, setLoading] = useState(true);
      const getStatusColor = (status) => {
            switch (status) {
                  case 'valid':
                        return colors.success;
                  case 'scanned':
                        return colors.primary;
                  case 'invalid':
                        return colors.error;
                  default:
                        return colors.textSecondary;
            }
      };

      const getStatusIcon = (status) => {
            switch (status) {
                  case 'valid':
                        return '✅';
                  case 'scanned':
                        return '📱';
                  case 'invalid':
                        return '❌';
                  default:
                        return '❓';
            }
      };


      const handleScanTicket = (ticket) => {
            Alert.alert(
                  'Scan Ticket',
                  `Scan ticket ${ticket.ticket_number} for ${ticket.customer_name}?`,
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
            navigation.navigate('TicketDetails', { show, ticket });
      };

      const renderTicket = ({ item }) => (
            <TouchableOpacity
                  style={[styles.ticketCard, commonStyles.shadow]}
                  onPress={() => handleViewTicketDetails(item)}
            >
                  <View style={styles.ticketHeader}>
                        <View style={styles.ticketInfo}>
                              <Text style={styles.ticketNumber}>{item.ticket_number}</Text>
                              <Text style={styles.customerName}>{item.customer_name}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                              <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                  </View>

                  <View style={styles.ticketDetails}>
                        <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Seat:</Text>
                              <Text style={styles.detailValue}>{item.seat_number}</Text>
                        </View>
                        <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Price:</Text>
                              <Text style={styles.detailValue}>{item.price}</Text>
                        </View>
                        <View style={styles.detailRow}>
                              <Text style={styles.detailLabel}>Purchased:</Text>
                              <Text style={styles.detailValue}>{item.purchase_date}</Text>
                        </View>
                  </View>

                  {item.status === 'valid' && (
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
                  <Text style={styles.emptyTitle}>No tickets found</Text>
                  <Text style={styles.emptySubtitle}>
                        {selectedFilter !== 'all' 
                              ? `No ${selectedFilter} tickets available`
                              : 'Tickets will appear here when they are purchased'
                        }
                  </Text>
            </View>
      );


      const fetchTickets = async () => {
            try {
                  const response = await showAPI.getTicketsByShow(show_id, show_date_id);
                  console.log(response, "response");
                  if (response?.success && response?.data?.data) {
                        setTickets(response.data.data);
                  } 
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
                              <Text style={styles.showTitle}>{show.title}</Text>
                              <Text style={styles.headerSubtitle}>
                                    {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
                              </Text>
                        </View>
                  </View>


                  {/* Tickets List */}
                  <FlatList
                        data={tickets}
                        renderItem={renderTicket}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={EmptyState}
                        contentContainerStyle={
                              tickets.length === 0 ? styles.emptyListContainer : styles.listContainer
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
