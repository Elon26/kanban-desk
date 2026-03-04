import { useModal } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';

export function useModals() {
  return useModal<ModalStackParams>();
}
