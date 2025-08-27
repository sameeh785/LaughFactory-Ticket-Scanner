import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { showAPI } from "../services/apiEndpoints";
import ShowCard from "../components/ShowCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Input from "../components/Input";
import { colors, commonStyles, debounce } from "../utils/helpers";

const ShowsScreen = ({ navigation }) => {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("today"); // 'today' | 'upcoming'
  //functions
  const fetchShows = async () => {
    try {
      const response = await showAPI.getShowsByClub(
        process.env.EXPO_PUBLIC_CLUB_ID
      );
      if (response?.success && response?.data?.data?.length > 0) {
        setShows(response.data.data);
      } else {
        console.error("Failed to fetch shows:", response.error);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
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

    // Date helpers
    const toStartOfDay = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const parseToLocalDate = (dateString) => {
      const parsed = new Date(dateString);
      if (isNaN(parsed)) return null;
      return toStartOfDay(parsed);
    };
    const today = toStartOfDay(new Date());

    // Apply tab filter (Today vs Upcoming)
    filtered = filtered.filter((show) => {
      if (!show?.date) return false;
      const showDay = parseToLocalDate(show.date);
      if (!showDay) return false;
      if (selectedTab === "today") return showDay.getTime() === today.getTime();
      return showDay.getTime() > today.getTime();
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (show) =>
          show.title?.toLowerCase().includes(query) ||
          show.description?.toLowerCase().includes(query) ||
          (show.comedians &&
            show.comedians.some((comedian) =>
              comedian.name?.toLowerCase().includes(query)
            ))
      );
    }

    setFilteredShows(filtered);
  };

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const handleScanTickets = (show) => {
    // Navigate to tickets screen with static data for now
    navigation.navigate("QRScanner", {
      show,
      mode: "scan_ticket",
    });
  };

  const handleViewGuestList = (show) => {
    navigation.navigate("GuestList", { show });
  };

  const handleViewAttendees = (show) => {
    navigation.navigate("Attendees", { show });
  };

  const renderShow = ({ item }) => (
    <ShowCard
      show={item}
      onScanTickets={() => handleScanTickets(item)}
      onViewGuestList={() => handleViewGuestList(item)}
      onViewAttendees={() => handleViewAttendees(item)}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎭</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No shows found" : "No shows available"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try adjusting your search or filter criteria"
          : "Shows will appear here when they are created"}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => {
            setSearchQuery("");
          }}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  //effects
  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    filterShows();
  }, [shows, searchQuery, selectedTab]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎭 Shows</Text>
        <Text style={styles.headerSubtitle}>
          {filteredShows.length} show{filteredShows.length !== 1 ? "s" : ""}{" "}
          found
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

      {/* Tabs: Today | Upcoming */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersContent}>
          <View style={styles.filtersRow}>
            <TouchableOpacity
              onPress={() => setSelectedTab("today")}
              style={[
                styles.filterButton,
                selectedTab === "today" && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTab === "today" && styles.filterTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab("upcoming")}
              style={[
                styles.filterButton,
                selectedTab === "upcoming" && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTab === "upcoming" && styles.filterTextActive,
                ]}
              >
                Upcoming
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
          filteredShows.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
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
    fontWeight: "bold",
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
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
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
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
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
    fontWeight: "500",
    color: colors.background,
  },
});

export default ShowsScreen;
