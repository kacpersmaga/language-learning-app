import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressViewModel } from '../../viewmodels/ProgressViewModel';
import LessonCard from '../components/LessonCard';
import { LESSONS } from '../../models/Lesson';
import { COLORS } from '../theme';

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;
  const { getLessonStatus, getStats } = useProgressViewModel();
  const stats = getStats();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderHeader = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={[styles.header, isLandscape && styles.headerLandscape]}
      >
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.subtitle}>Continue your English journey</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>
      </LinearGradient>
      <Text style={styles.sectionTitle}>Lessons</Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={LESSONS}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        numColumns={isLandscape ? 2 : 1}
        key={isLandscape ? 'landscape' : 'portrait'}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={isLandscape ? { flex: 1 } : {}}>
            <LessonCard
              lesson={item}
              status={getLessonStatus(item.id)}
              onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  headerLandscape: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  list: {
    paddingBottom: 24,
  },
});

export default HomeScreen;
