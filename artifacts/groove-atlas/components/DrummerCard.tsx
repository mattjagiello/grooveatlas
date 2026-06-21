import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize, fontWeight: '700', letterSpacing: 0.5 }}>{letters}</Text>
    </View>
  );
}

function Avatar({ drummer, size, fontSize, bg }: { drummer: Drummer; size: number; fontSize: number; bg: string }) {
  const [errored, setErrored] = useState(false);
  if (drummer.photoUrl && !errored) {
    return (
      <Image
        source={{ uri: drummer.photoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
        onError={() => setErrored(true)}
      />
    );
  }
  return <Initials name={drummer.name} size={size} fontSize={fontSize} bg={bg} />;
}

export default function DrummerCard({ drummer, onPress, compact }: DrummerCardProps) {
  const colors = useColors();
  const { width: screenWidth } = useWindowDimensions();
  // Fluid card width: ~37% of screen, capped so large screens don't get too wide
  const cardWidth = Math.min(Math.round(screenWidth * 0.37), 158);

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
        hitSlop={{ top: 4, bottom: 4 }}
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
      style={[styles.card, { width: cardWidth, backgroundColor: colors.card, borderColor: colors.border }]}
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    minHeight: 44,
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
