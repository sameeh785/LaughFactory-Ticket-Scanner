import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      ScrollView,
      RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/apiEndpoints';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, commonStyles, formatNumber, getGreeting } from '../utils/helpers';

const DashboardScreen = ({ navigation }) => {
      const [stats, setStats] = useState(null);
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);

      const { user } = useAuth();

      useEffect(() => {
            fetchStats();
      }, []);

      const fetchStats = async () => {
            try {
                  const response = await dashboardAPI.getStats();
                  if (response.success) {
                        setStats(response.data);
                  } else {
                        console.error('Failed to fetch stats:', response.error);
                  }
            } catch (error) {
                  console.error('Error fetching stats:', error);
            } finally {
                  setLoading(false);
            }
      };

      const onRefresh = async () => {
            setRefreshing(true);
            await fetchStats();
            setRefreshing(false);
      };

      const StatCard = ({ title, value, icon, color = colors.primary, subtitle }) => (
            <View style={[styles.statCard, commonStyles.shadow]}>
                  <View style={styles.statHeader}>
                        <Text style={styles.statIcon}>{icon}</Text>
                        <View style={[styles.statBadge, { backgroundColor: color }]} />
                  </View>
                  <Text style={[styles.statValue, { color }]}>
                        {typeof value === 'number' ? formatNumber(value) : value}
                  </Text>
                  <Text style={styles.statTitle}>{title}</Text>
                  {subtitle && (
                        <Text style={styles.statSubtitle}>{subtitle}</Text>
                  )}
            </View>
      );

      const ActivityItem = ({ activity }) => (
            <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                        <Text>🎭</Text>
                  </View>
                  <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.event}</Text>
                        <Text style={styles.activityScans}>
                              {activity.scans} tickets scanned
                        </Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <View style={styles.activityBadge}>
                        <Text style={styles.activityBadgeText}>{activity.scans}</Text>
                  </View>
            </View>
      );

      if (loading) {
            return <LoadingSpinner text="Loading dashboard..." />;
      }

      return (
            <SafeAreaView style={styles.container}>
                  <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                  >
                        {/* Header */}
                        <View style={styles.header}>
                              <View>
                                    <Text style={styles.greeting}>
                                          {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋
                                    </Text>
                                    <Text style={styles.headerSubtitle}>
                                          Here's your scanning overview
                                    </Text>
                              </View>
                              <View style={styles.profileIcon}>
                                    <Text style={styles.profileInitial}>
                                          {user?.name?.charAt(0) || 'U'}
                                    </Text>
                              </View>
                        </View>

                        {/* Quick Stats */}
                        <View style={styles.statsContainer}>
                              <Text style={styles.sectionTitle}>📊 Quick Stats</Text>

                              <View style={styles.statsGrid}>
                                    <StatCard
                                          title="Total Events"
                                          value={stats?.totalEvents || 0}
                                          icon="🎪"
                                          color={colors.primary}
                                    />
                                    <StatCard
                                          title="Tickets Scanned"
                                          value={stats?.scannedTickets || 0}
                                          icon="🎫"
                                          color={colors.success}
                                    />
                              </View>

                              <View style={styles.statsGrid}>
                                    <StatCard
                                          title="Today's Scans"
                                          value={stats?.todayScans || 0}
                                          icon="📱"
                                          color={colors.accent}
                                    />
                                    <StatCard
                                          title="Success Rate"
                                          value={`${stats?.successRate || 0}%`}
                                          icon="✅"
                                          color={colors.warning}
                                    />
                              </View>
                        </View>

                        {/* Recent Activity */}
                        <View style={styles.activityContainer}>
                              <View style={styles.activityHeader}>
                                    <Text style={styles.sectionTitle}>⚡ Recent Activity</Text>
                                    <Text style={styles.viewAllText}>View All</Text>
                              </View>

                              <View style={[styles.activityCard, commonStyles.shadow]}>
                                    {stats?.recentActivity?.length > 0 ? (
                                          stats.recentActivity.map((activity) => (
                                                <ActivityItem key={activity.id} activity={activity} />
                                          ))
                                    ) : (
                                          <View style={styles.emptyActivity}>
                                                <Text style={styles.emptyActivityIcon}>📭</Text>
                                                <Text style={styles.emptyActivityText}>
                                                      No recent activity
                                                </Text>
                                                <Text style={styles.emptyActivitySubtext}>
                                                      Start scanning tickets to see activity here
                                                </Text>
                                          </View>
                                    )}
                              </View>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                              <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>

                              <View style={styles.actionButtons}>
                                    <View style={[styles.actionButton, commonStyles.shadow]}>
                                          <Text style={styles.actionIcon}>🎭</Text>
                                          <Text style={styles.actionTitle}>View Events</Text>
                                          <Text style={styles.actionSubtitle}>See all upcoming events</Text>
                                    </View>

                                    <View style={[styles.actionButton, commonStyles.shadow]}>
                                          <Text style={styles.actionIcon}>👤</Text>
                                          <Text style={styles.actionTitle}>My Profile</Text>
                                          <Text style={styles.actionSubtitle}>Update your information</Text>
                                    </View>
                              </View>
                        </View>
                  </ScrollView>
            </SafeAreaView>
      );
};

const styles = StyleSheet.create({
      container: {
            ...commonStyles.container,
      },
      scrollContent: {
            paddingBottom: 20,
      },
      header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
      },
      greeting: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
      },
      headerSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginTop: 4,
      },
      profileIcon: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary,
            ...commonStyles.centerContent,
      },
      profileInitial: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.background,
      },
      sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
      },
      statsContainer: {
            paddingHorizontal: 20,
            marginBottom: 24,
      },
      statsGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
      },
      statCard: {
            flex: 0.48,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
      },
      statHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
      },
      statIcon: {
            fontSize: 24,
      },
      statBadge: {
            width: 8,
            height: 8,
            borderRadius: 4,
      },
      statValue: {
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 4,
      },
      statTitle: {
            fontSize: 14,
            color: colors.textSecondary,
      },
      statSubtitle: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
      },
      activityContainer: {
            paddingHorizontal: 20,
            marginBottom: 24,
      },
      activityHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
      },
      viewAllText: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: '500',
      },
      activityCard: {
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
      },
      activityItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      activityIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            ...commonStyles.centerContent,
            marginRight: 12,
      },
      activityContent: {
            flex: 1,
      },
      activityTitle: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.text,
      },
      activityScans: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
      },
      activityTime: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 2,
      },
      activityBadge: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
      },
      activityBadgeText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.background,
      },
      emptyActivity: {
            ...commonStyles.centerContent,
            paddingVertical: 32,
      },
      emptyActivityIcon: {
            fontSize: 48,
            marginBottom: 16,
      },
      emptyActivityText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 4,
      },
      emptyActivitySubtext: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
      },
      quickActions: {
            paddingHorizontal: 20,
      },
      actionButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
      },
      actionButton: {
            flex: 0.48,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
      },
      actionIcon: {
            fontSize: 32,
            marginBottom: 8,
      },
      actionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
      },
      actionSubtitle: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
      },
});

export default DashboardScreen;
