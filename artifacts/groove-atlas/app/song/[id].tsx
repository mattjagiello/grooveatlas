import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
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
import {
  getSongById,
  getDrummerById,
  getEraById,
  getGenreById,
} from '@/constants/data';
import { useColors } from '@/hooks/useColors';

const COMPLEXITY_LABELS = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
const COMPLEXITY_COLORS = ['#228B22', '#6B8E23', '#B8860B', '#CD853F', '#8B1A1A'];

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const song = getSongById(id ?? '');
  if (!song) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, padding: 20 }}>Song not found</Text>
      </View>
    );
  }

  const drummer = getDrummerById(song.drummerId);
  const era = getEraById(song.eraId);
  const genres = song.genreIds.map((gid) => getGenreById(gid)).filter(Boolean);
  const complexityColor = COMPLEXITY_COLORS[song.complexity - 1];
  const complexityLabel = COMPLEXITY_LABELS[song.complexity - 1];

  const openSongsterr = async () => {
    if (!song.songsterrSlug) return;
    const url = `https://www.songsterr.com/a/wsa/${song.songsterrSlug}`;
    await WebBrowser.openBrowserAsync(url);
  };

  const dots = Array.from({ length: 5 }, (_, i) => i < song.complexity);

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
          <Text style={[styles.title, { color: colors.foreground, fontFamily: 'serif' }]}>
            {song.title}
          </Text>
          <Text style={[styles.artist, { color: colors.primary }]}>{song.artist}</Text>
          <Text style={[styles.year, { color: colors.mutedForeground }]}>{song.year}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {era && (
              <TouchableOpacity
                onPress={() => router.push(`/era/${era.id}`)}
                style={[styles.tag, { backgroundColor: era.color + '25', borderColor: era.color }]}
              >
                <Text style={[styles.tagText, { color: era.color }]}>{era.name}</Text>
              </TouchableOpacity>
            )}
            {genres.map((g) => g && (
              <TouchableOpacity
                key={g.id}
                onPress={() => router.push(`/genre/${g.id}`)}
                style={[styles.tag, { backgroundColor: g.color + '25', borderColor: g.color }]}
              >
                <Text style={[styles.tagText, { color: g.color }]}>{g.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Groove Stats */}
        <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary, fontFamily: 'serif' }]}>
              {song.tempo}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>BPM</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <View style={styles.complexityDots}>
              {dots.map((filled, i) => (
                <View
                  key={i}
                  style={[
                    styles.complexityDot,
                    { backgroundColor: filled ? complexityColor : colors.border },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              {complexityLabel}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={[styles.stat, { flex: 2 }]}>
            <Text style={[styles.feelText, { color: colors.foreground }]} numberOfLines={2}>
              {song.feel}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Feel</Text>
          </View>
        </View>

        {/* Drummer */}
        {drummer && (
          <TouchableOpacity
            onPress={() => router.push(`/drummer/${drummer.id}`)}
            style={[styles.drummerBox, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.drummerAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.drummerInitials}>
                {drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={styles.drummerInfo}>
              <Text style={[styles.drummerLabel, { color: colors.mutedForeground }]}>
                DRUMMER
              </Text>
              <Text style={[styles.drummerName, { color: colors.foreground, fontFamily: 'serif' }]}>
                {drummer.name}
              </Text>
              <Text style={[styles.drummerBand, { color: colors.mutedForeground }]} numberOfLines={1}>
                {drummer.bands[0]}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
            The Groove
          </Text>
          <Text style={[styles.body, { color: colors.foreground }]}>{song.description}</Text>
        </View>

        {/* Why Study */}
        <View style={[styles.studyBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <View style={styles.studyHeader}>
            <Feather name="book-open" size={16} color={colors.primary} />
            <Text style={[styles.studyTitle, { color: colors.primary }]}>Why Study This</Text>
          </View>
          <Text style={[styles.body, { color: colors.foreground }]}>{song.whyStudy}</Text>
        </View>

        {/* Songsterr link */}
        {song.songsterrSlug && (
          <TouchableOpacity
            onPress={openSongsterr}
            style={[styles.tabsBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="music" size={16} color="#fff" />
            <Text style={styles.tabsBtnText}>View Tabs on Songsterr</Text>
            <Feather name="external-link" size={14} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {},
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  backBtn: {
    marginBottom: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  artist: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  year: {
    fontSize: 13,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 8,
  },
  complexityDots: {
    flexDirection: 'row',
    gap: 4,
  },
  complexityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  feelText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  drummerBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drummerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drummerInitials: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  drummerInfo: {
    flex: 1,
    gap: 2,
  },
  drummerLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  drummerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  drummerBand: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
  },
  studyBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  studyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },
  tabsBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
