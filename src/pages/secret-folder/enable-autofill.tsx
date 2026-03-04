import { Env } from '@kirz/expo-env';
import { scaleY } from '@kirz/nativewind-scale';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { PageHeader } from '@/components/page-header';
import { colors } from '@/config/theme';
import AppIcon from '@/images/splash-icon.png';
import KeyIcon from '@/svg/key-alt.svg';
import SettingsIcon from '@/svg/settings.svg';
import { FadeGradient } from '@/ui/fade-gradient';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

export function EnableAutofill() {
  const selectedLang = useStorageValue('selectedLang');
  const insets = useSafeAreaInsets();

  return (
    <Page>
      <PageBackground />
      <Container>
        <PageHeader pageName={langs[selectedLang].page_names.autofill_guide} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-y-2"
          contentContainerStyle={{
            paddingTop: scaleY(24),
            paddingBottom: scaleY(48 + 16) + (insets.bottom || scaleY(16)),
          }}
        >
          <View className="flex-row items-center rounded-2xl bg-white/10 gap-5 px-4 py-2.5">
            <SettingsIcon
              className="size-12"
              style={{
                shadowColor: colors.black.toString(),
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              }}
            />
            <View className="gap-y-0.5">
              <UiText className="text-sm text-gray">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_one_title
                }
              </UiText>
              <UiText className="text-lg">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_one_text
                }
              </UiText>
            </View>
          </View>

          <View className="rounded-2xl bg-white/10 gap-y-4 px-4 py-2.5">
            <View className="gap-y-0.5 pl-3">
              <UiText className="text-sm text-gray">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_two_title
                }
              </UiText>
              <UiText className="text-lg">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_two_text
                }
              </UiText>
            </View>

            <View
              className="flex-row items-center rounded-lg bg-white/10 gap-x-3 px-4"
              style={{ height: scaleY(44) }}
            >
              <View className="items-center justify-center rounded-lg bg-[#8E8E90] size-8">
                <KeyIcon />
              </View>
              <UiText>
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .passwords
                }
              </UiText>
            </View>
          </View>

          <View className="rounded-2xl bg-white/10 gap-y-4 px-4 py-2.5">
            <View className="gap-y-0.5 pl-3">
              <UiText className="text-sm text-gray">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_three_title
                }
              </UiText>
              <UiText className="text-lg">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_three_text
                }
              </UiText>
            </View>

            <View
              className="flex-row items-center rounded-lg bg-white/10 gap-x-3 px-4"
              style={{ height: scaleY(44) }}
            >
              <UiText>
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .passwords_options
                }
              </UiText>
            </View>
          </View>

          <View className="rounded-2xl bg-white/10 gap-y-4 px-4 py-2.5">
            <View className="gap-y-0.5 pl-3">
              <UiText className="text-sm text-gray">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_four_title
                }
              </UiText>
              <UiText className="text-lg">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_four_text
                }
              </UiText>
            </View>

            <View
              className="flex-row items-center justify-between rounded-lg bg-white/10 gap-x-3 px-4"
              style={{ height: scaleY(44) }}
            >
              <UiText>
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .autoFill_passwords
                }
              </UiText>
              <Switch value pointerEvents="none" />
            </View>
          </View>

          <View className="rounded-2xl bg-white/10 gap-y-4 px-4 py-2.5">
            <View className="gap-y-0.5 pl-3">
              <UiText className="text-sm text-gray">
                {
                  langs[selectedLang].pages.secret_folder.enable_autofill
                    .step_five_title
                }
              </UiText>
              <UiText className="text-lg">
                {langs[selectedLang].page_names.select} {Env.APP_NAME}
              </UiText>
            </View>

            <View
              className="flex-row items-center rounded-lg bg-white/10 gap-x-3 px-4"
              style={{ height: scaleY(44) }}
            >
              <Image source={AppIcon} className="rounded-lg size-7.5" />
              <UiText>{Env.APP_NAME}</UiText>
              <View className="flex-1" />
              <SfSymbol name="checkmark" tintColor={colors.blue.toString()} />
            </View>
          </View>
        </ScrollView>
        <FadeGradient />
        <View
          className="absolute flex-row items-stretch gap-2.5 left-edge right-edge px-edge"
          style={{ bottom: insets.bottom + scaleY(20) || scaleY(36) }}
        >
          <UiButton
            className="flex-1 bg-blue"
            onPress={() => {
              router.back();
            }}
          >
            {langs[selectedLang].buttons.continue}
          </UiButton>
        </View>
      </Container>
    </Page>
  );
}
