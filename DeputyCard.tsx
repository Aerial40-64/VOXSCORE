import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { Deputy } from '@/types/database';
import CoherenceRing, { getScoreColor } from '@/components/common/CoherenceRing';
import { Shadows } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface DeputyCardProps {
  deputy: Deputy;
  compact?: boolean;
}

export default function DeputyCard({ deputy, compact = false }: DeputyCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const partyColor = deputy.party?.color || colors.absent;
  const scoreColor = getScoreColor(deputy.coherence_score);

  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: colors.surface }, Shadows.md]}
      onPress={() => router.push(`/depute/${deputy.id}`)}
      activeOpacity={0.88}
    >
      <View style={s.main}>
        <View style={s.avatarWrap}>
          {deputy.photo_url ? (
            <Image source={{ uri: deputy.photo_url }} style={[s.avatar, { backgroundColor: colors.borderLight }]} />
          ) : (
            <View style={[s.avatarFallback, { backgroundColor: partyColor + '20' }]}>
              <Text style={[s.avatarInitial, { color: partyColor }]}>
                {deputy.first_name[0]}{deputy.name[0]}
              </Text>
            </View>
          )}
          <View style={[s.partyDot, { backgroundColor: partyColor, borderColor: colors.surface }]} />
        </View>

        <View style={s.info}>
          <Text style={[s.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {deputy.first_name} {deputy.name}
          </Text>
          <View style={[s.partyBadge, { backgroundColor: partyColor + '15' }]}>
            <Text style={[s.partyText, { color: partyColor }]}>
              {deputy.party?.short_name || 'N/A'}
            </Text>
          </View>
          <View style={s.locationRow}>
            <MapPin size={11} color={colors.textTertiary} strokeWidth={2} />
            <Text style={[s.location, { color: colors.textTertiary }]} numberOfLines={1}>{deputy.department}</Text>
          </View>
        </View>

        <CoherenceRing score={deputy.coherence_score} size={compact ? 58 : 66} strokeWidth={6} />
      </View>

      {!compact && (
        <View style={[s.footer, { borderTopColor: colors.borderLight, backgroundColor: colors.surfaceElevated }]}>
          <View style={s.footerStat}>
            <Text style={[s.footerValue, { color: colors.textPrimary }]}>{deputy.mandates_count}</Text>
            <Text style={[s.footerLabel, { color: colors.textTertiary }]}>mandat{deputy.mandates_count > 1 ? 's' : ''}</Text>
          </View>
          <View style={[s.footerDivider, { backgroundColor: colors.border }]} />
          <View style={s.footerStat}>
            <Text style={[s.footerValue, { color: colors.textPrimary }, deputy.absences_rate > 20 && { color: colors.broken }]}>
              {deputy.absences_rate}%
            </Text>
            <Text style={[s.footerLabel, { color: colors.textTertiary }]}>absences</Text>
          </View>
          <View style={[s.footerDivider, { backgroundColor: colors.border }]} />
          <View style={[s.footerCta, { backgroundColor: scoreColor + '12' }]}>
            <Text style={[s.footerCtaText, { color: scoreColor }]}>
              Score {deputy.coherence_score}/100
            </Text>
            <ChevronRight size={12} color={scoreColor} strokeWidth={2.5} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 54, height: 54, borderRadius: 27,
  },
  avatarFallback: {
    width: 54, height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitial: { fontSize: 17, fontWeight: '800' },
  partyDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2.5,
  },
  info: { flex: 1, gap: 4 },
  name: {
    fontSize: 15, fontWeight: '800', letterSpacing: -0.2,
  },
  partyBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 5, alignSelf: 'flex-start',
  },
  partyText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  location: { fontSize: 12, flex: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  footerStat: { flex: 1, alignItems: 'center', gap: 2 },
  footerValue: { fontSize: 15, fontWeight: '800' },
  footerLabel: { fontSize: 10 },
  footerDivider: { width: 1, height: 24 },
  footerCta: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  footerCtaText: { fontSize: 12, fontWeight: '700' },
});
