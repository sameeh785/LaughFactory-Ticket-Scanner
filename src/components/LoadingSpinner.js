import React, { useEffect, useRef } from 'react';
import {
      View,
      ActivityIndicator,
      StyleSheet,
      Animated,
} from 'react-native';
import { colors, commonStyles } from '../utils/helpers';

/**
 * Loading Spinner Component
 * @param {string} size - Spinner size ('small', 'large')
 * @param {string} color - Spinner color
 * @param {boolean} overlay - Show as overlay
 * @param {object} style - Additional styles
 */
const LoadingSpinner = ({
      size = 'large',
      color = colors.primary,
      overlay = false,
      style,
}) => {
      const rotateAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
            const startRotation = () => {
                  Animated.loop(
                        Animated.timing(rotateAnim, {
                              toValue: 1,
                              duration: 2000,
                              useNativeDriver: true,
                        })
                  ).start();
            };

            startRotation();
      }, [rotateAnim]);

      const spin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
      });

      const containerStyle = overlay
            ? [styles.overlay, style]
            : [styles.container, style];

      return (
            <View style={containerStyle}>
                  <View style={styles.logoContainer}>
                        <Animated.Text 
                              style={[
                                    styles.logoText,
                                    { transform: [{ rotate: spin }] }
                              ]}
                        >
                              🎭
                        </Animated.Text>
                  </View>
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
      logoContainer: {
            marginTop: 12,
            alignItems: 'center',
      },
      logoText: {
            fontSize: 48,
            textAlign: 'center',
      },
});

export default LoadingSpinner;
