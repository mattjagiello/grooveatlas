import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { Era } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  eras: Era[];
  selectedEraId: string;
  onSelectEra: (era: Era) => void;
  onExploreEra: (era: Era) => void;
};

export default function EraHeroCarousel({ eras, selectedEraId, onSelectEra, onExploreEra }: Props) {
  const colors = useColors();
  const flatListRef = useRef<FlatList<Era>>(null);

  const onSelectEraRef = useRef(onSelectEra);
  onSelectEraRef.current = onSelectEra;
  const selectedEraIdRef = useRef(selectedEraId);
  selectedEraIdRef.current = selectedEraId;

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const era = viewableItems[0].item as Era;
        if (era.id !== selectedEraIdRef.current) {
          Haptics.selectionAsync();
          onSelectEraRef.current(era);
        }
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 51 }).current;

  const scrollToEra = (era: Era) => {
    const idx = eras.findIndex((e) => e.id === era.id);
    if (idx !== -1) {
      flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      onSelectEra(era);
    }
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={eras}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item: era }) => {
          const isSelected = era.id === selectedEraId;
          return (
            <View style={[styles.page, { width: SCREEN_WIDTH }]}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderLeftColor: era.color,
                    shadowColor: era.color,
                  },
                ]}
              >
                <View style={[styles.colorBar, { backgroundColor: era.color }]} />
                <View style={styles.cardBody}>
                  <View style={styles.topRow}>
                    <View style={styles.titleBlock}>
                      <Text
                        style={[
                          styles.eraName,
                          { color: era.color, fontFamily: 'serif' },
                        ]}
                      >
                        {era.name}
                      </Text>
                      <Text style={[styles.years, { color: colors.mutedForeground }]}>
                        {era.years}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.subtitleBadge,
                        { backgroundColor: era.color + '18', borderColor: era.color + '40' },
                      ]}
                    >
                      <Text style={[styles.subtitleText, { color: era.color }]}>
                        {era.subtitle}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[styles.description, { color: colors.mutedForeground }]}
                    numberOfLines={3}
                  >
                    {era.description}
                  </Text>

                  <View style={styles.chips}>
                    {era.characteristics.slice(0, 3).map((c, i) => (
                      <View key={i} style={[styles.chip, { backgroundColor: colors.muted }]}>
                        <Text style={[styles.chipText, { color: colors.mutedForeground }]}>
                          {c}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.footer}>
                    <Text style={[styles.stats, { color: colors.mutedForeground }]}>
                      {era.keyDrummerIds.length} drummers · {era.iconicSongIds.length} recordings
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onExploreEra(era);
                      }}
                      style={[styles.exploreBtn, { borderColor: era.color }]}
                    >
                      <Text style={[styles.exploreBtnText, { color: era.color }]}>
                        Explore
                      </Text>
                      <Feather name="arrow-right" size={12} color={era.color} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.dots}>
        {eras.map((era) => {
          const isActive = era.id === selectedEraId;
          return (
            <TouchableOpacity
              key={era.id}
              onPress={() => scrollToEra(era)}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive ? era.color : colors.border,
                    width: isActive ? 16 : 7,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  colorBar: {
    width: 5,
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleBlock: {
    flex: 1,
  },
  eraName: {
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 44,
  },
  years: {
    fontSize: 12,
    marginTop: 2,
  },
  subtitleBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: 130,
    alignSelf: 'flex-start',
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    fontSize: 12,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  exploreBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
});
