import { requireNativeView } from 'expo';
import type * as React from 'react';

import type { DraggableCollectionViewProps } from './DraggableCollection.types';

const NativeView: React.ComponentType<DraggableCollectionViewProps> =
  requireNativeView('DraggableCollection');

export default function DraggableCollectionView(props: DraggableCollectionViewProps) {
  return <NativeView {...props} />;
}
