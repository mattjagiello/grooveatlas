import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Era } from '@/constants/data';
import { useColors } from '@/hooks/useColors';

type DecadeTimelineProps = {
  eras: Era[];
  selectedEraId: string;
  onSelectEra: (era: Era) => void;
};

export default function DecadeTimeline({
  eras,
  selectedEraId,
  onSelectEra,
}: DecadeTimelineProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {eras.map((era, index) => {
        const isSelected = era.id === selectedEraId;
        return (
          <React.Fragment key={era.id}>
            {index > 0 && (
              <View style={[styles.connector, { backgroundColor: colors.border }]} />
            )}
            <TouchableOpacity
              onPress={() => onSelectEra(era)}
              style={[
                styles.item,
                {
                  backgroundColor: isSelected ? era.color : colors.muted,
                  borderColor: isSelected ? era.color : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.decade,
                  {
                    color: isSelected ? '#fff' : colors.mutedForeground,
                    fontFamily: 'serif',
                  },
                ]}
              >
                {era.name}
              </Text>
              {isSelected && (
                <View style={[styles.dot, { backgroundColor: '#fff' }]} />
              )}
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 0,
  },
  connector: {
    width: 20,
    height: 1,
    alignSelf: 'center',
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  decade: {
    fontSize: 13,
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
