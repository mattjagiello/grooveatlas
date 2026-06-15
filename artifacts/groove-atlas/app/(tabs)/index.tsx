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
import {
  useListEras,
  useListGenres,
  useListDrummers,
  useListSongs,
  getListDrummersQueryKey,
  getListSongsQueryKey,
} from '@workspace/api-client-react';
import DecadeTimeline from '@/components/DecadeTimeline';
import DrummerCard from '@/components/DrummerCard';
import GlobeMap from '@/components/GlobeMap';
import SongCard from '@/components/SongCard';
import { Drummer, Era, Genre, Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);

  const { data: rawEras = [], isLoading: erasLoading } = useListEras();
  const { data: rawGenres = [] } = useListGenres();

  const eras = rawEras as Era[];
  const genres = rawGenres as Genre[];

  useEffect(() => {
    if (eras.length > 0 && !selectedEraId) {
      const defaultEra = eras[3] ?? eras[0];
      if (defaultEra) setSelectedEraId(defaultEra.id);
    }
  }, [eras, selectedEraId]);

  const selectedEra = eras.find((e) => e.id === selectedEraId) ?? eras[0];

  const drummerParams = selectedEraId ? { eraId: selectedEraId } : undefined;
  const songParams = selectedEraId ? { eraId: selectedEraId } : undefined;

  const { data: rawDrummers = [] } = useListDrummers(drummerParams, {
    query: { queryKey: getListDrummersQueryKey(drummerParams), enabled: !!selectedEraId },
  });
  const { data: rawSongs = [] } = useListSongs(songParams, {
    query: { queryKey: getListSongsQueryKey(songParams), enabled: !!selectedEraId },
  });

  const eraDrummers = rawDrummers as Drummer[];
  const eraSongs = rawSongs as Song[];

  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
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
            {
              paddingBottom:
                insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100,
            },
          ]}
        >
          {/* Globe */}
          <View style={styles.globeSection}>
            <GlobeMap
              genres={genres}
              onGenrePress={(g: Genre) => router.push(`/genre/${g.id}`)}
            />
            <Text style={[styles.globeHint, { color: colors.mutedForeground }]}>
              Tap a dot to explore a genre's origin
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Timeline */}
          {eras.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                BROWSE BY ERA
              </Text>
              <DecadeTimeline
                eras={eras}
                selectedEraId={selectedEraId ?? ''}
                onSelectEra={(e: Era) => setSelectedEraId(e.id)}
              />
            </View>
          )}

          {/* Era info */}
          {selectedEra && (
            <View
              style={[
                styles.eraInfo,
                { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: selectedEra.color },
              ]}
            >
              <Text style={[styles.eraName, { color: selectedEra.color, fontFamily: 'serif' }]}>
                {selectedEra.name}
              </Text>
              <Text style={[styles.eraSubtitle, { color: colors.foreground }]}>
                {selectedEra.subtitle}
              </Text>
              <Text style={[styles.eraDesc, { color: colors.mutedForeground }]} numberOfLines={3}>
                {selectedEra.description}
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/era/${selectedEra.id}`)}
                style={[styles.eraBtn, { borderColor: selectedEra.color }]}
              >
                <Text style={[styles.eraBtnText, { color: selectedEra.color }]}>
                  Explore {selectedEra.name}
                </Text>
                <Feather name="arrow-right" size={13} color={selectedEra.color} />
              </TouchableOpacity>
            </View>
          )}

          {/* Key Drummers of Era */}
          {eraDrummers.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
                Drummers of the {selectedEra?.name}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontal}
              >
                {eraDrummers.slice(0, 8).map((drummer: Drummer) => (
                  <DrummerCard
                    key={drummer.id}
                    drummer={drummer}
                    onPress={(d: Drummer) => router.push(`/drummer/${d.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Iconic Songs */}
          {eraSongs.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
                Iconic Recordings
              </Text>
              <View style={styles.songList}>
                {eraSongs.slice(0, 4).map((song: Song) => (
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
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
    lineHeight: 16,
  },
  logoSub: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 6,
    lineHeight: 30,
  },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 2,
  },
  content: {
    paddingTop: 12,
  },
  loader: {
    marginTop: 100,
  },
  globeSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  globeHint: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  horizontal: {
    paddingHorizontal: 20,
  },
  eraInfo: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 4,
  },
  eraName: {
    fontSize: 28,
    fontWeight: '700',
  },
  eraSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  eraDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  eraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  eraBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  songList: {
    paddingHorizontal: 16,
  },
});
