import { ScrollView, View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import WidgetImageA1 from '@/images/widgets/widget-a-1.png';
import WidgetImageA2 from '@/images/widgets/widget-a-2.png';
import WidgetImageA3 from '@/images/widgets/widget-a-3.png';
import WidgetImageA4 from '@/images/widgets/widget-a-4.png';
import WidgetImageB1 from '@/images/widgets/widget-b-1.png';
import WidgetImageB2 from '@/images/widgets/widget-b-2.png';
import WidgetImageB3 from '@/images/widgets/widget-b-3.png';
import WidgetImageB4 from '@/images/widgets/widget-b-4.png';
import WidgetImageB5 from '@/images/widgets/widget-b-5.png';

import { WidgetItem } from '../components/widget-item';

type Props = { isAod: boolean };

export function WidgetItemPage({ isAod }: Props) {
  const selectedLang = useStorageValue('selectedLang');

  const ordinarySteps = [
    {
      label: langs[selectedLang].step + ' 1',
      text: langs[selectedLang].pages.settings.widget_steps.ordinary_one,
      img: WidgetImageA1,
    },
    {
      label: langs[selectedLang].step + ' 2',
      text: langs[selectedLang].pages.settings.widget_steps.ordinary_two,
      img: WidgetImageA2,
    },
    {
      label: langs[selectedLang].step + ' 3',
      text: langs[selectedLang].pages.settings.widget_steps.ordinary_three,
      img: WidgetImageA3,
    },
    {
      label: langs[selectedLang].step + ' 4',
      text: langs[selectedLang].pages.settings.widget_steps.ordinary_four,
      img: WidgetImageA4,
    },
  ];

  const aodSteps = [
    {
      label: langs[selectedLang].step + ' 1',
      text: langs[selectedLang].pages.settings.widget_steps.aod_one,
      img: WidgetImageB1,
    },
    {
      label: langs[selectedLang].step + ' 2',
      text: langs[selectedLang].pages.settings.widget_steps.aod_two,
      img: WidgetImageB2,
    },
    {
      label: langs[selectedLang].step + ' 3',
      text: langs[selectedLang].pages.settings.widget_steps.aod_three,
      img: WidgetImageB3,
    },
    {
      label: langs[selectedLang].step + ' 4',
      text: langs[selectedLang].pages.settings.widget_steps.aod_four,
      img: WidgetImageB4,
    },
    {
      label: langs[selectedLang].step + ' 5',
      text: langs[selectedLang].pages.settings.widget_steps.aod_five,
      img: WidgetImageB5,
    },
  ];

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={
            isAod
              ? langs[selectedLang].page_names.aod_widget
              : langs[selectedLang].page_names.home_widget
          }
        />
        <ScrollView className="mt-5">
          <View className="gap-y-5 pb-10">
            {(isAod ? aodSteps : ordinarySteps).map((step) => (
              <WidgetItem
                key={step.label}
                label={step.label}
                text={step.text}
                img={step.img}
              />
            ))}
          </View>
        </ScrollView>
      </Container>
    </Page>
  );
}
