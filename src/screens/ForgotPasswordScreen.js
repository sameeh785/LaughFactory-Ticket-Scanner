import React, { useState } from 'react';
import {
      View,
      Text,
      StyleSheet,
      ScrollView,
      KeyboardAvoidingView,
      Platform,
      Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, commonStyles, validateEmail } from '../utils/helpers';

const ForgotPasswordScreen = ({ navigation }) => {
      const [email, setEmail] = useState('');
      const [loading, setLoading] = useState(false);
      const [emailSent, setEmailSent] = useState(false);

      const { forgotPassword } = useAuth();

      const handleSendReset = async () => {
            if (!email.trim()) {
                  Alert.alert('Error', 'Please enter your email address');
                  return;
            }

            if (!validateEmail(email)) {
                  Alert.alert('Error', 'Please enter a valid email address');
                  return;
            }

            setLoading(true);
            try {
                  const response = await forgotPassword(email);

                  if (response.success) {
                        setEmailSent(true);
                  } else {
                        Alert.alert('Error', response.error || 'Failed to send reset email');
                  }
            } catch (error) {
                  console.error('Forgot password error:', error);
                  Alert.alert('Error', 'An error occurred. Please try again.');
            } finally {
                  setLoading(false);
            }
      };

      const handleBackToLogin = () => {
            navigation.goBack();
      };

      if (emailSent) {
            return (
                  <SafeAreaView style={styles.container}>
                        <View style={styles.successContainer}>
                              <Text style={styles.successIcon}>📧</Text>
                              <Text style={styles.successTitle}>Check Your Email</Text>
                              <Text style={styles.successText}>
                                    We've sent password reset instructions to:
                              </Text>
                              <Text style={styles.emailText}>{email}</Text>
                              <Text style={styles.successSubtext}>
                                    If you don't see the email, check your spam folder or try again.
                              </Text>

                              <Button
                                    title="Back to Sign In"
                                    onPress={handleBackToLogin}
                                    style={styles.backButton}
                              />

                              <Button
                                    title="Resend Email"
                                    onPress={() => {
                                          setEmailSent(false);
                                          setEmail('');
                                    }}
                                    variant="outline"
                                    style={styles.resendButton}
                              />
                        </View>
                  </SafeAreaView>
            );
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
                              <View style={styles.header}>
                                    <View style={styles.iconContainer}>
                                          <Text style={styles.icon}>🔑</Text>
                                    </View>
                                    <Text style={styles.title}>Forgot Password?</Text>
                                    <Text style={styles.subtitle}>
                                          No worries! Enter your email address and we'll send you instructions to reset your password.
                                    </Text>
                              </View>

                              <View style={styles.form}>
                                    <Input
                                          label="Email Address"
                                          value={email}
                                          onChangeText={setEmail}
                                          placeholder="Enter your email address"
                                          keyboardType="email-address"
                                          autoCapitalize="none"
                                          required
                                          leftIcon={<Text style={styles.inputIcon}>📧</Text>}
                                    />

                                    <Button
                                          title="Send Reset Instructions"
                                          onPress={handleSendReset}
                                          loading={loading}
                                          style={styles.sendButton}
                                    />

                                    <Button
                                          title="Back to Sign In"
                                          onPress={handleBackToLogin}
                                          variant="outline"
                                          style={styles.backToLoginButton}
                                    />
                              </View>

                              <View style={styles.helpContainer}>
                                    <Text style={styles.helpTitle}>Need Help?</Text>
                                    <Text style={styles.helpText}>
                                          If you're still having trouble accessing your account, contact your administrator for assistance.
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
            paddingTop: 40,
      },
      header: {
            alignItems: 'center',
            marginBottom: 40,
      },
      iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.surface,
            ...commonStyles.centerContent,
            marginBottom: 24,
      },
      icon: {
            fontSize: 36,
      },
      title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 12,
      },
      subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
      },
      form: {
            marginBottom: 40,
      },
      inputIcon: {
            fontSize: 18,
      },
      sendButton: {
            marginBottom: 16,
      },
      backToLoginButton: {
            marginTop: 8,
      },
      helpContainer: {
            alignItems: 'center',
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
      },
      helpTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 8,
      },
      helpText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
      },
      successContainer: {
            flex: 1,
            ...commonStyles.centerContent,
            paddingHorizontal: 40,
      },
      successIcon: {
            fontSize: 64,
            marginBottom: 24,
      },
      successTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 16,
      },
      successText: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 8,
      },
      emailText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.primary,
            textAlign: 'center',
            marginBottom: 16,
      },
      successSubtext: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 32,
      },
      backButton: {
            width: '100%',
            marginBottom: 12,
      },
      resendButton: {
            width: '100%',
      },
});

export default ForgotPasswordScreen;
