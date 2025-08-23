import React from 'react';
import {
      View,
      ActivityIndicator,
      StyleSheet,
      Text,
} from 'react-native';
import { colors, commonStyles } from '../utils/helpers';

/**
 * Loading Spinner Component
 * @param {string} size - Spinner size ('small', 'large')
 * @param {string} color - Spinner color
 * @param {string} text - Loading text
 * @param {boolean} overlay - Show as overlay
 * @param {object} style - Additional styles
 */
const LoadingSpinner = ({
      size = 'large',
      color = colors.primary,
      text = 'Loading...',
      overlay = false,
      style,
}) => {
      const containerStyle = overlay
            ? [styles.overlay, style]
            : [styles.container, style];

      return (
            <View style={containerStyle}>
                  <ActivityIndicator size={size} color={color} />
                  {text && (
                        <Text style={styles.loadingText}>{text}</Text>
                  )}
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            ...commonStyles.centerContent,
            padding: 20,
      },
      overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            ...commonStyles.centerContent,
            zIndex: 1000,
      },
      loadingText: {
            marginTop: 12,
            fontSize: 16,
            color: colors.text,
            textAlign: 'center',
      },
});

export default LoadingSpinner;
