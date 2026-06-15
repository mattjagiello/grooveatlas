import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Genre } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

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
        <Text style={[styles.name, { color: colors.foreground, fontFamily: 'serif' }]}>
          {genre.name}
        </Text>
        <Text style={[styles.origin, { color: colors.mutedForeground }]} numberOfLines={1}>
          {genre.origin}
        </Text>
        <Text style={[styles.era, { color: genre.color }]}>{genre.era}</Text>
        <Text style={[styles.drummers, { color: colors.mutedForeground }]}>
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
    minHeight: 100,
  },
  colorBar: {
    height: 4,
  },
  content: {
    padding: 12,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  origin: {
    fontSize: 11,
    marginTop: 2,
  },
  era: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  drummers: {
    fontSize: 10,
    marginTop: 2,
  },
});
