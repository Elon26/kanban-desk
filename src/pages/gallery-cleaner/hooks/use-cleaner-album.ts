import { useQueries, useQuery } from '@tanstack/react-query';
import { Mutex } from 'async-mutex';
import AsyncStorage from 'expo-sqlite/kv-store';
import { useState } from 'react';

import { usePermissions } from '@/hooks/use-permissions';
import { useStorage } from '@/hooks/use-storage';
import { CameraRoll, type GalleryAsset } from '@/modules/cleaner-gallery';

import { cleanerQueryClient, QUERY_KEYS } from '../store/query-client';
import {
  type GalleryCleanerAlbum,
  GalleryCleanerAvailableAlbums,
} from '../types';

function useCleanerAlbumQueryEnabled() {
  const permissions = usePermissions();
  const [enabled, setEnabled] = useState(false);
  const checkPermission = async (enable: boolean) => {
    const { status } = await permissions.checkPermissionStatus(
      'ios.permission.PHOTO_LIBRARY'
    );
    if (status === 'granted') {
      enable && setEnabled(true);
    } else {
      setEnabled(false);
    }
  };
  return {
    enabled,
    checkPermission,
  };
}

export function useCleanerAlbum(name: GalleryCleanerAlbum) {
  const [isPhotosPermissionAsked, setIsPhotosPermissionAsked] = useStorage(
    'isPhotosPermissionAsked'
  );
  if (!isPhotosPermissionAsked) setIsPhotosPermissionAsked(true);
  const { enabled, checkPermission } = useCleanerAlbumQueryEnabled();
  const query = useQuery(
    {
      queryKey: [QUERY_KEYS.ALBUM, `albumName:${name}`],
      queryFn: () => fetchAlbum(name),
      enabled,
    },
    cleanerQueryClient
  );
  return {
    assets: query.data,
    isLoading: query.isFetching,
    checkPermissionAndFetch: () => checkPermission(true),
    refetch: query.refetch,
  };
}

export async function invalidateCleanerAlbums(names: GalleryCleanerAlbum[]) {
  return Promise.all(
    names.map((name) =>
      cleanerQueryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALBUM, `albumName:${name}`],
      })
    )
  );
}

export function useCleanerAlbums(
  albums: GalleryCleanerAlbum[] = GalleryCleanerAvailableAlbums as unknown as GalleryCleanerAlbum[]
) {
  const { enabled, checkPermission } = useCleanerAlbumQueryEnabled();
  const queries = useQueries(
    {
      queries: albums.map((name) => ({
        queryKey: [QUERY_KEYS.ALBUM, `albumName:${name}`],
        queryFn: () => fetchAlbum(name),
        enabled,
      })),
      combine: (data) => {
        const result = {} as Record<
          GalleryCleanerAlbum,
          {
            assets: GalleryAsset[] | GalleryAsset[][] | undefined;
            isLoading: boolean;
          }
        >;
        for (let i = 0; i < data.length; i++) {
          result[GalleryCleanerAvailableAlbums[i]] = {
            assets: data[i].data,
            isLoading: data[i].isFetching,
          };
        }
        return result;
      },
    },
    cleanerQueryClient
  );
  return {
    albums: queries,
    isLoading: Object.values(queries).some((x) => x.isLoading),
    checkPermissionAndFetch: () => checkPermission(true),
    checkPermissionOnly: () => checkPermission(false),
  };
}

const mutex = new Mutex();

export async function fetchAlbum(album: GalleryCleanerAlbum) {
  const release = await mutex.acquire();
  try {
    if (
      album === 'screenshots' ||
      album === 'selfies' ||
      album === 'videos' ||
      album === 'livePhotos'
    ) {
      const items = await CameraRoll.getAssets({
        collectionType: 'smartAlbum',
        collectionSubType: album,
        select: [
          'id',
          'createdAt',
          'name',
          'size',
          'uri',
          'width',
          'height',
          ...(album === 'videos' ? ['duration' as const] : []),
        ],
      });

      return items.map((x) => ({
        ...x,
        mediaType: album === 'videos' ? 'video' : 'image',
        ...(album === 'videos' && {
          duration: x.duration ?? 0,
        }),
      })) as GalleryAsset[];
    }

    if (album === 'similarPhotos') {
      const groups = await CameraRoll.findSimilarImages();
      return groups;
    }

    if (album === 'blurryPhotos') {
      const processedIdsStorageKey = '__processed_blurry_photos__';
      const processedIds: string[] = JSON.parse(
        (await AsyncStorage.getItem(processedIdsStorageKey)) ?? '[]'
      );

      const foundIdsStorageKey = '__found_blurry_photos__';
      const foundIds: string[] = JSON.parse(
        (await AsyncStorage.getItem(foundIdsStorageKey)) ?? '[]'
      );

      const prevResults = await CameraRoll.getAssets({
        mediaType: 'image',
        ids: foundIds,
        select: ['id', 'createdAt', 'name', 'size', 'uri'],
      });

      let newProcessedIds: string[] = [];
      const items = await CameraRoll.findBlurryImages({
        ignoreIds: processedIds,
        onFinished(processedIds) {
          newProcessedIds = [...processedIds];
        },
      });

      await Promise.all([
        AsyncStorage.setItem(
          processedIdsStorageKey,
          JSON.stringify([...processedIds, ...newProcessedIds])
        ),
        AsyncStorage.setItem(
          foundIdsStorageKey,
          JSON.stringify([
            ...prevResults.map((x) => x.id),
            ...items.map((x) => x.id),
          ])
        ),
      ]);
      return [...prevResults, ...items];
    }

    throw new Error('Not implemented');
  } finally {
    release();
  }
}
