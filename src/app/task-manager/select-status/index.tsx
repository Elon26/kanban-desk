import { useLocalSearchParams } from 'expo-router';

import SelectStatusPage from '@/pages/task-manager/subpages/select-status-page';

export default function SelectStatusScreen() {
  const { taskId } = useLocalSearchParams();

  return <SelectStatusPage taskId={taskId} />;
}
