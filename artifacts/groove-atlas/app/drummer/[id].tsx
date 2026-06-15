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
import { useGetDrummer } from '@workspace/api-client-react';
import SongCard from '@/components/SongCard';
import { Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function DrummerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const { data: drummer, isLoading } = useGetDrummer(id ?? '');

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
  const bpmMin = drummer.bpmMin;
  const bpmMax = drummer.bpmMax;

  const yearsActive = drummer.died
    ? `${drummer.born}–${drummer.died}`
    : `${drummer.born}–present`;

  const genreLabels = drummer.genres.join(', ');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40,
          },
        ]}
      >
        {/* Hero */}
        <View
          style={[
            styles.hero,
            {
              paddingTop: insets.top + webTopPad + 16,
              borderBottomColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            testID="back-button"
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.heroRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={styles.heroInfo}>
              <Text
                style={[styles.name, { color: colors.foreground, fontFamily: 'serif' }]}
                numberOfLines={2}
              >
                {drummer.name}
              </Text>
              <Text style={[styles.years, { color: colors.mutedForeground }]}>
                {yearsActive}
              </Text>
              <TouchableOpacity onPress={() => router.push(`/era/${drummer.primaryEra}`)}>
                <View style={[styles.eraTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                  <Text style={[styles.eraTagText, { color: colors.primary }]}>
                    {drummer.primaryEra}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.bands, { color: colors.mutedForeground }]}>
            {drummer.bands.join(' · ')}
          </Text>
          {genreLabels.length > 0 && (
            <Text style={[styles.genres, { color: colors.primary }]}>{genreLabels}</Text>
          )}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
            Biography
          </Text>
          <Text style={[styles.bio, { color: colors.foreground }]}>{drummer.bio}</Text>
        </View>

        {/* Signature Style */}
        <View style={[styles.styleBox, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: colors.primary }]}>
          <Text style={[styles.styleLabel, { color: colors.mutedForeground }]}>
            SIGNATURE STYLE
          </Text>
          <Text style={[styles.styleText, { color: colors.foreground }]}>
            {drummer.signatureStyle}
          </Text>
        </View>

        {/* BPM Range */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
            Tempo Range
          </Text>
          <View style={[styles.bpmContainer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <View style={styles.bpmLabels}>
              <Text style={[styles.bpmVal, { color: colors.primary, fontFamily: 'serif' }]}>
                {bpmMin}
              </Text>
              <Text style={[styles.bpmSep, { color: colors.mutedForeground }]}>—</Text>
              <Text style={[styles.bpmVal, { color: colors.primary, fontFamily: 'serif' }]}>
                {bpmMax}
              </Text>
              <Text style={[styles.bpmUnit, { color: colors.mutedForeground }]}>BPM</Text>
            </View>
            <View style={[styles.bpmTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.bpmFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${Math.round(((bpmMax - 40) / (320 - 40)) * 100)}%`,
                    marginLeft: `${Math.round(((bpmMin - 40) / (320 - 40)) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.bpmHint, { color: colors.mutedForeground }]}>
              Typical performance range
            </Text>
          </View>
        </View>

        {/* Influence */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
            Legacy & Influence
          </Text>
          <Text style={[styles.influence, { color: colors.foreground }]}>
            {drummer.influence}
          </Text>
        </View>

        {/* Songs */}
        {songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
              Essential Recordings
            </Text>
            {songs.map((s: Song) => (
              <SongCard
                key={s.id}
                song={s}
                onPress={(song: Song) => router.push(`/song/${song.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {},
  loader: {
    marginTop: 100,
  },
  backBtnAlone: {
    margin: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  backBtn: {
    marginBottom: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  years: {
    fontSize: 13,
  },
  eraTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 2,
  },
  eraTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bands: {
    fontSize: 13,
    marginTop: 4,
  },
  genres: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    lineHeight: 23,
  },
  styleBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 6,
  },
  styleLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  styleText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  bpmContainer: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  bpmLabels: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bpmVal: {
    fontSize: 32,
    fontWeight: '700',
  },
  bpmSep: {
    fontSize: 20,
  },
  bpmUnit: {
    fontSize: 14,
    marginLeft: 4,
  },
  bpmTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bpmFill: {
    height: 6,
    borderRadius: 3,
  },
  bpmHint: {
    fontSize: 11,
  },
  influence: {
    fontSize: 15,
    lineHeight: 22,
  },
});
