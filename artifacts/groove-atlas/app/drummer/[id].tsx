import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  Image,
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
import { Skeleton } from '@/components/Skeleton';
import { Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';
import type { DrummerVibe } from '@/lib/queries';

const HERO_HEIGHT = 260;

// ─── Colour maps ──────────────────────────────────────────────────────────────

const MOOD_COLORS: Record<string, string> = {
  aggressive: '#DC2626', energetic: '#EA580C', happy: '#D97706',
  romantic: '#DB2777', sad: '#2563EB', relaxed: '#059669',
  dark: '#7C3AED', ethereal: '#0891B2', melancholic: '#6366F1',
  uplifting: '#16A34A', epic: '#9A3412', mysterious: '#6D28D9',
  cheerful: '#D97706', positive: '#16A34A', bright: '#CA8A04',
  powerful: '#9A3412', groovy: '#0D9488', cool: '#0284C7',
};

const ENERGY_LABELS: Record<string, string> = { low: 'LOW', medium: 'MED', high: 'HIGH' };

// ─── BPM zone sparkline ───────────────────────────────────────────────────────

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
  return Math.min(100, Math.max(0, ((bpm - BPM_MIN_SCALE) / (BPM_MAX_SCALE - BPM_MIN_SCALE)) * 100));
}

function zoneOverlap(zMin: number, zMax: number, dMin: number, dMax: number) {
  return dMin < zMax && dMax > zMin;
}

interface BpmZoneBarProps {
  bpmMin: number;
  bpmMax: number;
  avgBpm: number | null;
  primaryColor: string;
  trackColor: string;
  mutedColor: string;
  dividerColor: string;
}

