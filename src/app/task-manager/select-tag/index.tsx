import { useLocalSearchParams } from 'expo-router';

import SelectTagPage from '@/pages/task-manager/subpages/select-tag-page';

export default function SelectTagScreen() {
  const { taskId } = useLocalSearchParams();

  return <SelectTagPage taskId={taskId} />;
}
