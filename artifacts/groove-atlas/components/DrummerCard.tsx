import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Drummer } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

type DrummerCardProps = {
  drummer: Drummer;
  onPress?: (drummer: Drummer) => void;
  compact?: boolean;
};

function Initials({ name, size, fontSize, bg }: { name: string; size: number; fontSize: number; bg: string }) {
  const letters = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: '#fff', fontSize, fontWeight: '700', letterSpacing: 0.5 }}>{letters}</Text>
    </View>
  );
}

function Avatar({ drummer, size, fontSize, bg }: { drummer: Drummer; size: number; fontSize: number; bg: string }) {
  if (drummer.photoUrl) {
    return (
      <Image
        source={{ uri: drummer.photoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    );
  }
  return <Initials name={drummer.name} size={size} fontSize={fontSize} bg={bg} />;
}

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
        <Avatar drummer={drummer} size={36} fontSize={12} bg={colors.primary} />
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
      <Avatar drummer={drummer} size={44} fontSize={16} bg={colors.primary} />
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
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
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
