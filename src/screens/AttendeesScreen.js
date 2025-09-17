import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useRoute } from "@react-navigation/native";
import { colors, commonStyles } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import { showAPI } from "../services/apiEndpoints";

const AttendeesScreen = () => {
  const route = useRoute();
  const { show } = route.params || {};

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tableData, setTableData] = useState([]);

  const fetchAttendees = async () => {
    try {
      const response = await showAPI.getTicketsByShow(show.id, show.date_id);
      const payload = response?.data?.data ?? response?.data ?? [];
      const normalized = Array.isArray(payload)
        ? payload
        : payload
        ? [payload]
        : [];
      setAttendees(normalized);
    } catch (error) {
      console.error("Error fetching guest list:", error);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendees();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAttendees();
  }, [show.id]);

  const renderAttendeeItem = ({ item, index }) => (
    <View
      style={[
        styles.attendeeItem,
        item.is_scanned
          ? styles.attendeeItemChecked
          : styles.attendeeItemPending,
      ]}
    >
      <View style={styles.attendeeInfo}>
        <View style={styles.fieldRow}>
          <Text style={styles.labelBold}>Name:</Text>
          <Text style={styles.fieldValue}>{item.attendee.name || "N/A"}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.labelBold}>Email:</Text>
          <Text style={styles.fieldValue}>{item.attendee.email || "N/A"}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.labelBold}>Phone:</Text>
          <Text style={styles.fieldValue}>{item.attendee.phone || "N/A"}</Text>
        </View>

        {item.ticket_code ? (
          <View style={styles.fieldRow}>
            <Text style={styles.labelBold}>Ticket:</Text>
            <Text style={styles.ticketCode}>{item.ticket_code}</Text>
          </View>
        ) : null}
        <Text style={styles.metaText}>
          {item.is_scanned
            ? item.scanned_at
              ? `Scanned at: ${new Date(item.scanned_at).toLocaleString()}`
              : "Scanned"
            : "Scan pending"}
        </Text>
      </View>
      <View style={styles.attendeeStatus}>
        <View
          style={[
            styles.statusBadge,
            item.is_scanned
              ? styles.statusBadgePrimary
              : styles.statusBadgeWarning,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              item.is_scanned
                ? styles.statusBadgeTextPrimary
                : styles.statusBadgeTextWarning,
            ]}
          >
            {item.is_scanned ? "✅ Checked In" : "⏳ Not Scanned"}
          </Text>
        </View>
      </View>
    </View>
  );


  useEffect(() => {
    if (attendees.length > 0) {
      const updatedTableData = [];
      const record = {
        total: {
          sold: attendees?.length || 0,
          scanned: attendees?.filter((a) => a?.is_scanned).length || 0,
        },
      };
      attendees.forEach((item) => {
        if (item?.ticket_type?.name) {
          record[item.ticket_type.name] = {
            sold: record[item.ticket_type.name]?.sold ? record[item.ticket_type.name].sold + 1 : 1,
            scanned: record[item.ticket_type.name]?.scanned ? record[item.ticket_type.name].scanned + (item.is_scanned ? 1 : 0) : (item.is_scanned ? 1 : 0),
          };
        }
      });
      console.log("record", record);
      Object.keys(record).forEach((key) => {
        updatedTableData.push({
          category: key,
          sold: record[key].sold,
          scanned: record[key].scanned,
        });
      });
      setTableData(updatedTableData);
    }
  }, [attendees]);
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!show) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎫 Attendees</Text>
          <Text style={styles.subtitle}>Show not found</Text>
        </View>
      </View>
    );
  }
  console.log("attendees", attendees);
  if (attendees.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎫 Attendees</Text>
          <Text style={styles.subtitle}>No attendees found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎫 Attendees</Text>
        <Text style={styles.subtitle}>{show.title}</Text>
      </View>

      {/* Ticket Sales Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCategoryText}></Text>
          <Text style={styles.tableHeaderText}>Sold</Text>
          <Text style={styles.tableHeaderText}>Scanned</Text>
        </View>
        {tableData.map((row, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCategoryText}>{row.category}</Text>
            <Text style={styles.tableDataText}>{row.sold}</Text>
            <Text style={styles.tableDataText}>{row.scanned}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={attendees}
        renderItem={renderAttendeeItem}
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
            <Text style={styles.emptyEmoji}>🎫</Text>
            <Text style={styles.emptyTitle}>No Attendees Yet</Text>
            <Text style={styles.emptyText}>
              No one has checked in for this show yet.
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
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  countsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  countBadgeScanned: {
    borderColor: colors.primary,
    color: colors.primary,
  },
  tableContainer: {
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...commonStyles.shadow,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderCategoryText: {
    flex: 2,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "left",
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCategoryText: {
    flex: 2,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    textAlign: "left",
  },
  tableDataText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  attendeeItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    ...commonStyles.shadow,
    position: "relative",
  },
  attendeeItemChecked: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  attendeeItemPending: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarChecked: {
    borderColor: colors.primary,
  },
  avatarPending: {
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  attendeeInfo: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    flexWrap: "wrap",
    gap: 6,
  },
  labelBold: {
    fontWeight: "700",
    color: colors.text,
  },
  attendeeStatus: {
    position: "absolute",
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
    backgroundColor: "transparent",
  },
  statusBadgeWarning: {
    borderColor: colors.warning,
    backgroundColor: "transparent",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadgeTextPrimary: {
    color: colors.primary,
  },
  statusBadgeTextWarning: {
    color: colors.warning,
  },
  fieldValue: {
    fontSize: 14,
    color: colors.text,
  },
  ticketCode: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

export default AttendeesScreen;
