import React from 'react';
import {
      View,
      Text,
      TouchableOpacity,
      StyleSheet,
} from 'react-native';
import { colors, commonStyles } from '../utils/helpers';

/**
 * Event Card Component
 * @param {object} event - Event data
 * @param {function} onPress - Card press handler
 * @param {boolean} showScanButton - Show scan button
 * @param {function} onScanPress - Scan button press handler
 */
const EventCard = ({
      event,
      onPress,
      showScanButton = true,
      onScanPress,
}) => {
      const getStatusColor = (status) => {
            switch (status) {
                  case 'active':
                        return colors.success;
                  case 'upcoming':
                        return colors.warning;
                  case 'completed':
                        return colors.textSecondary;
                  default:
                        return colors.text;
            }
      };

      const getStatusText = (status) => {
            switch (status) {
                  case 'active':
                        return 'Active';
                  case 'upcoming':
                        return 'Upcoming';
                  case 'completed':
                        return 'Completed';
                  default:
                        return status;
            }
      };

      const scanProgress = event.totalTickets > 0
            ? (event.ticketsScanned / event.totalTickets) * 100
            : 0;

      return (
            <TouchableOpacity
                  style={[styles.card, commonStyles.shadow]}
                  onPress={onPress}
            >
                  <View style={styles.cardHeader}>
                        <View style={styles.titleContainer}>
                              <Text style={styles.title} numberOfLines={2}>
                                    {event.title}
                              </Text>
                              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                                    <Text style={styles.statusText}>
                                          {getStatusText(event.status)}
                                    </Text>
                              </View>
                        </View>
                  </View>

                  <View style={styles.cardContent}>
                        <View style={styles.infoRow}>
                              <Text style={styles.infoLabel}>📅 Date:</Text>
                              <Text style={styles.infoText}>{event.date}</Text>
                        </View>

                        <View style={styles.infoRow}>
                              <Text style={styles.infoLabel}>🕐 Time:</Text>
                              <Text style={styles.infoText}>{event.time}</Text>
                        </View>

                        <View style={styles.infoRow}>
                              <Text style={styles.infoLabel}>📍 Venue:</Text>
                              <Text style={styles.infoText} numberOfLines={1}>
                                    {event.venue}
                              </Text>
                        </View>

                        {event.description && (
                              <Text style={styles.description} numberOfLines={2}>
                                    {event.description}
                              </Text>
                        )}

                        <View style={styles.progressContainer}>
                              <View style={styles.progressHeader}>
                                    <Text style={styles.progressLabel}>Tickets Scanned</Text>
                                    <Text style={styles.progressText}>
                                          {event.ticketsScanned} / {event.totalTickets}
                                    </Text>
                              </View>

                              <View style={styles.progressBarBackground}>
                                    <View
                                          style={[
                                                styles.progressBar,
                                                { width: `${scanProgress}%` }
                                          ]}
                                    />
                              </View>

                              <Text style={styles.progressPercentage}>
                                    {scanProgress.toFixed(1)}% Complete
                              </Text>
                        </View>
                  </View>

                  {showScanButton && event.status === 'active' && (
                        <TouchableOpacity
                              style={styles.scanButton}
                              onPress={() => onScanPress?.(event)}
                        >
                              <Text style={styles.scanButtonText}>📱 Start Scanning</Text>
                        </TouchableOpacity>
                  )}
            </TouchableOpacity>
      );
};

const styles = StyleSheet.create({
      card: {
            backgroundColor: colors.background,
            borderRadius: 12,
            marginHorizontal: 16,
            marginVertical: 8,
            overflow: 'hidden',
      },
      cardHeader: {
            padding: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      titleContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
      },
      title: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
            marginRight: 12,
      },
      statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
      },
      statusText: {
            fontSize: 12,
            fontWeight: '500',
            color: colors.background,
      },
      cardContent: {
            padding: 16,
      },
      infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
      },
      infoLabel: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.textSecondary,
            width: 80,
      },
      infoText: {
            fontSize: 14,
            color: colors.text,
            flex: 1,
      },
      description: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            marginVertical: 8,
      },
      progressContainer: {
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.surface,
            borderRadius: 8,
      },
      progressHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
      },
      progressLabel: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
      },
      progressText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
      },
      progressBarBackground: {
            height: 6,
            backgroundColor: colors.border,
            borderRadius: 3,
            marginBottom: 4,
      },
      progressBar: {
            height: '100%',
            backgroundColor: colors.primary,
            borderRadius: 3,
      },
      progressPercentage: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'right',
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
});

export default EventCard;
