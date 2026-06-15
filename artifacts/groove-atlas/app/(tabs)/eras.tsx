import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import EraCard from '@/components/EraCard';
import { Era, ERAS } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

export default function ErasScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webTopPad = Platform.OS === 'web' ? 67 : 0;

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
          Eras
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Eight decades of drum history
        </Text>
      </View>

      <FlatList
        data={ERAS}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        renderItem={({ item }) => (
          <EraCard
            era={item}
            onPress={(era: Era) => router.push(`/era/${era.id}`)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === 'web' ? 34 : 0) + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
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
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 0,
  },
  list: {
    paddingTop: 16,
  },
});
