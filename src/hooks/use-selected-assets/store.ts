import { createStore } from '@xstate/store';

import type { GalleryAsset } from '@/modules/cleaner-gallery';

export const selectionStore = createStore({
  context: {
    selectedAssets: [] as GalleryAsset[],
  },
  on: {
    setSelectedAssets: (_, event: { assets: GalleryAsset[] }) => {
      const set = new Set(event.assets);
      return {
        selectedAssets: Array.from(set),
      };
    },
    clearSelectedAssets: () => {
      return {
        selectedAssets: [],
      };
    },
    addSelectedAsset: (context, event: { assets: GalleryAsset[] }) => {
      const { selectedAssets } = context;
      const set = new Set([...selectedAssets, ...event.assets]);
      return {
        selectedAssets: Array.from(set),
      };
    },
    subtractSelectedAsset: (context, event: { assets: GalleryAsset[] }) => {
      const { selectedAssets } = context;
      if (event.assets.length === 0) {
        return { selectedAssets };
      }

      const urisToRemove = new Set(event.assets.map((asset) => asset.uri));

      return {
        selectedAssets: selectedAssets.filter(
          (asset) => !urisToRemove.has(asset.uri)
        ),
      };
    },
    addSelectedAssetByUri: (
      context,
      event: { uris: string[]; allAssets: GalleryAsset[] }
    ) => {
      const { selectedAssets } = context;
      const set = new Set(selectedAssets);
      for (const uri of event.uris) {
        const asset = event.allAssets.find((asset) => asset.uri === uri);
        if (asset) {
          set.add(asset);
        }
      }
      return {
        selectedAssets: Array.from(set),
      };
    },
    subtractSelectedAssetByUri: (
      context,
      event: { uris: string[]; allAssets: GalleryAsset[] }
    ) => {
      const { selectedAssets } = context;
      const set = new Set(selectedAssets);
      for (const uri of event.uris) {
        const asset = event.allAssets.find((asset) => asset.uri === uri);
        if (asset) {
          set.delete(asset);
        }
      }
      return {
        selectedAssets: Array.from(set),
      };
    },
    setSelectedByUri: (
      context,
      event: {
        urisToSelect: string[];
        allAssets: GalleryAsset[];
        urisToConsider: string[];
      }
    ) => {
      const { selectedAssets } = context;

      // Early return if there's nothing to consider
      if (event.urisToConsider.length === 0) {
        return { selectedAssets };
      }

      // Create Sets for O(1) lookups
      const urisToSelectSet = new Set(event.urisToSelect);
      const urisToConsiderSet = new Set(event.urisToConsider);

      // Create a Map of assets by URI for quick lookups
      const assetsByUri = new Map();
      for (const asset of event.allAssets) {
        if (asset.uri) {
          assetsByUri.set(asset.uri, asset);
        }
      }

      // Step 1: Keep assets that are outside the current subset (not in urisToConsider)
      const assetsOutsideSubset = selectedAssets.filter(
        (asset) => asset.uri && !urisToConsiderSet.has(asset.uri)
      );

      // Step 2: Add selected assets from the subset
      const result = [...assetsOutsideSubset];
      for (const uri of urisToSelectSet) {
        const asset = assetsByUri.get(uri);
        if (asset) {
          result.push(asset);
        }
      }

      return {
        selectedAssets: result,
      };
    },

    deselectAssetsInSubset: (context, event: { urisInSubset: string[] }) => {
      const { selectedAssets } = context;

      if (event.urisInSubset.length === 0) {
        return { selectedAssets };
      }

      if (selectedAssets.length === 0) {
        return { selectedAssets: [] };
      }

      const urisInSubsetSet = new Set(event.urisInSubset);

      const hasAssetsToDeselect = selectedAssets.some(
        (asset, idx) => idx < 5 && asset.uri && urisInSubsetSet.has(asset.uri)
      );

      if (!hasAssetsToDeselect) {
        const fullCheck = selectedAssets.some(
          (asset) => asset.uri && urisInSubsetSet.has(asset.uri)
        );

        if (!fullCheck) {
          return { selectedAssets };
        }
      }

      return {
        selectedAssets: selectedAssets.filter(
          (asset) => !asset.uri || !urisInSubsetSet.has(asset.uri)
        ),
      };
    },

    selectAllInSubset: (context, event: { assetsInSubset: GalleryAsset[] }) => {
      const { selectedAssets } = context;

      if (event.assetsInSubset.length === 0) {
        return { selectedAssets };
      }

      const selectedUris = new Set(selectedAssets.map((asset) => asset.uri));

      const newSelectedAssets = [...selectedAssets];

      for (const asset of event.assetsInSubset) {
        if (asset.uri && !selectedUris.has(asset.uri)) {
          newSelectedAssets.push(asset);
        }
      }

      return {
        selectedAssets: newSelectedAssets as GalleryAsset[],
      };
    },
  },
});
