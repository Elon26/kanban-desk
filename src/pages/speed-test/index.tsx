import { prettyBytes } from '@kirz/react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import DownloadIcon from '@/svg/download.svg';
import { UiText } from '@/ui/ui-text';
import { useSpeedTest } from './hooks/use-speedtest';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';
import { Pressable } from '@/ui/pressable';
import { twMerge } from 'tailwind-merge';
import { Speedometer } from './components/speedometer';
import { useModal } from 'react-native-modalfy';
import type { ModalStackParams } from '@/components/modals';
import NetInfo from '@react-native-community/netinfo';
import { useWidgetBridge } from '@/hooks/use-widget-bridge';

export type HistoryItem = {
  timestamp: number;
  download: number;
  upload: number;
};

export const historyAtom = atom<HistoryItem[]>([]);

export function SpeedTestPage() {
  const selectedLang = useStorageValue('selectedLang');

  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const {
    start: startSpeedtest,
    statusAtom,
    progressAtom,
    resultsAtom,
  } = useSpeedTest();
  const progressState = useAtomValue(progressAtom);
  const speedtestStatus = useAtomValue(statusAtom);
  const speedtestResults = useAtomValue(resultsAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const { openModal, closeModal } = useModal<ModalStackParams>();
  const { setWidgetData } = useWidgetBridge();

  const prevStatusRef = useRef<string>(speedtestStatus);

  async function handleStartSpeedtest() {
    if (isConnected) {
      startSpeedtest({ tests: ['download', 'upload'] });
    } else {
      let confirm: (value: unknown) => void = () => {};
      const confirmationPromise = new Promise<unknown>((resolve) => {
        confirm = resolve;
      });

      openModal('ConnectionErrorModal', {
        resolve: confirm,
      });

      const action = await confirmationPromise;

      if (action === 'back') {
        closeModal('ConnectionErrorModal');
      }

      if (action === 'retry') {
        closeModal('ConnectionErrorModal');
        setTimeout(() => {
          handleStartSpeedtest();
        }, 500);
      }
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('speedtestHistory');
        if (json) {
          setHistory(JSON.parse(json));
        }
      } catch (e) {
        console.error('Failed to load history', e);
      }
    })();
  }, [setHistory]);

  useEffect(() => {
    AsyncStorage.setItem('speedtestHistory', JSON.stringify(history)).catch(
      (e) => console.error('Save history failed', e)
    );
  }, [history]);

  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === 'testing' && speedtestStatus === 'ready') {
      openModal('SpeedResultsModal');
      setWidgetData('SpeedWidget', {
        downloadSpeed: speedtestResults.download ?? 0,
        uploadSpeed: speedtestResults.upload ?? 0,
      });
    }
    prevStatusRef.current = speedtestStatus;
  }, [speedtestStatus, speedtestResults, openModal, setWidgetData]);

  useEffect(() => {
    const { download, upload } = speedtestResults;
    if (download != null && upload != null) {
      setHistory((prev) => {
        const entry: HistoryItem = {
          timestamp: Date.now(),
          download,
          upload,
        };
        return [...prev.slice(-9), entry];
      });
    }
  }, [speedtestResults, setHistory]);

  const formatNumber = (value: string) => value.replace(',', '.');

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.speed_test} />
        <View className="flex-column flex-1 justify-between pt-8">
          <View className="flex-1 justify-between">
            <Animated.View
              className="f z-20 justify-between overflow-hidden rounded-3xl bg-[#FFFFFF25] gap-y-5.5 p-3 mb-10 w-full"
              entering={SlideInDown.springify().damping(14)}
              exiting={SlideOutDown}
            >
              <View className="flex-row justify-between px-3">
                <UiText>
                  {langs[selectedLang].pages.speed_test.connection_type}
                </UiText>
                <UiText>{langs[selectedLang].wi_fi}</UiText>
              </View>

              <Speedometer
                value={progressState?.result || 0}
                status={progressState?.type || 'inactive'}
                downloadResults={speedtestResults.download}
              />

              <Pressable
                className={twMerge('rounded-3xl bg-blue py-4')}
                style={{
                  backgroundColor:
                    speedtestStatus === 'testing' ? '#3D93F24D' : '#3D93F2',
                }}
                onPress={() => handleStartSpeedtest()}
                disabled={speedtestStatus === 'testing'}
              >
                <UiText
                  className="text-center text-lg font-medium"
                  style={{
                    opacity: speedtestStatus === 'testing' ? 0.3 : 1,
                  }}
                >
                  {speedtestStatus === 'testing'
                    ? langs[selectedLang].pages.speed_test.testing
                    : langs[selectedLang].pages.speed_test.start_test}
                </UiText>
              </Pressable>

              <View className="gap-y-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-x-2">
                    <View className="items-center justify-center rounded-full bg-[#CDF5E7] size-9">
                      <DownloadIcon />
                    </View>
                    <View className="gap-y-1">
                      <UiText className="font-medium">
                        {langs[selectedLang].pages.speed_test.download}
                      </UiText>
                      <UiText className="text-xs font-medium text-gray">
                        mb/s
                      </UiText>
                    </View>
                  </View>
                  <View className="flex-row items-end gap-x-1">
                    <UiText className="text-xl font-semibold">
                      {formatNumber(
                        prettyBytes(speedtestResults.download ?? 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          formatter: ({ value }) => value,
                        })
                      )}
                    </UiText>
                    <UiText>mb/s</UiText>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-x-2">
                    <View className="items-center justify-center rounded-full bg-[#F5CDE9] size-9">
                      <DownloadIcon className="rotate-180" />
                    </View>
                    <View className="gap-y-1">
                      <UiText className="font-medium">
                        {langs[selectedLang].pages.speed_test.upload}
                      </UiText>
                      <UiText className="text-xs font-medium text-gray">
                        mb/s
                      </UiText>
                    </View>
                  </View>
                  <View className="flex-row items-end gap-x-1">
                    <UiText className="text-xl font-semibold">
                      {formatNumber(
                        prettyBytes(speedtestResults.upload ?? 0, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          formatter: ({ value }) => value,
                        })
                      )}
                    </UiText>
                    <UiText>mb/s</UiText>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </Container>
    </Page>
  );
}
