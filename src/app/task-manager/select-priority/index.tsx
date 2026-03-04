import { useLocalSearchParams } from 'expo-router';

import SelectPriorityPage from '@/pages/task-manager/subpages/select-priority-page';

export default function SelectPriorityScreen() {
  const { taskId } = useLocalSearchParams();

  return <SelectPriorityPage taskId={taskId} />;
}
