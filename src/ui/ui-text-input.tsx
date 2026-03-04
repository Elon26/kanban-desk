import { FC } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';
import * as Clipboard from 'expo-clipboard';
import * as Burnt from 'burnt';
import CopyIcon from '@/svg/copy.svg';
import { Pressable } from './pressable';

type InputProps = {
  name: string;
  Icon: FC<SvgProps>;
} & TextInputProps;

export function UiTextInput({
  name,
  Icon,
  placeholder,
  className,
  value,
  ...rest
}: InputProps) {
  const handleCopy = async () => {
    if (value) {
      await Clipboard.setStringAsync(value);
      Burnt.toast({
        title: 'Copied to clipboard',
        preset: 'done',
        haptic: 'success',
        duration: 1,
        shouldDismissByDrag: true,
        from: 'top',
      });
    }
  };

  return (
    <View className="flex-row rounded-3xl bg-white/10 gap-x-2 px-4 py-2.5">
      <View className="items-center justify-center rounded-full bg-[#A3C9FA] size-7.5">
        <Icon />
      </View>
      <TextInput
        className={twMerge(
          'flex-1 text-text',
          'placeholder:text-text/50',
          className
        )}
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {value && (
        <Pressable
          className="items-center justify-center rounded-full bg-white/10 size-7.5"
          onPress={handleCopy}
        >
          <CopyIcon />
        </Pressable>
      )}
    </View>
  );
}
