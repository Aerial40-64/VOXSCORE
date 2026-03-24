import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CATEGORY_CONFIG: Record<string, { bg: string; color: string }> = {
  Social: { bg: '#F0F4FF', color: '#1E4FD8' },
  Economie: { bg: '#FFF7E6', color: '#B45309' },
  Immigration: { bg: '#FFF0F3', color: '#BE123C' },
  Environnement: { bg: '#ECFDF5', color: '#047857' },
  Justice: { bg: '#EFF6FF', color: '#1D4ED8' },
  Numerique: { bg: '#F0FEFF', color: '#0E7490' },
  Sante: { bg: '#FDF4FF', color: '#9333EA' },
  Education: { bg: '#FFF7ED', color: '#C2410C' },
};

interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category] || { bg: '#F1F5F9', color: '#64748B' };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
