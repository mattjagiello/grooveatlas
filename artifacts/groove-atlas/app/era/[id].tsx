import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DrummerCard from '@/components/DrummerCard';
import SongCard from '@/components/SongCard';
import {
  Drummer,
  Song,
  getEraById,
  getDrummersByIds,
  getSongsByIds,
  getDrummerById,
} from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function EraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const era = getEraById(id ?? '');
  if (!era) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, padding: 20 }}>Era not found</Text>
      </View>
    );
  }

  const drummers = getDrummersByIds(era.keyDrummerIds);
  const songs = getSongsByIds(era.iconicSongIds);

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
              borderLeftColor: era.color,
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
          <View style={styles.heroContent}>
            <Text style={[styles.heroName, { color: era.color, fontFamily: 'serif' }]}>
              {era.name}
            </Text>
            <Text style={[styles.heroYears, { color: colors.mutedForeground }]}>
              {era.years}
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.foreground }]}>
              {era.subtitle}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.description, { color: colors.foreground }]}>
            {era.description}
          </Text>
        </View>

        {/* Characteristics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
            Defining Characteristics
          </Text>
          {era.characteristics.map((c, i) => (
            <View key={i} style={[styles.characteristicRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.characteristicDot, { backgroundColor: era.color }]} />
              <Text style={[styles.characteristicText, { color: colors.foreground }]}>{c}</Text>
            </View>
          ))}
        </View>

        {/* Key Drummers */}
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

        {/* Iconic Songs */}
        {songs.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
              Iconic Recordings
            </Text>
            <View style={styles.songList}>
              {songs.map((s: Song) => {
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
  content: {},
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
  },
  backBtn: {
    marginBottom: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    gap: 4,
  },
  heroName: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
  },
  heroYears: {
    fontSize: 14,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
  characteristicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  characteristicDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  characteristicText: {
    fontSize: 14,
    flex: 1,
  },
  horizontal: {
    paddingRight: 20,
  },
  songList: {},
});
