import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  fetchDrummerStats,
  formatCount,
  isSongstatsError,
  type SongstatsStats,
  type SongstatsError,
} from '@/lib/songstats-client';
import { useColors } from '@/hooks/useColors';

interface Props {
  drummerId: string;
}

export default function SongstatsCard({ drummerId }: Props) {
  const colors = useColors();
  const [stats, setStats] = useState<SongstatsStats | null>(null);
  const [error, setError] = useState<SongstatsError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setStats(null);
    setError(null);
    fetchDrummerStats(drummerId).then((result) => {
      if (cancelled) return;
      if (isSongstatsError(result)) {
        setError(result);
      } else {
        setStats(result);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [drummerId]);

  const openSongstats = async () => {
    if (!stats?.songstatsUrl) return;
    await WebBrowser.openBrowserAsync(stats.songstatsUrl);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="bar-chart-2" size={14} color={colors.primary} />
          <Text style={[styles.title, { color: colors.primary }]}>Streaming Today</Text>
        </View>
        <Text style={[styles.source, { color: colors.mutedForeground }]}>via Songstats</Text>
      </View>

      {loading && (
        <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
      )}

      {!loading && error && (
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          {error.code === 'NOT_CONFIGURED'
            ? 'Stats unavailable'
            : error.code === 'NOT_FOUND' || error.code === 'NO_BAND'
            ? 'No streaming data found'
            : 'Could not load stats'}
        </Text>
      )}

      {!loading && stats && (
        <>
          <TouchableOpacity onPress={openSongstats} style={styles.bandRow} activeOpacity={0.7}>
            <Text style={[styles.bandName, { color: colors.foreground }]} numberOfLines={1}>
              {stats.name}
            </Text>
            <Feather name="external-link" size={12} color={colors.mutedForeground} />
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {formatCount(stats.monthlyListeners)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Monthly</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Listeners</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {formatCount(stats.streamsTotal)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Streams</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {formatCount(stats.playlistsCurrent)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Active</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Playlists</Text>
            </View>
          </View>

          {stats.popularityCurrent !== null && (
            <View style={styles.popularityRow}>
              <Text style={[styles.popularityLabel, { color: colors.mutedForeground }]}>
                Spotify Popularity
              </Text>
              <View style={[styles.popularityTrack, { backgroundColor: colors.muted }]}>
                <View
                  style={[
                    styles.popularityFill,
                    { backgroundColor: colors.primary, width: `${stats.popularityCurrent}%` as any },
                  ]}
                />
              </View>
              <Text style={[styles.popularityValue, { color: colors.primary }]}>
                {stats.popularityCurrent}/100
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  source: {
    fontSize: 11,
  },
  loader: {
    marginVertical: 8,
  },
  errorText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bandName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 13,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  popularityRow: {
    gap: 6,
  },
  popularityLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  popularityTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  popularityFill: {
    height: '100%',
    borderRadius: 3,
  },
  popularityValue: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
});
