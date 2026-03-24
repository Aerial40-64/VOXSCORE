import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';
import { Law } from '@/types/database';
import CategoryBadge from '@/components/common/CategoryBadge';
import { Shadows } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface LawCardProps {
  law: Law;
  showDetails?: boolean;
}

export default function LawCard({ law, showDetails = false }: LawCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(showDetails);

  const RESULT_CONFIG = {
    adopted: { label: 'Adoptee', bg: colors.keptLight, color: colors.kept },
    rejected: { label: 'Rejetee', bg: colors.brokenLight, color: colors.broken },
    pending: { label: 'En cours', bg: colors.partialLight, color: colors.partial },
  };

  const result = RESULT_CONFIG[law.vote_result];
  const totalVotes = law.pour_count + law.contre_count + law.abstention_count;

  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: colors.surface }, Shadows.md]}
      onPress={() => router.push(`/loi/${law.id}`)}
      activeOpacity={0.9}
    >
      <View style={s.header}>
        <View style={s.headerLeft}>
          <CategoryBadge category={law.category} />
          <View style={[s.resultBadge, { backgroundColor: result.bg }]}>
            <Text style={[s.resultText, { color: result.color }]}>{result.label}</Text>
          </View>
        </View>
        {law.vote_date && (
          <Text style={[s.date, { color: colors.textTertiary }]}>
            {new Date(law.vote_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
          </Text>
        )}
      </View>

      <Text style={[s.title, { color: colors.textPrimary }]}>{law.title_short}</Text>
      <Text style={[s.description, { color: colors.textSecondary }]} numberOfLines={expanded ? undefined : 2}>
        {law.description_simple}
      </Text>

      {expanded && (
        <View style={s.details}>
          {law.positive_impacts.length > 0 && (
            <View style={s.impactSection}>
              <View style={s.impactHeader}>
                <TrendingUp size={14} color={colors.kept} strokeWidth={2.5} />
                <Text style={[s.impactTitle, { color: colors.kept }]}>Points positifs</Text>
              </View>
              {law.positive_impacts.slice(0, 3).map((impact, i) => (
                <View key={i} style={s.impactItem}>
                  <View style={[s.bullet, { backgroundColor: colors.kept }]} />
                  <Text style={[s.impactText, { color: colors.textSecondary }]}>{impact}</Text>
                </View>
              ))}
            </View>
          )}

          {law.negative_impacts.length > 0 && (
            <View style={s.impactSection}>
              <View style={s.impactHeader}>
                <TrendingDown size={14} color={colors.broken} strokeWidth={2.5} />
                <Text style={[s.impactTitle, { color: colors.broken }]}>Points negatifs</Text>
              </View>
              {law.negative_impacts.slice(0, 3).map((impact, i) => (
                <View key={i} style={s.impactItem}>
                  <View style={[s.bullet, { backgroundColor: colors.broken }]} />
                  <Text style={[s.impactText, { color: colors.textSecondary }]}>{impact}</Text>
                </View>
              ))}
            </View>
          )}

          {law.estimated_cost && (
            <View style={[s.costRow, { backgroundColor: colors.partialLight }]}>
              <DollarSign size={14} color={colors.partial} strokeWidth={2.5} />
              <Text style={[s.costText, { color: colors.partial }]}>{law.estimated_cost}</Text>
            </View>
          )}

          {totalVotes > 0 && (
            <View style={s.voteBar}>
              <View style={s.voteBarTrack}>
                <View style={[s.voteBarFill, { flex: law.pour_count, backgroundColor: colors.kept }]} />
                <View style={[s.voteBarFill, { flex: law.contre_count, backgroundColor: colors.broken }]} />
                <View style={[s.voteBarFill, { flex: law.abstention_count, backgroundColor: colors.partial }]} />
              </View>
              <View style={s.voteBarLegend}>
                <Text style={[s.voteLegendText, { color: colors.kept }]}>{law.pour_count} pour</Text>
                <Text style={[s.voteLegendText, { color: colors.broken }]}>{law.contre_count} contre</Text>
                <Text style={[s.voteLegendText, { color: colors.partial }]}>{law.abstention_count} abstentions</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={s.expandBtn}
        onPress={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        <Text style={[s.expandText, { color: colors.primaryLight }]}>{expanded ? 'Reduire' : 'Voir le detail'}</Text>
        {expanded ? (
          <ChevronUp size={14} color={colors.primaryLight} strokeWidth={2.5} />
        ) : (
          <ChevronDown size={14} color={colors.primaryLight} strokeWidth={2.5} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resultText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 12 },
  title: { fontSize: 16, fontWeight: '800', marginBottom: 6, lineHeight: 22 },
  description: { fontSize: 14, lineHeight: 20 },
  details: { marginTop: 14, gap: 12 },
  impactSection: { gap: 6 },
  impactHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  impactTitle: { fontSize: 13, fontWeight: '700' },
  impactItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingLeft: 4 },
  bullet: { width: 5, height: 5, borderRadius: 2.5, marginTop: 6 },
  impactText: { fontSize: 13, flex: 1, lineHeight: 18 },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
  },
  costText: { fontSize: 13, fontWeight: '600', flex: 1 },
  voteBar: { gap: 8 },
  voteBarTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  voteBarFill: { borderRadius: 2 },
  voteBarLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  voteLegendText: { fontSize: 11, fontWeight: '600' },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  expandText: { fontSize: 13, fontWeight: '600' },
});
