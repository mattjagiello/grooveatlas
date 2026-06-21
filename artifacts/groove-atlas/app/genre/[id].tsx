import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGenre } from '@/hooks/useGql';
import DrummerCard from '@/components/DrummerCard';
import TrackRow from '@/components/TrackRow';
import { Drummer, Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

export default function GenreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/genres' as never);

  const { data: genre, isLoading } = useGenre(id ?? '');

  if (isLoading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  if (!genre) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goBack} style={styles.backBtnAlone}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ color: colors.foreground, padding: 20 }}>Genre not found</Text>
      </View>
    );
  }

  const drummers = (genre.keyDrummers ?? []) as Drummer[];
  const songs = (genre.iconicSongs ?? []) as Song[];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 48 }}
      >
        {/* ── Header — left color accent, no card background ── */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + webTopPad + 16,
              borderBottomColor: colors.border,
              borderLeftColor: genre.color,
            },
          ]}
        >
          <TouchableOpacity onPress={goBack} style={styles.backBtn} testID="back-button">
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.superLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>GENRE</Text>
          <Text style={[styles.heroName, { color: colors.foreground, fontFamily: Fonts.display }]} numberOfLines={2}>
            {genre.name}
          </Text>
          <View style={styles.originRow}>
            <Feather name="map-pin" size={13} color={genre.color} />
            <Text style={[styles.origin, { color: genre.color, fontFamily: Fonts.labelRegular }]}>{genre.origin}</Text>
            <Text style={[styles.eraText, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
              · {genre.era}
            </Text>
          </View>
        </View>

        {/* ── Description ── */}
        <View style={styles.section}>
          <Text style={[styles.body, { color: colors.foreground }]}>{genre.description}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* ── Rhythmic Characteristics ── */}
        <View style={styles.section}>
          <Text style={[styles.capsLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>
            RHYTHMIC CHARACTERISTICS
          </Text>
          <View style={styles.chips}>
            {genre.characteristics.map((c, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: genre.color + '18', borderColor: genre.color + '55' }]}>
                <View style={[styles.chipDot, { backgroundColor: genre.color }]} />
                <Text style={[styles.chipText, { color: colors.foreground }]}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Key Drummers ── */}
        {drummers.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>
                Key Drummers
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={drummers}
              keyExtractor={(d) => d.id}
              initialNumToRender={3}
              maxToRenderPerBatch={4}
              windowSize={3}
              removeClippedSubviews={Platform.OS !== 'web'}
              contentContainerStyle={styles.horizontal}
              renderItem={({ item }) => (
                <DrummerCard
                  drummer={item}
                  onPress={(d: Drummer) => router.push(`/drummer/${d.id}`)}
                />
              )}
            />
          </>
        )}

        {/* ── Essential Listening ── */}
        {songs.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>
                Essential Listening
              </Text>
            </View>
            <View style={[styles.trackList, { borderTopColor: colors.border }]}>
              {songs.map((s: Song) => (
                <TrackRow
                  key={s.id}
                  song={s}
                  onPress={(song) => router.push(`/song/${song.id}`)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: { marginTop: 100 },
  backBtnAlone: { margin: 20, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: 20, paddingBottom: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    gap: 4,
  },
  backBtn: { marginBottom: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  superLabel: { fontSize: 10, letterSpacing: 2 },
  heroName: { fontSize: 48, lineHeight: 50, marginTop: 2 },
  originRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  origin: { fontSize: 13 },
  eraText: { fontSize: 13 },
  section: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 },
  capsLabel: { fontSize: 9, letterSpacing: 2, marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 24 },
  sectionTitle: { fontSize: 22, marginBottom: 4 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 20, marginVertical: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 13 },
  horizontal: { paddingHorizontal: 16, paddingVertical: 12 },
  trackList: { borderTopWidth: StyleSheet.hairlineWidth },
});
