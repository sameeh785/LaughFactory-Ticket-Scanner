import React, { useState, useEffect, useRef } from 'react';
import {
      View,
      Text,
      StyleSheet,
      Alert,
      TouchableOpacity,
      Vibration,
      Modal,
      ScrollView,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scanAPI } from '../services/apiEndpoints';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, commonStyles, isValidQRCode } from '../utils/helpers';

const QRScannerScreen = ({ navigation, route }) => {
      const { show } = route.params;
      const [hasPermission, setHasPermission] = useState(null);
      const [scanned, setScanned] = useState(false);
      const [scanning, setScanning] = useState(false);
      const [flashOn, setFlashOn] = useState(false);
      const [showNotesModal, setShowNotesModal] = useState(false);
      const [notesText, setNotesText] = useState('');
      
      // Use refs for immediate state tracking
      const isScanningRef = useRef(false);
      const lastScanTimeRef = useRef(0);

      useEffect(() => {
            getCameraPermissions();
      }, []);

      const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
      };

      const handleBarCodeScanned = async ({ type, data }) => {
            const now = Date.now();

            // Prevent rapid scanning using refs for immediate check
            if (isScanningRef.current || (now - lastScanTimeRef.current < 5000)) {
                  return;
            }

            // Immediately set refs to prevent multiple scans
            isScanningRef.current = true;
            lastScanTimeRef.current = now;
            
            // Update state for UI
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
                                                isScanningRef.current = false;
                                                setScanned(false);
                                                setScanning(false);
                                          }
                                    }
                              ]
                        );
                        return;
                  }

                  // Call scan API
                  const response = await scanAPI.scanTicket(show.id, show.date_id, data);
                  if (response.success) {         
                        const notesArray = response?.data?.data?.order_notes || [];
                        const combinedNotes = notesArray.map((item) => item?.note).filter(Boolean).join("\n");
                        setNotesText(combinedNotes || '');
                        setShowNotesModal(true);
                       
                  } else {
                        isScanningRef.scanningFailed = true;
                        // Show error alert
                        Alert.alert(
                              '❌ Scan Failed',
                              response.error || 'Failed to verify ticket',
                              [
                                    {
                                          text: 'Try Again',
                                          onPress: () => {
                                                isScanningRef.current = false;
                                                isScanningRef.scanningFailed = false;
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
                  isScanningRef.scanningFailed = true;
                  Alert.alert(
                        'Error',
                        'An error occurred while scanning. Please try again.',
                        [
                              {
                                    text: 'Retry',
                                    onPress: () => {
                                          isScanningRef.current = false;
                                          isScanningRef.scanningFailed = false;
                                          setScanned(false);
                                          setScanning(false);
                                    }
                              }
                        ]
                  );
            } finally {
                  isScanningRef.current = false;
                  setScanning(false);
            }
      };

      const toggleFlash = () => {
            setFlashOn(!flashOn);
      };

      const resetScanner = () => {
            isScanningRef.current = false;
            setScanned(false);
            setScanning(false);
      };

      if (hasPermission === null) {
            return (
                  <SafeAreaView style={styles.container}>
                        <LoadingSpinner />
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
                              <Text style={styles.headerSubtitle}>{show.title}</Text>
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
                  {/* <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsTitle}>
                              {isScanningRef.scanningFailed ? 'Scan Failed' : scanned ? 'Processing...' : 'Scan QR Code'}
                        </Text>
                        <Text style={styles.instructionsText}>
                              {scanned
                                    ? 'Please wait while we verify the ticket'
                                    : 'Point your camera at the QR code on the ticket'
                              }
                        </Text>
                  </View> */}

                  {/* Notes Modal (scrollable) */}
                  <Modal
                        visible={showNotesModal}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setShowNotesModal(false)}
                  >
                        <View style={styles.modalOverlay}>
                              <View style={styles.modalCard}>
                                    <Text style={styles.modalTitle}>Ticket scanned successfully!</Text>
                                    <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
                                          <Text style={styles.modalNotesText}>
                                                {notesText || 'No notes available.'}
                                          </Text>
                                    </ScrollView>
                                    <View style={styles.modalButtonsRow}>
                                          <Button
                                                title="Close"
                                                variant="outline"
                                                style={styles.modalButton}
                                                onPress={() => {
                                                      setShowNotesModal(false);
                                                      navigation.navigate('AllShows');
                                                }}
                                          />
                                          <Button
                                                title="Scan Again"
                                                style={styles.modalButton}
                                                onPress={() => {
                                                      setShowNotesModal(false);
                                                      isScanningRef.current = false;
                                                      isScanningRef.scanningFailed = false;
                                                      setScanned(false);
                                                      setScanning(false);
                                                }}
                                          />
                                    </View>
                              </View>
                        </View>
                  </Modal>
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
      modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
      },
      modalCard: {
            width: '100%',
            maxHeight: '80%',
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 16,
            ...commonStyles.shadow,
      },
      modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.primary,
            textAlign: 'center',
            marginBottom: 12,
      },
      modalScroll: {
            maxHeight: 320,
            marginBottom: 16,
      },
      modalScrollContent: {
            paddingVertical: 4,
      },
      modalNotesText: {
            fontSize: 14,
            color: colors.text,
            lineHeight: 20,
      },
      modalButtonsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
      },
      modalButton: {
            flex: 1,
      },
});

export default QRScannerScreen;
