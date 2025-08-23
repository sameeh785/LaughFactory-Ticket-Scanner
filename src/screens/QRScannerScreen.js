import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      Alert,
      TouchableOpacity,
      Vibration,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scanAPI } from '../services/apiEndpoints';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, commonStyles, isValidQRCode } from '../utils/helpers';

const QRScannerScreen = ({ navigation, route }) => {
      const { event } = route.params;

      const [hasPermission, setHasPermission] = useState(null);
      const [scanned, setScanned] = useState(false);
      const [scanning, setScanning] = useState(false);
      const [flashOn, setFlashOn] = useState(false);
      const [lastScanTime, setLastScanTime] = useState(0);

      useEffect(() => {
            getCameraPermissions();
      }, []);

      const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
      };

      const handleBarCodeScanned = async ({ type, data }) => {
            const now = Date.now();

            // Prevent rapid scanning of the same code
            if (now - lastScanTime < 2000) {
                  return;
            }

            setLastScanTime(now);
            setScanned(true);
            setScanning(true);

            // Vibrate on scan
            Vibration.vibrate(100);

            try {
                  // Validate QR code format
                  if (!isValidQRCode(data)) {
                        Alert.alert(
                              'Invalid QR Code',
                              'This QR code format is not recognized. Please scan a valid ticket QR code.',
                              [
                                    {
                                          text: 'Scan Again',
                                          onPress: () => {
                                                setScanned(false);
                                                setScanning(false);
                                          }
                                    }
                              ]
                        );
                        return;
                  }

                  // Call scan API
                  const response = await scanAPI.scanTicket(data, event.id);

                  if (response.success) {
                        const ticketData = response.data;

                        // Show success alert
                        Alert.alert(
                              '✅ Ticket Verified',
                              `Ticket scanned successfully!\n\n` +
                              `Holder: ${ticketData.holderName}\n` +
                              `Type: ${ticketData.ticketType}\n` +
                              `Seat: ${ticketData.seatNumber}\n\n` +
                              `${ticketData.message}`,
                              [
                                    {
                                          text: 'Scan Next',
                                          onPress: () => {
                                                setScanned(false);
                                                setScanning(false);
                                          }
                                    },
                                    {
                                          text: 'Done',
                                          onPress: () => navigation.goBack(),
                                          style: 'cancel'
                                    }
                              ]
                        );
                  } else {
                        // Show error alert
                        Alert.alert(
                              '❌ Scan Failed',
                              response.error || 'Failed to verify ticket',
                              [
                                    {
                                          text: 'Try Again',
                                          onPress: () => {
                                                setScanned(false);
                                                setScanning(false);
                                          }
                                    },
                                    {
                                          text: 'Cancel',
                                          onPress: () => navigation.goBack(),
                                          style: 'cancel'
                                    }
                              ]
                        );
                  }
            } catch (error) {
                  console.error('Scan error:', error);
                  Alert.alert(
                        'Error',
                        'An error occurred while scanning. Please try again.',
                        [
                              {
                                    text: 'Retry',
                                    onPress: () => {
                                          setScanned(false);
                                          setScanning(false);
                                    }
                              }
                        ]
                  );
            } finally {
                  setScanning(false);
            }
      };

      const toggleFlash = () => {
            setFlashOn(!flashOn);
      };

      const resetScanner = () => {
            setScanned(false);
            setScanning(false);
      };

      if (hasPermission === null) {
            return (
                  <SafeAreaView style={styles.container}>
                        <LoadingSpinner text="Requesting camera permission..." />
                  </SafeAreaView>
            );
      }

      if (hasPermission === false) {
            return (
                  <SafeAreaView style={styles.container}>
                        <View style={styles.permissionContainer}>
                              <Text style={styles.permissionIcon}>📷</Text>
                              <Text style={styles.permissionTitle}>Camera Permission Required</Text>
                              <Text style={styles.permissionText}>
                                    This app needs access to your camera to scan QR codes on tickets.
                              </Text>
                              <Button
                                    title="Grant Permission"
                                    onPress={getCameraPermissions}
                                    style={styles.permissionButton}
                              />
                              <Button
                                    title="Go Back"
                                    onPress={() => navigation.goBack()}
                                    variant="outline"
                                    style={styles.backButton}
                              />
                        </View>
                  </SafeAreaView>
            );
      }

      return (
            <SafeAreaView style={styles.container}>
                  {/* Header */}
                  <View style={styles.header}>
                        <TouchableOpacity
                              style={styles.backButton}
                              onPress={() => navigation.goBack()}
                        >
                              <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                              <Text style={styles.headerTitle}>QR Scanner</Text>
                              <Text style={styles.headerSubtitle}>{event.title}</Text>
                        </View>
                        <TouchableOpacity
                              style={styles.flashButton}
                              onPress={toggleFlash}
                        >
                              <Text style={styles.flashButtonText}>
                                    {flashOn ? '🔦' : '💡'}
                              </Text>
                        </TouchableOpacity>
                  </View>

                  {/* Camera View */}
                  <View style={styles.cameraContainer}>
                        <CameraView
                              style={styles.camera}
                              facing="back"
                              enableTorch={flashOn}
                              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                              barcodeScannerSettings={{
                                    barcodeTypes: ['qr'],
                              }}
                        >
                              {/* Scanning Overlay */}
                              <View style={styles.scannerOverlay}>
                                    <View style={styles.scannerFrame}>
                                          <View style={[styles.corner, styles.topLeft]} />
                                          <View style={[styles.corner, styles.topRight]} />
                                          <View style={[styles.corner, styles.bottomLeft]} />
                                          <View style={[styles.corner, styles.bottomRight]} />

                                          {scanning && (
                                                <View style={styles.scanningIndicator}>
                                                      <LoadingSpinner size="small" color={colors.background} />
                                                </View>
                                          )}
                                    </View>
                              </View>
                        </CameraView>
                  </View>

                  {/* Instructions */}
                  <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>
                              {scanned ? 'Processing...' : 'Scan QR Code'}
                        </Text>
                        <Text style={styles.instructionsText}>
                              {scanned
                                    ? 'Please wait while we verify the ticket'
                                    : 'Point your camera at the QR code on the ticket'
                              }
                        </Text>

                        {scanned && !scanning && (
                              <Button
                                    title="Scan Again"
                                    onPress={resetScanner}
                                    variant="outline"
                                    style={styles.scanAgainButton}
                              />
                        )}
                  </View>

                  {/* Stats Footer */}
                  <View style={styles.statsFooter}>
                        <View style={styles.statItem}>
                              <Text style={styles.statValue}>{event.ticketsScanned}</Text>
                              <Text style={styles.statLabel}>Scanned</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                              <Text style={styles.statValue}>{event.totalTickets}</Text>
                              <Text style={styles.statLabel}>Total</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                              <Text style={styles.statValue}>
                                    {event.totalTickets > 0
                                          ? Math.round((event.ticketsScanned / event.totalTickets) * 100)
                                          : 0
                                    }%
                              </Text>
                              <Text style={styles.statLabel}>Progress</Text>
                        </View>
                  </View>
            </SafeAreaView>
      );
};

