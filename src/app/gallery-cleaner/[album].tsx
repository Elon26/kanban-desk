import { useLocalSearchParams } from 'expo-router';

import {
  GalleryCleaner,
  type GalleryCleanerProps,
} from '@/pages/gallery-cleaner';

export default function GalleryCleanerAlbumScreen() {
  const { album, buttonPressAction } =
    useLocalSearchParams() as GalleryCleanerProps;
  return <GalleryCleaner album={album} buttonPressAction={buttonPressAction} />;
}
