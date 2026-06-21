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
import { useEra } from '@/hooks/useGql';
import DrummerCard from '@/components/DrummerCard';
import TrackRow from '@/components/TrackRow';
import SonicFingerprint from '@/components/SonicFingerprint';
import { Drummer, Song } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

export default function EraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/(tabs)/eras' as never);

  const { data: era, isLoading } = useEra(id ?? '');

  if (isLoading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  if (!era) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goBack} style={styles.backBtnAlone}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ color: colors.foreground, padding: 20 }}>Era not found</Text>
      </View>
    );
  }

  const drummers = (era.keyDrummers ?? []) as Drummer[];
  const songs = (era.iconicSongs ?? []) as Song[];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 48 }}
      >
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + webTopPad + 16, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} testID="back-button">
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.superLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>ERA</Text>
          <Text style={[styles.heroName, { color: era.color, fontFamily: Fonts.display }]} numberOfLines={2}>
            {era.name}
          </Text>
          <Text style={[styles.heroYears, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
            {era.years}
          </Text>
          <View style={[styles.subtitleQuote, { borderLeftColor: era.color }]}>
            <Text style={[styles.subtitleText, { color: colors.foreground, fontFamily: Fonts.serifItalic }]}>
              {era.subtitle}
            </Text>
          </View>
        </View>

        {/* ── Description ── */}
        <View style={styles.section}>
          <Text style={[styles.body, { color: colors.foreground }]}>{era.description}</Text>
        </View>

        {/* ── AI Sonic Fingerprint ── */}
        {era.aiSoundProfile && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <SonicFingerprint vibe={era.aiSoundProfile} accentColor={era.color} />
            </View>
          </>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* ── Defining Characteristics ── */}
        <View style={styles.section}>
          <Text style={[styles.capsLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>
            DEFINING CHARACTERISTICS
          </Text>
          <View style={styles.charList}>
            {era.characteristics.map((c, i) => (
              <View key={i} style={[styles.charRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.charDot, { backgroundColor: era.color }]} />
                <Text style={[styles.charText, { color: colors.foreground }]}>{c}</Text>
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

        {/* ── Iconic Recordings ── */}
        {songs.length > 0 && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>
                Iconic Recordings
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
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 4,
  },
  backBtn: { marginBottom: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  superLabel: { fontSize: 10, letterSpacing: 2 },
  heroName: { fontSize: 48, lineHeight: 50, marginTop: 2 },
  heroYears: { fontSize: 13, marginTop: 2 },
  subtitleQuote: { borderLeftWidth: 3, paddingLeft: 14, marginTop: 16 },
  subtitleText: { fontSize: 14, lineHeight: 22 },
  section: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 },
  capsLabel: { fontSize: 9, letterSpacing: 2, marginBottom: 12 },
  body: { fontSize: 15, lineHeight: 24 },
  sectionTitle: { fontSize: 22, marginBottom: 4 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 20, marginVertical: 6 },
  charList: { gap: 0 },
  charRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 12, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  charDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 4, flexShrink: 0 },
  charText: { fontSize: 14, lineHeight: 22, flex: 1 },
  horizontal: { paddingHorizontal: 16, paddingVertical: 12 },
  trackList: { borderTopWidth: StyleSheet.hairlineWidth },
});
