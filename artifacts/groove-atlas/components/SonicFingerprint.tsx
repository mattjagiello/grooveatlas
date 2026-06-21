import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';
import type { DrummerVibe } from '@/lib/queries';

const MOOD_COLORS: Record<string, string> = {
  aggressive: '#DC2626', energetic: '#EA580C', happy: '#D97706',
  romantic: '#DB2777', sad: '#2563EB', relaxed: '#059669',
  dark: '#7C3AED', ethereal: '#0891B2', melancholic: '#6366F1',
  uplifting: '#16A34A', epic: '#9A3412', mysterious: '#6D28D9',
  cheerful: '#D97706', positive: '#16A34A', bright: '#CA8A04',
  powerful: '#9A3412', groovy: '#0D9488', cool: '#0284C7',
};

const ENERGY_LABELS: Record<string, string> = { low: 'LOW', medium: 'MEDIUM', high: 'HIGH' };

interface Props {
  vibe: DrummerVibe;
  accentColor: string;
}

export default function SonicFingerprint({ vibe, accentColor }: Props) {
  const colors = useColors();
  const energyLabel = vibe.dominantEnergy
    ? (ENERGY_LABELS[vibe.dominantEnergy.toLowerCase()] ?? vibe.dominantEnergy.toUpperCase())
    : null;

  const caption = vibe.transformerCaptions?.[0] ?? null;
  const allTags = [...(vibe.topCharacter ?? [])].slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>
          SONIC FINGERPRINT
        </Text>
        <View style={[styles.aiBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '40' }]}>
          <Text style={[styles.aiBadgeText, { color: accentColor, fontFamily: Fonts.label }]}>CYANITE AI</Text>
        </View>
      </View>

      {/* Stat line */}
      <View style={styles.statLine}>
        {vibe.avgBpm != null && (
          <>
            <Text style={[styles.statNum, { color: accentColor, fontFamily: Fonts.display }]}>
              {vibe.avgBpm}
            </Text>
            <Text style={[styles.statUnit, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
              BPM avg
            </Text>
            <Text style={[styles.dot, { color: colors.border }]}>·</Text>
          </>
        )}
        {energyLabel && (
          <>
            <Text style={[styles.statNum, { color: colors.foreground, fontFamily: Fonts.display }]}>
              {energyLabel}
            </Text>
            <Text style={[styles.statUnit, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
              energy
            </Text>
            <Text style={[styles.dot, { color: colors.border }]}>·</Text>
          </>
        )}
        <Text style={[styles.statUnit, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
          {vibe.analysedCount} tracks analysed
        </Text>
      </View>

      {/* Mood chips */}
      {vibe.topMoods.length > 0 && (
        <View style={styles.chipRow}>
          {vibe.topMoods.map((m) => {
            const c = MOOD_COLORS[m.toLowerCase()] ?? accentColor;
            return (
              <View key={m} style={[styles.chip, { backgroundColor: c + '18', borderColor: c + '55' }]}>
                <Text style={[styles.chipText, { color: c, fontFamily: Fonts.label }]}>{m}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Character / movement tags */}
      {allTags.length > 0 && (
        <View style={styles.chipRow}>
          {allTags.map((t) => (
            <View key={t} style={[styles.chip, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[styles.chipText, { color: colors.foreground, fontFamily: Fonts.labelRegular }]}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* AI caption pull-quote */}
      {caption && (
        <View style={[styles.quote, { borderLeftColor: accentColor }]}>
          <Text style={[styles.quoteText, { color: colors.mutedForeground, fontFamily: Fonts.serifItalic }]}>
            "{caption}"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 9, letterSpacing: 2 },
  aiBadge: {
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: 4, borderWidth: 1,
  },
  aiBadgeText: { fontSize: 9, letterSpacing: 1 },
  statLine: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 },
  statNum: { fontSize: 26, lineHeight: 28 },
  statUnit: { fontSize: 12, marginRight: 2 },
  dot: { fontSize: 16, marginHorizontal: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 14, borderWidth: 1 },
  chipText: { fontSize: 11 },
  quote: { borderLeftWidth: 3, paddingLeft: 12, marginTop: 2 },
  quoteText: { fontSize: 13, lineHeight: 20 },
});
