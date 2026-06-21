import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

interface TrackRowProps {
  song: Song;
  onPress?: (song: Song) => void;
  drummerName?: string;
}

export default function TrackRow({ song, onPress, drummerName }: TrackRowProps) {
  const colors = useColors();
  const dots = Array.from({ length: 5 }, (_, i) => i < song.complexity);

  const handlePress = () => {
    Haptics.selectionAsync();
    if (onPress) {
      onPress(song);
    } else {
      router.push(`/song/${song.id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.row, { borderBottomColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: Fonts.serif }]} numberOfLines={1}>
          {song.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            {song.artist} · {song.year}
          </Text>
          {drummerName && (
            <Text style={[styles.drummer, { color: colors.primary, fontFamily: Fonts.labelRegular }]} numberOfLines={1}>
              · {drummerName}
            </Text>
          )}
        </View>
        <View style={styles.dots}>
          {dots.map((filled, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: filled ? colors.primary : colors.border }]} />
          ))}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.bpm, { color: colors.primary, fontFamily: Fonts.label }]}>{song.tempo}</Text>
        <Text style={[styles.bpmUnit, { color: colors.mutedForeground }]}>BPM</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 13,
    gap: 12, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: { flex: 1, gap: 4 },
  title: { fontSize: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  sub: { fontSize: 12 },
  drummer: { fontSize: 12 },
  dots: { flexDirection: 'row', gap: 3, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  right: { alignItems: 'flex-end' },
  bpm: { fontSize: 18, lineHeight: 20 },
  bpmUnit: { fontSize: 9 },
});
