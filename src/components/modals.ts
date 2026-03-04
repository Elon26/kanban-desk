import { Easing } from 'react-native';
import {
  createModalStack,
  type ModalOptions,
  type ModalStack,
} from 'react-native-modalfy';

import RateModal from '@/pages/about/components/rate-modal';
import { PaywallModal } from '@/pages/paywall/paywall-modal';
import { ConfirmationOfDeletionModal } from '@/pages/secret-folder/components/confirmation-of-deletion-modal';
import { RemoveAfterImportModal } from '@/pages/secret-folder/components/remove-after-import-modal';
import { SecretPasswordModal } from '@/pages/secret-folder/components/secret-password-modal';
import { SetPinRequestModal } from '@/pages/secret-folder/modals/set-pin-request-modal';
import ScanningModal from '@/pages/smart-cleaner/components/scanning-modal';
import { ConnectionErrorModal } from '@/pages/speed-test/components/connection-error-modal';
import { SpeedResultsModal } from '@/pages/speed-test/components/speed-result-modal';
import { UnlockFullUploadModal } from '@/pages/task-manager/modals/unlock-full-upload-modal';
import { UnlockMoreTasksModal } from '@/pages/task-manager/modals/unlock-more-tasks-modal';

import { LoaderModal } from './loader-modal';
import { SuccessModal } from './success-modal';

const defaultOptions: ModalOptions = {
  position: 'center',
  disableFlingGesture: true,
  backBehavior: 'none',
  backdropOpacity: 0.2,
  animateInConfig: {
    easing: Easing.inOut(Easing.exp),
    duration: 1000,
  },
} as const;

export type ModalStackParams = {
  LoaderModal: typeof LoaderModal;
  SuccessModal: {
    filesQuantity: number;
    freedSpace: string;
  };
  SpeedResultsModal: typeof SpeedResultsModal;
  RateModal: typeof RateModal;
  SetPinRequestModal: typeof SetPinRequestModal;
  SecretPasswordModal: {
    id?: string;
  };
  RemoveAfterImportModal: {
    description: string;
    resolve: (value: unknown) => void;
  };
  ConfirmationOfDeletionModal: {
    description: string;
    resolve: (value: unknown) => void;
  };
  Paywall: {
    type: 'a' | 'b' | 'c' | 'd' | 'e';
  };
  UnlockMoreTasksModal: typeof UnlockMoreTasksModal;
  UnlockFullUploadModal: {
    resolve: (value: unknown) => void;
  };
  ConnectionErrorModal: {
    resolve: (value: unknown) => void;
  };
  ScanningModal: never;
};

export const modalsStack: ModalStack<ModalStackParams> = createModalStack(
  {
    LoaderModal,
    SuccessModal,
    SpeedResultsModal,
    RateModal,
    SetPinRequestModal,
    SecretPasswordModal,
    RemoveAfterImportModal,
    ConfirmationOfDeletionModal,
    Paywall: {
      modal: PaywallModal,
      position: 'top',
    },
    UnlockMoreTasksModal,
    UnlockFullUploadModal,
    ConnectionErrorModal,
    ScanningModal,
  },
  defaultOptions
);
