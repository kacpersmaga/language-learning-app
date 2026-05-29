import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';

const AboutScreen = () => {
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isLandscape && styles.contentLandscape]}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.appCard}
        >
          <Text style={styles.appIcon}>🌍</Text>
          <Text style={styles.appName}>LinguaLearn</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDesc}>
            An educational application for learning English, built with React Native & Expo.
          </Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authors</Text>

          <View style={styles.authorCard}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>KS</Text>
            </View>
            <View>
              <Text style={styles.authorName}>Kacper Smaga</Text>
              <Text style={styles.authorRole}>Developer</Text>
            </View>
          </View>

          <View style={[styles.authorCard, { borderTopWidth: 1, borderTopColor: COLORS.border }]}>
            <View style={[styles.authorAvatar, { backgroundColor: COLORS.secondary }]}>
              <Text style={styles.authorAvatarText}>RB</Text>
            </View>
            <View>
              <Text style={styles.authorName}>Roch Burmer</Text>
              <Text style={styles.authorRole}>Developer</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Institution</Text>
          <View style={styles.ideisCard}>
            <View style={styles.ideisLogoBg}>
              <Text style={styles.ideisLogoText}>IDEIS</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.ideisName}>IDEIS</Text>
              <Text style={styles.ideisDesc}>
                Institute of Computer Science and Intelligent Systems
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <View style={styles.techGrid}>
            {[
              { icon: '⚛️', name: 'React Native' },
              { icon: '📱', name: 'Expo SDK 56' },
              { icon: '🔥', name: 'Firebase' },
              { icon: '🧭', name: 'React Navigation' },
            ].map(tech => (
              <View key={tech.name} style={styles.techItem}>
                <Text style={styles.techIcon}>{tech.icon}</Text>
                <Text style={styles.techName}>{tech.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {[
            'MVVM architecture pattern',
            'Firebase backend & authentication',
            'Local data persistence (AsyncStorage)',
            'Push notifications',
            'Portrait & landscape support',
            'Free Dictionary API integration',
            'Animated UI transitions',
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureDot}>✓</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Made with ❤️ for mobile programming course
        </Text>
      </Animated.View>
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
    paddingBottom: 40,
  },
  contentLandscape: {
    paddingHorizontal: 48,
  },
  appCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  appDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  authorRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ideisCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ideisLogoBg: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ideisLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  ideisName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  ideisDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  techIcon: {
    fontSize: 16,
  },
  techName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  featureDot: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 16,
  },
});

export default AboutScreen;
