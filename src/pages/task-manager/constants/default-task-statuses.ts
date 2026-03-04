import langs from '@/i18n/langs.json';
import { getLocale } from '@/utils/get-locale';

import { TaskStatus } from '../types/task-status';

const selectedLang = getLocale();

export const defaultTaskStatuses: TaskStatus[] = [
  {
    id: 'f642df17-98a6-4427-bcf1-abbc9424d481',
    name: langs[selectedLang].pages.task_manager.to_do,
    color: '#63CBF7',
    isCustom: false,
  },
  {
    id: 'f625df17-98a6-2547-bcf1-abbc9225d481',
    name: langs[selectedLang].pages.task_manager.in_progress,
    color: '#F7BE63',
    isCustom: false,
  },
  {
    id: 'f612df17-98a6-4127-bcf1-abbc9214d121',
    name: langs[selectedLang].pages.task_manager.done,
    color: '#81F763',
    isCustom: false,
  },
];
