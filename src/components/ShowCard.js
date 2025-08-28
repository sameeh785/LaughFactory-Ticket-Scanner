import React from 'react';
import {
      View,
      Text,
      TouchableOpacity,
      StyleSheet,
      Image,
} from 'react-native';
import { colors, commonStyles } from '../utils/helpers';

/**
 * Show Card Component
 * @param {object} show - Show data
 * @param {function} onPress - Card press handler
 * @param {function} onViewTickets - View tickets button press handler
 */
const ShowCard = ({
      show,
      onPress,
      onScanTickets,
      onViewGuestList,
      onViewAttendees,
}) => {
      // Format date for display
      const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
            });
      };

      // Format time for display
      const formatTime = (timeString) => {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
      };

      return (
            <TouchableOpacity
                  style={[styles.card, commonStyles.shadow]}
                  onPress={onPress}
            >
                  {/* Show Image */}
                  {/* {show.image && (
                        <Image
                              source={{ uri: show.image }}
                              style={styles.showImage}
                              resizeMode="cover"
                        />
                  )} */}

                  <View style={styles.cardContent}>
                        {/* Title and Date */}
                        <View style={styles.headerSection}>
                              <Text style={styles.title} numberOfLines={2}>
                                    {show.title}
                              </Text>
                              <View style={styles.dateTimeContainer}>
                                    <Text style={styles.dateText}>
                                          📅 {formatDate(show.date)}
                                    </Text>
                                    <Text style={styles.timeText}>
                                          🕐 {formatTime(show.start_time)}
                                    </Text>
                              </View>
                        </View>

                        {/* Description */}
                        {show.description && (
                              <Text style={styles.description} numberOfLines={3}>
                                    {show.description}
                              </Text>
                        )}

                        {/* Comedians */}
                        {/* {show.comedians && show.comedians.length > 0 && (
                              <View style={styles.comediansSection}>
                                    <Text style={styles.comediansLabel}>
                                          🎤 Featuring:
                                    </Text>
                                    <View style={styles.comediansList}>
                                          {show.comedians.map((comedian, index) => (
                                                <View key={comedian.id} style={styles.comedianItem}>
                                                      {comedian.image ? (
                                                            <Image
                                                                  source={{ uri: comedian.image }}
                                                                  style={styles.comedianImage}
                                                                  resizeMode="cover"
                                                            />
                                                      ) : (
                                                            <View style={styles.comedianPlaceholder}>
                                                                  <Text style={styles.comedianPlaceholderText}>
                                                                        👤
                                                                  </Text>
                                                            </View>
                                                      )}
                                                      <Text style={styles.comedianName} numberOfLines={1}>
                                                            {show.comedians[index].name}
                                                      </Text>
                                                </View>
                                          ))}
                                    </View>
                              </View>
                        )} */}

                        {/* Guest List and Attendees buttons */}
                        <View style={styles.buttonRow}>
                              <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => onViewGuestList?.(show)}
                              >
                                    <Text style={styles.secondaryButtonText}>👥 Guest List</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => onViewAttendees?.(show)}
                              >
                                    <Text style={styles.secondaryButtonText}>🎫 Attendees {show.attendees ?? 0}</Text>
                              </TouchableOpacity>
                        </View>

                        {/* View Tickets Button */}
                        <TouchableOpacity
                              style={styles.viewTicketsButton}
                              onPress={() => onScanTickets?.(show)}
                        >
                              <Text style={styles.viewTicketsButtonText}>🎫 Scan Tickets</Text>
                        </TouchableOpacity>
                  </View>
            </TouchableOpacity>
      );
};

const styles = StyleSheet.create({
      card: {
            backgroundColor: colors.background,
            borderRadius: 16,
            marginHorizontal: 16,
            marginVertical: 8,
            overflow: 'hidden',
      },
      showImage: {
            width: '100%',
            height: 200,
      },
      cardContent: {
            padding: 16,
      },
      headerSection: {
            marginBottom: 12,
      },
      title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
      },
      dateTimeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
      },
      dateText: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.primary,
      },
      timeText: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.primary,
      },
      description: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 20,
            marginBottom: 16,
      },
      comediansSection: {
            marginBottom: 16,
      },
      comediansLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
      },
      comediansList: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
      },
      comedianItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            maxWidth: '48%',
      },
      comedianImage: {
            width: 24,
            height: 24,
            borderRadius: 12,
            marginRight: 6,
      },
      comedianPlaceholder: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 6,
      },
      comedianPlaceholderText: {
            fontSize: 12,
      },
      comedianName: {
            fontSize: 12,
            color: colors.text,
            flex: 1,
      },
      buttonRow: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 12,
      },
      secondaryButton: {
            flex: 1,
            backgroundColor: colors.surface,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
      },
      secondaryButtonText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.text,
      },
      viewTicketsButton: {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
      },
      viewTicketsButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.background,
      },
});

export default ShowCard;
