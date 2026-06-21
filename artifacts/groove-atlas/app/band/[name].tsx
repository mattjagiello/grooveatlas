import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDrummersByBand } from '@/hooks/useGql';
import DrummerCard from '@/components/DrummerCard';
import { Drummer } from '@/constants/data';
import { useColors } from '@/hooks/useColors';
import { Fonts } from '@/constants/typography';

export default function BandScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const bandName = name ? decodeURIComponent(name) : '';
  const { data: drummers, isLoading } = useDrummersByBand(bandName);

  const goBack = () => router.canGoBack() ? router.back() : router.replace('/(tabs)' as never);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.hero,
          {
            paddingTop: insets.top + webTopPad + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={goBack} style={styles.backBtn} testID="back-button">
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: Fonts.label }]}>BAND</Text>
        <Text style={[styles.heroName, { color: colors.foreground, fontFamily: Fonts.serif }]} numberOfLines={3}>
          {bandName}
        </Text>
        {!isLoading && drummers && (
          <Text style={[styles.subline, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
            {drummers.length === 1 ? '1 drummer' : `${drummers.length} drummers`} in this band
          </Text>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : !drummers || drummers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No drummers found for this band.</Text>
        </View>
      ) : (
        <FlatList
          data={drummers}
          keyExtractor={(d) => d.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 24 },
          ]}
          ItemSeparatorComponent={() => <View style={[styles.sep, { backgroundColor: colors.border }]} />}
          renderItem={({ item }) => (
            <DrummerCard
              drummer={item}
              onPress={(d: Drummer) => router.push(`/drummer/${d.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: {
    paddingHorizontal: 20, paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, gap: 4,
  },
  backBtn: { marginBottom: 12, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, letterSpacing: 2 },
  heroName: { fontSize: 36, lineHeight: 40 },
  subline: { fontSize: 13, marginTop: 2 },
  loader: { marginTop: 60 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  list: { padding: 16 },
  sep: { height: StyleSheet.hairlineWidth },
});
