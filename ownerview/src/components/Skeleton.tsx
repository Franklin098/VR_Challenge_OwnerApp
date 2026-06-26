import { useEffect, useState } from 'react';
import { Animated, StyleSheet, type DimensionValue } from 'react-native';

import { color, radius } from '@/tokens';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
};

/** A softly pulsing placeholder block. Animates opacity only (GPU-friendly). */
export function Skeleton({ width = '100%', height = 16, borderRadius = radius.cardSmall }: SkeletonProps) {
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, { width, height, borderRadius, opacity }]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: color.surfaceInset,
  },
});
