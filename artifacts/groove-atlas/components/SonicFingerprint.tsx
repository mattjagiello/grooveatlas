import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';
import type { DrummerVibe } from '@/lib/queries';

const ENERGY_LABELS: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High' };

interface Props {
  vibe: DrummerVibe;
  accentColor: string;
}

export default function SonicFingerprint({ vibe, accentColor }: Props) {
  const colors = useColors();
  const energyLabel = vibe.dominantEnergy
    ? (ENERGY_LABELS[vibe.dominantEnergy.toLowerCase()] ?? vibe.dominantEnergy)
    : null;

  const topMoods = (vibe.topMoods ?? []).slice(0, 3).join(' · ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>
          SONIC FINGERPRINT
        </Text>
        <Text style={[styles.source, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
          via Cyanite AI
        </Text>
      </View>

      <View style={styles.statsRow}>
        {vibe.avgBpm != null && (
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: accentColor, fontFamily: Fonts.display }]}>
              {vibe.avgBpm}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
              BPM avg
            </Text>
          </View>
        )}
        {energyLabel && (
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        )}
        {energyLabel && (
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.foreground, fontFamily: Fonts.display }]}>
              {energyLabel}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
              energy
            </Text>
          </View>
        )}
        {vibe.analysedCount > 0 && (
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        )}
        {vibe.analysedCount > 0 && (
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.foreground, fontFamily: Fonts.display }]}>
              {vibe.analysedCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
              tracks
            </Text>
          </View>
        )}
      </View>

      {topMoods.length > 0 && (
        <View style={[styles.moodRow, { borderLeftColor: accentColor }]}>
          <Text style={[styles.moodLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>
            MOOD
          </Text>
          <Text style={[styles.moodText, { color: colors.foreground, fontFamily: Fonts.labelRegular }]}>
            {topMoods}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 9, letterSpacing: 2 },
  source: { fontSize: 11 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 30,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    marginHorizontal: 4,
  },
  moodRow: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    gap: 3,
  },
  moodLabel: {
    fontSize: 9,
    letterSpacing: 2,
  },
  moodText: {
    fontSize: 15,
  },
});
