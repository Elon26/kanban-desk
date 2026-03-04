import { twMerge } from 'tailwind-merge';

import { Pressable } from './pressable';
import { UiText } from './ui-text';

type ChevronProps = {
  label: string;
  handler: () => void;
  size?: 'normal' | 'big';
  disabled?: boolean;
  classes?: string;
};

export function Btn({
  label,
  handler,
  size = 'normal',
  disabled = false,
  classes = '',
}: ChevronProps) {
  return (
    <Pressable
      className={twMerge(
        'rounded-3xl bg-blue',
        size === 'big' ? 'py-4' : 'py-2',
        classes
      )}
      onPress={handler}
      disabled={disabled}
    >
      <UiText className="text-center font-medium">{label}</UiText>
    </Pressable>
  );
}
