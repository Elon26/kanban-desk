import { useLocalSearchParams } from 'expo-router';

import SelectDeadlinePage from '@/pages/task-manager/subpages/select-deadline-page';

export default function SelectDeadlineScreen() {
  const { taskId } = useLocalSearchParams();

  return <SelectDeadlinePage taskId={taskId} />;
}
