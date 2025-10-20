import { detectOS } from '@/lib/utils';
import type { PlatformConfig, PlatformType } from '@/types/emoji';

// Note: name and description fields are no longer used directly in UI.
// Instead, we use i18n translations from messages/*.json (platforms.* and platformDescriptions.*)
export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  fluent: {
    id: 'fluent',
    name: 'Fluent Emoji',
    description: 'Microsoft Design System',
    icon: '🎨',
    styles: ['3d', 'color', 'flat', 'high-contrast']
  },
  native: {
    id: 'native',
    name: 'Native Platform',
    description: 'Auto-detect System',
    icon: '💻',
    styles: ['color']
  },
  nato: {
    id: 'nato',
    name: 'Noto Emoji',
    description: 'Google Open Source Design',
    icon: '🌐',
    styles: ['color']
  }
};

// 将 unicode 转换为 nato-emoji 文件名格式
function unicodeToNatoFilename(unicode: string): string {
  // unicode 格式如: "U+1F600" 或 "1F600" 或 "1f9d1 200d 1f3a8"（包含空格的复合emoji）
  // nato 文件名格式: "emoji_u1f600.svg" 或 "emoji_u1f9d1_200d_1f3a8.svg"
  // 注意：需要移除变体选择器（fe0e, fe0f）
  const cleaned = unicode
    .replace(/U\+/gi, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(code => code !== 'fe0e' && code !== 'fe0f') // 过滤掉变体选择器
    .join('_');
  return `emoji_u${cleaned}`;
}

// 模拟不同平台的emoji数据
export function getEmojiDataForPlatform(platform: PlatformType, baseEmojiData: any) {
  // 目前只有Fluent Emoji有真实数据，其他平台使用模拟数据
  if (platform === 'fluent') {
    return baseEmojiData;
  }

  // 为 nato 平台生成数据（使用 R2 CDN 上的 nato-emoji PNG 资源）
  if (platform === 'nato') {
    const natoEmojis = baseEmojiData.emojis.map((emoji: any) => ({
      ...emoji,
      id: `nato-${emoji.id}`,
      styles: {
        color: `nato-emoji/png/128/${unicodeToNatoFilename(emoji.unicode)}.png`
      }
    }));

    return {
      ...baseEmojiData,
      emojis: natoEmojis,
      totalCount: natoEmojis.length,
      emojisByCategory: natoEmojis.reduce((acc: any, emoji: any) => {
        if (!acc[emoji.group]) acc[emoji.group] = [];
        acc[emoji.group].push(emoji);
        return acc;
      }, {})
    };
  }

  // 原生平台：根据用户操作系统自动选择最佳方案
  if (platform === 'native') {
    const osInfo = detectOS();

    const nativeEmojis = baseEmojiData.emojis.map((emoji: any) => ({
      ...emoji,
      id: `native-${emoji.id}`,
      // 不同系统的策略：
      // - macOS/iOS: 使用系统原生 emoji（空 styles）
      // - Windows: 使用系统原生 emoji（Segoe UI Emoji）
      // - Android: 使用 Noto Emoji（Android 原生就是 Noto）
      // - Linux/Unknown: 使用 Noto Emoji 作为降级
      styles: osInfo.supportsNativeEmoji && (osInfo.type === 'macos' || osInfo.type === 'ios' || osInfo.type === 'windows')
        ? {} // macOS/iOS/Windows：显示系统原生 emoji
        : { color: `nato-emoji/png/128/${unicodeToNatoFilename(emoji.unicode)}.png` } // Android/Linux/其他：使用 Noto Emoji
    }));

    return {
      ...baseEmojiData,
      emojis: nativeEmojis,
      totalCount: nativeEmojis.length,
      emojisByCategory: nativeEmojis.reduce((acc: any, emoji: any) => {
        if (!acc[emoji.group]) acc[emoji.group] = [];
        acc[emoji.group].push(emoji);
        return acc;
      }, {})
    };
  }

  return baseEmojiData;
}
