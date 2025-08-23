import React, { useState } from 'react';
import {
      View,
      Text,
      StyleSheet,
      ScrollView,
      KeyboardAvoidingView,
      Platform,
      TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, commonStyles, validateEmail, validatePassword } from '../utils/helpers';

const LoginScreen = ({ navigation }) => {
      const [formData, setFormData] = useState({
            email: '',
            password: '',
      });
      const [errors, setErrors] = useState({});
      const [isLoading, setIsLoading] = useState(false);

      const { login, error: authError, clearError } = useAuth();

      const handleInputChange = (field, value) => {
            setFormData(prev => ({
                  ...prev,
                  [field]: value,
            }));

            // Clear field error when user starts typing
            if (errors[field]) {
                  setErrors(prev => ({
                        ...prev,
                        [field]: null,
                  }));
            }

            // Clear auth error
            if (authError) {
                  clearError();
            }
      };

      const validateForm = () => {
            const newErrors = {};

            if (!formData.email) {
                  newErrors.email = 'Email is required';
            } else if (!validateEmail(formData.email)) {
                  newErrors.email = 'Please enter a valid email';
            }

            if (!formData.password) {
                  newErrors.password = 'Password is required';
            } else {
                  const passwordValidation = validatePassword(formData.password);
                  if (!passwordValidation.isValid) {
                        newErrors.password = passwordValidation.message;
                  }
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const handleLogin = async () => {
            if (!validateForm()) {
                  return;
            }

            setIsLoading(true);
            try {
                  const result = await login(formData.email, formData.password);

                  if (!result.success) {
                        // Error is handled by AuthContext
                        console.log('Login failed:', result.error);
                  }
                  // Success is handled by AuthContext and will navigate automatically
            } catch (error) {
                  console.error('Login error:', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const navigateToForgotPassword = () => {
            navigation.navigate('ForgotPassword');
      };

      if (isLoading) {
            return <LoadingSpinner overlay text="Signing in..." />;
      }

      return (
            <SafeAreaView style={styles.container}>
                  <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoid}
                  >
                        <ScrollView
                              contentContainerStyle={styles.scrollContent}
                              keyboardShouldPersistTaps="handled"
                        >
                              <View style={styles.logoContainer}>
                                    <View style={styles.logo}>
                                          <Text style={styles.logoText}>🎭</Text>
                                    </View>
                                    <Text style={styles.appTitle}>LaughFactory</Text>
                                    <Text style={styles.appSubtitle}>Ticket Scanning</Text>
                              </View>

                              <View style={styles.formContainer}>
                                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                                    <Text style={styles.subtitleText}>
                                          Sign in to your account to continue
                                    </Text>

                                    <View style={styles.form}>
                                          <Input
                                                label="Email Address"
                                                value={formData.email}
                                                onChangeText={(value) => handleInputChange('email', value)}
                                                placeholder="Enter your email"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                error={errors.email}
                                                required
                                                leftIcon={<Text style={styles.inputIcon}>📧</Text>}
                                          />

                                          <Input
                                                label="Password"
                                                value={formData.password}
                                                onChangeText={(value) => handleInputChange('password', value)}
                                                placeholder="Enter your password"
                                                secureTextEntry
                                                error={errors.password}
                                                required
                                                leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
                                          />

                                          {authError && (
                                                <View style={styles.errorContainer}>
                                                      <Text style={styles.errorText}>⚠️ {authError}</Text>
                                                </View>
                                          )}

                                          {/* <TouchableOpacity
                                                style={styles.forgotPasswordContainer}
                                                onPress={navigateToForgotPassword}
                                          >
                                                <Text style={styles.forgotPasswordText}>
                                                      Forgot your password?
                                                </Text>
                                          </TouchableOpacity>
*/}
                                          <Button
                                                title="Sign In"
                                                onPress={handleLogin}
                                                loading={isLoading}
                                                style={styles.loginButton}
                                          />
                                    </View>
                              </View>

                              <View style={styles.footer}>
                                    <Text style={styles.footerText}>
                                          Having trouble signing in?
                                    </Text>
                                    <Text style={styles.footerSubtext}>
                                          Contact your administrator for assistance
                                    </Text>
                              </View>
                        </ScrollView>
                  </KeyboardAvoidingView>
            </SafeAreaView>
      );
};

const styles = StyleSheet.create({
      container: {
            ...commonStyles.container,
      },
      keyboardAvoid: {
            flex: 1,
      },
      scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
      },
      logoContainer: {
            alignItems: 'center',
            paddingTop: 40,
            paddingBottom: 32,
      },
      logo: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            ...commonStyles.centerContent,
            marginBottom: 16,
      },
      logoText: {
            fontSize: 40,
      },
      appTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 4,
      },
      appSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
      },
      formContainer: {
            flex: 1,
      },
      welcomeText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 8,
      },
      subtitleText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 32,
      },
      form: {
            width: '100%',
      },
      inputIcon: {
            fontSize: 18,
      },
      errorContainer: {
            backgroundColor: '#FFF5F5',
            borderWidth: 1,
            borderColor: colors.error,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
      },
      errorText: {
            color: colors.error,
            fontSize: 14,
            textAlign: 'center',
      },
      forgotPasswordContainer: {
            alignItems: 'center',
            marginBottom: 24,
      },
      forgotPasswordText: {
            color: colors.primary,
            fontSize: 16,
            fontWeight: '500',
      },
      loginButton: {
            marginTop: 8,
      },
      footer: {
            alignItems: 'center',
            paddingVertical: 24,
      },
      footerText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
      },
      footerSubtext: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 4,
      },
});

export default LoginScreen;
