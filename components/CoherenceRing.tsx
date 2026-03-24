import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';

interface CoherenceRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  dark?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 70) return Colors.kept;
  if (score >= 40) return Colors.partial;
  return Colors.broken;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Bon';
  if (score >= 55) return 'Moyen';
  if (score >= 40) return 'Faible';
  return 'Tres faible';
}

export default function CoherenceRing({
  score,
  size = 80,
  strokeWidth = 8,
  showLabel = false,
  dark = false,
}: CoherenceRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const strokeDashoffset = circumference * (1 - progress);
  const color = getScoreColor(score);
  const trackColor = dark ? 'rgba(255,255,255,0.12)' : Colors.borderLight;
  const textColor = dark ? Colors.textInverse : color;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${cx}, ${cy}`}
        />
      </Svg>
      <View style={[styles.labelContainer, { width: size, height: size }]}>
        <Text style={[styles.score, { color: textColor, fontSize: size * 0.26 }]}>
          {score}
        </Text>
        <Text style={[styles.percent, { fontSize: size * 0.14, color: dark ? 'rgba(255,255,255,0.5)' : Colors.textTertiary }]}>
          /100
        </Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { color }]}>{getScoreLabel(score)}</Text>
      )}
    </View>
  );
}

export { getScoreColor, getScoreLabel };

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  percent: {
    fontWeight: '600',
    marginTop: -2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
