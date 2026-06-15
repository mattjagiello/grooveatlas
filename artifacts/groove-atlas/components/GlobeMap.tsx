import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
} from 'react-native-svg';
import { Genre } from '@/constants/data';

const GLOBE_SIZE = 280;
const CX = 140;
const CY = 140;
const RADIUS = 128;

function lngToX(lng: number) {
  return ((lng + 180) / 360) * GLOBE_SIZE;
}

function latToY(lat: number) {
  return ((90 - lat) / 180) * GLOBE_SIZE;
}

type PulsingDotProps = {
  x: number;
  y: number;
  color: string;
  onPress?: () => void;
};

function PulsingDot({ x, y, color, onPress }: PulsingDotProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.dotContainer, { left: x - 10, top: y - 10 }]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={[
          styles.ring,
          {
            backgroundColor: color,
            transform: [{ scale: ringScale }],
            opacity: ringOpacity,
          },
        ]}
      />
      <View style={[styles.dot, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
}

const GRID_LATS = [-60, -30, 0, 30, 60];
const GRID_LNGS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

const CONTINENTS = [
  { cx: 62, cy: 72, rx: 30, ry: 20 },
  { cx: 93, cy: 165, rx: 17, ry: 26 },
  { cx: 151, cy: 57, rx: 17, ry: 18 },
  { cx: 153, cy: 137, rx: 21, ry: 52 },
  { cx: 213, cy: 66, rx: 52, ry: 44 },
  { cx: 243, cy: 177, rx: 16, ry: 20 },
  { cx: 108, cy: 27, rx: 11, ry: 9 },
];

type GlobeMapProps = {
  genres: Genre[];
  onGenrePress?: (genre: Genre) => void;
};

export default function GlobeMap({ genres, onGenrePress }: GlobeMapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.globeWrapper}>
        <Svg width={GLOBE_SIZE} height={GLOBE_SIZE} viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`}>
          <Defs>
            <ClipPath id="globe">
              <Circle cx={CX} cy={CY} r={RADIUS} />
            </ClipPath>
          </Defs>

          <G clipPath="url(#globe)">
            {/* Ocean */}
            <Circle cx={CX} cy={CY} r={RADIUS} fill="#B8A878" />

            {/* Grid lines — latitude */}
            {GRID_LATS.map((lat) => (
              <Line
                key={`lat-${lat}`}
                x1={0}
                y1={latToY(lat)}
                x2={GLOBE_SIZE}
                y2={latToY(lat)}
                stroke="#8B6914"
                strokeWidth={0.4}
                opacity={0.4}
              />
            ))}

            {/* Grid lines — longitude */}
            {GRID_LNGS.map((lng) => (
              <Line
                key={`lng-${lng}`}
                x1={lngToX(lng)}
                y1={0}
                x2={lngToX(lng)}
                y2={GLOBE_SIZE}
                stroke="#8B6914"
                strokeWidth={0.4}
                opacity={0.4}
              />
            ))}

            {/* Continents */}
            {CONTINENTS.map((c, i) => (
              <Ellipse
                key={i}
                cx={c.cx}
                cy={c.cy}
                rx={c.rx}
                ry={c.ry}
                fill="#7A6235"
                opacity={0.85}
              />
            ))}

            {/* Equator highlight */}
            <Line
              x1={0}
              y1={CY}
              x2={GLOBE_SIZE}
              y2={CY}
              stroke="#8B6914"
              strokeWidth={0.8}
              opacity={0.6}
            />
          </G>

          {/* Globe border */}
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="#8B6914"
            strokeWidth={2}
          />
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS + 4}
            fill="none"
            stroke="#8B6914"
            strokeWidth={0.5}
            opacity={0.3}
          />
          <Circle
            cx={CX}
            cy={CY}
            r={RADIUS + 8}
            fill="none"
            stroke="#8B6914"
            strokeWidth={0.5}
            opacity={0.15}
          />
        </Svg>

        {/* Pulsing origin dots — overlaid as Views */}
        {genres
          .filter((g) => {
            const x = lngToX(g.lng);
            const y = latToY(g.lat);
            const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2);
            return dist <= RADIUS;
          })
          .map((genre) => (
            <PulsingDot
              key={genre.id}
              x={lngToX(genre.lng)}
              y={latToY(genre.lat)}
              color={genre.color}
              onPress={() => onGenrePress?.(genre)}
            />
          ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {genres.slice(0, 5).map((g) => (
          <TouchableOpacity
            key={g.id}
            style={styles.legendItem}
            onPress={() => onGenrePress?.(g)}
          >
            <View style={[styles.legendDot, { backgroundColor: g.color }]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  globeWrapper: {
    width: GLOBE_SIZE,
    height: GLOBE_SIZE,
    borderRadius: GLOBE_SIZE / 2,
    overflow: 'hidden',
    position: 'relative',
  },
  dotContainer: {
    position: 'absolute',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
