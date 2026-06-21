import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

type SongCardProps = {
  song: Song;
  onPress?: (song: Song) => void;
  showDrummer?: boolean;
  drummerName?: string;
};

const COMPLEXITY_LABELS = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];

export default function SongCard({ song, onPress, drummerName }: SongCardProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.(song);
  };

  const dots = Array.from({ length: 5 }, (_, i) => i < song.complexity);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.75}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.foreground, fontFamily: Fonts.serif }]}
            numberOfLines={1}
          >
            {song.title}
          </Text>
          <Text style={[styles.artist, { color: colors.mutedForeground }]} numberOfLines={1}>
            {song.artist} · {song.year}
          </Text>
          {drummerName && (
            <Text style={[styles.drummer, { color: colors.primary, fontFamily: Fonts.labelRegular }]} numberOfLines={1}>
              {drummerName}
            </Text>
          )}
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>

      <View style={styles.meta}>
        <View style={[styles.tempo, { backgroundColor: colors.muted }]}>
          <Text style={[styles.tempoText, { color: colors.primary, fontFamily: Fonts.label }]}>
            {song.tempo} BPM
          </Text>
        </View>
        <View style={styles.complexity}>
          {dots.map((filled, i) => (
            <View
              key={i}
              style={[
                styles.complexityDot,
                { backgroundColor: filled ? colors.primary : colors.border },
              ]}
            />
          ))}
          <Text style={[styles.complexityLabel, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
            {COMPLEXITY_LABELS[song.complexity - 1]}
          </Text>
        </View>
      </View>

      <Text style={[styles.feel, { color: colors.mutedForeground, fontFamily: Fonts.serifItalic }]} numberOfLines={1}>
        {song.feel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  artist: {
    fontSize: 12,
  },
  drummer: {
    fontSize: 11,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tempo: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tempoText: {
    fontSize: 11,
  },
  complexity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  complexityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  complexityLabel: {
    fontSize: 10,
    marginLeft: 2,
  },
  feel: {
    fontSize: 12,
  },
});
