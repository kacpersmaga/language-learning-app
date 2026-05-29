import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

const LessonCard = ({ lesson, status, onPress }) => {
  const isLocked = lesson.comingSoon;

  return (
    <TouchableOpacity
      style={[styles.card, isLocked && styles.locked, status?.completed && styles.completed]}
      onPress={!isLocked ? onPress : null}
      activeOpacity={isLocked ? 1 : 0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{lesson.icon}</Text>
        {status?.completed && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, isLocked && styles.lockedText]}>{lesson.title}</Text>
        <Text style={[styles.description, isLocked && styles.lockedText]} numberOfLines={2}>
          {lesson.description}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.badge}>{lesson.difficulty}</Text>
          <Text style={styles.duration}>{lesson.duration}</Text>
        </View>
        {status?.completed && (
          <Text style={styles.score}>Score: {status.score}%</Text>
        )}
      </View>
      {isLocked ? (
        <Text style={styles.lockIcon}>🔒</Text>
      ) : (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  locked: {
    opacity: 0.5,
  },
  completed: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  lockedText: {
    color: COLORS.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    fontSize: 11,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
    overflow: 'hidden',
  },
  duration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  score: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 4,
  },
  lockIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
});

export default LessonCard;
