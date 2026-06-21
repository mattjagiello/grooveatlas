import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Genre } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

type GenreCardProps = {
  genre: Genre;
  onPress?: (genre: Genre) => void;
};

export default function GenreCard({ genre, onPress }: GenreCardProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.(genre);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.75}
    >
      <View style={[styles.colorBar, { backgroundColor: genre.color }]} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.foreground, fontFamily: Fonts.display }]}>
          {genre.name}
        </Text>
        <Text style={[styles.origin, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]} numberOfLines={1}>
          {genre.origin}
        </Text>
        <Text style={[styles.drummers, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
          {genre.keyDrummerIds.length} drummers
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 95,
  },
  colorBar: {
    height: 6,
  },
  content: {
    padding: 12,
    gap: 3,
  },
  name: {
    fontSize: 22,
    lineHeight: 22,
  },
  origin: {
    fontSize: 11,
    marginTop: 2,
  },
  drummers: {
    fontSize: 10,
    marginTop: 1,
  },
});
