import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface VoteBadgeProps {
  vote: 'pour' | 'contre' | 'abstention' | 'absent';
  size?: 'sm' | 'md' | 'lg';
}

const VOTE_CONFIG = {
  pour: { label: 'POUR', bg: Colors.keptLight, color: Colors.keptDark, border: Colors.kept },
  contre: { label: 'CONTRE', bg: Colors.brokenLight, color: Colors.brokenDark, border: Colors.broken },
  abstention: { label: 'ABSTENTION', bg: Colors.partialLight, color: Colors.partialDark, border: Colors.partial },
  absent: { label: 'ABSENT', bg: Colors.absentLight, color: Colors.absent, border: Colors.absent },
};

const SIZE_CONFIG = {
  sm: { fontSize: 9, px: 6, py: 3, radius: 5 },
  md: { fontSize: 10, px: 8, py: 4, radius: 6 },
  lg: { fontSize: 12, px: 12, py: 5, radius: 8 },
};

export default function VoteBadge({ vote, size = 'md' }: VoteBadgeProps) {
  const config = VOTE_CONFIG[vote];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          paddingHorizontal: sizeConfig.px,
          paddingVertical: sizeConfig.py,
          borderRadius: sizeConfig.radius,
          borderWidth: 1,
          borderColor: config.border + '40',
        },
      ]}
    >
      <Text style={[styles.text, { color: config.color, fontSize: sizeConfig.fontSize }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start' },
  text: { fontWeight: '800', letterSpacing: 0.6 },
});
