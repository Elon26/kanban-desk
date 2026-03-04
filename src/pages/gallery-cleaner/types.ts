import langs from '@/i18n/langs.json';
import { getLocale } from '@/utils/get-locale';

export type GalleryFetchStatus =
  | 'unknown'
  | 'error'
  | 'fetching'
  | 'fetched'
  | 'blocked';

export const GalleryCleanerAvailableAlbums = [
  'screenshots',
  'selfies',
  'videos',
  'livePhotos',
  'blurryPhotos',
  'similarPhotos',
] as const;

export type GalleryCleanerAlbum =
  (typeof GalleryCleanerAvailableAlbums)[number];

export function isGalleryCleanerAlbum(
  value: unknown
): value is GalleryCleanerAlbum {
  return (
    typeof value === 'string' &&
    GalleryCleanerAvailableAlbums.includes(value as GalleryCleanerAlbum)
  );
}

export function isNestedArray<T>(value: unknown): value is T[][] {
  return Array.isArray(value) && Array.isArray(value[0]);
}

const selectedLang = getLocale();

export const AlbumName: Record<GalleryCleanerAlbum, string> = {
  blurryPhotos: langs[selectedLang].albums.blurry_photos,
  screenshots: langs[selectedLang].albums.screenshots,
  similarPhotos: langs[selectedLang].albums.similar_photos,
  selfies: langs[selectedLang].albums.selfies,
  videos: langs[selectedLang].albums.videos,
  livePhotos: langs[selectedLang].albums.live_photos,
};
