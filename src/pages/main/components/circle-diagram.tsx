import Svg, { Circle } from 'react-native-svg';

type Props = {
  size: number;
  numDots: number;
  dotRadius: number;
  percentage: number;
};

export default function CircleDiagram({
  size,
  numDots,
  dotRadius,
  percentage,
}: Props) {
  const radius = size / 2 - 10;

  const activeDots = Math.round((percentage / 100) * numDots);

  const dots = Array.from({ length: numDots }).map((_, i) => {
    const angle = (2 * Math.PI * i) / numDots - Math.PI / 2;
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    const fill = i < activeDots ? '#4DB2FF' : '#444';

    return <Circle key={i} cx={x} cy={y} r={dotRadius} fill={fill} />;
  });

  return (
    <Svg width={size} height={size}>
      {dots}
    </Svg>
  );
}
