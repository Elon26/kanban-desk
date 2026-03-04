import { scaleX } from '@kirz/nativewind-scale';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Image } from 'expo-image';
import { Alert, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useModal } from 'react-native-modalfy';
import Animated, {
  LinearTransition,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import type { ModalStackParams } from '@/components/modals';
import { colors } from '@/config/theme';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { Checkbox } from '@/ui/checkbox';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

import { deletePassword } from '../hooks/use-secret-passwords';
import { isWeakPassword } from '../hooks/use-secret-passwords/helper';
import type { Password } from '../hooks/use-secret-passwords/types';

type PasswordListItemProps = {
  item: Password;
  selectionMode: boolean;
  toggleCheckPassword: (password: Password) => void;
  isChecked: boolean;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PasswordListItem({
  item,
  selectionMode,
  toggleCheckPassword,
  isChecked,
}: PasswordListItemProps) {
  const modal = useModal<ModalStackParams>();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <AnimatedTouchable
      entering={ZoomIn}
      exiting={ZoomOut}
      layout={LinearTransition}
      onPress={
        selectionMode
          ? () => toggleCheckPassword(item)
          : () => {
              modal.openModal('SecretPasswordModal', { id: item.id });
            }
      }
      activeOpacity={1}
    >
      <ReanimatedSwipeable
        enableTrackpadTwoFingerGesture
        overshootFriction={8}
        overshootRight={false}
        overshootLeft={false}
      >
        <View className="flex-row items-center rounded-4xl bg-white/10 gap-x-2 px-4.5 py-2.5">
          {item.image && (
            <Image
              source={{ uri: item.image }}
              className="rounded-full size-10"
            />
          )}
          <View className="flex-1 gap-y-1">
            <UiText className="font-medium w-full" numberOfLines={1}>
              {item.name}
            </UiText>
            <UiText
              className="text-xs font-medium opacity-50 w-full"
              numberOfLines={1}
            >
              {item.link}
            </UiText>
          </View>
          <View className="flex-row items-center justify-end gap-x-2">
            {isWeakPassword(item.password) && (
              <>
                <SfSymbol
                  name="exclamationmark.triangle.fill"
                  tintColor={colors.red.toString()}
                  size={scaleX(20)}
                />
                <UiText className="text-xs capitalize text-red">
                  {langs[selectedLang].pages.secret_folder.weak}
                </UiText>
              </>
            )}
            {selectionMode ? (
              <Checkbox
                checked={isChecked}
                className="pointer-events-none"
                onChange={() => toggleCheckPassword(item)}
              />
            ) : (
              <UiText className="capitalize text-gray">
                {langs[selectedLang].edit}
              </UiText>
            )}
          </View>
        </View>
      </ReanimatedSwipeable>
    </AnimatedTouchable>
  );
}

type ActionProps = {
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  item: Password;
  methods: SwipeableMethods;
};

function RightAction({ progress, drag, item, methods }: ActionProps) {
  const styleAnimation = useAnimatedStyle(() => ({ opacity: progress.value }));
  const isOverThreshold = useDerivedValue(
    () => progress.value >= 1 && drag.value < 0
  );
  useDerivedValue(() => {
    if (isOverThreshold.value) {
      runOnJS(impactAsync)(ImpactFeedbackStyle.Heavy);
    }
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete this password from device?',
      'This password will be deleted from your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deletePassword(item),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <AnimatedTouchable
      style={styleAnimation}
      className="items-end justify-center mr-edge px-4 w-8"
      onPress={() => {
        methods.close();
        handleDelete();
      }}
    >
      <View className="absolute rounded-4xl bg-red right-0 bottom-0 top-0 w-64" />
      <SfSymbol name="trash" size={20} tintColor={colors.red.toString()} />
    </AnimatedTouchable>
  );
}
