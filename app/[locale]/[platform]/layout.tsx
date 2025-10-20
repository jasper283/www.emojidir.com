import { locales } from '@/i18n/config';
import { PLATFORM_CONFIGS } from '@/lib/platforms';
import type { PlatformType } from '@/types/emoji';
import type { Metadata } from 'next';

const baseUrl = 'https://emojidir.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; platform: string }>;
}): Promise<Metadata> {
  const { locale, platform: platformSlug } = await params;
  const platformId = platformSlug?.replace('-emoji', '') as PlatformType;
  const platformConfig = PLATFORM_CONFIGS[platformId];

  if (!platformConfig) {
    return {};
  }

  // 平台名称和描述的多语言版本
  const platformMetadata: Record<string, Record<string, { name: string; description: string }>> = {
    'en': {
      'fluent': {
        name: 'Fluent Emoji',
        description: 'Browse and download thousands of Microsoft Fluent Emoji in 3D, Color, Flat, and High Contrast styles. Modern design system emojis for your projects.'
      },
      'nato': {
        name: 'Noto Emoji',
        description: 'Explore Google\'s Noto Emoji collection with thousands of open-source emojis. Download high-quality emoji images in multiple sizes.'
      },
      'native': {
        name: 'Native Platform Emoji',
        description: 'View emojis in your system\'s native style. Auto-detected platform-specific emoji rendering for macOS, Windows, Android, and iOS.'
      }
    },
    'zh-CN': {
      'fluent': {
        name: 'Fluent Emoji',
        description: '浏览和下载数千个微软 Fluent Emoji，包括 3D、彩色、扁平和高对比度风格。适用于您项目的现代设计系统表情符号。'
      },
      'nato': {
        name: 'Noto Emoji',
        description: '探索谷歌的 Noto Emoji 集合，包含数千个开源表情符号。下载多种尺寸的高质量表情符号图片。'
      },
      'native': {
        name: '原生平台表情符号',
        description: '以系统原生风格查看表情符号。自动检测适用于 macOS、Windows、Android 和 iOS 的平台特定表情符号渲染。'
      }
    },
    'zh-TW': {
      'fluent': {
        name: 'Fluent Emoji',
        description: '瀏覽和下載數千個微軟 Fluent Emoji，包括 3D、彩色、扁平和高對比度風格。適用於您專案的現代設計系統表情符號。'
      },
      'nato': {
        name: 'Noto Emoji',
        description: '探索谷歌的 Noto Emoji 集合，包含數千個開源表情符號。下載多種尺寸的高品質表情符號圖片。'
      },
      'native': {
        name: '原生平台表情符號',
        description: '以系統原生風格查看表情符號。自動偵測適用於 macOS、Windows、Android 和 iOS 的平台特定表情符號渲染。'
      }
    },
    'ja': {
      'fluent': {
        name: 'Fluent Emoji',
        description: 'Microsoft Fluent Emojiを数千個閲覧・ダウンロード。3D、カラー、フラット、ハイコントラストスタイル対応。プロジェクト用の現代的なデザインシステム絵文字。'
      },
      'nato': {
        name: 'Noto Emoji',
        description: 'GoogleのNoto Emojiコレクションを探索。数千のオープンソース絵文字。複数サイズの高品質絵文字画像をダウンロード。'
      },
      'native': {
        name: 'ネイティブプラットフォーム絵文字',
        description: 'システムのネイティブスタイルで絵文字を表示。macOS、Windows、Android、iOS用のプラットフォーム固有の絵文字レンダリングを自動検出。'
      }
    },
    'ko': {
      'fluent': {
        name: 'Fluent Emoji',
        description: '수천 개의 Microsoft Fluent Emoji를 3D, 컬러, 플랫, 고대비 스타일로 찾아보고 다운로드하세요. 프로젝트를 위한 현대적인 디자인 시스템 이모지.'
      },
      'nato': {
        name: 'Noto Emoji',
        description: 'Google의 Noto Emoji 컬렉션을 탐색하세요. 수천 개의 오픈소스 이모지. 여러 크기의 고품질 이모지 이미지를 다운로드하세요.'
      },
      'native': {
        name: '네이티브 플랫폼 이모지',
        description: '시스템의 네이티브 스타일로 이모지를 확인하세요. macOS, Windows, Android, iOS용 플랫폼별 이모지 렌더링을 자동 감지합니다.'
      }
    }
  };

  const localeMetadata = platformMetadata[locale]?.[platformId] || platformMetadata['en'][platformId];
  const title = `${localeMetadata.name} - Emoji Directory`;
  const description = localeMetadata.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/${platformSlug}`,
      languages: Object.fromEntries(
        locales.map(loc => [loc, `${baseUrl}/${loc}/${platformSlug}`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/${platformSlug}`,
      type: 'website',
      locale,
      siteName: 'Emoji Directory',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const platforms = Object.keys(PLATFORM_CONFIGS);
  const params = [];

  for (const locale of locales) {
    for (const platform of platforms) {
      params.push({
        locale,
        platform: `${platform}-emoji`
      });
    }
  }

  return params;
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

