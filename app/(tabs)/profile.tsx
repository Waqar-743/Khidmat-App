import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Platform, SafeAreaView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../src/constants';

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [language, setLanguage] = React.useState('En');

  const handlePress = (feature: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${feature} feature coming soon!`);
    } else {
      alert(`${feature} feature coming soon!`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* Header matching design */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <MaterialIcons name="smart-toy" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>KHIDMAT Agent</Text>
          <TouchableOpacity style={styles.headerAction}>
            <MaterialIcons name="more-vert" size={24} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          {/* Profile Card — Centered layout matching s12 */}
          <View style={styles.profileCard}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <MaterialIcons name="edit" size={14} color={Colors.onPrimary} />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={styles.name}>Bilal Ahmed</Text>

            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified User</Text>
            </View>

            {/* Contact Info */}
            <View style={styles.contactList}>
              <View style={styles.contactRow}>
                <View style={styles.contactIconBg}>
                  <MaterialIcons name="phone" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.contactText}>+92 300{'\n'}1234567</Text>
              </View>
              <View style={styles.contactRow}>
                <View style={styles.contactIconBg}>
                  <MaterialIcons name="email" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.contactText}>bilal.ahmed@example.com</Text>
              </View>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity style={styles.editProfileBtn} onPress={() => handlePress('Edit Profile')}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Saved Addresses */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcons name="location-on" size={24} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Saved{'\n'}Addresses</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => handlePress('Add Address')}>
                <MaterialIcons name="add" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Home Address */}
            <View style={styles.addressCard}>
              <MaterialIcons name="home" size={24} color={Colors.primary} style={styles.addressIcon} />
              <View style={styles.addressContent}>
                <Text style={styles.addressType}>Home</Text>
                <Text style={styles.addressText}>Apt 4B, Gulberg Heights, Block D, Gulberg III, Lahore, Punjab</Text>
              </View>
            </View>

            {/* Office Address */}
            <View style={styles.addressCard}>
              <MaterialIcons name="work-outline" size={24} color={Colors.primary} style={styles.addressIcon} />
              <View style={styles.addressContent}>
                <Text style={styles.addressType}>Office</Text>
                <Text style={styles.addressText}>Level 3, Tech Park, Johar Town, Lahore, Punjab</Text>
              </View>
            </View>
          </View>

          {/* Preferences & Settings */}
          <View style={styles.settingsSection}>
            <View style={styles.settingsSectionHeader}>
              <Text style={styles.settingsSectionTitle}>Preferences & Settings</Text>
            </View>

            {/* Language Setting */}
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBg}>
                  <MaterialIcons name="translate" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Language</Text>
                  <Text style={styles.settingSubtitle}>Current: {language === 'En' ? 'English' : 'Urdu'}</Text>
                </View>
              </View>
              <View style={styles.langToggle}>
                <TouchableOpacity 
                  style={language === 'En' ? styles.langActive : styles.langInactive}
                  onPress={() => setLanguage('En')}
                >
                  <Text style={language === 'En' ? styles.langActiveText : styles.langInactiveText}>En</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={language === 'Urdu' ? styles.langActive : styles.langInactive}
                  onPress={() => setLanguage('Urdu')}
                >
                  <Text style={language === 'Urdu' ? styles.langActiveText : styles.langInactiveText}>اردو</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Notifications */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBg}>
                  <MaterialIcons name="notifications" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Notification Settings</Text>
                  <Text style={styles.settingSubtitle}>Push, SMS, and Email alerts</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.outlineVariant, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>

            {/* Privacy */}
            <TouchableOpacity style={styles.settingRow} onPress={() => handlePress('Privacy Policy')}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBg}>
                  <MaterialIcons name="policy" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Privacy Policy</Text>
                  <Text style={styles.settingSubtitle}>Review our data handling practices</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/help-support')}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconBg}>
                  <MaterialIcons name="help-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Help & Support</Text>
                  <Text style={styles.settingSubtitle}>FAQs, chat, and call center</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Sign Out */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton}>
              <MaterialIcons name="logout" size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    height: 64,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
  },
  headerTitle: {
    flex: 1,
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    marginLeft: Spacing.gutter,
  },
  headerAction: {
    padding: Spacing.sm,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  // Profile Card — centered layout like s12
  profileCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    ...Elevation.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.outlineVariant,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Elevation.sm,
  },
  name: {
    ...Typography.headlineLgMobile,
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  verifiedBadge: {
    backgroundColor: Colors.secondaryFixed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  verifiedText: {
    ...Typography.bodyMd,
    color: Colors.onSecondaryFixed,
    fontWeight: '500',
  },
  contactList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutter,
  },
  contactIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  editProfileBtn: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  editProfileText: {
    ...Typography.codeSm,
    color: Colors.onSecondaryContainer,
    fontWeight: '500',
    letterSpacing: 1,
  },
  // Saved Addresses
  section: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.lg,
    ...Elevation.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  addBtn: {
    padding: 8,
    borderRadius: BorderRadius.full,
  },
  addressCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.sm,
  },
  addressIcon: {
    marginRight: Spacing.gutter,
    marginTop: 4,
  },
  addressContent: {
    flex: 1,
  },
  addressType: {
    ...Typography.bodyLg,
    color: Colors.onBackground,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  addressText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },
  // Settings Section
  settingsSection: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Elevation.sm,
  },
  settingsSectionHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    backgroundColor: 'rgba(245,242,255,0.5)',
  },
  settingsSectionTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
  },
  settingRow: {
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(190,201,195,0.2)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  settingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    ...Typography.bodyLg,
    color: Colors.onBackground,
    fontWeight: '500',
  },
  settingSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  langActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    ...Elevation.sm,
  },
  langActiveText: {
    ...Typography.bodyMd,
    color: Colors.onPrimary,
    fontWeight: '500',
  },
  langInactive: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  langInactiveText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    fontSize: 16,
  },
  // Logout
  logoutContainer: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.bodyLg,
    color: Colors.error,
    fontWeight: '500',
  },
});
