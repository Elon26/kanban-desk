import { router } from 'expo-router';
import { usePinSettings } from 'expo-with-pincode';
import { TouchableOpacity, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { colors } from '@/config/theme';
import ExclamationIcon from '@/svg/burger.svg';
import CirclesIcon from '@/svg/burger.svg';
import ShieldCheckIcon from '@/svg/burger.svg';
import { LockableButton } from '@/ui/lockable-button';
import { ModalFrame, type ModalFrameProps } from '@/ui/modal-frame';
import { UiText } from '@/ui/ui-text';

import { useSecretContacts } from '../hooks/use-secret-contacts';
import { useSecretFolderGallery } from '../hooks/use-secret-folder-gallery';
import { useSecretPasswords } from '../hooks/use-secret-passwords';

export function SecretFolderWidget({
  locked,
  isLink = false,
  ...props
}: ModalFrameProps) {
  const { isPincodeSet } = usePinSettings();
  const color = isPincodeSet ? colors.primary : colors.red;
  return (
    <ModalFrame
      color={color.toString()}
      title="Secret Folder"
      href={isLink ? '/secret-folder' : undefined}
      slot1={<PinInfo locked={locked} />}
      slot2={<FolderStats locked={locked} />}
      {...props}
    />
  );
}

type PinInfoProps = {
  locked: boolean;
};

function PinInfo({ locked }: PinInfoProps) {
  const { isPincodeSet } = usePinSettings();
  return (
    <>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <UiText className="text-lg font-medium">
            {isPincodeSet
              ? 'Your data is protected'
              : 'Your data is not protected'}
          </UiText>
          <LockableButton
            locked={locked}
            className={twMerge(
              'size-9',
              isPincodeSet ? 'bg-primary' : 'bg-red'
            )}
          >
            {isPincodeSet ? (
              <ShieldCheckIcon className="color-white size-6" />
            ) : (
              <ExclamationIcon className="color-white size-6" />
            )}
          </LockableButton>
        </View>
        <UiText className="text-sm opacity-50">
          {isPincodeSet
            ? 'Your data is safe, but you always have the option to update your PIN-code'
            : 'Add FaceID and PIN login for full protection of your data privacy'}
        </UiText>
      </View>
      <View className="flex-row items-center justify-between">
        <CirclesIcon
          className={twMerge(
            'h-[32] w-[86]',
            isPincodeSet ? 'color-primary' : 'color-red'
          )}
        />
        <TouchableOpacity
          className={twMerge(
            'justify-center rounded-full px-4 h-9',
            isPincodeSet ? 'bg-primary-light' : 'bg-red-light'
          )}
          onPress={() => {
            router.navigate('/set-pin');
          }}
        >
          {isPincodeSet ? (
            <UiText className="text-sm font-medium color-primary">
              Change PIN-code
            </UiText>
          ) : (
            <UiText className="text-sm font-medium color-red">
              Set PIN-code
            </UiText>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

function FolderStats({ locked }: { locked: boolean }) {
  const { assets } = useSecretFolderGallery();
  const { all } = useSecretContacts();
  const { passwords } = useSecretPasswords();

  const { isPincodeSet } = usePinSettings();
  const photosCount = locked ? '---' : assets.length;
  const contactsCount = locked ? '---' : all.length;
  const passwordsCount = locked ? '---' : (passwords?.length ?? 0);

  return (
    <View className="flex-row gap-2.5">
      {[
        [photosCount, 'Photo'],
        [contactsCount, 'Contact'],
        [passwordsCount, 'Pass'],
      ].map(([count, title]) => (
        <View
          className="flex-1 items-center rounded-0.5xl border border-black/10 py-2.5"
          key={title}
        >
          <UiText
            className={twMerge(
              'text-xs font-medium',
              isPincodeSet ? 'color-primary' : 'color-red'
            )}
          >
            {count}{' '}
            <UiText className="text-xs font-medium color-text/50">
              {title}
              {count !== 1 && title !== 'Pass' ? 's' : ''}
            </UiText>
          </UiText>
        </View>
      ))}
    </View>
  );
}
