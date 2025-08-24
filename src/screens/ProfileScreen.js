import React, { useState, useEffect } from 'react';
import {
      View,
      Text,
      StyleSheet,
      ScrollView,
      TouchableOpacity,
      Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/apiEndpoints';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, commonStyles, formatDate, validateEmail } from '../utils/helpers';

const ProfileScreen = ({ navigation }) => {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [editing, setEditing] = useState(false);
      const [editData, setEditData] = useState({});
      const [saving, setSaving] = useState(false);

      const { user, logout, updateUser } = useAuth();

      useEffect(() => {
            fetchProfile();
      }, []);

      const fetchProfile = async () => {
            try {
                  const response = await profileAPI.getProfile();
                  if (response.success) {
                        setProfile(response.data);
                        setEditData({
                              name: response.data.name,
                              email: response.data.email,
                              phone: response.data.phone,
                        });
                  } else {
                        console.error('Failed to fetch profile:', response.error);
                  }
            } catch (error) {
                  console.error('Error fetching profile:', error);
            } finally {
                  setLoading(false);
            }
      };

      const handleEdit = () => {
            setEditing(true);
      };

      const handleCancelEdit = () => {
            setEditing(false);
            setEditData({
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone,
            });
      };

      const handleSave = async () => {
            // Validate form
            if (!editData.name?.trim()) {
                  Alert.alert('Error', 'Name is required');
                  return;
            }

            if (!editData.email?.trim()) {
                  Alert.alert('Error', 'Email is required');
                  return;
            }

            if (!validateEmail(editData.email)) {
                  Alert.alert('Error', 'Please enter a valid email address');
                  return;
            }

            setSaving(true);
            try {
                  const response = await profileAPI.updateProfile(editData);

                  if (response.success) {
                        setProfile(prev => ({ ...prev, ...editData }));
                        updateUser(editData);
                        setEditing(false);
                        Alert.alert('Success', 'Profile updated successfully');
                  } else {
                        Alert.alert('Error', response.error || 'Failed to update profile');
                  }
            } catch (error) {
                  console.error('Error updating profile:', error);
                  Alert.alert('Error', 'An error occurred while updating profile');
            } finally {
                  setSaving(false);
            }
      };

      const handleLogout = () => {
            Alert.alert(
                  'Confirm Logout',
                  'Are you sure you want to sign out?',
                  [
                        {
                              text: 'Cancel',
                              style: 'cancel',
                        },
                        {
                              text: 'Sign Out',
                              style: 'destructive',
                              onPress: async () => {
                                    try {
                                          await logout();
                                          // Navigation will be handled by AuthContext
                                    } catch (error) {
                                          console.error('Logout error:', error);
                                    }
                              },
                        },
                  ]
            );
      };

      const navigateToChangePassword = () => {
            navigation.navigate('ChangePassword');
      };

      const InfoRow = ({ label, value, icon }) => (
            <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>{icon}</Text>
                  <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>{label}</Text>
                        <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
                  </View>
            </View>
      );

      const ActionButton = ({ title, onPress, icon, color = colors.primary, variant = 'outline' }) => (
            <TouchableOpacity
                  style={[
                        styles.actionButton,
                        variant === 'filled' && { backgroundColor: color }
                  ]}
                  onPress={onPress}
            >
                  <Text style={styles.actionIcon}>{icon}</Text>
                  <Text style={[
                        styles.actionText,
                        variant === 'filled' && { color: colors.background }
                  ]}>
                        {title}
                  </Text>
            </TouchableOpacity>
      );

      if (loading) {
            return <LoadingSpinner />;
      }

      return (
            <SafeAreaView style={styles.container}>
                  <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        <View style={styles.header}>
                              <View style={styles.avatarContainer}>
                                    <View style={styles.avatar}>
                                          <Text style={styles.avatarText}>
                                                {profile?.name?.charAt(0) || 'U'}
                                          </Text>
                                    </View>
                                    <View style={styles.headerInfo}>
                                          <Text style={styles.userName}>{profile?.name || 'User'}</Text>
                                          <Text style={styles.userRole}>{profile?.role || 'Scanner'}</Text>
                                    </View>
                              </View>

                              {!editing && (
                                    <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                                          <Text style={styles.editButtonText}>✏️ Edit</Text>
                                    </TouchableOpacity>
                              )}
                        </View>

                        {editing ? (
                              /* Edit Form */
                              <View style={styles.editForm}>
                                    <Text style={styles.sectionTitle}>✏️ Edit Profile</Text>

                                    <Input
                                          label="Full Name"
                                          value={editData.name}
                                          onChangeText={(value) => setEditData(prev => ({ ...prev, name: value }))}
                                          placeholder="Enter your full name"
                                          required
                                    />

                                    <Input
                                          label="Email Address"
                                          value={editData.email}
                                          onChangeText={(value) => setEditData(prev => ({ ...prev, email: value }))}
                                          placeholder="Enter your email"
                                          keyboardType="email-address"
                                          autoCapitalize="none"
                                          required
                                    />

                                    <Input
                                          label="Phone Number"
                                          value={editData.phone}
                                          onChangeText={(value) => setEditData(prev => ({ ...prev, phone: value }))}
                                          placeholder="Enter your phone number"
                                          keyboardType="phone-pad"
                                    />

                                    <View style={styles.editActions}>
                                          <Button
                                                title="Cancel"
                                                onPress={handleCancelEdit}
                                                variant="outline"
                                                style={styles.editActionButton}
                                          />
                                          <Button
                                                title="Save Changes"
                                                onPress={handleSave}
                                                loading={saving}
                                                style={styles.editActionButton}
                                          />
                                    </View>
                              </View>
                        ) : (
                              /* Profile Information */
                              <View style={styles.profileInfo}>
                                    <Text style={styles.sectionTitle}>👤 Personal Information</Text>

                                    <View style={[styles.infoCard, commonStyles.shadow]}>
                                          <InfoRow
                                                label="Full Name"
                                                value={profile?.name}
                                                icon="👤"
                                          />
                                          <InfoRow
                                                label="Email Address"
                                                value={profile?.email}
                                                icon="📧"
                                          />
                                          <InfoRow
                                                label="Phone Number"
                                                value={profile?.phone}
                                                icon="📱"
                                          />
                                          <InfoRow
                                                label="Role"
                                                value={profile?.role}
                                                icon="🏷️"
                                          />
                                          <InfoRow
                                                label="Department"
                                                value={profile?.department}
                                                icon="🏢"
                                          />
                                    </View>

                                    <Text style={styles.sectionTitle}>📊 Account Details</Text>

                                    <View style={[styles.infoCard, commonStyles.shadow]}>
                                          <InfoRow
                                                label="Join Date"
                                                value={profile?.joinDate ? formatDate(profile.joinDate, 'long') : null}
                                                icon="📅"
                                          />
                                          <InfoRow
                                                label="Last Login"
                                                value={profile?.lastLogin ? formatDate(profile.lastLogin, 'datetime') : null}
                                                icon="🕐"
                                          />
                                          <InfoRow
                                                label="Permissions"
                                                value={profile?.permissions?.join(', ')}
                                                icon="🔐"
                                          />
                                    </View>
                              </View>
                        )}

                        {!editing && (
                              /* Action Buttons */
                              <View style={styles.actions}>
                                    <Text style={styles.sectionTitle}>⚡ Actions</Text>

                                    <ActionButton
                                          title="Change Password"
                                          onPress={navigateToChangePassword}
                                          icon="🔑"
                                    />

                                    <ActionButton
                                          title="Sign Out"
                                          onPress={handleLogout}
                                          icon="🚪"
                                          color={colors.error}
                                          variant="filled"
                                    />
                              </View>
                        )}
                  </ScrollView>
            </SafeAreaView>
      );
};

const styles = StyleSheet.create({
      container: {
            ...commonStyles.container,
      },
      scrollContent: {
            paddingBottom: 20,
      },
      header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      avatarContainer: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      avatar: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.primary,
            ...commonStyles.centerContent,
            marginRight: 16,
      },
      avatarText: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.background,
      },
      headerInfo: {
            flex: 1,
      },
      userName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
      },
      userRole: {
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 2,
      },
      editButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
      },
      editButtonText: {
            fontSize: 14,
            fontWeight: '500',
            color: colors.primary,
      },
      sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            paddingHorizontal: 20,
      },
      profileInfo: {
            paddingVertical: 16,
      },
      infoCard: {
            backgroundColor: colors.background,
            borderRadius: 12,
            marginHorizontal: 20,
            marginBottom: 24,
            padding: 16,
      },
      infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
      },
      infoIcon: {
            fontSize: 20,
            width: 32,
            textAlign: 'center',
      },
      infoContent: {
            flex: 1,
            marginLeft: 12,
      },
      infoLabel: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 2,
      },
      infoValue: {
            fontSize: 16,
            color: colors.text,
            fontWeight: '500',
      },
      editForm: {
            paddingVertical: 16,
            paddingHorizontal: 20,
      },
      editActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
      },
      editActionButton: {
            flex: 0.48,
      },
      actions: {
            paddingVertical: 16,
      },
      actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            marginBottom: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
      },
      actionIcon: {
            fontSize: 20,
            marginRight: 12,
      },
      actionText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.text,
      },
});

export default ProfileScreen;
