import { atom } from 'jotai';

export const queryEnabledAtom = atom({
  any: false,
  number: false,
  name: false,
});
