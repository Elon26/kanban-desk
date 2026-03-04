import { scaleY } from '@kirz/nativewind-scale';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import type { FullscreenViewOverlayComponentProps } from 'expo-simple-gallery';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

import { colors } from '@/config/theme';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BackIcon from '@/svg/back.svg';
import ShareIcon from '@/svg/share.svg';
import { Pressable } from '@/ui/pressable';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { hexa } from '@/utils/color';

type FullscreenViewOverlayComponentPropsExtended =
  FullscreenViewOverlayComponentProps & {
    closeViewer?: () => void;
    setSelectionMode?: (selectionMode: boolean) => void;
    deleteByUri?: (uri: string) => void;
  };

export function FullscreenViewOverlayComponent({
  closeViewer,
  selected,
  toggleSelection,
  setSelectionMode,
  uri,
  deleteByUri,
}: FullscreenViewOverlayComponentPropsExtended) {
  const selectedLang = useStorageValue('selectedLang');
  const handleToggleSelection = () => {
    setSelectionMode?.(true);
    toggleSelection();
  };
  const insets = useSafeAreaInsets();
  const [fileName, setFileName] = useState('');

  async function handleFileName(uri: string) {
    if (uri.startsWith('file://')) {
      const result =
        (uri.split('/').pop()?.slice(0, 15) || '...') +
        ((uri.split('/').pop()?.length || 0) > 15 ? '...' : '');

      setFileName(result);
    }
    if (uri.startsWith('ph://')) {
      const asset = await MediaLibrary.getAssetInfoAsync(
        uri.replace('ph://', '')
      );
      const result =
        (asset.localUri?.split('/').pop()?.slice(0, 15) || '...') +
        ((asset.localUri?.split('/').pop()?.length || 0) > 15 ? '...' : '');
      setFileName(result);
    }
  }

  useEffect(() => {
    handleFileName(uri);
  }, []);

  return (
    <>
      <View className="z-30 flex-row items-center justify-between gap-x-3 px-5 top-18">
        <Pressable
          className="flex-row items-center rounded-2xl bg-white/10 h-full"
          onPress={closeViewer}
        >
          <View className="items-center justify-center rounded-full bg-white/15 size-7.5">
            <BackIcon />
          </View>
          <UiText className="text-sm capitalize px-2">
            {langs[selectedLang].back}
          </UiText>
        </Pressable>
        <UiText className="text-lg font-semibold">{fileName}</UiText>
        <View className="w-[75px]" />
      </View>
      <View
        className="absolute left-0 right-0 px-edge bottom-0 pt-4"
        style={{ paddingBottom: insets.bottom || scaleY(16) }}
      >
        <View className="pointer-events-none absolute inset-0">
          <LinearGradient
            colors={[hexa(colors.black, 0.3), hexa(colors.black, 0)]}
            start={[0, 1]}
            end={[0, 0]}
            style={{ flex: 1 }}
          />
        </View>
        <View className="flex-row items-stretch gap-2.5">
          <TouchableOpacity
            className="aspect-square items-center justify-center rounded-full bg-white/10"
            onPress={async () => {
              if (uri.startsWith('file://')) {
                Sharing.shareAsync(uri);
                return;
              }
              if (uri.startsWith('ph://')) {
                const asset = await MediaLibrary.getAssetInfoAsync(
                  uri.replace('ph://', '')
                );
                asset.localUri && Sharing.shareAsync(asset.localUri);
              }
            }}
          >
            <ShareIcon className="color-text size-6" />
          </TouchableOpacity>
          <UiButton
            className="flex-1 bg-blue"
            onPress={() => {
              deleteByUri?.(uri);
              closeViewer?.();
            }}
          >
            {langs[selectedLang].buttons.delete}
          </UiButton>
        </View>
      </View>
    </>
  );
}

type HeaderRightProps = {
  selected: boolean;
  toggleSelection: () => void;
};

function HeaderRight({ selected, toggleSelection }: HeaderRightProps) {
  const selectedLang = useStorageValue('selectedLang');
  return (
    <TouchableOpacity
      onPress={() => toggleSelection()}
      className={twMerge(
        'flex-row items-center justify-center rounded-full border border-primary h-7 w-18',
        selected ? 'bg-white' : 'bg-primary'
      )}
    >
      <UiText
        className={twMerge(
          'text-sm capitalize',
          selected ? 'text-primary' : 'text-white'
        )}
      >
        {selected ? langs[selectedLang].deselect : langs[selectedLang].select}
      </UiText>
    </TouchableOpacity>
  );
}
