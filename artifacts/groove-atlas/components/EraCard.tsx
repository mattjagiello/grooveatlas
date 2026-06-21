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
          <Text style={[styles.name, { color: colors.foreground, fontFamily: Fonts.display }]}>
            {era.name}
          </Text>
          <Text style={[styles.years, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>{era.years}</Text>
        </View>
        <Text style={[styles.subtitle, { color: era.color, fontFamily: Fonts.labelRegular }]} numberOfLines={1}>
          {era.subtitle}
        </Text>
        <Text style={[styles.drummers, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
          {era.keyDrummerIds.length} drummers · {era.iconicSongIds.length} songs
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
    width: 5,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    fontSize: 34,
    lineHeight: 34,
  },
  years: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 12,
  },
  drummers: {
    fontSize: 11,
    marginTop: 2,
  },
});
