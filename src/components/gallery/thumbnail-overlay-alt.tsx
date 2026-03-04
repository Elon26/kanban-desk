import type { ThumbnailOverlayComponentProps } from 'expo-simple-gallery';

import { Checkbox } from '@/ui/checkbox';

export function ThumbnailOverlayComponent({
  selected,
}: ThumbnailOverlayComponentProps) {
  return (
    <Checkbox
      checked={selected}
      className="pointer-events-none absolute m-1 right-3 top-0"
    />
  );
}
