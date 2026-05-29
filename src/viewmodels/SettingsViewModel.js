import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { FirebaseService } from '../services/FirebaseService';
import { NotificationService } from '../services/NotificationService';

const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  reminderHour: 18,
  reminderMinute: 0,
  darkMode: false,
  fontSize: 'medium',
  language: 'pl',
};

export const useSettingsViewModel = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    const unsubscribe = FirebaseService.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const loadSettings = useCallback(async () => {
    const saved = await StorageService.getSettings();
    if (saved) setSettings({ ...DEFAULT_SETTINGS, ...saved });
    setLoading(false);
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      StorageService.saveSettings(updated);
      return updated;
    });

    if (key === 'notificationsEnabled') {
      if (value) {
        const granted = await NotificationService.requestPermissions();
        if (granted) {
          await NotificationService.scheduleDailyReminder(
            settings.reminderHour,
            settings.reminderMinute
          );
        }
      } else {
        await NotificationService.cancelAllNotifications();
      }
    }

    if (key === 'reminderHour' || key === 'reminderMinute') {
      if (settings.notificationsEnabled) {
        const hour = key === 'reminderHour' ? value : settings.reminderHour;
        const minute = key === 'reminderMinute' ? value : settings.reminderMinute;
        await NotificationService.scheduleDailyReminder(hour, minute);
      }
    }
  }, [settings]);

  const signOut = useCallback(async () => {
    await FirebaseService.signOut();
    await StorageService.saveUserProfile(null);
    setUser(null);
  }, []);

  return { settings, user, loading, updateSetting, signOut };
};
