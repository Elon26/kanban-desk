import { withAuthenticationRequired } from 'expo-with-pincode';

import { SecretContacts } from '@/pages/secret-folder/contacts';

function SecretContactsScreen() {
  return <SecretContacts />;
}

export default withAuthenticationRequired(SecretContactsScreen);
