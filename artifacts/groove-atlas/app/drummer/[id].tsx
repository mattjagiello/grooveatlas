import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDrummer, useDrummerVibe } from '@/hooks/useGql';
import SongCard from '@/components/SongCard';
import SongstatsCard from '@/components/SongstatsCard';
import { Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import type { DrummerVibe } from '@/lib/queries';

const MOOD_COLORS: Record<string, string> = {
  aggressive: '#DC2626', energetic: '#EA580C', happy: '#D97706',
  romantic: '#DB2777', sad: '#2563EB', relaxed: '#059669',
  dark: '#7C3AED', ethereal: '#0891B2', melancholic: '#6366F1',
  uplifting: '#16A34A', epic: '#9A3412', mysterious: '#6D28D9',
  cheerful: '#D97706', positive: '#16A34A', bright: '#CA8A04',
  powerful: '#9A3412', groovy: '#0D9488', cool: '#0284C7',
};

const ENERGY_ICONS: Record<string, string> = { low: '🌊', medium: '🔥', high: '⚡' };

function DrummerVibeCard({
  vibe,
  colors,
}: {
  vibe: DrummerVibe;
  colors: ReturnType<typeof useColors>;
}) {
  if (vibe.analysedCount === 0) return null;
  const topMoods = vibe.topMoods.slice(0, 5);
  const topGenres = vibe.topGenres.slice(0, 4);
  const topChar = vibe.topCharacter.slice(0, 4);
  const energyIcon = ENERGY_ICONS[vibe.dominantEnergy?.toLowerCase() ?? ''] ?? '🎵';

  return (
    <View style={[vibeStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={vibeStyles.header}>
        <Text style={vibeStyles.emoji}>🎚</Text>
        <View style={{ flex: 1 }}>
          <Text style={[vibeStyles.title, { color: colors.foreground }]}>Sonic Fingerprint</Text>
          <Text style={[vibeStyles.sub, { color: colors.mutedForeground }]}>
            {vibe.analysedCount} of {vibe.songCount} recordings analysed via Cyanite
          </Text>
        </View>
      </View>

      {topMoods.length > 0 && (
        <View style={vibeStyles.row}>
          {topMoods.map((m) => (
            <View key={m} style={[vibeStyles.moodChip, { backgroundColor: (MOOD_COLORS[m.toLowerCase()] ?? colors.primary) + '22', borderColor: (MOOD_COLORS[m.toLowerCase()] ?? colors.primary) + '66' }]}>
              <Text style={[vibeStyles.moodChipText, { color: MOOD_COLORS[m.toLowerCase()] ?? colors.primary }]}>{m}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={vibeStyles.statsRow}>
        {vibe.avgBpm !== null && (
          <View style={[vibeStyles.statBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <Text style={[vibeStyles.statVal, { color: colors.primary }]}>{vibe.avgBpm}</Text>
            <Text style={[vibeStyles.statLabel, { color: colors.mutedForeground }]}>AVG BPM</Text>
          </View>
        )}
        {vibe.dominantEnergy && (
          <View style={[vibeStyles.statBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text style={vibeStyles.statEmoji}>{energyIcon}</Text>
            <Text style={[vibeStyles.statLabel, { color: colors.mutedForeground }]}>{vibe.dominantEnergy} energy</Text>
          </View>
        )}
      </View>

      {topGenres.length > 0 && (
        <View style={vibeStyles.row}>
          {topGenres.map((g) => (
            <View key={g} style={[vibeStyles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[vibeStyles.tagText, { color: colors.foreground }]}>{g}</Text>
            </View>
          ))}
        </View>
      )}

      {topChar.length > 0 && (
        <View style={vibeStyles.row}>
          {topChar.map((c) => (
            <View key={c} style={[vibeStyles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[vibeStyles.tagText, { color: colors.mutedForeground }]}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      {vibe.freeGenreText ? (
        <Text style={[vibeStyles.freeGenre, { color: colors.mutedForeground }]}>
          {vibe.freeGenreText}
        </Text>
      ) : null}

      {vibe.transformerCaptions.length > 0 && (
        <Text style={[vibeStyles.caption, { color: colors.mutedForeground, borderColor: colors.border }]}>
          "{vibe.transformerCaptions[0]}"
        </Text>
      )}
    </View>
  );
}

const BPM_MIN_SCALE = 40;
const BPM_MAX_SCALE = 320;
const BPM_ZONES = [
  { label: 'Ballad', min: 40, max: 80, hint: '40–80' },
  { label: 'Groove', min: 80, max: 120, hint: '80–120' },
  { label: 'Funk', min: 120, max: 160, hint: '120–160' },
  { label: 'Drive', min: 160, max: 220, hint: '160–220' },
  { label: 'Blast', min: 220, max: 320, hint: '220+' },
];

function bpmPct(bpm: number) {
  return ((bpm - BPM_MIN_SCALE) / (BPM_MAX_SCALE - BPM_MIN_SCALE)) * 100;
}

function zoneOverlap(zMin: number, zMax: number, dMin: number, dMax: number) {
  return dMin < zMax && dMax > zMin;
}

interface BpmSparklineProps {
  bpmMin: number;
  bpmMax: number;
  primaryColor: string;
  trackColor: string;
  textColor: string;
  mutedColor: string;
}

function BpmSparkline({ bpmMin, bpmMax, primaryColor, trackColor, mutedColor }: BpmSparklineProps) {
  const fillLeft = `${bpmPct(bpmMin)}%` as const;
  const fillWidth = `${Math.max(bpmPct(bpmMax) - bpmPct(bpmMin), 2)}%` as const;

  return (
    <View style={spark.wrapper}>
      <View style={spark.zonesRow}>
        {BPM_ZONES.map((zone) => {
          const active = zoneOverlap(zone.min, zone.max, bpmMin, bpmMax);
          return (
            <View key={zone.label} style={spark.zoneCell}>
              <Text style={[spark.zoneLabel, { color: active ? primaryColor : mutedColor, fontWeight: active ? '700' : '400' }]}>
                {zone.label}
              </Text>
              <Text style={[spark.zoneRange, { color: mutedColor }]}>{zone.hint}</Text>
            </View>
          );
        })}
      </View>
      <View style={[spark.track, { backgroundColor: trackColor }]}>
        <View style={[spark.fill, { backgroundColor: primaryColor, left: fillLeft, width: fillWidth }]} />
        {BPM_ZONES.map((zone, idx) => (
          idx < BPM_ZONES.length - 1 && (
            <View
              key={zone.label}
              style={[
                spark.divider,
                { left: `${bpmPct(zone.max)}%` as any, backgroundColor: trackColor === '#E8D5B0' ? '#C4A060' : '#444' },
              ]}
            />
          )
        ))}
      </View>
      <View style={spark.bpmRow}>
        <Text style={[spark.bpmVal, { color: primaryColor }]}>{bpmMin}</Text>
        <Text style={[spark.bpmSep, { color: mutedColor }]}>—</Text>
        <Text style={[spark.bpmVal, { color: primaryColor }]}>{bpmMax}</Text>
        <Text style={[spark.bpmUnit, { color: mutedColor }]}>BPM</Text>
      </View>
    </View>
  );
}

export default function DrummerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const { data: drummer, isLoading } = useDrummer(id ?? '');
  const { data: vibe } = useDrummerVibe(id ?? '');

  if (isLoading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  if (!drummer) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnAlone}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ color: colors.foreground, padding: 20 }}>Drummer not found</Text>
      </View>
    );
  }

  const songs = (drummer.iconicSongs ?? []) as Song[];
  const yearsActive = drummer.died ? `${drummer.born}–${drummer.died}` : `${drummer.born}–present`;
  const genreLabels = drummer.genres.join(', ');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 },
        ]}
      >
        <View
          style={[
            styles.hero,
            { paddingTop: insets.top + webTopPad + 16, borderBottomColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-button">
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.heroRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={[styles.name, { color: colors.foreground, fontFamily: 'serif' }]} numberOfLines={2}>
                {drummer.name}
              </Text>
              <Text style={[styles.years, { color: colors.mutedForeground }]}>{yearsActive}</Text>
              <TouchableOpacity onPress={() => router.push(`/era/${drummer.primaryEra}`)}>
                <View style={[styles.eraTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                  <Text style={[styles.eraTagText, { color: colors.primary }]}>{drummer.primaryEra}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.bands, { color: colors.mutedForeground }]}>{drummer.bands.join(' · ')}</Text>
          {genreLabels.length > 0 && (
            <Text style={[styles.genres, { color: colors.primary }]}>{genreLabels}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>Biography</Text>
          <Text style={[styles.bio, { color: colors.foreground }]}>{drummer.bio}</Text>
        </View>

        <View style={[styles.styleBox, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: colors.primary }]}>
          <Text style={[styles.styleLabel, { color: colors.mutedForeground }]}>SIGNATURE STYLE</Text>
          <Text style={[styles.styleText, { color: colors.foreground }]}>{drummer.signatureStyle}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>Tempo & Style</Text>
          <View style={[styles.sparkCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <BpmSparkline
              bpmMin={drummer.bpmMin}
              bpmMax={drummer.bpmMax}
              primaryColor={colors.primary}
              trackColor={colors.muted}
              textColor={colors.foreground}
              mutedColor={colors.mutedForeground}
            />
          </View>
        </View>

        {vibe && (
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>Sonic Fingerprint</Text>
            <DrummerVibeCard vibe={vibe} colors={colors} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>Legacy & Influence</Text>
          <Text style={[styles.influence, { color: colors.foreground }]}>{drummer.influence}</Text>
        </View>

        <View style={styles.section}>
          <SongstatsCard drummerId={drummer.id} />
        </View>

        {songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>Essential Recordings</Text>
            {songs.map((s: Song) => (
              <SongCard key={s.id} song={s} onPress={(song: Song) => router.push(`/song/${song.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const vibeStyles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  emoji: { fontSize: 26 },
  title: { fontSize: 15, fontWeight: '700' },
  sub: { fontSize: 11, marginTop: 2 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moodChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  moodChipText: { fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, borderWidth: 1, gap: 2 },
  statVal: { fontSize: 26, fontWeight: '700', lineHeight: 30 },
  statEmoji: { fontSize: 22 },
  statLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: '600' },
  freeGenre: { fontSize: 11, fontStyle: 'italic' },
  caption: { fontSize: 12, fontStyle: 'italic', lineHeight: 18, borderLeftWidth: 3, paddingLeft: 10 },
});

const spark = StyleSheet.create({
  wrapper: { gap: 8 },
  zonesRow: { flexDirection: 'row' },
  zoneCell: { flex: 1, alignItems: 'center', gap: 2 },
  zoneLabel: { fontSize: 10, textAlign: 'center' },
  zoneRange: { fontSize: 9, textAlign: 'center' },
  track: { height: 10, borderRadius: 5, position: 'relative', overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 5 },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  bpmRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, justifyContent: 'center', marginTop: 4 },
  bpmVal: { fontSize: 28, fontWeight: '700', fontFamily: 'serif' },
  bpmSep: { fontSize: 18 },
  bpmUnit: { fontSize: 13, marginLeft: 2 },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {},
  loader: { marginTop: 100 },
  backBtnAlone: { margin: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hero: { paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, gap: 6 },
  backBtn: { marginBottom: 12, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  heroInfo: { flex: 1, gap: 4 },
  name: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  years: { fontSize: 13 },
  eraTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1, marginTop: 2 },
  eraTagText: { fontSize: 11, fontWeight: '700' },
  bands: { fontSize: 13, marginTop: 4 },
  genres: { fontSize: 12, fontWeight: '600' },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  bio: { fontSize: 15, lineHeight: 23 },
  styleBox: { marginHorizontal: 20, marginTop: 20, padding: 16, borderRadius: 10, borderWidth: 1, borderLeftWidth: 4, gap: 6 },
  styleLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  styleText: { fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  sparkCard: { padding: 16, borderRadius: 10, borderWidth: 1 },
  influence: { fontSize: 15, lineHeight: 22 },
});
