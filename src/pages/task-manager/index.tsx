import { scaleY } from '@kirz/nativewind-scale';
import { type RelativePathString } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

import ResumeArea from './components/resume-area';
import TaskTableAreaCalendarView from './components/task-table-area-calendar-view';
import TaskTableAreaDeskView from './components/task-table-area-desk-view';

export default function TaskManagerPage() {
  const selectedLang = useStorageValue('selectedLang');
  const insets = useSafeAreaInsets();
  const [isCalendarView, setIsCalendarView] = useState(false);

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader
          pageName={langs[selectedLang].page_names.task_manager}
          customBack={'/main' as RelativePathString}
          rightButtonLabel={
            isCalendarView
              ? langs[selectedLang].page_names.desk_view
              : langs[selectedLang].page_names.calendar_view
          }
          rightButtonHandler={() => setIsCalendarView((prev) => !prev)}
          bigRightButton
        />
        <View
          className="flex-1 gap-y-4 mt-4"
          style={{ paddingBottom: insets.bottom || scaleY(16) }}
        >
          <ResumeArea />
          {isCalendarView ? (
            <TaskTableAreaCalendarView />
          ) : (
            <TaskTableAreaDeskView />
          )}
        </View>
      </Container>
    </Page>
  );
}
