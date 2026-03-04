import { useLocalSearchParams } from 'expo-router';

import EditTaskPage from '@/pages/task-manager/subpages/edit-task-page';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();

  return <EditTaskPage id={id} />;
}
