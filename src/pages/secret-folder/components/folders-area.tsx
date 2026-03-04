import { type Href, router } from 'expo-router';
import Numbro from 'numbro';
import { TouchableOpacity, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BackIcon from '@/svg/back.svg';
import ContactIcon from '@/svg/contact.svg';
import GalleryIcon from '@/svg/gallery.svg';
import PasswordsIcon from '@/svg/passwords.svg';
import { UiText } from '@/ui/ui-text';

import { useSecretContacts } from '../hooks/use-secret-contacts';
import { useSecretFolderGallery } from '../hooks/use-secret-folder-gallery';
import { useSecretPasswords } from '../hooks/use-secret-passwords';
import { DashedLine } from './dashed-line';

export function FoldersArea() {
  const { assets } = useSecretFolderGallery();
  const { all } = useSecretContacts();
  const { passwords } = useSecretPasswords();
  const selectedLang = useStorageValue('selectedLang');

  const items: [string, number, Href, React.FC<SvgProps>, string][] = [
    [
      langs[selectedLang].pages.secret_folder.contacts,
      all.length,
      '/secret-folder/contacts',
      ContactIcon,
      '#BBB8ED',
    ],
    [
      langs[selectedLang].pages.secret_folder.photos,
      assets.length,
      '/secret-folder/gallery',
      GalleryIcon,
      '#FAD1A3',
    ],
    [
      langs[selectedLang].pages.secret_folder.passwords,
      passwords?.length ?? 0,
      '/secret-folder/passwords',
      PasswordsIcon,
      '#CDF5E7',
    ],
  ];

  return (
    <View className="rounded-4xl bg-white/10">
      {items.map(([title, count, href, Icon, iconColor], sectionIndex) => (
        <View key={title} className="overflow-hidden mx-3">
          <TouchableOpacity onPress={() => router.navigate(href)}>
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-x-2">
                <View
                  className="items-center justify-center rounded-full size-8"
                  style={{ backgroundColor: iconColor }}
                >
                  <Icon />
                </View>
                <View className="flex-row items-end gap-x-1">
                  <UiText className="text-xl font-medium">
                    {Numbro(count).format({ thousandSeparated: true })}
                  </UiText>
                  <UiText className="text-xs font-medium text-gray pb-0.5">
                    {count === 1
                      ? langs[selectedLang].file
                      : langs[selectedLang].files}
                  </UiText>
                </View>
              </View>
              <View className="items-center justify-center rounded-full bg-white/15 size-7.5">
                <BackIcon className="rotate-180" />
              </View>
            </View>
          </TouchableOpacity>
          {sectionIndex < items.length - 1 && <DashedLine />}
        </View>
      ))}
    </View>
  );
}
