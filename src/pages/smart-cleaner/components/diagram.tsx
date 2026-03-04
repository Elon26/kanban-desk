import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

type Segment = {
  value: number;
  color: string;
  isSelected: boolean;
  totalSize: number;
};

type Props = {
  segmentsToSet: Segment[];
  selectedSizeLabelOrder: string;
  selectedSizeLabelIntegers: string;
  selectedSizeLabelHundredths: string;
  radiusOuter: number;
  radiusInner: number;
  size: number;
};

function SemiCircleChart({
  segmentsToSet,
  selectedSizeLabelOrder,
  selectedSizeLabelIntegers,
  selectedSizeLabelHundredths,
  radiusOuter,
  radiusInner,
  size,
}: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const segments: Segment[] = [];

  segmentsToSet.forEach((segment) => {
    if (segment.value > 0) segments.push(segment);
  });

  const width = size;
  const height = size / 2;
  const cx = width / 2;
  const cy = height;
  const radius = radiusOuter;
  const innerRadius = radiusInner; // радиус прозрачной области (вырез)

  const total = segments.reduce((acc, seg) => acc + seg.value, 0);

  // Расчёт углов сегментов с отступами (например, по 2 градуса отступ между сегментами)
  const gap = ((2 * Math.PI) / 180) * 0.5; // 0.5 градуса в радианах
  const totalGap = gap * segments.length;
  const effectiveAngle = Math.PI - totalGap; // полукруг минус все отступы

  let startAngle = Math.PI; // Начинаем слева (180°)

  // Функция для построения дуги с внутренним радиусом (кольцо)
  const createRingArc = (
    cx: number,
    cy: number,
    outerR: number,
    innerR: number,
    startAngle: number,
    endAngle: number
  ) => {
    const startOuter = {
      x: cx + outerR * Math.cos(startAngle),
      y: cy + outerR * Math.sin(startAngle),
    };
    const endOuter = {
      x: cx + outerR * Math.cos(endAngle),
      y: cy + outerR * Math.sin(endAngle),
    };
    const startInner = {
      x: cx + innerR * Math.cos(endAngle),
      y: cy + innerR * Math.sin(endAngle),
    };
    const endInner = {
      x: cx + innerR * Math.cos(startAngle),
      y: cy + innerR * Math.sin(startAngle),
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
      L ${startInner.x} ${startInner.y}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}
      Z
    `;
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={width} height={height}>
        {segments.map((seg, i) => {
          const angle = (seg.value / total) * effectiveAngle;
          const path = createRingArc(
            cx,
            cy,
            radius,
            innerRadius,
            startAngle,
            startAngle + angle
          );
          startAngle += angle + gap;
          if (i < segments.length - 1) {
            startAngle += gap;
          }

          return (
            <Path
              key={i}
              d={path}
              fill={seg.color}
              opacity={seg.isSelected ? 1 : 0.1}
            />
          );
        })}
      </Svg>
      <View className="absolute left-[30%] top-[65%]">
        <UiText className="color-gray">
          {langs[selectedLang].pages.smart_cleaner.selected}
        </UiText>
        <View className="flex-row items-end">
          <UiText className="text-3xl font-light">
            {selectedSizeLabelOrder}
          </UiText>
          <UiText className="text-3xl font-semibold pl-1">
            {selectedSizeLabelIntegers},
          </UiText>
          <UiText className="text-2xl font-medium pb-[1.5px]">
            {selectedSizeLabelHundredths}
          </UiText>
        </View>
      </View>
    </View>
  );
}

export default SemiCircleChart;
