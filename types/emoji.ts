export interface EmojiStyles {
  '3d'?: string;
  'color'?: string;
  'flat'?: string;
  'high-contrast'?: string;
  // 深浅色主题支持
  '3d-default'?: string;
  'color-default'?: string;
  'flat-default'?: string;
  'high-contrast-default'?: string;
  // 允许任意字符串键
  [key: string]: string | undefined;
}

export interface Emoji {
  id: string;
  name: string;
  glyph: string;
  group: string;
  keywords: string[];
  unicode: string;
  tts: string;
  styles: EmojiStyles;
}

export interface EmojiIndex {
  emojis: Emoji[];
  categories: string[];
  emojisByCategory: Record<string, Emoji[]>;
  totalCount: number;
  generatedAt: string;
}

export type StyleType = '3d' | 'color' | 'flat' | 'high-contrast';
export type PlatformType = 'fluent' | 'native' | 'nato';

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  description: string;
  icon: string;
  styles: StyleType[];
}

