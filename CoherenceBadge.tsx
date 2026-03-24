import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface CoherenceBadgeProps {
  coherence: 'respected' | 'broken' | 'partial';
  showIcon?: boolean;
}

const CONFIG = {
  respected: {
    label: 'Promesse tenue',
    bg: Colors.keptLight,
    color: Colors.kept,
    Icon: CheckCircle,
  },
  broken: {
    label: 'Promesse brisee',
    bg: Colors.brokenLight,
    color: Colors.broken,
    Icon: XCircle,
  },
  partial: {
    label: 'Partiellement tenue',
    bg: Colors.partialLight,
    color: Colors.partial,
    Icon: AlertCircle,
  },
};

export default function CoherenceBadge({ coherence, showIcon = true }: CoherenceBadgeProps) {
  const { label, bg, color, Icon } = CONFIG[coherence];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {showIcon && <Icon size={12} color={color} strokeWidth={2.5} />}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
