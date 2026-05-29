import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const StageProgressBar = ({ current, total }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < current && styles.dotCompleted,
            i === current && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  dotCompleted: {
    backgroundColor: COLORS.success,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});

export default StageProgressBar;
