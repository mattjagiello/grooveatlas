import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Drummer } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

type DrummerCardProps = {
  drummer: Drummer;
  onPress?: (drummer: Drummer) => void;
  compact?: boolean;
};

export default function DrummerCard({ drummer, onPress, compact }: DrummerCardProps) {
  const colors = useColors();

  const handlePress = () => {
    Haptics.selectionAsync();
    onPress?.(drummer);
  };

  const yearsActive = drummer.died
    ? `${drummer.born}–${drummer.died}`
    : `b. ${drummer.born}`;

  if (compact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.compact, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.75}
      >
        <View style={[styles.compactAvatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.compactInitial}>
            {drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </Text>
        </View>
        <View style={styles.compactInfo}>
          <Text
            style={[styles.compactName, { color: colors.foreground, fontFamily: 'serif' }]}
            numberOfLines={1}
          >
            {drummer.name}
          </Text>
          <Text style={[styles.compactMeta, { color: colors.mutedForeground }]} numberOfLines={1}>
            {drummer.primaryEra} · {drummer.bands[0]?.replace('session musician –', 'Session')}
          </Text>
        </View>
        <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.75}
    >
      <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.initial}>
          {drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </Text>
      </View>
      <Text
        style={[styles.name, { color: colors.foreground, fontFamily: 'serif' }]}
        numberOfLines={1}
      >
        {drummer.name}
      </Text>
      <Text style={[styles.band, { color: colors.mutedForeground }]} numberOfLines={1}>
        {drummer.bands[0]}
      </Text>
      <View style={styles.tags}>
        <View style={[styles.tag, { backgroundColor: colors.muted }]}>
          <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
            {drummer.primaryEra}
          </Text>
        </View>
      </View>
      <Text style={[styles.bpm, { color: colors.primary }]}>
        {drummer.bpmMin}–{drummer.bpmMax} BPM
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    gap: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  initial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  band: {
    fontSize: 11,
    lineHeight: 14,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  bpm: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  compactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  compactInitial: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactMeta: {
    fontSize: 12,
    marginTop: 2,
  },
});
