import {
  prettyBytes,
  useMemoryUsage,
  useProcessorUsage,
} from '@kirz/react-native-device-info';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import CPUIcon from '@/svg/cpu.svg';
import FreeRamIcon from '@/svg/free-ram.svg';
import LastCleanIcon from '@/svg/last-clean.svg';
import { UiText } from '@/ui/ui-text';
import { createLangStringForDate } from '@/utils/create-lang-string-for-date';

export default function InfoArea() {
  const { used } = useProcessorUsage();
  const ramUsage = useMemoryUsage();
  const selectedLang = useStorageValue('selectedLang');
  const lastSmartClean = useStorageValue('lastSmartClean');
  const [lastCleanToShow, setLastCleanToShow] = useState(
    lastSmartClean
      ? new Date(lastSmartClean * 1000).toLocaleString(
          createLangStringForDate(selectedLang),
          {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }
        )
      : 'N/A'
  );
  const [cpuUsedToShow, setCpuUsedToShow] = useState(`${Math.round(used)}%`);
  const [freeRamToShow, setFreeRamToShow] = useState(
    prettyBytes(ramUsage.free)
  );

  useEffect(() => {
    setLastCleanToShow(
      lastSmartClean
        ? new Date(lastSmartClean * 1000).toLocaleString(
            createLangStringForDate(selectedLang),
            {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            }
          )
        : 'N/A'
    );
  }, [lastSmartClean, selectedLang]);

  useEffect(() => {
    setCpuUsedToShow(`${Math.round(used)}%`);
  }, [used]);

  useEffect(() => {
    setFreeRamToShow(prettyBytes(ramUsage.free));
  }, [ramUsage.free]);

  return (
    <View className="flex-row gap-x-1">
      <View className="flex-1 items-center rounded-2xl bg-white/10 gap-y-2 py-2">
        <LastCleanIcon />
        <UiText className="text-center text-sm font-medium">
          {lastCleanToShow}
        </UiText>
        <UiText className="text-center text-sm font-medium">
          {langs[selectedLang].pages.main.info_area.last_clean}
        </UiText>
      </View>
      <View className="flex-1 items-center rounded-2xl bg-white/10 gap-y-2 py-2">
        <CPUIcon />
        <UiText className="text-center text-sm font-medium">
          {cpuUsedToShow}
        </UiText>
        <UiText className="text-center text-sm font-medium">
          {langs[selectedLang].pages.main.info_area.CPU_used}
        </UiText>
      </View>
      <View className="flex-1 items-center rounded-2xl bg-white/10 gap-y-2 py-2">
        <FreeRamIcon />
        <UiText className="text-center text-sm font-medium">
          {freeRamToShow}
        </UiText>
        <UiText className="text-center text-sm font-medium">
          {langs[selectedLang].pages.main.info_area.free_RAM}
        </UiText>
      </View>
    </View>
  );
}
