import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { colors, commonStyles } from "../utils/helpers";
import { useRoute, useNavigation } from "@react-navigation/native";
import { showAPI } from "../services/apiEndpoints";
import LoadingSpinner from "../components/LoadingSpinner";
import * as Clipboard from 'expo-clipboard';

const EventDetailScreen = () => {
  const { showDateId } = useRoute().params;
  const navigation = useNavigation();
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleCopyLink = async () => {
      if (!showDetails?.show_url) {
        Alert.alert(
          "Event link not found"
        );
        return;
      }

      await Clipboard.setStringAsync(showDetails.show_url);
      Alert.alert("Copied", "Event link has been copied to clipboard");
    };
  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const response = await showAPI.getShowDetailsByDateId(showDateId);
      if (response?.success && response?.data?.data) {
        setShowDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching show details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchShowDetails();
  }, [showDateId]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!showDetails) {
    return (
      <View style={styles.container}>
        <Text>No show details found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Scan QR Code</Text>
        <Text style={styles.subtitle}>Scan QR code to get into the event</Text>
      </View>

      <View style={styles.qrContainer}>
        <View style={styles.qrCodeWrapper}>
          <Image
            source={{ uri: showDetails.qr_code_url }}
            style={styles.qrCode}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
          <Text style={styles.copyButtonText}>📋 Copy Link</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  qrContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  qrCodeWrapper: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    ...commonStyles.shadow,
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  qrDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 20,
  },
  copyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...commonStyles.shadow,
  },
  copyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.background,
  },
});

export default EventDetailScreen;
