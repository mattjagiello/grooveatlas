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

const ENERGY_LABELS: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High' };

// ─── BPM zone bar ─────────────────────────────────────────────────────────────

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

function BpmZoneBar({
  bpmMin, bpmMax, avgBpm, primaryColor, trackColor, mutedColor, dividerColor,
}: {
  bpmMin: number; bpmMax: number; avgBpm: number | null;
  primaryColor: string; trackColor: string; mutedColor: string; dividerColor: string;
}) {
  const fillLeft = `${bpmPct(bpmMin)}%` as const;
  const fillWidth = `${Math.max(bpmPct(bpmMax) - bpmPct(bpmMin), 2)}%` as const;
  const avgLeft = avgBpm !== null ? `${bpmPct(avgBpm)}%` : null;

  return (
    <View style={bar.wrapper}>
      <View style={bar.zonesRow}>
        {BPM_ZONES.map((zone) => {
          const active = zoneOverlap(zone.min, zone.max, bpmMin, bpmMax);
          return (
            <View key={zone.label} style={bar.zoneCell}>
              <Text style={[bar.zoneLabel, { color: active ? primaryColor : mutedColor, fontFamily: active ? Fonts.label : Fonts.labelRegular }]}>
                {zone.label}
              </Text>
              <Text style={[bar.zoneRange, { color: mutedColor }]}>{zone.hint}</Text>
            </View>
          );
        })}
      </View>
      <View style={[bar.track, { backgroundColor: trackColor }]}>
        <View style={[bar.fill, { backgroundColor: primaryColor + '50', left: fillLeft, width: fillWidth }]} />
        {BPM_ZONES.map((zone, idx) => (
          idx < BPM_ZONES.length - 1 && (
            <View key={zone.label} style={[bar.divider, { left: `${bpmPct(zone.max)}%` as any, backgroundColor: dividerColor }]} />
          )
        ))}
        {avgLeft && (
          <View style={[bar.avgPin, { left: avgLeft as any, backgroundColor: primaryColor }]} />
        )}
      </View>
      <View style={bar.legend}>
        <View style={bar.legendItem}>
          <View style={[bar.legendSwatch, { backgroundColor: primaryColor + '50', borderWidth: 1, borderColor: primaryColor + '80' }]} />
          <Text style={[bar.legendText, { color: mutedColor }]}>span {bpmMin}–{bpmMax}</Text>
        </View>
        {avgLeft && (
          <View style={bar.legendItem}>
            <View style={[bar.avgSwatch, { backgroundColor: primaryColor }]} />
            <Text style={[bar.legendText, { color: mutedColor }]}>avg {avgBpm} BPM</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Section divider ─────────────────────────────────────────────────────────

function Divider({ color }: { color: string }) {
  return <View style={[div.line, { backgroundColor: color }]} />;
}

// ─── Track row (used instead of SongCard) ────────────────────────────────────

const COMPLEXITY_LABELS = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];

function TrackRow({ song, onPress, colors }: { song: Song; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  const dots = Array.from({ length: 5 }, (_, i) => i < song.complexity);
  return (
    <TouchableOpacity onPress={onPress} style={track.row} activeOpacity={0.7}>
      <View style={track.left}>
        <Text style={[track.title, { color: colors.foreground, fontFamily: Fonts.serif }]} numberOfLines={1}>
          {song.title}
        </Text>
        <View style={track.meta}>
          <Text style={[track.artist, { color: colors.mutedForeground }]}>{song.artist} · {song.year}</Text>
          <View style={track.dots}>
            {dots.map((filled, i) => (
              <View key={i} style={[track.dot, { backgroundColor: filled ? colors.primary : colors.border }]} />
            ))}
          </View>
        </View>
      </View>
      <View style={track.right}>
        <Text style={[track.bpm, { color: colors.primary, fontFamily: Fonts.label }]}>{song.tempo}</Text>
        <Text style={[track.bpmUnit, { color: colors.mutedForeground }]}>BPM</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DrummerDetailSkeleton({ colors }: { colors: ReturnType<typeof useColors> }) {
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  return (
    <View style={[page.root, { backgroundColor: colors.background }]}>
      <Skeleton width="100%" height={HERO_HEIGHT + insets.top + webTopPad} borderRadius={0} />
      <View style={{ padding: 20, gap: 14, marginTop: 16 }}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="50%" height={12} />
        <Skeleton width="100%" height={1} style={{ marginVertical: 8 }} />
        <Skeleton width="30%" height={18} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="80%" height={14} />
        <Skeleton width="100%" height={50} style={{ marginTop: 4 }} />
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

  if (isLoading && !drummer) return <DrummerDetailSkeleton colors={colors} />;

  if (!drummer) {
    return (
      <View style={[page.root, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goBack} style={[page.backBtn, { top: insets.top + webTopPad + 12 }]}>
          <View style={page.backBtnInner}><Feather name="arrow-left" size={20} color={colors.foreground} /></View>
        </TouchableOpacity>
        <Text style={{ color: colors.foreground, padding: 20 }}>Drummer not found</Text>
      </View>
    );
  }

  const songs = (drummer.iconicSongs ?? []) as Song[];
  const yearsActive = drummer.died ? `${drummer.born}–${drummer.died}` : `${drummer.born}–present`;
  const initials = drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  // Vibe data
  const hasVibe = vibe && vibe.analysedCount > 0;
  const avgBpm = hasVibe ? (vibe.avgBpm ?? null) : null;
  const energyLabel = hasVibe && vibe.dominantEnergy
    ? (ENERGY_LABELS[vibe.dominantEnergy.toLowerCase()] ?? vibe.dominantEnergy)
    : null;
  const topMoods = hasVibe ? vibe.topMoods.slice(0, 6) : [];
  const topTags = hasVibe ? [...vibe.topGenres.slice(0, 3), ...vibe.topCharacter.slice(0, 3)] : [];
  const caption = hasVibe && vibe.transformerCaptions.length > 0 ? vibe.transformerCaptions[0] : null;
  const dividerColor = colors.border;

  return (
    <View style={[page.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 48 }}
      >
        {/* ── Hero ── */}
        <View style={{ height: HERO_HEIGHT }}>
          {drummer.photoUrl ? (
            <Image source={{ uri: drummer.photoUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
          ) : (
            <>
              <LinearGradient colors={[colors.primary + '80', colors.background] as const} style={StyleSheet.absoluteFillObject} />
              <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={[page.initials, { color: colors.primary }]}>{initials}</Text>
              </View>
            </>
          )}
          {drummer.photoUrl && <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.28)' }]} />}
          <LinearGradient colors={['transparent', colors.background] as const} style={page.heroGradient} />
          <TouchableOpacity onPress={goBack} testID="back-button"
            style={[page.backBtn, { top: insets.top + webTopPad + 12 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={page.backBtnInner}><Feather name="arrow-left" size={20} color="#fff" /></View>
          </TouchableOpacity>
          <View style={page.nameArea}>
            <Text style={[page.heroName, { fontFamily: Fonts.display }]} numberOfLines={2}>{drummer.name}</Text>
            <Text style={[page.heroYears, { fontFamily: Fonts.labelRegular }]}>{yearsActive}</Text>
          </View>
        </View>

        {/* ── Meta row — no card, just metadata ── */}
        <View style={[page.metaRow, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.push(`/era/${drummer.primaryEra}`)}>
            <View style={[page.eraChip, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '50' }]}>
              <Text style={[page.eraChipText, { color: colors.primary, fontFamily: Fonts.label }]}>{drummer.primaryEra}</Text>
            </View>
          </TouchableOpacity>
          {drummer.genres.length > 0 && (
            <Text style={[page.metaText, { color: colors.mutedForeground }]}>
              {drummer.genres.join(' · ')}
            </Text>
          )}
        </View>
        <View style={[page.bandsRow, { borderBottomColor: colors.border }]}>
          <Text style={[page.bandsLabel, { color: colors.foreground }]}>with </Text>
          <Text style={[page.bandsText, { color: colors.mutedForeground }]} numberOfLines={2}>
            {drummer.bands.join(', ')}
          </Text>
        </View>

        {/* ── Biography ── */}
        <View style={page.section}>
          <Text style={[page.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Biography</Text>
          <Text style={[page.body, { color: colors.foreground }]}>{drummer.bio}</Text>

          {/* Signature style as inline pull-quote */}
          <View style={[page.pullQuote, { borderLeftColor: colors.primary }]}>
            <Text style={[page.pullLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>SIGNATURE STYLE</Text>
            <Text style={[page.pullText, { color: colors.foreground, fontFamily: Fonts.serifItalic }]}>{drummer.signatureStyle}</Text>
          </View>
        </View>

        <Divider color={colors.border} />

        {/* ── Rhythm Profile ── */}
        <View style={page.section}>
          <Text style={[page.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Rhythm Profile</Text>

          {/* Inline stat line */}
          {(avgBpm !== null || energyLabel) && (
            <View style={page.statLine}>
              {avgBpm !== null && (
                <>
                  <Text style={[page.statNum, { color: colors.primary, fontFamily: Fonts.display }]}>{avgBpm}</Text>
                  <Text style={[page.statUnit, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>BPM avg</Text>
                  {energyLabel && <Text style={[page.statSep, { color: colors.border }]}>·</Text>}
                </>
              )}
              {energyLabel && (
                <>
                  <Text style={[page.statNum, { color: colors.foreground, fontFamily: Fonts.display }]}>{energyLabel}</Text>
                  <Text style={[page.statUnit, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>energy</Text>
                </>
              )}
              {hasVibe && (
                <>
                  <Text style={[page.statSep, { color: colors.border }]}>·</Text>
                  <Text style={[page.statUnit, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
                    {vibe.analysedCount} tracks studied
                  </Text>
                </>
              )}
            </View>
          )}

          {/* Zone bar */}
          <BpmZoneBar
            bpmMin={drummer.bpmMin}
            bpmMax={drummer.bpmMax}
            avgBpm={avgBpm}
            primaryColor={colors.primary}
            trackColor={colors.muted}
            mutedColor={colors.mutedForeground}
            dividerColor={dividerColor}
          />

          {/* Mood tags */}
          {topMoods.length > 0 && (
            <View style={page.tagRow}>
              {topMoods.map((m) => {
                const c = MOOD_COLORS[m.toLowerCase()] ?? colors.primary;
                return (
                  <View key={m} style={[page.moodChip, { backgroundColor: c + '18', borderColor: c + '55' }]}>
                    <Text style={[page.moodText, { color: c, fontFamily: Fonts.label }]}>{m}</Text>
                  </View>
                );
              })}
              {topTags.map((t) => (
                <View key={t} style={[page.tagChip, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                  <Text style={[page.tagText, { color: colors.foreground, fontFamily: Fonts.labelRegular }]}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* AI caption */}
          {caption && (
            <View style={[page.pullQuote, { borderLeftColor: colors.border, marginTop: 4 }]}>
              <Text style={[page.pullText, { color: colors.mutedForeground, fontFamily: Fonts.serifItalic, fontSize: 13 }]}>
                "{caption}"
              </Text>
              <Text style={[page.cyaniteSource, { color: colors.mutedForeground }]}>
                Cyanite AI · {hasVibe ? `${vibe.analysedCount} of ${vibe.songCount} recordings` : ''}
              </Text>
            </View>
          )}
        </View>

        <Divider color={colors.border} />

        {/* ── Legacy & Influence ── */}
        <View style={page.section}>
          <Text style={[page.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Legacy & Influence</Text>
          <Text style={[page.body, { color: colors.foreground }]}>{drummer.influence}</Text>
        </View>

        <Divider color={colors.border} />

        {/* ── Streaming stats ── */}
        <View style={page.section}>
          <SongstatsCard drummerId={drummer.id} />
        </View>

        {/* ── Essential Recordings — clean track listing ── */}
        {songs.length > 0 && (
          <>
            <Divider color={colors.border} />
            <View style={page.section}>
              <Text style={[page.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Essential Recordings</Text>
            </View>
            <View style={[page.trackList, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              {songs.map((s: Song, idx: number) => (
                <View key={s.id}>
                  <TrackRow
                    song={s}
                    colors={colors}
                    onPress={() => router.push(`/song/${s.id}`)}
                  />
                  {idx < songs.length - 1 && (
                    <View style={[track.separator, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const bar = StyleSheet.create({
  wrapper: { gap: 6 },
  zonesRow: { flexDirection: 'row' },
  zoneCell: { flex: 1, alignItems: 'center', gap: 2 },
  zoneLabel: { fontSize: 10, textAlign: 'center' },
  zoneRange: { fontSize: 9, textAlign: 'center' },
  track: { height: 8, borderRadius: 4, position: 'relative', overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 4 },
  avgPin: { position: 'absolute', top: 0, bottom: 0, width: 3, borderRadius: 1.5 },
  divider: { position: 'absolute', top: 0, bottom: 0, width: 1 },
  legend: { flexDirection: 'row', gap: 14, marginTop: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendSwatch: { width: 10, height: 10, borderRadius: 5 },
  avgSwatch: { width: 3, height: 10, borderRadius: 1.5 },
  legendText: { fontSize: 10 },
});

const div = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, marginHorizontal: 20, marginVertical: 4 },
});

const track = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  left: { flex: 1, gap: 4 },
  title: { fontSize: 15 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  artist: { fontSize: 12 },
  dots: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  right: { alignItems: 'flex-end', gap: 0 },
  bpm: { fontSize: 18, lineHeight: 20 },
  bpmUnit: { fontSize: 9 },
  separator: { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },
});

const page = StyleSheet.create({
  root: { flex: 1 },
  heroGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 },
  backBtn: { position: 'absolute', left: 16 },
  backBtnInner: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center', justifyContent: 'center',
  },
  initials: { fontSize: 80, fontWeight: '800', opacity: 0.25 },
  nameArea: { position: 'absolute', bottom: 14, left: 20, right: 20 },
  heroName: { fontSize: 44, lineHeight: 46, color: '#fff', letterSpacing: 1 },
  heroYears: { fontSize: 13, color: 'rgba(255,255,255,0.80)', marginTop: 2 },

  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  eraChip: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, borderWidth: 1,
  },
  eraChipText: { fontSize: 11 },
  metaText: { fontSize: 12, flex: 1 },

  bandsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bandsLabel: { fontSize: 13, fontWeight: '700' },
  bandsText: { fontSize: 13, flex: 1 },

  section: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 6 },
  sectionTitle: { fontSize: 22, marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 24 },

  pullQuote: {
    borderLeftWidth: 3,
    paddingLeft: 14,
    marginTop: 18,
    gap: 4,
  },
  pullLabel: { fontSize: 9, letterSpacing: 1.5 },
  pullText: { fontSize: 14, lineHeight: 21 },

  statLine: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 4, marginBottom: 14 },
  statNum: { fontSize: 28, lineHeight: 30 },
  statUnit: { fontSize: 12, marginRight: 2 },
  statSep: { fontSize: 16, marginHorizontal: 2 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  moodChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 14, borderWidth: 1 },
  moodText: { fontSize: 12 },
  tagChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 14, borderWidth: 1 },
  tagText: { fontSize: 11 },

  cyaniteSource: { fontSize: 10, marginTop: 4, fontStyle: 'italic' },

  trackList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
});
