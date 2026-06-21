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
import { Fonts } from '@/constants/typography';

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
        renderItem={({ item: era }) => (
          <View style={[styles.page, { width: SCREEN_WIDTH }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onExploreEra(era);
              }}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  shadowColor: era.color,
                },
              ]}
            >
              <View style={[styles.colorBar, { backgroundColor: era.color }]} />
              <View style={styles.cardBody}>
                <View style={styles.topRow}>
                  <View style={styles.titleBlock}>
                    <Text style={[styles.eraName, { color: era.color, fontFamily: Fonts.display }]}>
                      {era.name}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
                      {era.subtitle}
                    </Text>
                  </View>
                  <View style={styles.metaRight}>
                    <Text style={[styles.years, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
                      {era.years}
                    </Text>
                    <Text style={[styles.stats, { color: colors.mutedForeground, fontFamily: Fonts.labelRegular }]}>
                      {era.keyDrummerIds.length} drummers
                    </Text>
                    <View style={[styles.exploreBtn, { borderColor: era.color }]}>
                      <Text style={[styles.exploreBtnText, { color: era.color, fontFamily: Fonts.label }]}>
                        EXPLORE
                      </Text>
                      <Feather name="arrow-right" size={11} color={era.color} />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
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
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  metaRight: {
    alignItems: 'flex-end',
    gap: 6,
    paddingBottom: 2,
  },
  eraName: {
    fontSize: 52,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  years: {
    fontSize: 12,
  },
  stats: {
    fontSize: 11,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 2,
  },
  exploreBtnText: {
    fontSize: 10,
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
