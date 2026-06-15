import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DrummerCard from '@/components/DrummerCard';
import EraCard from '@/components/EraCard';
import GenreCard from '@/components/GenreCard';
import SongCard from '@/components/SongCard';
import { Drummer, Era, Genre, Song, getDrummerById, searchAll } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const results = searchAll(query);
  const hasResults =
    results.drummers.length > 0 ||
    results.songs.length > 0 ||
    results.genres.length > 0 ||
    results.eras.length > 0;
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingTop: insets.top + webTopPad + 4,
            paddingBottom: 12,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'serif' }]}>
          Search
        </Text>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Drummer, song, genre, era…"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            autoCorrect={false}
            returnKeyType="search"
            testID="search-input"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100,
          },
        ]}
      >
        {query.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="compass" size={40} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground, fontFamily: 'serif' }]}>
              Explore the Atlas
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Search for a drummer, song, genre, or era to begin your journey
            </Text>
          </View>
        )}

        {query.length > 0 && !hasResults && (
          <View style={styles.emptyState}>
            <Feather name="search" size={40} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground, fontFamily: 'serif' }]}>
              No results
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try searching for "Bonham", "jazz", or "1970s"
            </Text>
          </View>
        )}

        {results.drummers.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              DRUMMERS
            </Text>
            {results.drummers.map((d: Drummer) => (
              <View key={d.id} style={styles.itemRow}>
                <DrummerCard
                  drummer={d}
                  compact
                  onPress={(drummer: Drummer) => router.push(`/drummer/${drummer.id}`)}
                />
              </View>
            ))}
          </View>
        )}

        {results.songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              SONGS
            </Text>
            {results.songs.map((s: Song) => {
              const drummer = getDrummerById(s.drummerId);
              return (
                <SongCard
                  key={s.id}
                  song={s}
                  drummerName={drummer?.name}
                  onPress={(song: Song) => router.push(`/song/${song.id}`)}
                />
              );
            })}
          </View>
        )}

        {results.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              GENRES
            </Text>
            <View style={styles.genreGrid}>
              {results.genres.map((g: Genre) => (
                <GenreCard
                  key={g.id}
                  genre={g}
                  onPress={(genre: Genre) => router.push(`/genre/${genre.id}`)}
                />
              ))}
            </View>
          </View>
        )}

        {results.eras.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              ERAS
            </Text>
            {results.eras.map((e: Era) => (
              <EraCard
                key={e.id}
                era={e}
                onPress={(era: Era) => router.push(`/era/${era.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  content: {
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
  },
  itemRow: {
    marginBottom: 8,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
