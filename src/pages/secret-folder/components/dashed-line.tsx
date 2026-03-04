import React from 'react';
import { View } from 'react-native';

export function DashedLine({
  dashLength = 4,
  dashGap = 4,
  dashCount = 50,
  color = 'rgba(255,255,255,0.1)',
  height = 1,
}) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: dashCount }).map((_, i) => (
        <View
          key={i}
          style={{
            width: dashLength,
            height,
            backgroundColor: color,
            marginRight: i !== dashCount - 1 ? dashGap : 0,
          }}
        />
      ))}
    </View>
  );
}