function BpmZoneBar({ bpmMin, bpmMax, avgBpm, primaryColor, trackColor, mutedColor, dividerColor }: BpmZoneBarProps) {
  const fillLeft = `${bpmPct(bpmMin)}%` as const;
  const fillWidth = `${Math.max(bpmPct(bpmMax) - bpmPct(bpmMin), 2)}%` as const;
  const avgLeft = avgBpm !== null ? `${bpmPct(avgBpm)}%` : null;

  return (
    <View style={spark.wrapper}>
      {/* Zone labels */}
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

      {/* Zone bar with range fill + avg marker */}
      <View style={[spark.track, { backgroundColor: trackColor }]}>
        <View style={[spark.fill, { backgroundColor: primaryColor + '50', left: fillLeft, width: fillWidth }]} />
        {BPM_ZONES.map((zone, idx) => (
          idx < BPM_ZONES.length - 1 && (
            <View key={zone.label} style={[spark.divider, { left: `${bpmPct(zone.max)}%` as any, backgroundColor: dividerColor }]} />
          )
        ))}
        {/* Avg BPM pin */}
        {avgLeft && (
          <View style={[spark.avgPin, { left: avgLeft as any, backgroundColor: primaryColor }]} />
        )}
      </View>

      {/* Legend */}
      <View style={spark.legend}>
        <View style={spark.legendItem}>
          <View style={[spark.legendDot, { backgroundColor: primaryColor + '50', borderWidth: 1, borderColor: primaryColor + '80' }]} />
          <Text style={[spark.legendText, { color: mutedColor }]}>repertoire span {bpmMin}–{bpmMax}</Text>
        </View>
        {avgLeft && (
          <View style={spark.legendItem}>
            <View style={[spark.avgDot, { backgroundColor: primaryColor }]} />
            <Text style={[spark.legendText, { color: mutedColor }]}>avg {avgBpm} BPM</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Unified Rhythm Profile ───────────────────────────────────────────────────

function RhythmProfile({
  bpmMin, bpmMax, vibe, colors,
}: {
  bpmMin: number;
  bpmMax: number;
  vibe: DrummerVibe | null | undefined;
  colors: ReturnType<typeof useColors>;
}) {
  const hasVibe = vibe && vibe.analysedCount > 0;
  const avgBpm = hasVibe ? (vibe.avgBpm ?? null) : null;
  const energyLabel = hasVibe && vibe.dominantEnergy
    ? (ENERGY_LABELS[vibe.dominantEnergy.toLowerCase()] ?? vibe.dominantEnergy.toUpperCase())
    : null;
  const topMoods = hasVibe ? vibe.topMoods.slice(0, 5) : [];
  const tags = hasVibe ? [...vibe.topGenres.slice(0, 4), ...vibe.topCharacter.slice(0, 3)] : [];
  const dividerColor = colors.muted === '#E8D5B0' ? '#C4A060' : '#444';

  return (
    <View style={[rp.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[rp.heading, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>RHYTHM PROFILE</Text>

      {/* Stat row — only render when we have meaningful values */}
      {(avgBpm !== null || hasVibe) && (
        <View style={rp.statsRow}>
          {avgBpm !== null && (
            <View style={[rp.statBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
              <Text style={[rp.statVal, { color: colors.primary, fontFamily: Fonts.display }]}>{avgBpm}</Text>
              <Text style={[rp.statLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>AVG BPM</Text>
            </View>
          )}
          {hasVibe && energyLabel && vibe.dominantEnergy && (
            <View style={[rp.statBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[rp.statVal, { color: colors.foreground, fontFamily: Fonts.display, fontSize: 22 }]}>{energyLabel}</Text>
              <Text style={[rp.statLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>ENERGY</Text>
            </View>
          )}
          {hasVibe && (
            <View style={[rp.statBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[rp.statVal, { color: colors.foreground, fontFamily: Fonts.display, fontSize: 22 }]}>{vibe.analysedCount}</Text>
              <Text style={[rp.statLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>TRACKS</Text>
            </View>
          )}
        </View>
      )}

      {/* Zone bar */}
      <BpmZoneBar
        bpmMin={bpmMin}
        bpmMax={bpmMax}
        avgBpm={avgBpm}
        primaryColor={colors.primary}
        trackColor={colors.muted}
        mutedColor={colors.mutedForeground}
        dividerColor={dividerColor}
      />

      {/* Moods */}
      {topMoods.length > 0 && (
        <View style={rp.chipRow}>
          {topMoods.map((m) => {
            const c = MOOD_COLORS[m.toLowerCase()] ?? colors.primary;
            return (
              <View key={m} style={[rp.moodChip, { backgroundColor: c + '22', borderColor: c + '66' }]}>
                <Text style={[rp.moodText, { color: c, fontFamily: Fonts.label }]}>{m}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Genre + character tags */}
      {tags.length > 0 && (
        <View style={rp.chipRow}>
          {tags.map((t) => (
            <View key={t} style={[rp.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[rp.tagText, { color: colors.foreground, fontFamily: Fonts.labelRegular }]}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {/* AI caption */}
      {hasVibe && vibe.transformerCaptions.length > 0 && (
        <Text style={[rp.caption, { color: colors.mutedForeground, borderColor: colors.border }]}>
          "{vibe.transformerCaptions[0]}"
        </Text>
      )}

      {/* Source */}
      {hasVibe && (
        <Text style={[rp.source, { color: colors.mutedForeground }]}>
          Via Cyanite AI · {vibe.analysedCount} of {vibe.songCount} recordings
        </Text>
      )}
    </View>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DrummerDetailSkeleton({ colors }: { colors: ReturnType<typeof useColors> }) {
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Skeleton width="100%" height={HERO_HEIGHT + insets.top + webTopPad} borderRadius={0} />
      <View style={{ padding: 20, gap: 12, marginTop: 16 }}>
        <Skeleton width="60%" height={22} />
        <Skeleton width="40%" height={14} />
        <Skeleton width="100%" height={80} style={{ marginTop: 8 }} />
        <Skeleton width="100%" height={100} />
        <Skeleton width="100%" height={60} />
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function DrummerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const { data: drummer, isLoading } = useDrummer(id ?? '');
  const { data: vibe } = useDrummerVibe(id ?? '');

  const goBack = () => router.canGoBack() ? router.back() : router.replace('/(tabs)' as never);

  if (isLoading && !drummer) {
    return <DrummerDetailSkeleton colors={colors} />;
  }

  if (!drummer) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goBack} style={[styles.heroBackBtn, { top: insets.top + webTopPad + 12 }]}>
          <View style={styles.heroBackBtnInner}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </View>
        </TouchableOpacity>
        <Text style={{ color: colors.foreground, padding: 20 }}>Drummer not found</Text>
      </View>
    );
  }

  const songs = (drummer.iconicSongs ?? []) as Song[];
  const yearsActive = drummer.died ? `${drummer.born}–${drummer.died}` : `${drummer.born}–present`;
  const genreLabels = drummer.genres.join(', ');
  const initials = drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 },
        ]}
      >
        {/* ── Cinematic hero ── */}
        <View style={{ height: HERO_HEIGHT }}>
          {drummer.photoUrl ? (
            <Image source={{ uri: drummer.photoUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          ) : (
            <>
              <LinearGradient
                colors={[colors.primary + '80', colors.background] as const}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={[styles.heroInitials, { color: colors.primary }]}>{initials}</Text>
              </View>
            </>
          )}
          {drummer.photoUrl && (
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.28)' }]} />
          )}
          <LinearGradient
            colors={['transparent', colors.background] as const}
            style={styles.heroGradient}
          />
          <TouchableOpacity
            onPress={goBack}
            testID="back-button"
            style={[styles.heroBackBtn, { top: insets.top + webTopPad + 12 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={styles.heroBackBtnInner}>
              <Feather name="arrow-left" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.heroNameArea}>
            <Text style={[styles.name, { fontFamily: Fonts.display }]} numberOfLines={2}>{drummer.name}</Text>
            <Text style={[styles.heroYears, { fontFamily: Fonts.labelRegular }]}>{yearsActive}</Text>
          </View>
        </View>

        {/* ── Meta strip ── */}
        <View style={[styles.heroMeta, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.heroMetaRow}>
            <TouchableOpacity onPress={() => router.push(`/era/${drummer.primaryEra}`)}>
              <View style={[styles.eraTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                <Text style={[styles.eraTagText, { color: colors.primary, fontFamily: Fonts.label }]}>{drummer.primaryEra}</Text>
              </View>
            </TouchableOpacity>
            {genreLabels.length > 0 && (
              <Text style={[styles.genres, { color: colors.mutedForeground }]}>{genreLabels}</Text>
            )}
          </View>
          <Text style={[styles.bands, { color: colors.mutedForeground }]}>
            <Text style={{ fontWeight: '700', color: colors.foreground }}>with </Text>
            {drummer.bands.join(' · ')}
          </Text>
        </View>

        {/* ── Biography ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Biography</Text>
          <Text style={[styles.bio, { color: colors.foreground }]}>{drummer.bio}</Text>
        </View>

        {/* ── Signature style ── */}
        <View style={[styles.styleBox, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: colors.primary }]}>
          <Text style={[styles.styleLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>SIGNATURE STYLE</Text>
          <Text style={[styles.styleText, { color: colors.foreground, fontFamily: Fonts.serifItalic }]}>{drummer.signatureStyle}</Text>
        </View>

        {/* ── Rhythm Profile (replaces Tempo & Style + Sonic Fingerprint) ── */}
        <View style={styles.section}>
          <RhythmProfile
            bpmMin={drummer.bpmMin}
            bpmMax={drummer.bpmMax}
            vibe={vibe}
            colors={colors}
          />
        </View>

        {/* ── Legacy & Influence ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Legacy & Influence</Text>
          <Text style={[styles.influence, { color: colors.foreground }]}>{drummer.influence}</Text>
        </View>

        {/* ── Streaming stats ── */}
        <View style={styles.section}>
          <SongstatsCard drummerId={drummer.id} />
        </View>

        {/* ── Essential recordings ── */}
        {songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Essential Recordings</Text>
            {songs.map((s: Song) => (
              <SongCard key={s.id} song={s} onPress={(song: Song) => router.push(`/song/${song.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const spark = StyleSheet.create({
  wrapper: { gap: 6 },
  zonesRow: { flexDirection: 'row' },
  zoneCell: { flex: 1, alignItems: 'center', gap: 2 },
  zoneLabel: { fontSize: 10, textAlign: 'center' },
  zoneRange: { fontSize: 9, textAlign: 'center' },
  track: { height: 10, borderRadius: 5, position: 'relative', overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 5 },
  avgPin: { position: 'absolute', top: 0, bottom: 0, width: 3, borderRadius: 1.5 },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  legend: { flexDirection: 'row', gap: 14, marginTop: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  avgDot: { width: 3, height: 10, borderRadius: 1.5 },
  legendText: { fontSize: 10 },
});

const rp = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 12 },
  heading: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, borderWidth: 1, gap: 2 },
  statVal: { fontSize: 24, fontWeight: '700', lineHeight: 28 },
  statEmoji: { fontSize: 20 },
  statLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 0.8, textAlign: 'center' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moodChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  moodText: { fontSize: 12, fontWeight: '600' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: '600' },
  caption: { fontSize: 12, fontStyle: 'italic', lineHeight: 18, borderLeftWidth: 3, paddingLeft: 10 },
  source: { fontSize: 10, fontStyle: 'italic' },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {},
  heroGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 110 },
  heroBackBtn: { position: 'absolute', left: 16 },
  heroBackBtnInner: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroInitials: { fontSize: 80, fontWeight: '800', opacity: 0.25, fontFamily: 'serif' },
  heroNameArea: { position: 'absolute', bottom: 14, left: 20, right: 20 },
  name: { fontSize: 44, lineHeight: 46, color: '#fff', letterSpacing: 1 },
  heroYears: { fontSize: 13, color: 'rgba(255,255,255,0.80)', marginTop: 2 },
  heroMeta: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 6 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  eraTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1 },
  eraTagText: { fontSize: 11, fontWeight: '700' },
  genres: { fontSize: 12, fontWeight: '500' },
  bands: { fontSize: 13 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  bio: { fontSize: 15, lineHeight: 23 },
  styleBox: { marginHorizontal: 20, marginTop: 20, padding: 16, borderRadius: 10, borderWidth: 1, borderLeftWidth: 4, gap: 6 },
  styleLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  styleText: { fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  influence: { fontSize: 15, lineHeight: 22 },
});
