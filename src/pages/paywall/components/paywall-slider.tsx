import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

import BoltIcon from '@/svg/paywall/bolt.svg';
import CrownIcon from '@/svg/paywall/crown.svg';
import NotificationIcon from '@/svg/paywall/notification.svg';
import SecretFolderIcon from '@/svg/paywall/secret-folder.svg';
import StickerIcon from '@/svg/paywall/sticker.svg';

import { UiText } from '@/ui/ui-text';
import { uuid } from '@/utils/uuid';
import { useState } from 'react';
import { scaleX } from '@kirz/nativewind-scale';

export function PaywallSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: uuid(),
      title: 'Unlimited free trial',
      subtitle: 'Explore all features before subscribing',
      icon: CrownIcon,
    },
    {
      id: uuid(),
      title: 'Full access to Task Manager',
      subtitle: 'Unlimited tasks, tags, priorities, and files',
      icon: NotificationIcon,
    },
    {
      id: uuid(),
      title: 'Advanced Cleaner tools',
      subtitle: 'Deeper cleaning and more freed-up space',
      icon: BoltIcon,
    },
    {
      id: uuid(),
      title: 'Secret Folder',
      subtitle: 'Secure, private storage for files and photos',
      icon: SecretFolderIcon,
    },
    {
      id: uuid(),
      title: 'Custom workflow setup',
      subtitle: 'Up to 7 columns and full layout control',
      icon: StickerIcon,
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / scaleX(320));
    setCurrentIndex(index);
  };

  return (
    <View>
      <View className="rounded-3xl bg-[#533866] mx-3 mt-6 w-80">
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={slides}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
          renderItem={({ item }) => {
            const Icon = item.icon;
            return (
              <View className="flex-row items-center gap-x-2 px-6 py-3 w-80">
                <Icon />
                <View className="flex-1 gap-y-1">
                  <UiText className="text-sm font-semibold">
                    {item.title}
                  </UiText>
                  <UiText className="text-gray">{item.subtitle}</UiText>
                </View>
              </View>
            );
          }}
        />
      </View>
      <View className="flex-row justify-center gap-x-2 mt-3">
        {slides.map((slide, index) => (
          <View
            key={slide.id + 'dot'}
            className="rounded-full size-2"
            style={{
              backgroundColor: currentIndex === index ? '#81f663' : '#302930',
            }}
          />
        ))}
      </View>
    </View>
  );
}
