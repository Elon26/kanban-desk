import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  LinearTransition,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

import { colors } from '@/config/theme';
import CallIcon from '@/svg/call.svg';
import { Checkbox } from '@/ui/checkbox';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import langs from '@/i18n/langs.json';

import {
  type SecretContact,
  useSecretContacts,
} from '../hooks/use-secret-contacts';
import { useStorageValue } from '@/hooks/use-storage';

type ContactListItemProps = {
  item: SecretContact;
  isSelected: boolean;
  toggleSelection: (contact: SecretContact) => void;
  selectionMode: boolean;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ContactListItem({
  item,
  isSelected,
  toggleSelection,
  selectionMode,
}: ContactListItemProps) {
  const { handleEdit } = useSecretContacts();
  const selectedLang = useStorageValue('selectedLang');

  return (
    <AnimatedTouchable
      entering={ZoomIn}
      exiting={ZoomOut}
      layout={LinearTransition}
      onPress={async () => {
        impactAsync(ImpactFeedbackStyle.Light);
        if (selectionMode) {
          toggleSelection(item);
          return;
        }
        if (item.id) {
          const updated = await handleEdit(item.id);
          if (updated) {
            router.setParams({ id: item.id });
          }
        }
      }}
      activeOpacity={1}
    >
      <ReanimatedSwipeable
        enableTrackpadTwoFingerGesture
        overshootFriction={8}
        overshootRight={false}
        overshootLeft={false}
      >
        <View className="flex-row items-center rounded-4xl bg-white/10 gap-x-2 px-4.5 py-2.5">
          <View className="items-center justify-center rounded-full bg-[#A3C9FA] size-9">
            <CallIcon />
          </View>
          <View className="flex-1 gap-y-1">
            <UiText className="font-medium">
              {item.phoneNumbers?.[0]?.number}
            </UiText>
            <UiText className="text-xs font-light text-gray">
              {item.firstName} {item.lastName}
            </UiText>
          </View>
          {selectionMode ? (
            <Checkbox
              checked={isSelected}
              onChange={() => toggleSelection(item)}
            />
          ) : (
            <UiText className="capitalize text-gray">
              {langs[selectedLang].edit}
            </UiText>
          )}
        </View>
      </ReanimatedSwipeable>
    </AnimatedTouchable>
  );
}

type ActionProps = {
  progress: SharedValue<number>;
  drag: SharedValue<number>;
  item: SecretContact;
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

  const { handleDelete } = useSecretContacts();

  return (
    <AnimatedTouchable
      style={styleAnimation}
      className="items-end justify-center mr-edge px-4 w-8"
      onPress={() => {
        methods.close();
        item.id && handleDelete(item.id);
      }}
    >
      <View className="absolute rounded-4xl bg-red right-0 bottom-0 top-0 w-64" />
      <SfSymbol name="trash" size={20} tintColor={colors.red.toString()} />
    </AnimatedTouchable>
  );
}

function LeftAction({ progress, drag, item, methods }: ActionProps) {
  const styleAnimation = useAnimatedStyle(() => ({ opacity: progress.value }));
  const isOverThreshold = useDerivedValue(
    () => progress.value >= 1 && drag.value > 0
  );
  useDerivedValue(() => {
    if (isOverThreshold.value) {
      runOnJS(impactAsync)(ImpactFeedbackStyle.Heavy);
    }
  });

  const { handleRestore } = useSecretContacts();

  return (
    <AnimatedTouchable
      style={styleAnimation}
      className="items-start justify-center ml-edge px-4 w-8"
      onPress={() => {
        methods.close();
        item.id && handleRestore([item.id]);
      }}
    >
      <View className="absolute rounded-4xl bg-primary left-0 bottom-0 top-0 w-64" />
      <SfSymbol
        name="arrow.clockwise"
        size={20}
        tintColor={colors.primary.toString()}
      />
    </AnimatedTouchable>
  );
}
