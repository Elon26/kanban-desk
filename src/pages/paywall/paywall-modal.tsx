import { useWindowDimensions, View } from 'react-native';
import type { ModalComponentProp } from 'react-native-modalfy';

import type { ModalStackParams } from '@/components/modals';

import { PaywallA } from './paywall-a';
import { PaywallB } from './paywall-b';
import { PaywallC } from './paywall-c';
import { PaywallD } from './paywall-d';
import { PaywallE } from './paywall-e';

export function PaywallModal({
  modal: { params },
}: ModalComponentProp<
  ModalStackParams,
  ModalStackParams['Paywall'],
  'Paywall'
>) {
  const { width, height } = useWindowDimensions();
  return (
    <View style={{ width, height }}>
      {params?.type === 'a' && <PaywallA />}
      {params?.type === 'b' && <PaywallB />}
      {params?.type === 'c' && <PaywallC />}
      {params?.type === 'd' && <PaywallD />}
      {params?.type === 'e' && <PaywallE />}
    </View>
  );
}
