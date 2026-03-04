import LangCode from '@/i18n/lang-code';
import { SecretContact } from '@/pages/secret-folder/hooks/use-secret-contacts';
import { SecretFolderAsset } from '@/pages/secret-folder/hooks/use-secret-folder-gallery/atom';
import { defaultTaskStatuses } from '@/pages/task-manager/constants/default-task-statuses';
import { Tag } from '@/pages/task-manager/types/tag';
import { TaskItem } from '@/pages/task-manager/types/task-item';

/**
 * The initial state of the storage.
 *
 * @warning
 * All keys must be defined. Use `null` for `undefined` values.
 */
export const initialStorageState = {
  isOnboardingFinished: false,
  isOnboardingDAnimationStarts: false,
  lastSmartClean: 0,
  isFirstLaunch: true,
  isFirstLaunchSecretFolder: true,
  isReadyToShowNotification: false,
  secretContacts: [] as SecretContact[],
  autofillGuideShown: false,
  lastSecureAction: 0,
  securedDataPercent: 0,
  taskStatuses: defaultTaskStatuses,
  newTask: {
    id: '',
    name: '',
    priority: null,
    tagId: null,
    statusId: null,
    startTime: null,
    endTime: null,
    description: '',
    updatedAt: 0,
    fileUris: [],
  } as TaskItem,
  userTags: [] as Tag[],
  userTasks: [] as TaskItem[],
  secretGalleryStorage: [] as SecretFolderAsset[],
  isNotificationsActive: true,
  hasDeveloperPremium: false,
  isPhotosPermissionAsked: false,
  isContactsPermissionAsked: false,
  selectedLang: LangCode.en as LangCode,
};

export type Storage = typeof initialStorageState;
