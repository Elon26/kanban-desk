import type { SerializedTaskItem } from '@/pages/task-manager/types/task-item';
import { Env } from '@kirz/expo-env';
import WidgetBridge from 'react-native-widget-bridge';

const GROUP_ID = `group.${Env.APP_BUNDLE_ID}.widget`;

interface WidgetData {
  SpeedWidget: {
    downloadSpeed: number;
    uploadSpeed: number;
  };
  CleanerWidget: {
    storageInfoTotal: string;
    storageInfoOccupied: string;
    storageInfoPercentOccupied: number;
    blurryPhotos: number;
    screenshots: number;
    duplicateNumbers: number;
    similarPhotos: number;
    screenshotsSize: number;
    blurryPhotosSize: number;
    similarPhotosSize: number;
    duplicateNumbersSize: number;
  };
  CalendarWidget: {
    tasks: SerializedTaskItem[];
  };
}

async function set<WidgetKind extends keyof WidgetData>(
  key: WidgetKind,
  value: WidgetData[WidgetKind]
) {
  const suiteIsReady = await WidgetBridge.ensureUserDefaultsSuit(GROUP_ID);
  if (!suiteIsReady) {
    throw new Error(`${GROUP_ID} is unavailable`);
  }

  const success = await WidgetBridge.setDict(key, value);
  if (!success) {
    throw new Error(`Writing "${key}" data failed`);
  }
  return WidgetBridge.reloadWidget(key);
}

async function update<WidgetKind extends keyof WidgetData>(
  key: WidgetKind,
  value: Partial<WidgetData[WidgetKind]>
) {
  const suiteIsReady = await WidgetBridge.ensureUserDefaultsSuit(GROUP_ID);
  if (!suiteIsReady) {
    throw new Error(`${GROUP_ID} is unavailable`);
  }
  const prev = await WidgetBridge.getDict(key);
  const next = { ...prev, ...value };

  const success = await WidgetBridge.setDict(key, next);
  if (!success) {
    throw new Error(`Writing "${key}" data failed`);
  }
  return WidgetBridge.reloadWidget(key);
}

export function useWidgetBridge() {
  return {
    setWidgetData: set,
    updateWidgetData: update,
  };
}
