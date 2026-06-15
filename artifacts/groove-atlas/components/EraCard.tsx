import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Era } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

type EraCardProps = {
  era: Era;
  onPress?: (era: Era) => void;
};

export default function EraCard({ era, onPress }: EraCardProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.(era);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.75}
    >
      <View style={[styles.accent, { backgroundColor: era.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.foreground, fontFamily: 'serif' }]}>
            {era.name}
          </Text>
          <Text style={[styles.years, { color: colors.mutedForeground }]}>{era.years}</Text>
        </View>
        <Text style={[styles.subtitle, { color: era.color }]}>{era.subtitle}</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {era.description}
        </Text>
        <View style={styles.characteristics}>
          {era.characteristics.slice(0, 2).map((c, i) => (
            <View key={i} style={[styles.chip, { backgroundColor: colors.muted }]}>
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{c}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.drummers, { color: colors.primary }]}>
          {era.keyDrummerIds.length} key drummers · {era.iconicSongIds.length} iconic songs
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  years: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  characteristics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  drummers: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
