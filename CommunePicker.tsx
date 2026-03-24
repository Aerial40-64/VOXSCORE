import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, MapPin } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/contexts/ThemeContext';
import { Shadows } from '@/constants/colors';

export interface PostalCodeCommune {
  code: string;
  commune_name: string;
  department_name: string;
  constituency_number: number;
  deputy_id: string;
}

interface Props {
  visible: boolean;
  postalCode: string;
  communes: PostalCodeCommune[];
  onSelect: (commune: PostalCodeCommune) => void;
  onClose: () => void;
}

export default function CommunePicker({ visible, postalCode, communes, onSelect, onClose }: Props) {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (visible) setFilter('');
  }, [visible]);

  const filtered = filter.trim().length > 0
    ? communes.filter(c => c.commune_name.toLowerCase().includes(filter.trim().toLowerCase()))
    : communes;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.container, { backgroundColor: colors.surfaceElevated }]} edges={['top', 'bottom']}>
        <View style={[s.header, { borderBottomColor: colors.border }]}>
          <View style={s.headerTop}>
            <View>
              <Text style={[s.title, { color: colors.textPrimary }]}>Choisir votre commune</Text>
              <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                Code postal {postalCode} — {communes.length} commune{communes.length > 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[s.closeBtn, { backgroundColor: colors.accentLight }]}>
              <X size={18} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {communes.length > 5 && (
            <View style={[s.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Search size={16} color={colors.textTertiary} strokeWidth={2} />
              <TextInput
                style={[s.searchInput, { color: colors.textPrimary }]}
                placeholder="Filtrer les communes..."
                placeholderTextColor={colors.textTertiary}
                value={filter}
                onChangeText={setFilter}
                autoCapitalize="none"
              />
            </View>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => `${item.commune_name}-${item.constituency_number}`}
          contentContainerStyle={s.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.communeRow, { backgroundColor: colors.surface, borderColor: colors.border }, Shadows.sm]}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              <View style={[s.communeIcon, { backgroundColor: colors.accentLight }]}>
                <MapPin size={16} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={s.communeInfo}>
                <Text style={[s.communeName, { color: colors.textPrimary }]}>{item.commune_name}</Text>
                <Text style={[s.communeCirco, { color: colors.textSecondary }]}>
                  {item.department_name} — {item.constituency_number}ème circonscription
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={[s.emptyText, { color: colors.textTertiary }]}>Aucune commune trouvée</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  communeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginBottom: 10,
  },
  communeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  communeInfo: {
    flex: 1,
  },
  communeName: {
    fontSize: 15,
    fontWeight: '600',
  },
  communeCirco: {
    fontSize: 12,
    marginTop: 2,
  },
  empty: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
