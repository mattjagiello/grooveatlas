import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useGenres } from '@/hooks/useGql';
import GenreCard from '@/components/GenreCard';
import { Genre } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function GenresScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

  const { data: genres = [], isLoading } = useGenres();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
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
          Genres
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Where the grooves came from
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={genres as Genre[]}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <GenreCard
              genre={item}
              onPress={(genre: Genre) => router.push(`/genre/${genre.id}`)}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: 1 },
  subtitle: { fontSize: 13, marginTop: 2 },
  list: { paddingTop: 16, paddingHorizontal: 16 },
  row: { gap: 10, marginBottom: 10 },
  loader: { marginTop: 60 },
});
