import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { useSong, useSimilarSongs } from '@/hooks/useGql';
import type { SimilarSong } from '@/lib/queries';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';
import type { TrackMeta } from '@/lib/queries';
import {
  startDrumExtraction,
  checkStemStatus,
  isStemError,
  type StemResult,
} from '@/lib/stems-client';
import {
  peekCyaniteCache,
  type CyaniteAnalysis,
} from '@/lib/cyanite-client';

const COMPLEXITY_LABELS = ['Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];
const COMPLEXITY_COLORS = ['#228B22', '#6B8E23', '#B8860B', '#CD853F', '#8B1A1A'];

function formatDuration(secs: number): string {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function TrackMetaCard({ meta, songTitle, colors }: { meta: TrackMeta; songTitle: string; colors: ReturnType<typeof useColors> }) {
  const openSpotify = async () => {
    if (!meta.spotifyId) return;
    await WebBrowser.openBrowserAsync(`https://open.spotify.com/track/${meta.spotifyId}`);
  };

  const namesDiffer = meta.trackName &&
    meta.trackName.toLowerCase().trim() !== songTitle.toLowerCase().trim();

  return (
    <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.metaHeader}>
        <Feather name="disc" size={14} color={colors.primary} />
        <Text style={[styles.metaTitle, { color: colors.primary }]}>Track Info</Text>
        <Text style={[styles.metaSource, { color: colors.mutedForeground }]}>via Musicmatch</Text>
      </View>

      {namesDiffer ? (
        <View style={styles.metaAlbumRow}>
          <Feather name="alert-circle" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaAlbum, { color: colors.mutedForeground }]} numberOfLines={1}>
            Matched as: <Text style={{ color: colors.foreground }}>{meta.trackName}</Text>
          </Text>
        </View>
      ) : null}

      {meta.albumTitle ? (
        <View style={styles.metaAlbumRow}>
          <Feather name="layers" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaAlbum, { color: colors.mutedForeground }]} numberOfLines={2}>
            Album: <Text style={{ color: colors.foreground }}>{meta.albumTitle}</Text>
          </Text>
        </View>
      ) : null}

      <View style={styles.metaStatsRow}>
        {meta.trackLengthSecs > 0 && (
          <View style={styles.metaStat}>
            <Feather name="clock" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaStatValue, { color: colors.foreground }]}>
              {formatDuration(meta.trackLengthSecs)}
            </Text>
            <Text style={[styles.metaStatLabel, { color: colors.mutedForeground }]}>Duration</Text>
          </View>
        )}
        {meta.trackRating > 0 && (
          <View style={styles.metaStat}>
            <Feather name="bar-chart-2" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaStatValue, { color: colors.foreground }]}>
              {meta.trackRating}
            </Text>
            <Text style={[styles.metaStatLabel, { color: colors.mutedForeground }]}>Rating</Text>
          </View>
        )}
        {meta.numFavourite > 0 && (
          <View style={styles.metaStat}>
            <Feather name="heart" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaStatValue, { color: colors.foreground }]}>
              {meta.numFavourite >= 1000
                ? `${(meta.numFavourite / 1000).toFixed(1)}k`
                : String(meta.numFavourite)}
            </Text>
            <Text style={[styles.metaStatLabel, { color: colors.mutedForeground }]}>Fans</Text>
          </View>
        )}
      </View>

      {meta.genres.length > 0 && (
        <View style={styles.metaGenreRow}>
          {meta.genres.map((g) => (
            <View key={g} style={[styles.metaGenreTag, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '50' }]}>
              <Text style={[styles.metaGenreText, { color: colors.primary }]}>{g}</Text>
            </View>
          ))}
        </View>
      )}

      {meta.spotifyId ? (
        <TouchableOpacity onPress={openSpotify} style={[styles.spotifyBtn, { borderColor: colors.border }]}>
          <Feather name="external-link" size={12} color={colors.mutedForeground} />
          <Text style={[styles.spotifyBtnText, { color: colors.mutedForeground }]}>Listen on Spotify</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

type StemState =
  | { phase: 'idle' }
  | { phase: 'starting'; step: string }
  | { phase: 'polling'; taskId: string; previewTitle: string; elapsed: number }
  | { phase: 'ready'; result: StemResult }
  | { phase: 'premium' }
  | { phase: 'no_preview' }
  | { phase: 'error'; message: string };

function StemPlayer({
  url,
  label,
  icon,
  colors,
}: {
  url: string;
  label: string;
  icon: 'headphones' | 'volume-2';
  colors: ReturnType<typeof useColors>;
}) {
  const player = useAudioPlayer(url);
  const playing = player.playing;

  const toggle = () => {
    if (playing) {
      player.pause();
    } else {
      player.seekTo(0);
      player.play();
    }
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      style={[styles.stemPlayer, { backgroundColor: colors.muted, borderColor: colors.border }]}
    >
      <View style={[styles.stemIconWrap, { backgroundColor: colors.primary + '20' }]}>
        <Feather name={playing ? 'pause' : icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.stemInfo}>
        <Text style={[styles.stemLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.stemHint, { color: colors.mutedForeground }]}>
          {playing ? 'Tap to pause' : 'Tap to play'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function DrumStudySection({
  songId,
  colors,
}: {
  songId: string;
  colors: ReturnType<typeof useColors>;
}) {
  const [state, setState] = useState<StemState>({ phase: 'idle' });

  const start = async () => {
    setState({ phase: 'starting', step: 'Finding preview via Deezer…' });

    // Step 1: fast — find preview, upload, enqueue split (< 10s)
    const started = await startDrumExtraction(songId);
    if (isStemError(started)) {
      if (started.code === 'PREMIUM_REQUIRED') { setState({ phase: 'premium' }); return; }
      if (started.code === 'NO_PREVIEW') { setState({ phase: 'no_preview' }); return; }
      setState({ phase: 'error', message: started.message });
      return;
    }

    const { taskId, previewTitle, songTitle, artist } = started;
    setState({ phase: 'polling', taskId, previewTitle, elapsed: 0 });

    // Step 2: poll from the client every 4s (each check call is < 1s, no long HTTP hold)
    const startedAt = Date.now();
    const MAX_WAIT = 3 * 60 * 1000; // 3 minutes
    while (Date.now() - startedAt < MAX_WAIT) {
      await new Promise((r) => setTimeout(r, 4000));
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      setState((s) => s.phase === 'polling' ? { ...s, elapsed } : s);

      const status = await checkStemStatus(taskId);
      if (isStemError(status)) {
        setState({ phase: 'error', message: status.message });
        return;
      }
      if ('drumUrl' in status) {
        setState({
          phase: 'ready',
          result: { songId, songTitle, artist, previewTitle, drumUrl: status.drumUrl, accompanimentUrl: status.accompanimentUrl },
        });
        return;
      }
      // status === 'processing' — keep polling
    }
    setState({ phase: 'error', message: 'Timed out after 3 minutes — LALAL.AI may be busy.' });
  };

  const reset = () => setState({ phase: 'idle' });

  return (
    <View style={[styles.studySection, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.studyHeader2}>
        <Text style={styles.drumEmoji}>🥁</Text>
        <View style={styles.studyTitleWrap}>
          <Text style={[styles.studySectionTitle, { color: colors.foreground }]}>Drum Study Mode</Text>
          <Text style={[styles.studySectionSub, { color: colors.mutedForeground }]}>
            Isolate the drum track via LALAL.AI
          </Text>
        </View>
      </View>

      {state.phase === 'idle' && (
        <TouchableOpacity
          onPress={start}
          style={[styles.studyBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="scissors" size={15} color="#fff" />
          <Text style={styles.studyBtnText}>Isolate Drum Track</Text>
        </TouchableOpacity>
      )}

      {state.phase === 'starting' && (
        <View style={styles.studyLoading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.studyLoadingText, { color: colors.mutedForeground }]}>
            {state.step}
          </Text>
          <Text style={[styles.studyLoadingHint, { color: colors.mutedForeground }]}>
            Finding preview · uploading to LALAL.AI…
          </Text>
        </View>
      )}

      {state.phase === 'polling' && (
        <View style={styles.studyLoading}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.studyLoadingText, { color: colors.mutedForeground }]}>
            AI separating drums… ({state.elapsed}s)
          </Text>
          <Text style={[styles.studyLoadingHint, { color: colors.mutedForeground }]}>
            "{state.previewTitle}" · usually 20–60s
          </Text>
        </View>
      )}

      {state.phase === 'ready' && (
        <View style={styles.studyResult}>
          <Text style={[styles.studyResultNote, { color: colors.mutedForeground }]}>
            30s preview · "{state.result.previewTitle}"
          </Text>
          <StemPlayer
            url={state.result.drumUrl}
            label="Drum Track Only"
            icon="headphones"
            colors={colors}
          />
          {state.result.accompanimentUrl ? (
            <StemPlayer
              url={state.result.accompanimentUrl}
              label="Everything Else"
              icon="volume-2"
              colors={colors}
            />
          ) : null}
          <TouchableOpacity onPress={reset} style={styles.resetBtn}>
            <Text style={[styles.resetText, { color: colors.mutedForeground }]}>↩ Try again</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.phase === 'premium' && (
        <View style={[styles.studyNotice, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '40' }]}>
          <Feather name="lock" size={16} color={colors.primary} />
          <Text style={[styles.studyNoticeText, { color: colors.foreground }]}>
            Premium license upgrade in progress.{'\n'}This will work automatically once activated.
          </Text>
          <TouchableOpacity onPress={reset}>
            <Text style={[styles.resetText, { color: colors.mutedForeground }]}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.phase === 'no_preview' && (
        <View style={[styles.studyNotice, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="alert-circle" size={16} color={colors.mutedForeground} />
          <Text style={[styles.studyNoticeText, { color: colors.foreground }]}>
            No preview audio found for this track on Deezer.
          </Text>
          <TouchableOpacity onPress={reset}>
            <Text style={[styles.resetText, { color: colors.mutedForeground }]}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.phase === 'error' && (
        <View style={[styles.studyNotice, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="alert-triangle" size={16} color={colors.mutedForeground} />
          <Text style={[styles.studyNoticeText, { color: colors.foreground }]} numberOfLines={3}>
            {state.message}
          </Text>
          <TouchableOpacity onPress={reset}>
            <Text style={[styles.resetText, { color: colors.mutedForeground }]}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={[styles.studyAttr, { color: colors.mutedForeground }]}>
        Powered by LALAL.AI · Preview via Deezer
      </Text>
    </View>
  );
}

const MOOD_COLORS: Record<string, string> = {
  aggressive: '#DC2626', energetic: '#EA580C', happy: '#D97706',
  romantic: '#DB2777', sad: '#2563EB', relaxed: '#059669',
  dark: '#7C3AED', ethereal: '#0891B2', melancholic: '#6366F1',
  uplifting: '#16A34A', epic: '#9A3412', mysterious: '#6D28D9',
};

const ENERGY_LEVELS: Record<string, number> = {
  low: 0.25, medium: 0.6, high: 0.9,
};

type VibeState =
  | { phase: 'loading' }
  | { phase: 'ready'; analysis: CyaniteAnalysis }
  | { phase: 'unavailable' };

function SimilarSongsSection({
  songId,
  colors,
}: {
  songId: string;
  colors: ReturnType<typeof useColors>;
}) {
  const { data: similar } = useSimilarSongs(songId, 4);
  if (!similar || similar.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'serif' }]}>
        Sounds Like
      </Text>
      {similar.map(({ song, sharedTags }: SimilarSong) => (
        <TouchableOpacity
          key={song.id}
          onPress={() => router.push(`/song/${song.id}`)}
          style={[styles.similarCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.similarInfo}>
            <Text style={[styles.similarTitle, { color: colors.foreground }]} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={[styles.similarArtist, { color: colors.mutedForeground }]} numberOfLines={1}>
              {song.artist} · {song.year}
            </Text>
            {sharedTags.length > 0 && (
              <View style={styles.similarTags}>
                {sharedTags.map((t) => (
                  <View key={t} style={[styles.similarTag, { backgroundColor: colors.primary + '18', borderColor: colors.primary + '40' }]}>
                    <Text style={[styles.similarTagText, { color: colors.primary }]}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CyaniteCard({ songId, colors }: { songId: string; colors: ReturnType<typeof useColors> }) {
  const [state, setState] = useState<VibeState>({ phase: 'loading' });

  useEffect(() => {
    peekCyaniteCache(songId).then((analysis) => {
      setState(analysis ? { phase: 'ready', analysis } : { phase: 'unavailable' });
    });
  }, [songId]);

  if (state.phase === 'loading' || state.phase === 'unavailable') return null;

  const a = state.analysis;
  const energyFill = ENERGY_LEVELS[a.energyLevel.toLowerCase()] ?? 0.5;
  const topMoods = a.moodTags.slice(0, 5);
  const topGenres = a.genreTags.slice(0, 3);
  const advancedMoods = (a.moodAdvancedTags ?? []).slice(0, 5);
  const characterVibes = [...(a.movementTags ?? []), ...(a.characterTags ?? [])].slice(0, 5);
  const hasDrums = a.instrumentTags.some((t) =>
    t.toLowerCase().includes('drum') || t.toLowerCase().includes('percuss')
  );

  return (
    <View style={[styles.studySection, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.studyHeader2}>
        <Text style={styles.drumEmoji}>🎛</Text>
        <View style={styles.studyTitleWrap}>
          <Text style={[styles.studySectionTitle, { color: colors.foreground }]}>Vibe Analysis</Text>
          <Text style={[styles.studySectionSub, { color: colors.mutedForeground }]}>
            AI audio fingerprint via Cyanite
          </Text>
        </View>
      </View>

      <View style={styles.vibeResult}>
        {a.transformerCaption ? (
          <Text style={[styles.vibeCaption, { color: colors.foreground, borderColor: colors.border }]}>
            "{a.transformerCaption}"
          </Text>
        ) : null}

        {topMoods.length > 0 && (
          <View style={styles.vibeRow}>
            {topMoods.map((m) => (
              <View key={m} style={[styles.moodChip, { backgroundColor: (MOOD_COLORS[m.toLowerCase()] ?? colors.primary) + '22', borderColor: (MOOD_COLORS[m.toLowerCase()] ?? colors.primary) + '66' }]}>
                <Text style={[styles.moodChipText, { color: MOOD_COLORS[m.toLowerCase()] ?? colors.primary }]}>
                  {m}
                </Text>
              </View>
            ))}
            {hasDrums && (
              <View style={[styles.moodChip, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '66' }]}>
                <Text style={[styles.moodChipText, { color: colors.primary }]}>🥁 drums</Text>
              </View>
            )}
          </View>
        )}

        {advancedMoods.length > 0 && (
          <View style={[styles.vibeRow, { marginTop: -2 }]}>
            {advancedMoods.map((m) => (
              <View key={m} style={[styles.vibeTag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.vibeTagText, { color: colors.mutedForeground }]}>{m}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.vibeGrid, { borderColor: colors.border }]}>
          <View style={styles.vibeGridLabels}>
            <Text style={[styles.vibeGridLabel, { color: colors.mutedForeground }]}>INTENSE</Text>
            <Text style={[styles.vibeGridLabel, { color: colors.mutedForeground }]}>HAPPY</Text>
          </View>
          <View style={[styles.vibeGridInner, { borderColor: colors.border + '80' }]}>
            <View style={[StyleSheet.absoluteFillObject, styles.vibeGridHLine, { borderColor: colors.border + '60' }]} />
            <View style={[StyleSheet.absoluteFillObject, styles.vibeGridVLine, { borderColor: colors.border + '60' }]} />
            <View style={[styles.vibeGridDot, {
              backgroundColor: colors.primary,
              left: `${Math.round(a.valence * 100)}%` as unknown as number,
              top: `${Math.round((1 - a.arousal) * 100)}%` as unknown as number,
            }]} />
          </View>
          <View style={styles.vibeGridLabels}>
            <Text style={[styles.vibeGridLabel, { color: colors.mutedForeground }]}>DARK</Text>
            <Text style={[styles.vibeGridLabel, { color: colors.mutedForeground }]}>CALM</Text>
          </View>
        </View>

        <View style={styles.vibeStatRow}>
          <View style={styles.vibeStat}>
            <Text style={[styles.vibeStatLabel, { color: colors.mutedForeground }]}>ENERGY</Text>
            <View style={[styles.vibeBarTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.vibeBarFill, { backgroundColor: colors.primary, width: `${Math.round(energyFill * 100)}%` as unknown as number }]} />
            </View>
            <Text style={[styles.vibeStatVal, { color: colors.foreground }]}>{a.energyLevel || '—'}</Text>
          </View>
          {a.bpm > 0 && (
            <View style={styles.vibeStat}>
              <Text style={[styles.vibeStatLabel, { color: colors.mutedForeground }]}>BPM</Text>
              <Text style={[styles.vibeBpmVal, { color: colors.primary }]}>{a.bpm}</Text>
            </View>
          )}
          {a.timeSignature ? (
            <View style={styles.vibeStat}>
              <Text style={[styles.vibeStatLabel, { color: colors.mutedForeground }]}>TIME SIG</Text>
              <Text style={[styles.vibeBpmVal, { color: colors.primary }]}>{a.timeSignature}</Text>
            </View>
          ) : null}
        </View>

        {(topGenres.length > 0 || a.musicalEraTag || a.freeGenreTags) && (
          <View style={styles.vibeRow}>
            {topGenres.map((g) => (
              <View key={g} style={[styles.vibeTag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.vibeTagText, { color: colors.foreground }]}>{g}</Text>
              </View>
            ))}
            {a.musicalEraTag ? (
              <View style={[styles.vibeTag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.vibeTagText, { color: colors.foreground }]}>{a.musicalEraTag}</Text>
              </View>
            ) : null}
          </View>
        )}

        {a.freeGenreTags ? (
          <Text style={[styles.vibeFreeGenre, { color: colors.mutedForeground }]}>
            {a.freeGenreTags}
          </Text>
        ) : null}

        {characterVibes.length > 0 && (
          <View style={styles.vibeRow}>
            {characterVibes.map((v) => (
              <View key={v} style={[styles.vibeTag, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.vibeTagText, { color: colors.mutedForeground }]}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={[styles.studyAttr, { color: colors.mutedForeground }]}>
          Powered by Cyanite · Preview via Deezer
        </Text>
      </View>
    </View>
  );
}

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const { data: song, isLoading } = useSong(id ?? '');

  if (isLoading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  const goBack = () => router.canGoBack() ? router.back() : router.replace('/(tabs)' as never);

  if (!song) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={goBack} style={styles.backBtnAlone}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={{ color: colors.foreground, padding: 20 }}>Song not found</Text>
      </View>
    );
  }

  const drummer = song.drummer ?? null;
  const complexityIdx = Math.max(0, Math.min(4, song.complexity - 1));
  const complexityColor = COMPLEXITY_COLORS[complexityIdx]!;
  const complexityLabel = COMPLEXITY_LABELS[complexityIdx]!;

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
          { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 40 },
        ]}
      >
        <View
          style={[
            styles.hero,
            { paddingTop: insets.top + webTopPad + 16, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={goBack} style={styles.backBtn} testID="back-button">
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground, fontFamily: Fonts.display }]}>{song.title}</Text>
          <Text style={[styles.artist, { color: colors.primary, fontFamily: Fonts.labelRegular }]}>{song.artist}</Text>
          <Text style={[styles.year, { color: colors.mutedForeground }]}>{song.year}</Text>
          <View style={styles.tags}>
            <TouchableOpacity
              onPress={() => router.push(`/era/${song.eraId}`)}
              style={[styles.tag, { backgroundColor: colors.primary + '25', borderColor: colors.primary }]}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>{song.eraId}</Text>
            </TouchableOpacity>
            {song.genreIds.map((gid) => (
              <TouchableOpacity
                key={gid}
                onPress={() => router.push(`/genre/${gid}`)}
                style={[styles.tag, { backgroundColor: colors.muted, borderColor: colors.border }]}
              >
                <Text style={[styles.tagText, { color: colors.foreground }]}>{gid}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary, fontFamily: 'serif' }]}>{song.tempo}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>BPM</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <View style={styles.complexityDots}>
              {dots.map((filled, i) => (
                <View key={i} style={[styles.complexityDot, { backgroundColor: filled ? complexityColor : colors.border }]} />
              ))}
            </View>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{complexityLabel}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={[styles.stat, { flex: 2 }]}>
            <Text style={[styles.feelText, { color: colors.foreground }]} numberOfLines={2}>{song.feel}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Feel</Text>
          </View>
        </View>

        {drummer && (
          <TouchableOpacity
            onPress={() => router.push(`/drummer/${drummer.id}`)}
            style={[styles.drummerRow, { borderLeftColor: colors.primary, borderBottomColor: colors.border }]}
          >
            {drummer.photoUrl ? (
              <Image
                source={{ uri: drummer.photoUrl }}
                style={styles.drummerAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.drummerAvatar, { backgroundColor: colors.primary + '30' }]}>
                <Text style={[styles.drummerInitials, { color: colors.primary }]}>
                  {drummer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
            )}
            <View style={styles.drummerInfo}>
              <Text style={[styles.drummerLabel, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>DRUMMED BY</Text>
              <Text style={[styles.drummerName, { color: colors.foreground, fontFamily: Fonts.serif }]}>{drummer.name}</Text>
              <Text style={[styles.drummerBand, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]} numberOfLines={1}>
                {drummer.bands[0]}
              </Text>
            </View>
            <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>The Groove</Text>
          <Text style={[styles.body, { color: colors.foreground }]}>{song.description}</Text>
        </View>

        {song.trackMeta && <TrackMetaCard meta={song.trackMeta} songTitle={song.title} colors={colors} />}

        {id && <DrumStudySection songId={id} colors={colors} />}
        {id && <CyaniteCard songId={id} colors={colors} />}
        {id && <SimilarSongsSection songId={id} colors={colors} />}

        <View style={[styles.whyDivider, { backgroundColor: colors.border }]} />
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: Fonts.serif }]}>Why Study This</Text>
          <Text style={[styles.body, { color: colors.foreground }]}>{song.whyStudy}</Text>
        </View>

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
  loader: { marginTop: 100 },
  backBtnAlone: { margin: 20, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hero: { paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, gap: 4 },
  backBtn: { marginBottom: 12, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 38, lineHeight: 40 },
  artist: { fontSize: 14, marginTop: 2 },
  year: { fontSize: 13 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1 },
  statDivider: { width: 1, height: 36, marginHorizontal: 8 },
  complexityDots: { flexDirection: 'row', gap: 4 },
  complexityDot: { width: 10, height: 10, borderRadius: 5 },
  feelText: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  drummerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16,
    borderLeftWidth: 3, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  drummerAvatar: { width: 40, height: 40, borderRadius: 20 },
  drummerInitials: { fontSize: 13, fontWeight: '700', textAlign: 'center', width: 40, lineHeight: 40 },
  drummerInfo: { flex: 1, gap: 2 },
  drummerLabel: { fontSize: 9, letterSpacing: 2 },
  drummerName: { fontSize: 16 },
  drummerBand: { fontSize: 12 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 22, marginBottom: 10 },
  whyDivider: { height: StyleSheet.hairlineWidth, marginHorizontal: 20, marginTop: 8 },
  body: { fontSize: 15, lineHeight: 23 },
  metaCard: { marginHorizontal: 20, marginTop: 20, padding: 16, borderRadius: 10, borderWidth: 1, gap: 12 },
  metaHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTitle: { fontSize: 13, fontWeight: '700', flex: 1 },
  metaSource: { fontSize: 10, letterSpacing: 0.5 },
  metaAlbumRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  metaAlbum: { fontSize: 15, fontWeight: '600', flex: 1, fontStyle: 'italic' },
  metaStatsRow: { flexDirection: 'row', gap: 20 },
  metaStat: { alignItems: 'center', gap: 3 },
  metaStatValue: { fontSize: 16, fontWeight: '700' },
  metaStatLabel: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  metaGenreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaGenreTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  metaGenreText: { fontSize: 11, fontWeight: '600' },
  spotifyBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth, marginTop: 4 },
  spotifyBtnText: { fontSize: 12 },
  studySection: { marginHorizontal: 20, marginTop: 20, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  studyHeader2: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingBottom: 12 },
  drumEmoji: { fontSize: 28 },
  studyTitleWrap: { flex: 1 },
  studySectionTitle: { fontSize: 15, fontWeight: '700' },
  studySectionSub: { fontSize: 12, marginTop: 2 },
  studyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 16, paddingVertical: 12, borderRadius: 8 },
  studyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  studyLoading: { alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  studyLoadingText: { fontSize: 13, fontWeight: '500' },
  studyLoadingHint: { fontSize: 11, textAlign: 'center' },
  studyResult: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  studyResultNote: { fontSize: 11, fontStyle: 'italic', marginBottom: 4 },
  stemPlayer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, borderWidth: 1 },
  stemIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stemInfo: { flex: 1 },
  stemLabel: { fontSize: 14, fontWeight: '600' },
  stemHint: { fontSize: 11, marginTop: 2 },
  resetBtn: { alignItems: 'center', paddingVertical: 4 },
  resetText: { fontSize: 12 },
  studyNotice: { flexDirection: 'column', gap: 8, margin: 16, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  studyNoticeText: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  studyAttr: { fontSize: 10, textAlign: 'center', paddingBottom: 12, letterSpacing: 0.3 },
  vibeResult: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  vibeCaption: { fontSize: 13, fontStyle: 'italic', lineHeight: 20, borderLeftWidth: 3, paddingLeft: 10 },
  vibeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moodChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  moodChipText: { fontSize: 12, fontWeight: '600' },
  vibeGrid: { borderRadius: 8, borderWidth: 1, overflow: 'hidden', gap: 2 },
  vibeGridLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6, paddingVertical: 3 },
  vibeGridLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  vibeGridInner: { height: 120, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, position: 'relative' },
  vibeGridHLine: { top: '50%', height: StyleSheet.hairlineWidth, borderTopWidth: StyleSheet.hairlineWidth },
  vibeGridVLine: { left: '50%', width: StyleSheet.hairlineWidth, borderLeftWidth: StyleSheet.hairlineWidth },
  vibeGridDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, marginLeft: -6, marginTop: -6 },
  vibeStatRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-end' },
  vibeStat: { flex: 1, gap: 4 },
  vibeStatLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  vibeStatVal: { fontSize: 11, fontWeight: '600' },
  vibeBpmVal: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  vibeBarTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  vibeBarFill: { height: 6, borderRadius: 3 },
  vibeTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  vibeTagText: { fontSize: 11, fontWeight: '600' },
  vibeFreeGenre: { fontSize: 11, fontStyle: 'italic', marginTop: 2, marginBottom: 4 },
  similarCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8, gap: 10 },
  similarInfo: { flex: 1, gap: 3 },
  similarTitle: { fontSize: 14, fontWeight: '600' },
  similarArtist: { fontSize: 12 },
  similarTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  similarTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, borderWidth: 1 },
  similarTagText: { fontSize: 10, fontWeight: '600' },
  studyBox: { marginHorizontal: 20, marginTop: 20, padding: 16, borderRadius: 10, borderWidth: 1, gap: 10 },
  studyHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  studyTitle: { fontSize: 14, fontWeight: '700' },
  tabsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 14, borderRadius: 10 },
  tabsBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
