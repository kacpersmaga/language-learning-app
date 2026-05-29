import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useSettingsViewModel } from '../../viewmodels/SettingsViewModel';
import { COLORS } from '../theme';

const SettingsScreen = () => {
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;
  const { settings, user, updateSetting, signOut } = useSettingsViewModel();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isLandscape && styles.contentLandscape]}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user ? (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.displayName?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.displayName || 'User'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Not signed in</Text>
            <Text style={styles.rowSubLabel}>
              Sign in for cloud sync (configure Firebase first)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Daily reminders</Text>
            <Text style={styles.rowSubLabel}>Get reminded to practice every day</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={v => updateSetting('notificationsEnabled', v)}
            trackColor={{ false: '#ccc', true: COLORS.primary }}
            thumbColor="#fff"
          />
        </View>

        {settings.notificationsEnabled && (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reminder time</Text>
            <View style={styles.timeSelector}>
              <TouchableOpacity
                style={styles.timeBtn}
                onPress={() =>
                  updateSetting(
                    'reminderHour',
                    settings.reminderHour > 0 ? settings.reminderHour - 1 : 23
                  )
                }
              >
                <Text style={styles.timeBtnText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>
                {String(settings.reminderHour).padStart(2, '0')}:
                {String(settings.reminderMinute).padStart(2, '0')}
              </Text>
              <TouchableOpacity
                style={styles.timeBtn}
                onPress={() =>
                  updateSetting(
                    'reminderHour',
                    settings.reminderHour < 23 ? settings.reminderHour + 1 : 0
                  )
                }
              >
                <Text style={styles.timeBtnText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Interface language</Text>
            <Text style={styles.rowSubLabel}>App display language</Text>
          </View>
          <View style={styles.langSelector}>
            <TouchableOpacity
              style={[styles.langBtn, settings.language === 'pl' && styles.langBtnActive]}
              onPress={() => updateSetting('language', 'pl')}
            >
              <Text style={[styles.langBtnText, settings.language === 'pl' && styles.langBtnTextActive]}>
                PL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, settings.language === 'en' && styles.langBtnActive]}
              onPress={() => updateSetting('language', 'en')}
            >
              <Text style={[styles.langBtnText, settings.language === 'en' && styles.langBtnTextActive]}>
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Font size</Text>
          </View>
          <View style={styles.langSelector}>
            {['small', 'medium', 'large'].map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.langBtn, settings.fontSize === size && styles.langBtnActive]}
                onPress={() => updateSetting('fontSize', size)}
              >
                <Text style={[styles.langBtnText, settings.fontSize === size && styles.langBtnTextActive]}>
                  {size[0].toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  contentLandscape: {
    paddingHorizontal: 48,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowSubLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  signOutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  signOutText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 13,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  timeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeBtnText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    minWidth: 50,
    textAlign: 'center',
  },
  langSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  langBtnTextActive: {
    color: '#fff',
  },
});

export default SettingsScreen;
