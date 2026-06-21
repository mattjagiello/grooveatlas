import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Era } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

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
          <Text style={[styles.name, { color: colors.foreground, fontFamily: Fonts.serif }]}>
            {era.name}
          </Text>
          <Text style={[styles.years, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>{era.years}</Text>
        </View>
        <Text style={[styles.subtitle, { color: era.color, fontFamily: Fonts.label }]}>{era.subtitle}</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
          {era.description}
        </Text>
        <View style={styles.characteristics}>
          {era.characteristics.slice(0, 2).map((c, i) => (
            <View key={i} style={[styles.chip, { backgroundColor: colors.muted }]}>
              <Text style={[styles.chipText, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>{c}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.drummers, { color: colors.primary, fontFamily: Fonts.labelRegular }]}>
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
  },
  years: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 0.5,
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
  },
  drummers: {
    fontSize: 12,
    marginTop: 4,
  },
});
