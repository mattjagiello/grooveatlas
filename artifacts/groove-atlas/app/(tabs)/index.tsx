import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useEras, useDrummers, useSongs, useGenres } from '@/hooks/useGql';
import EraHeroCarousel from '@/components/EraHeroCarousel';
import DrummerCard from '@/components/DrummerCard';
import SongCard from '@/components/SongCard';
import { Skeleton } from '@/components/Skeleton';
import { Drummer, Era, Genre, Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

function HomeSkeleton({ colors, insets }: { colors: ReturnType<typeof useColors>; insets: { top: number } }) {
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}
    >
      {/* Era carousel skeleton */}
      <View style={{ marginBottom: 20 }}>
        <Skeleton width="35%" height={10} style={{ marginHorizontal: 20, marginBottom: 10 }} />
        <Skeleton width="auto" height={188} borderRadius={14} style={{ marginHorizontal: 16 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={i === 1 ? 16 : 7} height={7} borderRadius={4} />
          ))}
        </View>
      </View>

      {/* Drummers section skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton width="55%" height={20} style={{ marginHorizontal: 20, marginBottom: 14 }} />
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={130} height={130} borderRadius={10} />
          ))}
        </View>
      </View>

      {/* Songs section skeleton */}
      <View style={{ marginBottom: 24 }}>
        <Skeleton width="45%" height={20} style={{ marginHorizontal: 20, marginBottom: 14 }} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} width="auto" height={82} borderRadius={10} style={{ marginHorizontal: 16, marginBottom: 8 }} />
        ))}
      </View>

      {/* Genre strip skeleton */}
      <Skeleton width="40%" height={20} style={{ marginHorizontal: 20, marginBottom: 14 }} />
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, gap: 8 }}>
        {[80, 100, 70, 90].map((w, i) => (
          <Skeleton key={i} width={w} height={40} borderRadius={22} />
        ))}
      </View>
    </ScrollView>
  );
}

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { data: eras = [], isLoading: erasLoading } = useEras();
  const { data: genres = [] } = useGenres();

  const reversedEras = [...eras].reverse();

  useEffect(() => {
    if (reversedEras.length > 0 && !selectedEraId) {
      setSelectedEraId(reversedEras[0].id);
    }
  }, [eras]);

  const selectedEra = eras.find((e) => e.id === selectedEraId) ?? reversedEras[0];

  const { data: eraDrummers = [] } = useDrummers(
    selectedEraId ? { eraId: selectedEraId } : undefined,
  );
  const { data: eraSongs = [] } = useSongs(
    selectedEraId ? { eraId: selectedEraId } : undefined,
  );

  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  }

  const displayDrummers = useMemo(
    () => shuffle(eraDrummers as Drummer[]).slice(0, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedEraId, eraDrummers.length],
  );

  const displaySongs = useMemo(
    () => shuffle(eraSongs as Song[]).slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedEraId, eraSongs.length],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['eras'] }),
      queryClient.invalidateQueries({ queryKey: ['genres'] }),
      queryClient.invalidateQueries({ queryKey: ['drummers'] }),
      queryClient.invalidateQueries({ queryKey: ['songs'] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingTop: insets.top + webTopPad + 4,
            paddingBottom: 10,
          },
        ]}
      >
        <View>
          <Text style={[styles.logo, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>
            GROOVE
          </Text>
          <Text style={[styles.logoSub, { color: colors.primary, fontFamily: Fonts.display }]}>
            ATLAS
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/search')}
          style={[styles.searchBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Feather name="search" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {erasLoading ? (
        <HomeSkeleton colors={colors} insets={insets} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100 },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.carouselSection}>
            {reversedEras.length > 0 && selectedEraId && (
              <EraHeroCarousel
                eras={reversedEras}
                selectedEraId={selectedEraId}
                onSelectEra={(e: Era) => setSelectedEraId(e.id)}
                onExploreEra={(e: Era) => router.push(`/era/${e.id}`)}
              />
            )}
          </View>

          {displayDrummers.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}
                >
                  Drummers of the {selectedEra?.name}
                </Text>
                <TouchableOpacity
                  onPress={() => selectedEra && router.push(`/era/${selectedEra.id}`)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={displayDrummers}
                keyExtractor={(d) => d.id}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
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
            </View>
          )}

          {displaySongs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}
                >
                  Iconic Recordings
                </Text>
              </View>
              <View style={styles.songList}>
                {displaySongs.map((song: Song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onPress={(s: Song) => router.push(`/song/${s.id}`)}
                  />
                ))}
              </View>
            </View>
          )}

          {genres.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>
                  Browse by Genre
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/genres')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.genreStrip}
              >
                {(genres as Genre[]).map((genre: Genre) => (
                  <TouchableOpacity
                    key={genre.id}
                    onPress={() => router.push(`/genre/${genre.id}`)}
                    style={[styles.genreChip, { borderColor: genre.color, backgroundColor: genre.color + '18' }]}
                    hitSlop={{ top: 4, bottom: 4 }}
                  >
                    <View style={[styles.genreDot, { backgroundColor: genre.color }]} />
                    <Text style={[styles.genreChipText, { color: colors.foreground }]}>{genre.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: { fontSize: 11, letterSpacing: 3, lineHeight: 14 },
  logoSub: { fontSize: 34, lineHeight: 32 },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 2,
  },
  content: { paddingTop: 12 },
  carouselSection: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20 },
  seeAll: { fontSize: 13, fontWeight: '600' },
  horizontal: { paddingHorizontal: 20, gap: 0 },
  songList: { paddingHorizontal: 16 },
  genreStrip: { paddingHorizontal: 20, gap: 8 },
  genreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 44,
  },
  genreDot: { width: 8, height: 8, borderRadius: 4 },
  genreChipText: { fontSize: 13, fontWeight: '600' },
});
