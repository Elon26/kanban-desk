import type { ThumbnailOverlayComponentProps } from 'expo-simple-gallery';
import { useAtomValue } from 'jotai';

import { selectionModeAtom } from '@/components/gallery/atom';
import { Checkbox } from '@/ui/checkbox';

export function ThumbnailOverlayComponent({
  selected,
}: ThumbnailOverlayComponentProps) {
  const selectionMode = useAtomValue(selectionModeAtom);

  return selectionMode ? (
    <Checkbox
      checked={selected}
      className="pointer-events-none absolute m-1 right-4 top-1"
    />
  ) : null;
}
