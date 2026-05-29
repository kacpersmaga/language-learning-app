import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useProgressViewModel } from '../../viewmodels/ProgressViewModel';
import { LESSONS } from '../../models/Lesson';
import { COLORS } from '../theme';
import { getGrade } from '../../models/UserProgress';

const ProgressScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;
  const { getStats, getLessonStatus, resetProgress } = useProgressViewModel();
  const stats = getStats();
  const fillAnim = useRef(new Animated.Value(0)).current;

  const progressPercent = stats.total > 0 ? stats.completed / stats.total : 0;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: progressPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetProgress },
      ]
    );
  };

  const barWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, isLandscape && styles.contentLandscape]}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={[styles.headerCard, isLandscape && styles.headerCardLandscape]}
      >
        <Text style={styles.headerTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Lessons done</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.streak} 🔥</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.avgScore}%</Text>
            <Text style={styles.statLabel}>Avg. score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalPoints}</Text>
            <Text style={styles.statLabel}>Total points</Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: barWidth }]} />
        </View>
        <Text style={styles.progressLabel}>
          {stats.completed} / {stats.total} lessons completed
        </Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Lesson Results</Text>

      {LESSONS.filter(l => !l.comingSoon).map((lesson) => {
        const status = getLessonStatus(lesson.id);
        const grade = status.completed ? getGrade(status.score) : null;

        return (
          <View key={lesson.id} style={styles.lessonRow}>
            <Text style={styles.lessonIcon}>{lesson.icon}</Text>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonName}>{lesson.title}</Text>
              {status.completed ? (
                <Text style={styles.lessonScore}>Score: {status.score}% — {grade?.label}</Text>
              ) : (
                <Text style={styles.lessonPending}>Not completed yet</Text>
              )}
            </View>
            {status.completed ? (
              <View style={[styles.gradeBadge, { backgroundColor: status.score >= 75 ? COLORS.success : COLORS.warning }]}>
                <Text style={styles.gradeText}>{grade?.grade}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.navigate('Home', { screen: 'HomeTab' })}
              >
                <Text style={styles.startBtnText}>Start</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetBtnText}>Reset all progress</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 32,
  },
  contentLandscape: {
    paddingHorizontal: 48,
  },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  headerCardLandscape: {
    marginTop: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    minWidth: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    textAlign: 'center',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  lessonIcon: {
    fontSize: 28,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  lessonScore: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 2,
  },
  lessonPending: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gradeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  startBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  startBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  resetBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  resetBtnText: {
    color: COLORS.error,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProgressScreen;
