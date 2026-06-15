import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEras, useDrummers, useSongs } from '@/hooks/useGql';
import EraHeroCarousel from '@/components/EraHeroCarousel';
import DrummerCard from '@/components/DrummerCard';
import SongCard from '@/components/SongCard';
import { Drummer, Era, Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);

  const { data: eras = [], isLoading: erasLoading } = useEras();

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
          <Text style={[styles.logo, { color: colors.primary, fontFamily: 'serif' }]}>
            GROOVE
          </Text>
          <Text style={[styles.logoSub, { color: colors.foreground, fontFamily: 'serif' }]}>
            ATLAS
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/search')}
          style={[styles.searchBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
        >
          <Feather name="search" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {erasLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100 },
          ]}
        >
          <View style={styles.carouselSection}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              BROWSE BY ERA
            </Text>
            {reversedEras.length > 0 && selectedEraId && (
              <EraHeroCarousel
                eras={reversedEras}
                selectedEraId={selectedEraId}
                onSelectEra={(e: Era) => setSelectedEraId(e.id)}
                onExploreEra={(e: Era) => router.push(`/era/${e.id}`)}
              />
            )}
          </View>

          {eraDrummers.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}
                >
                  Drummers of the {selectedEra?.name}
                </Text>
                <TouchableOpacity onPress={() => selectedEra && router.push(`/era/${selectedEra.id}`)}>
                  <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontal}
              >
                {(eraDrummers as Drummer[]).slice(0, 10).map((drummer: Drummer) => (
                  <DrummerCard
                    key={drummer.id}
                    drummer={drummer}
                    onPress={(d: Drummer) => router.push(`/drummer/${d.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {eraSongs.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}
              >
                Iconic Recordings
              </Text>
              <View style={styles.songList}>
                {(eraSongs as Song[]).slice(0, 5).map((song: Song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onPress={(s: Song) => router.push(`/song/${s.id}`)}
                  />
                ))}
              </View>
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
  logo: { fontSize: 13, fontWeight: '700', letterSpacing: 4, lineHeight: 16 },
  logoSub: { fontSize: 26, fontWeight: '700', letterSpacing: 6, lineHeight: 30 },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 2,
  },
  content: { paddingTop: 12 },
  loader: { marginTop: 100 },
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
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 13, fontWeight: '600' },
  horizontal: { paddingHorizontal: 20, gap: 0 },
  songList: { paddingHorizontal: 16 },
});
