import { CameraRoll } from './camera-roll';
import {
  GalleryAsset,
  GetAssetsParams,
  SelectKey,
  SortByKey,
  VideoInfo,
} from './types';

const fetchAssets = CameraRoll.getAssets;
const fetchAssetsCount = CameraRoll.getAssetsCount;
const deleteAssets = CameraRoll.deleteAssets;

export {
  CameraRoll,
  deleteAssets,
  fetchAssets,
  fetchAssetsCount,
  GalleryAsset,
  GetAssetsParams,
  SelectKey,
  SortByKey,
  VideoInfo,
};
