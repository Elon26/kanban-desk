import { scaleX, scaleY } from '@kirz/nativewind-scale';
import * as Burnt from 'burnt';
import * as Clipboard from 'expo-clipboard';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import {
  Switch,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { type ModalComponentProp, useModal } from 'react-native-modalfy';
import { twMerge } from 'tailwind-merge';

import type { ModalStackParams } from '@/components/modals';
import { colors } from '@/config/theme';
import { BlurryBackdrop } from '@/ui/blurry-backdrop';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';
import { UiTextInput } from '@/ui/ui-text-input';
import LinkIcon from '@/svg/link.svg';
import ContactIcon from '@/svg/username.svg';
import CircleArrowsIcon from '@/svg/circle-arrows.svg';
import PasswordIcon from '@/svg/password.svg';

import {
  addPassword,
  updatePassword,
  useSecretPassword,
} from '../hooks/use-secret-passwords';
import {
  charSets,
  generatePassword,
} from '../hooks/use-secret-passwords/helper';
import { PasswordLengthSlider } from './password-length-slider';
import { useStorage } from '@/hooks/use-storage';
import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

type Charset = keyof typeof charSets;
const DEFAULT_CHARSET: Charset[] = ['digits', 'letters'];
const DEFAULT_PASSWORD_LENGTH = 8;

export function SecretPasswordModal({
  modal: { params },
}: ModalComponentProp<ModalStackParams, object, 'SecretPasswordModal'>) {
  const selectedLang = useStorageValue('selectedLang');
  const { width } = useWindowDimensions();
  const id = params?.id;
  const pw = useSecretPassword(id ?? '');

  let initialCharset: Charset[] = DEFAULT_CHARSET;
  let initialPasswordLength = DEFAULT_PASSWORD_LENGTH;
  if (pw?.password?.length) {
    const p = pw.password;
    initialCharset = [];
    initialPasswordLength = p.length;
    for (const [name, chars] of Object.entries(charSets)) {
      if (new RegExp(`[${chars}]`, 'g').test(p)) {
        initialCharset.push(name as Charset);
      }
    }
  }

  const [charset, setCharset] = useState(initialCharset);
  const [passwordLength, setPasswordLength] = useState(initialPasswordLength);

  const useLink = useState(pw?.link ?? '');
  const useUsername = useState(pw?.login ?? '');
  const usePassword = useState(
    pw?.password ?? generatePassword(initialPasswordLength, charset)
  );

  const [link, login, password] = [useLink[0], useUsername[0], usePassword[0]];

  const getStateHash = () => JSON.stringify({ link, login, password });
  const initialStateHash = useRef(getStateHash());
  const isChanged = initialStateHash.current !== getStateHash();

  const submitDisabled = !link || !login || !password || !isChanged;

  const [lastSecureAction, setLastSecureAction] =
    useStorage('lastSecureAction');
  const [securedDataPercent, setSecuredDataPercent] =
    useStorage('securedDataPercent');
  let updatedSecuredDataPercent = securedDataPercent;

  const handleSubmit = () => {
    if (id) {
      updatePassword({
        id,
        link,
        login,
        password,
      });
    } else {
      addPassword({
        link,
        login,
        password,
      });

      if (updatedSecuredDataPercent < 100) {
        updatedSecuredDataPercent += 10;
        setSecuredDataPercent(updatedSecuredDataPercent);
        setLastSecureAction(Date.now());
      }
    }
  };

  return (
    <BlurryBackdrop>
      <View
        className="rounded-3xl bg-[#2d2532] p-2.5"
        style={{ width: width - scaleX(40) }}
      >
        <UiText className="text-center text-lg font-bold mb-4">
          {langs[selectedLang].modals.secret_password_modal.password_editor}
        </UiText>
        <Form
          useLink={useLink}
          useUsername={useUsername}
          usePassword={usePassword}
          passwordLength={passwordLength}
          setPasswordLength={setPasswordLength}
          charsets={charset}
        />
        <Buttons
          setCharset={setCharset}
          currentCharsets={charset}
          setPassword={usePassword[1]}
          passwordLength={passwordLength}
          handleSubmit={handleSubmit}
          submitDisabled={submitDisabled}
        />
      </View>
    </BlurryBackdrop>
  );
}

type FormProps = {
  useLink: [string, Dispatch<SetStateAction<string>>];
  useUsername: [string, Dispatch<SetStateAction<string>>];
  usePassword: [string, Dispatch<SetStateAction<string>>];
  passwordLength: number;
  setPasswordLength: Dispatch<SetStateAction<number>>;
  charsets: Charset[];
};

function Form({
  useLink,
  usePassword,
  useUsername,
  passwordLength,
  setPasswordLength,
  charsets,
}: FormProps) {
  const [link, setLink] = useLink;
  const [username, setUsername] = useUsername;
  const [password, setPassword] = usePassword;
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="gap-2.5 my-1.5">
      <View className="gap-2.5">
        <UiTextInput
          name="Link"
          Icon={LinkIcon}
          placeholder={
            langs[selectedLang].modals.secret_password_modal.enter_link
          }
          keyboardType="url"
          value={link}
          onChangeText={setLink}
        />
        <UiTextInput
          name="Username"
          Icon={ContactIcon}
          placeholder={
            langs[selectedLang].modals.secret_password_modal.enter_username
          }
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View className="rounded-2xl bg-white/10 gap-y-6 pl-2.5 pr-2.5 pb-7.5 pt-2.5">
        <UiTextInput
          name="Password"
          Icon={PasswordIcon}
          placeholder={
            langs[selectedLang].modals.secret_password_modal.enter_password
          }
          value={password}
          onChangeText={setPassword}
        />
        <View>
          <UiText className="text-sm">
            {langs[selectedLang].modals.secret_password_modal.password_length}
          </UiText>
          <PasswordLengthSlider
            value={passwordLength}
            onChange={(val) => {
              setPasswordLength(val);
              if (typeof val === 'number') {
                setPassword(generatePassword(val, charsets));
              }
            }}
          />
        </View>
        <View className="absolute z-30 left-[50%] top-[100%]">
          <View className="-left-[35%] rotate-45 items-center justify-center rounded-full bg-[#2d2532] top-[15%] size-16">
            <TouchableOpacity
              className="aspect-square items-center justify-center rounded-full bg-[#A3C9FA] size-15"
              onPress={() =>
                setPassword(generatePassword(passwordLength, charsets))
              }
            >
              <CircleArrowsIcon className="rotate-90" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

type ButtonsProps = {
  currentCharsets: Charset[];
  setCharset: Dispatch<SetStateAction<Charset[]>>;
  setPassword: Dispatch<SetStateAction<string>>;
  passwordLength: number;
  submitDisabled: boolean;
  handleSubmit: () => void;
};

function Buttons({
  currentCharsets,
  setCharset,
  setPassword,
  passwordLength,
  submitDisabled,
  handleSubmit,
}: ButtonsProps) {
  const selectedLang = useStorageValue('selectedLang');
  const modal = useModal<ModalStackParams>();

  const toggleCharset = (name: Charset) => {
    setCharset((charsets) => {
      const newCS = charsets.includes(name)
        ? charsets.filter((charset) => charset !== name)
        : [...charsets, name];

      if (newCS.length === 0) {
        setPassword(generatePassword(passwordLength, ['digits']));
        return ['digits'];
      }
      setPassword(generatePassword(passwordLength, newCS));
      return newCS;
    });
  };

  const options: [string, string, Charset][] = [
    [
      langs[selectedLang].modals.secret_password_modal.digits,
      'e.g. 123',
      'digits',
    ],
    [
      langs[selectedLang].modals.secret_password_modal.letters,
      'e.g. abc',
      'letters',
    ],
    [
      langs[selectedLang].modals.secret_password_modal.symbols,
      'e.g.%!#',
      'symbols',
    ],
  ];

  return (
    <View className="gap-y-2.5">
      <View className="rounded-2xl bg-white/10 gap-y-4 pl-2.5 pr-2.5 pb-2.5 pt-7.5">
        {options.map(([title, subtitle, charset]) => (
          <TouchableOpacity
            key={title}
            className="flex-row items-center justify-between gap-x-2.5"
            onPress={() => toggleCharset(charset)}
          >
            <View className="flex-row items-center gap-x-2.5">
              <UiText className="font-medium pt-1">{title}</UiText>
              <UiText className="text-xl text-gray">({subtitle})</UiText>
            </View>
            <Switch
              value={currentCharsets.includes(charset)}
              trackColor={{ false: '#767577', true: '#3D93F2' }}
              onChange={() => toggleCharset(charset)}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-row gap-x-4">
        <TouchableOpacity
          className="flex-1 basis-1/2 items-center justify-center rounded-2xl border border-blue bg-white/10 py-3"
          onPress={() => modal.closeModal('SecretPasswordModal')}
        >
          <UiText className="text-xl font-semibold text-blue">
            {langs[selectedLang].close}
          </UiText>
        </TouchableOpacity>
        <TouchableOpacity
          className={twMerge(
            'flex-1 basis-1/2 items-center justify-center rounded-2xl bg-blue py-3',
            submitDisabled ? 'bg-blue/20' : ''
          )}
          disabled={submitDisabled}
          onPress={() => {
            if (!submitDisabled) {
              handleSubmit();
              modal.closeModal('SecretPasswordModal');
            }
          }}
        >
          <UiText
            className={twMerge(
              'text-xl font-semibold capitalize',
              submitDisabled ? 'text-white/20' : 'v'
            )}
          >
            {langs[selectedLang].done}
          </UiText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
