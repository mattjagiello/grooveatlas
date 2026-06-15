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
import { useDrummer } from '@/hooks/useGql';
import SongCard from '@/components/SongCard';
import { Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>Legacy & Influence</Text>
          <Text style={[styles.influence, { color: colors.foreground }]}>{drummer.influence}</Text>
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
