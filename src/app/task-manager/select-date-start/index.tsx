import { useLocalSearchParams } from 'expo-router';

import SelectDateStartPage from '@/pages/task-manager/subpages/select-date-start-page';

export default function SelectDateStartScreen() {
  const { taskId } = useLocalSearchParams();

  return <SelectDateStartPage taskId={taskId} />;
}
