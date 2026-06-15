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
import { useGenre } from '@/hooks/useGql';
import DrummerCard from '@/components/DrummerCard';
import SongCard from '@/components/SongCard';
import { Drummer, Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function GenreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnAlone}>
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
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 },
        ]}
      >
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-button">
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={[styles.colorBar, { backgroundColor: genre.color }]} />
          <Text style={[styles.heroName, { color: colors.foreground, fontFamily: 'serif' }]}>
            {genre.name}
          </Text>
          <View style={styles.originRow}>
            <Feather name="map-pin" size={13} color={genre.color} />
            <Text style={[styles.origin, { color: genre.color }]}>{genre.origin}</Text>
          </View>
          <Text style={[styles.era, { color: colors.mutedForeground }]}>{genre.era}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.description, { color: colors.foreground }]}>{genre.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
            Rhythmic Characteristics
          </Text>
          <View style={styles.chips}>
            {genre.characteristics.map((c, i) => (
              <View key={i} style={[styles.chip, { backgroundColor: colors.muted, borderColor: genre.color }]}>
                <View style={[styles.chipDot, { backgroundColor: genre.color }]} />
                <Text style={[styles.chipText, { color: colors.foreground }]}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        {drummers.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
              Key Drummers
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontal}
            >
              {drummers.map((d: Drummer) => (
                <DrummerCard
                  key={d.id}
                  drummer={d}
                  onPress={(drummer: Drummer) => router.push(`/drummer/${drummer.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
              Essential Listening
            </Text>
            <View style={styles.songList}>
              {songs.map((s: Song) => (
                <SongCard
                  key={s.id}
                  song={s}
                  onPress={(song: Song) => router.push(`/song/${song.id}`)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {},
  loader: { marginTop: 100 },
  backBtnAlone: { margin: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hero: { paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, gap: 4 },
  backBtn: { marginBottom: 12, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  colorBar: { height: 4, width: 40, borderRadius: 2, marginBottom: 8 },
  heroName: { fontSize: 38, fontWeight: '700', lineHeight: 44 },
  originRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  origin: { fontSize: 14, fontWeight: '600' },
  era: { fontSize: 13, marginTop: 2 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  description: { fontSize: 15, lineHeight: 22 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 13, fontWeight: '500' },
  horizontal: { paddingRight: 20 },
  songList: {},
});
