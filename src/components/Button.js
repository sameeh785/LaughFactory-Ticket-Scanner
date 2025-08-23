import React from 'react';
import {
      TouchableOpacity,
      Text,
      StyleSheet,
      ActivityIndicator,
      View,
} from 'react-native';
import { colors } from '../utils/helpers';

/**
 * Custom Button Component
 * @param {string} title - Button text
 * @param {function} onPress - Button press handler
 * @param {boolean} loading - Show loading indicator
 * @param {boolean} disabled - Disable button
 * @param {string} variant - Button variant ('primary', 'secondary', 'outline')
 * @param {object} style - Additional styles
 * @param {object} textStyle - Text styles
 */
const Button = ({
      title,
      onPress,
      loading = false,
      disabled = false,
      variant = 'primary',
      style,
      textStyle,
      icon,
      ...props
}) => {
      const getButtonStyle = () => {
            let baseStyle = [styles.button];

            switch (variant) {
                  case 'primary':
                        baseStyle.push(styles.primaryButton);
                        break;
                  case 'secondary':
                        baseStyle.push(styles.secondaryButton);
                        break;
                  case 'outline':
                        baseStyle.push(styles.outlineButton);
                        break;
                  default:
                        baseStyle.push(styles.primaryButton);
            }

            if (disabled || loading) {
                  baseStyle.push(styles.disabledButton);
            }

            return baseStyle;
      };

      const getTextStyle = () => {
            let baseStyle = [styles.buttonText];

            switch (variant) {
                  case 'primary':
                        baseStyle.push(styles.primaryButtonText);
                        break;
                  case 'secondary':
                        baseStyle.push(styles.secondaryButtonText);
                        break;
                  case 'outline':
                        baseStyle.push(styles.outlineButtonText);
                        break;
                  default:
                        baseStyle.push(styles.primaryButtonText);
            }

            if (disabled || loading) {
                  baseStyle.push(styles.disabledButtonText);
            }

            return baseStyle;
      };

      return (
            <TouchableOpacity
                  style={[getButtonStyle(), style]}
                  onPress={onPress}
                  disabled={disabled || loading}
                  {...props}
            >
                  <View style={styles.buttonContent}>
                        {loading ? (
                              <ActivityIndicator
                                    size="small"
                                    color={variant === 'outline' ? colors.primary : colors.background}
                              />
                        ) : (
                              <>
                                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                                    <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                              </>
                        )}
                  </View>
            </TouchableOpacity>
      );
};

const styles = StyleSheet.create({
      button: {
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
      },
      buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
      },
      buttonText: {
            fontSize: 16,
            fontWeight: '600',
      },
      iconContainer: {
            marginRight: 8,
      },
      // Primary button styles
      primaryButton: {
            backgroundColor: colors.primary,
      },
      primaryButtonText: {
            color: colors.background,
      },
      // Secondary button styles
      secondaryButton: {
            backgroundColor: colors.secondary,
      },
      secondaryButtonText: {
            color: colors.background,
      },
      // Outline button styles
      outlineButton: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
      },
      outlineButtonText: {
            color: colors.primary,
      },
      // Disabled button styles
      disabledButton: {
            backgroundColor: colors.border,
            borderColor: colors.border,
      },
      disabledButtonText: {
            color: colors.textSecondary,
      },
});

export default Button;
