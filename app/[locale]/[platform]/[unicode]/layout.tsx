import { getAssetUrl } from '@/config/cdn';
import { locales } from '@/i18n/config';
import type { Emoji, EmojiIndex, PlatformType } from '@/types/emoji';
import type { Metadata } from 'next';
// 构建时导入数据
import emojiIndexData from '@/data/emoji-index.json';

const baseUrl = 'https://emojidir.com';
const baseEmojiData = emojiIndexData as EmojiIndex;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; platform: string; unicode: string }>;
}): Promise<Metadata> {
  const { locale, platform: platformSlug, unicode } = await params;
  const platformId = platformSlug?.replace('-emoji', '') as PlatformType;

  // 查找emoji
  const emoji = baseEmojiData.emojis.find((e: Emoji) => e.unicode === unicode);

  if (!emoji) {
    return {
      title: 'Emoji Not Found - Emoji Directory',
      description: 'The emoji you are looking for could not be found.',
    };
  }

  // 平台名称多语言映射
  const platformNames: Record<string, Record<string, string>> = {
    'en': { fluent: 'Fluent Emoji', nato: 'Noto Emoji', native: 'Native Platform' },
    'zh-CN': { fluent: 'Fluent Emoji', nato: 'Noto Emoji', native: '原生平台' },
    'zh-TW': { fluent: 'Fluent Emoji', nato: 'Noto Emoji', native: '原生平台' },
    'ja': { fluent: 'Fluent Emoji', nato: 'Noto Emoji', native: 'ネイティブプラットフォーム' },
    'ko': { fluent: 'Fluent Emoji', nato: 'Noto Emoji', native: '네이티브 플랫폼' },
  };

  const platformName = platformNames[locale]?.[platformId] || platformNames['en'][platformId];
  const title = `${emoji.glyph} ${emoji.name} - ${platformName}`;
  const description = `${emoji.name} emoji (${emoji.glyph}). Unicode: U+${emoji.unicode.toUpperCase()}. Category: ${emoji.group}. Download and copy this emoji in multiple styles. Keywords: ${emoji.keywords.slice(0, 5).join(', ')}.`;
  const imageUrl = emoji.styles['color']
    ? getAssetUrl(emoji.styles['color'])
    : `${baseUrl}/favicon.svg`;

  return {
    title,
    description,
    keywords: [...emoji.keywords, emoji.name, 'emoji', platformId, emoji.group],
    alternates: {
      canonical: `${baseUrl}/${locale}/${platformSlug}/${unicode}`,
      languages: Object.fromEntries(
        locales.map(loc => [loc, `${baseUrl}/${loc}/${platformSlug}/${unicode}`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/${platformSlug}/${unicode}`,
      type: 'website',
      locale,
      siteName: 'Emoji Directory',
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: `${emoji.name} emoji`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  // 只为主要平台生成静态参数，避免生成过多页面
  const mainPlatform = 'fluent-emoji';
  const params = [];

  for (const locale of locales) {
    for (const emoji of baseEmojiData.emojis) {
      params.push({
        locale,
        platform: mainPlatform,
        unicode: emoji.unicode,
      });
    }
  }

  return params;
}

export default function EmojiDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

