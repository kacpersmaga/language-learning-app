import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_PROGRESS: '@lla_user_progress',
  SETTINGS: '@lla_settings',
  USER_PROFILE: '@lla_user_profile',
};

export const StorageService = {
  async getProgress() {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveProgress(progress) {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  async getUserProfile() {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveUserProfile(profile) {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};
