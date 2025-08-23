import React, { useState } from 'react';
import {
      View,
      TextInput,
      Text,
      StyleSheet,
      TouchableOpacity,
} from 'react-native';
import { colors } from '../utils/helpers';

/**
 * Custom Input Component
 * @param {string} label - Input label
 * @param {string} value - Input value
 * @param {function} onChangeText - Text change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} secureTextEntry - Hide text (for passwords)
 * @param {string} error - Error message
 * @param {boolean} required - Required field indicator
 * @param {string} keyboardType - Keyboard type
 * @param {object} style - Additional styles
 * @param {object} inputStyle - Input field styles
 */
const Input = ({
      label,
      value,
      onChangeText,
      placeholder,
      secureTextEntry = false,
      error,
      required = false,
      keyboardType = 'default',
      style,
      inputStyle,
      leftIcon,
      rightIcon,
      editable = true,
      multiline = false,
      numberOfLines = 1,
      ...props
}) => {
      const [isFocused, setIsFocused] = useState(false);
      const [showPassword, setShowPassword] = useState(false);

      const handleFocus = () => setIsFocused(true);
      const handleBlur = () => setIsFocused(false);

      const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
      };

      const getInputContainerStyle = () => {
            let baseStyle = [styles.inputContainer];

            if (isFocused) {
                  baseStyle.push(styles.focusedContainer);
            }

            if (error) {
                  baseStyle.push(styles.errorContainer);
            }

            if (!editable) {
                  baseStyle.push(styles.disabledContainer);
            }

            return baseStyle;
      };

      return (
            <View style={[styles.container, style]}>
                  {label && (
                        <Text style={styles.label}>
                              {label}
                              {required && <Text style={styles.required}> *</Text>}
                        </Text>
                  )}

                  <View style={getInputContainerStyle()}>
                        {leftIcon && (
                              <View style={styles.leftIconContainer}>
                                    {leftIcon}
                              </View>
                        )}

                        <TextInput
                              style={[styles.input, inputStyle]}
                              value={value}
                              onChangeText={onChangeText}
                              placeholder={placeholder}
                              placeholderTextColor={colors.textSecondary}
                              secureTextEntry={secureTextEntry && !showPassword}
                              keyboardType={keyboardType}
                              onFocus={handleFocus}
                              onBlur={handleBlur}
                              editable={editable}
                              multiline={multiline}
                              numberOfLines={numberOfLines}
                              {...props}
                        />

                        {secureTextEntry && (
                              <TouchableOpacity
                                    style={styles.passwordToggle}
                                    onPress={togglePasswordVisibility}
                              >
                                    <Text style={styles.passwordToggleText}>
                                          {showPassword ? '🙈' : '👁️'}
                                    </Text>
                              </TouchableOpacity>
                        )}

                        {rightIcon && !secureTextEntry && (
                              <View style={styles.rightIconContainer}>
                                    {rightIcon}
                              </View>
                        )}
                  </View>

                  {error && (
                        <Text style={styles.errorText}>{error}</Text>
                  )}
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            marginBottom: 16,
      },
      label: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.text,
            marginBottom: 8,
      },
      required: {
            color: colors.error,
      },
      inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: colors.background,
            minHeight: 48,
      },
      focusedContainer: {
            borderColor: colors.primary,
            borderWidth: 2,
      },
      errorContainer: {
            borderColor: colors.error,
            borderWidth: 2,
      },
      disabledContainer: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
      },
      input: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: colors.text,
      },
      leftIconContainer: {
            paddingLeft: 12,
      },
      rightIconContainer: {
            paddingRight: 12,
      },
      passwordToggle: {
            paddingHorizontal: 12,
            paddingVertical: 12,
      },
      passwordToggleText: {
            fontSize: 18,
      },
      errorText: {
            fontSize: 14,
            color: colors.error,
            marginTop: 4,
            marginLeft: 4,
      },
});

export default Input;
