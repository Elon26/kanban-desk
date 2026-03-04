import { Env } from '@kirz/expo-env';
import { useState } from 'react';
import { View } from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { PressableCard } from '@/components/pressable-card';
import { useStorageValue } from '@/hooks/use-storage';
import { useWebViewModal } from '@/hooks/use-web-view-modal';
import langs from '@/i18n/langs.json';
import ContactIcon from '@/svg/about/contact.svg';
import LicenseIcon from '@/svg/about/license.svg';
import PrivacyIcon from '@/svg/about/privacy.svg';
import RateIcon from '@/svg/about/rate.svg';
import TermsIcon from '@/svg/about/terms.svg';

import RateModal from './components/rate-modal';

export default function AboutPage() {
  const selectedLang = useStorageValue('selectedLang');
  const { openModal: openWebViewModal } = useWebViewModal();
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);

  return (
    <View>
      <Page>
        <PageBackground />
        <Container>
          <PageHeader pageName={langs[selectedLang].page_names.about} />
          <View className="gap-y-3 pt-13">
            <PressableCard
              title={langs[selectedLang].pages.settings.contact_us}
              Icon={ContactIcon}
              handler={() => openWebViewModal(Env.CONTACT_US)}
            />
            <PressableCard
              title={langs[selectedLang].pages.settings.rate_us}
              Icon={RateIcon}
              handler={() => setIsRateModalOpen(true)}
            />
            <PressableCard
              title={langs[selectedLang].pages.settings.privacy}
              Icon={PrivacyIcon}
              handler={() => openWebViewModal(Env.PRIVACY_POLICY)}
            />
            <PressableCard
              title={langs[selectedLang].pages.settings.license}
              Icon={LicenseIcon}
              handler={() => openWebViewModal(Env.LICENCE_AGREEMENT)}
            />
            <PressableCard
              title={langs[selectedLang].pages.settings.terms}
              Icon={TermsIcon}
              handler={() => openWebViewModal(Env.TERMS_OF_USE)}
            />
          </View>
        </Container>
      </Page>

      {isRateModalOpen && (
        <RateModal closeModal={() => setIsRateModalOpen(false)} />
      )}
    </View>
  );
}
