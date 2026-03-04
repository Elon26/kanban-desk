import { useState } from 'react';
import {
  Modal,
  Pressable,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

const colors = [
  '#12FF1A',
  '#000000',
  '#0064FF',
  '#969696',
  '#FFFFFF',
  '#FF2200',
];

export function ScreenTestPage() {
  const selectedLang = useStorageValue('selectedLang');
  const [selectedColor, setSelectedColor] = useState<string | null>();

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.screen_test} />
        <View className="gap-y-8 pt-5">
          <UiText className="text-sm font-medium text-gray">
            {langs[selectedLang].pages.settings.screen_test}
          </UiText>
          <View className="flex-row flex-wrap -m-1">
            {colors.map((c) => (
              <View key={c} className="basis-1/2 p-1">
                <TouchableOpacity
                  className="rounded-3xl h-32"
                  style={{
                    backgroundColor: c,
                  }}
                  onPress={() => {
                    setSelectedColor(c);
                  }}
                />
              </View>
            ))}
          </View>
          {selectedColor && (
            <Modal visible animationType="fade">
              <StatusBar hidden />
              <Pressable
                className="flex-1"
                onPress={() => {
                  setSelectedColor(null);
                }}
                style={{ backgroundColor: selectedColor }}
              />
            </Modal>
          )}
        </View>
      </Container>
    </Page>
  );
}
