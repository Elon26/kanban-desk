const theme = {
  primary: '#54FF7F',
  background: '#020B10',
  secondary: '#302f46',
  text: {
    DEFAULT: '#FFFFFF',
    black: '#002917',
  },
  transparent: 'transparent',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#BFBFBF',
  green: '#46D96B',
  red: '#FF5454',
  pink: '#F5CDE9',
  blue: '#3D93F2',
  violet: 'BBB8ED',
} as const;

export const gradients = {
  primary: ['#30AD50', '#4CE572'],
  red: ['#AD3030', '#FF5454'],
} as const;

type Palette = typeof theme;
type ColorKey = keyof Palette;

type DefaultOrNever<T extends ColorKey> = Palette[T] extends Record<string, string>
  ? Palette[T]['DEFAULT'] extends string
    ? Palette[T]['DEFAULT']
    : never
  : never;

type ThemePalette = {
  [K in keyof Palette]: Palette[K] extends string
    ? Palette[K]
    : DefaultOrNever<K> extends never
      ? { [P in keyof Palette[K]]: Palette[K][P] }
      : DefaultOrNever<K> & { [P in keyof Palette[K]]: Palette[K][P] };
};

class ThemeColor<T extends ColorKey> extends String {
  private static colors = theme;
  private DEFAULT: string | undefined;
  #key: T;

  constructor(key: T) {
    super();
    this.#key = key;
    const value = ThemeColor.colors[key];

    if (typeof value === 'string') {
      this.DEFAULT = value;
    } else if (typeof value === 'object') {
      if ('DEFAULT' in value) {
        this.DEFAULT = value.DEFAULT;
      }
      Object.assign(this, value);
    }
  }

  toString() {
    if (__DEV__ && !this.DEFAULT) {
      console.warn(`⚠️ 🎨 Color ${this.#key} has no DEFAULT value`);
    }
    return this.DEFAULT ?? (__DEV__ ? '#FF0000' : '#000000');
  }
}

export const colors: ThemePalette = Object.keys(theme).reduce((acc, key) => {
  const k = key as ColorKey;
  acc[k] = new ThemeColor(k);
  return acc;
  // biome-ignore lint/suspicious/noExplicitAny: prevent early type assertion
}, {} as any);
