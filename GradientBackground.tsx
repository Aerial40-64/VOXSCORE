import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

const LIGHT_GRADIENT: readonly [string, string, string, string] = [
  '#FF3870',
  '#FF7A5A',
  '#FFB89A',
  '#FFF0E8',
];

const DARK_GRADIENT: readonly [string, string, string, string] = [
  '#4A0A20',
  '#2D0A1A',
  '#1A0810',
  '#0F050A',
];

export default function GradientBackground({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <LinearGradient
      colors={isDark ? DARK_GRADIENT : LIGHT_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={styles.fill}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
