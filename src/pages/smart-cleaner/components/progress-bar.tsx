// GradientProgressBar.tsx
import React from 'react';
import { DimensionValue, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  progress: number; // значение от 0 до 1
  height?: number;
  borderRadius?: number;
  showPercent?: boolean;
};

export function GradientProgressBar({
  progress,
  height = 17,
  borderRadius = 10,
  showPercent = false,
}: Props) {
  const widthPercent = (Math.min(Math.max(progress, 0), 1) * 100 +
    '%') as DimensionValue;

  return (
    <View style={[styles.container, { height, borderRadius }]}>
      <LinearGradient
        colors={['#3D93F2', '#F76363']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { width: widthPercent, height, borderRadius }]}
      />
      {showPercent && (
        <Text style={styles.label}>{Math.round(progress * 100)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF26',
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    zIndex: 1,
  },
});
