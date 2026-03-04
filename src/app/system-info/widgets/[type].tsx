import { useLocalSearchParams } from 'expo-router';

import { WidgetItemPage } from '@/pages/system-info/subpages/widget-item-page';

export default function WidgetItemScreen() {
  const { type } = useLocalSearchParams();
  let isAod = false;
  if (type === 'aod') isAod = true;

  return <WidgetItemPage isAod={isAod} />;
}
