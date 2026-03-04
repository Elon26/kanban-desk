import { withAuthenticationRequired } from 'expo-with-pincode';

import { SecretPasswords } from '@/pages/secret-folder/passwords';

function SecretContactsScreen() {
  return <SecretPasswords />;
}

export default withAuthenticationRequired(SecretContactsScreen);
