import { useSelector } from '@xstate/store/react';
import { useCallback, useMemo } from 'react';

import type { GalleryAsset } from '@/modules/cleaner-gallery';
import { isNotNullOrUndefined } from '@/utils/array';
import { assert } from '@/utils/assert';

import { selectionStore } from './store';

const DEBUG = false;

const debug = DEBUG ? console.debug : () => {};

/**
 * Manages selection state for a subset of assets.
 *
 * Provides utility functions for selecting, deselecting, and toggling asset selection
 * within a defined subset of system-wide assets.
 *
 * @param assets - The subset of assets to manage selection for.
 * @returns Selection state and utility functions.
 */
export function useSelectedAssets(assets: GalleryAsset[]) {
  const allUris = assets.map(({ uri }) => uri).filter(isNotNullOrUndefined);
  const selectedAssets = useSelector(
    selectionStore,
    (state) => state.context.selectedAssets
  );

  const selectedUris = useMemo(
    () => selectedAssets.map(({ uri }) => uri),
    [selectedAssets]
  );

  const addSelectedAssetsByUri = useCallback(
    (uris: string[]) => {
      const start = performance.now();
      selectionStore.send({
        type: 'addSelectedAssetByUri',
        uris,
        allAssets: assets,
      });
      const end = performance.now();
      debug(
        `addSelectedAssetsByUri took ${((end - start) / 1000).toFixed(4)}s for ${uris.length} URIs`
      );
    },
    [assets]
  );

  const subtractSelectedAssetsByUri = useCallback(
    (uris: string[]) => {
      const start = performance.now();
      selectionStore.send({
        type: 'subtractSelectedAssetByUri',
        uris,
        allAssets: assets,
      });
      const end = performance.now();
      debug(
        `subtractSelectedAssetsByUri took ${((end - start) / 1000).toFixed(4)}s for ${uris.length} URIs`
      );
    },
    [assets]
  );

  const selectAll = useCallback(() => {
    const start = performance.now();

    selectionStore.send({
      type: 'selectAllInSubset',
      assetsInSubset: assets,
    });

    const end = performance.now();
    debug(
      `selectAll took ${((end - start) / 1000).toFixed(4)}s for ${assets.length} assets`
    );
  }, [assets]);

  const deselectAll = useCallback(() => {
    const start = performance.now();

    const hasSelectedAssets = selectedAssets.some((asset) =>
      allUris.includes(asset.uri ?? '')
    );

    if (!hasSelectedAssets) {
      debug(
        `deselectAll early return - nothing to deselect - took ${((performance.now() - start) / 1000).toFixed(4)}s`
      );
      return;
    }

    selectionStore.send({
      type: 'deselectAssetsInSubset',
      urisInSubset: allUris,
    });

    const end = performance.now();
    debug(
      `deselectAll took ${((end - start) / 1000).toFixed(4)}s for ${allUris.length} URIs`
    );
  }, [allUris, selectedAssets]);

  const setSelectedByUri = useCallback(
    (uris: string[]) => {
      const start = performance.now();

      // If we're selecting everything in the subset, use the more efficient selectAll function
      if (
        uris.length === allUris.length &&
        uris.every((uri, i) => uri === allUris[i])
      ) {
        selectAll();
        return;
      }

      selectionStore.send({
        type: 'setSelectedByUri',
        urisToSelect: uris,
        allAssets: assets,
        urisToConsider: allUris,
      });

      const end = performance.now();
      debug(
        `setSelectedByUri took ${((end - start) / 1000).toFixed(4)}s for ${uris.length} URIs`
      );
    },
    [allUris, assets, selectAll]
  );

  const clearSelectedAssets = useCallback(() => {
    const start = performance.now();
    selectionStore.send({ type: 'clearSelectedAssets' });
    const end = performance.now();
    debug(`clearSelectedAssets took ${((end - start) / 1000).toFixed(4)}s`);
  }, []);

  const isSelected = useCallback(
    (asset: string | GalleryAsset) => {
      const start = performance.now();
      if (typeof asset === 'string') {
        return selectedUris.includes(asset);
      }
      const r = selectedUris.includes(asset.uri);
      const end = performance.now();
      debug(
        `isSelected took ${((end - start) / 1000).toFixed(4)}s for asset ${asset.uri}`
      );
      return r;
    },
    [selectedUris]
  );

  const toggleSelect = useCallback(
    (asset: GalleryAsset | string) => {
      const start = performance.now();
      if (typeof asset === 'string') {
        if (selectedUris.includes(asset)) {
          subtractSelectedAssetsByUri([asset]);
        } else {
          addSelectedAssetsByUri([asset]);
        }
      } else {
        assert(asset.uri);
        if (selectedUris.includes(asset.uri)) {
          subtractSelectedAssetsByUri([asset.uri]);
        } else {
          addSelectedAssetsByUri([asset.uri]);
        }
      }
      const end = performance.now();
      debug(
        `toggleSelect took ${((end - start) / 1000).toFixed(4)}s for asset ${typeof asset === 'string' ? asset : asset.uri}`
      );
      return selectionStore.getSnapshot().context.selectedAssets;
    },
    [addSelectedAssetsByUri, selectedUris, subtractSelectedAssetsByUri]
  );

  const setSelectedAssets = useCallback((assets: GalleryAsset[]) => {
    const start = performance.now();
    selectionStore.send({ type: 'setSelectedAssets', assets });
    const end = performance.now();
    debug(
      `setSelectedAssets took ${((end - start) / 1000).toFixed(4)}s for ${assets.length} assets`
    );
  }, []);

  const isPartialSelected = useMemo(() => {
    const start = performance.now();
    const r =
      !!assets.length &&
      assets.some((asset) => selectedUris.includes(asset.uri));
    const end = performance.now();
    debug(
      `isPartialSelected took ${((end - start) / 1000).toFixed(4)}s for ${assets.length} assets`
    );
    return r;
  }, [assets, selectedUris]);

  const isAllSelected = useMemo(() => {
    const start = performance.now();
    if (!assets.length) {
      return false;
    }
    const selectedUrisSet = new Set(selectedUris);

    const r = assets.every((asset) => selectedUrisSet.has(asset.uri));

    const end = performance.now();
    debug(
      `isAllSelected took ${((end - start) / 1000).toFixed(4)}s for ${assets.length} assets`
    );
    return r;
  }, [assets, selectedUris]);

  const selectedWithinSubset = useMemo(() => {
    const start = performance.now();

    const assetUrisInSubset = new Set(
      assets.map((asset) => asset.uri).filter(Boolean)
    );

    const r = selectedAssets.filter(
      (asset) => asset.uri && assetUrisInSubset.has(asset.uri)
    );

    const end = performance.now();
    debug(
      `selectedWithinSubset took ${((end - start) / 1000).toFixed(4)}s for ${selectedAssets.length} selected assets out of ${assets.length} assets in subset`
    );
    return r;
  }, [assets, selectedAssets]);

  const assetsSize = assets.reduce((acc, item) => acc + (item.size || 0), 0);

  return {
    assetsSize,
    /**
     * Array of all selected assets, regardless of the current subset.
     */
    selectedAssets,
    /**
     * Array of all selected assets within the current subset.
     */
    selectedWithinSubset,
    /**
     * Array of all selected uris, regardless of the current subset.
     */
    selectedUris,
    /**
     * Adds the specified assets to the selection.
     *
     * @param uris - An array of asset URIs to add to the selection.
     */
    addSelectedAssetsByUri,
    /**
     * Removes the specified assets from the selection.
     *
     * @param uris - An array of asset URIs to remove from the selection.
     */
    subtractSelectedAssetsByUri,
    /**
     * Updates the selection to match the specified URIs, but only within the provided asset subset.
     *
     * This method first deselects all assets in the current subset (`assets`),
     * then selects only the assets whose URIs are included in the provided `uris` array.
     * It does not affect assets outside the subset.
     *
     * @param uris - An array of asset URIs to be selected within the current subset.
     */
    setSelectedByUri,
    /**
     * Sets the selection to the provided assets, regardless of the current subset.
     *
     * @param assets - An array of assets to select.
     */
    setSelected: setSelectedAssets,
    /**
     * Selects all assets within the provided subset.
     */
    selectAll,
    /**
     * Deselects all assets within the provided subset.
     */
    deselectAll,
    /**
     * Clears all selected assets, regardless of the current subset.
     */
    clearSelectedAssets,
    /**
     * Checks whether all assets in the current subset are selected.
     *
     * @returns `true` if all assets in the subset are selected, otherwise `false`.
     */
    isAllSelected,
    /**
     * Checks whether all assets in the current subset are selected.
     *
     * @returns `true` if all assets in the subset are selected, otherwise `false`.
     */
    isSelected,
    /**
     * Toggles the selection state of an asset.
     *
     * If the asset is currently selected, it will be deselected.
     * If it is not selected, it will be added to the selection.
     *
     * @param asset - The asset or its URI.
     */
    toggleSelect,
    /**
     * Checks whether at least one asset in the subset is selected.
     *
     * @returns `true` if at least one asset in the subset is selected, otherwise `false`.
     */
    isPartialSelected,
  };
}

function set(assets: GalleryAsset[]) {
  selectionStore.send({ type: 'setSelectedAssets', assets });
}

function clear() {
  selectionStore.send({ type: 'clearSelectedAssets' });
}

function add(assets: GalleryAsset[]) {
  selectionStore.send({ type: 'addSelectedAsset', assets });
}

function subtract(assets: GalleryAsset[]) {
  selectionStore.send({ type: 'subtractSelectedAsset', assets });
}

export const manageSelectedAssets = { set, add, subtract, clear };