const styles = StyleSheet.create({
      container: {
            ...commonStyles.container,
            backgroundColor: '#000',
      },
      header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.background,
      },
      backButton: {
            padding: 8,
      },
      backButtonText: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: '500',
      },
      headerCenter: {
            flex: 1,
            alignItems: 'center',
      },
      headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
      },
      headerSubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
      },
      flashButton: {
            padding: 8,
      },
      flashButtonText: {
            fontSize: 24,
      },
      cameraContainer: {
            flex: 1,
      },
      camera: {
            flex: 1,
      },
      scannerOverlay: {
            ...StyleSheet.absoluteFillObject,
            ...commonStyles.centerContent,
      },
      scannerFrame: {
            width: 250,
            height: 250,
            position: 'relative',
      },
      corner: {
            position: 'absolute',
            width: 30,
            height: 30,
            borderColor: colors.background,
            borderWidth: 4,
      },
      topLeft: {
            top: 0,
            left: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
      },
      topRight: {
            top: 0,
            right: 0,
            borderLeftWidth: 0,
            borderBottomWidth: 0,
      },
      bottomLeft: {
            bottom: 0,
            left: 0,
            borderRightWidth: 0,
            borderTopWidth: 0,
      },
      bottomRight: {
            bottom: 0,
            right: 0,
            borderLeftWidth: 0,
            borderTopWidth: 0,
      },
      scanningIndicator: {
            ...StyleSheet.absoluteFillObject,
            ...commonStyles.centerContent,
      },
      instructionsContainer: {
            backgroundColor: colors.background,
            paddingHorizontal: 20,
            paddingVertical: 16,
            alignItems: 'center',
      },
      instructionsTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
      },
      instructionsText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
      },
      scanAgainButton: {
            marginTop: 16,
            width: 120,
      },
      statsFooter: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            paddingVertical: 16,
            paddingHorizontal: 20,
      },
      statItem: {
            flex: 1,
            alignItems: 'center',
      },
      statValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
      },
      statLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
      },
      statDivider: {
            width: 1,
            backgroundColor: colors.border,
            marginHorizontal: 16,
      },
      permissionContainer: {
            flex: 1,
            ...commonStyles.centerContent,
            paddingHorizontal: 40,
      },
      permissionIcon: {
            fontSize: 64,
            marginBottom: 20,
      },
      permissionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 12,
      },
      permissionText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
      },
      permissionButton: {
            width: '100%',
            marginBottom: 12,
      },
});

export default QRScannerScreen;
