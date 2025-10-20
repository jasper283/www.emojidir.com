'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import PlatformSwitcher from '@/components/PlatformSwitcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/config/cdn';
import { getEmojiDataForPlatform } from '@/lib/platforms';
import type { Emoji, EmojiIndex, PlatformType } from '@/types/emoji';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
// 构建时导入数据
import emojiIndexData from '@/data/emoji-index.json';

export default function EmojiDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const baseEmojiData = emojiIndexData as EmojiIndex;

  // 从 URL 获取参数
  const locale = params.locale as string;
  const platformSlug = params.platform as string;
  const selectedPlatform = platformSlug?.replace('-emoji', '') as PlatformType || 'fluent';
  const unicodeParam = decodeURIComponent(params.unicode as string);

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 根据选择的平台获取对应的emoji数据
  const emojiData = useMemo(() => {
    return getEmojiDataForPlatform(selectedPlatform, baseEmojiData);
  }, [selectedPlatform, baseEmojiData]);

  // 查找当前emoji
  const emoji = useMemo(() => {
    return emojiData.emojis.find((e: Emoji) => e.unicode === unicodeParam);
  }, [emojiData, unicodeParam]);

  // 获取所有可用的样式，包括特殊样式
  const getAllAvailableStyles = useCallback((): string[] => {
    if (!emoji) return [];

    const allStyles = Object.keys(emoji.styles);

    // 优先显示标准样式
    const standardStyles = allStyles.filter(style =>
      ['3d', 'color', 'flat', 'high-contrast'].includes(style)
    );

    // 如果没有标准样式，显示其他样式
    if (standardStyles.length === 0) {
      return allStyles.filter(style =>
        !style.includes('-default') &&
        !style.includes('dark') &&
        !style.includes('light') &&
        !style.includes('medium') &&
        style !== 'default'
      );
    }

    return standardStyles;
  }, [emoji]);

  const availableStyles = useMemo(() => getAllAvailableStyles(), [getAllAvailableStyles]);

  // 获取当前样式的图片路径，支持深浅色主题回退
  const getCurrentStyleUrl = useCallback((style: string): string => {
    if (!emoji) return '';

    // 首先尝试直接获取路径
    let imagePath = emoji.styles[style] || '';

    // 如果标准路径不存在，尝试深浅色主题路径
    if (!imagePath && ['3d', 'color', 'flat', 'high-contrast'].includes(style)) {
      const defaultStyleKey = `${style}-default`;
      imagePath = emoji.styles[defaultStyleKey] || '';
    }

    return imagePath;
  }, [emoji]);

  // 检查样式是否可用
  const isStyleAvailable = useCallback((style: string): boolean => {
    if (!emoji) return false;
    return !!(emoji.styles[style] || emoji.styles[`${style}-default`]);
  }, [emoji]);

  // 过滤出真正可用的样式
  const trulyAvailableStyles = useMemo(() =>
    availableStyles.filter(isStyleAvailable),
    [availableStyles, isStyleAvailable]
  );

  // 动态选择默认样式
  const selectedStyle = useMemo(() => {
    if (trulyAvailableStyles.length > 0) {
      return trulyAvailableStyles[0];
    }
    return '3d';
  }, [trulyAvailableStyles]);

  const [currentSelectedStyle, setCurrentSelectedStyle] = useState<string>(selectedStyle);

  const currentStyleUrl = useMemo(() =>
    getCurrentStyleUrl(currentSelectedStyle),
    [getCurrentStyleUrl, currentSelectedStyle]
  );

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 获取Noto Emoji的不同尺寸
  const natoSizes = [32, 72, 128, 512];

  // 获取Unicode文件名（用于Noto Emoji）
  const unicodeToNatoFilename = (unicode: string): string => {
    const cleaned = unicode
      .replace(/U\+/gi, '')
      .toLowerCase()
      .split(/\s+/)
      .filter(code => code !== 'fe0e' && code !== 'fe0f')
      .join('_');
    return `emoji_u${cleaned}`;
  };

  // 下载emoji图片（通过API路由代理）
  const downloadEmoji = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      // 使用API路由代理下载，绕过CORS限制
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请稍后重试');
    } finally {
      setDownloading(false);
    }
  };

  if (!emoji) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Emoji Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The emoji you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push(`/${locale}/${platformSlug}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // 判断是否有可下载的资源
  const hasDownloadableAsset = currentStyleUrl && currentStyleUrl.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/30 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/${locale}/${platformSlug}`)}
                className="hover:bg-accent"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Image src="/favicon.svg" alt={t('common.appName')} width={40} height={40} className="w-10 h-10" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {emoji.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PlatformSwitcher currentPlatform={selectedPlatform} />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Emoji Display */}
          <div className="space-y-6">
            {/* Main Emoji Display */}
            <div className="bg-card rounded-2xl p-12 border-2 shadow-lg">
              <div className="aspect-square flex items-center justify-center bg-muted/30 rounded-xl">
                {currentStyleUrl ? (
                  <Image
                    src={getAssetUrl(currentStyleUrl)}
                    alt={emoji.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <div className="text-9xl">{emoji.glyph}</div>
                )}
              </div>
            </div>

            {/* Style Selection - 只在有多个样式时显示 */}
            {trulyAvailableStyles.length > 1 && (
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-foreground">{t('common.style')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {trulyAvailableStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setCurrentSelectedStyle(style)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${currentSelectedStyle === style
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-card-foreground border-border hover:border-primary'
                        }`}
                    >
                      <span className="font-medium text-sm">
                        {t(`styles.${style}`, { defaultValue: style })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Copy Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => copyToClipboard(emoji.glyph)}
                className="w-full"
                variant={copied ? 'default' : 'outline'}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? t('common.copied') : t('common.copyToClipboard')}
              </Button>
              <Button
                onClick={() => copyToClipboard(emoji.unicode)}
                className="w-full"
                variant="outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Unicode
              </Button>
            </div>

            {/* Download Section - Fluent Emoji */}
            {hasDownloadableAsset && selectedPlatform === 'fluent' && (
              <div className="w-full">
                <Button
                  onClick={() => {
                    const ext = currentStyleUrl.endsWith('.svg') ? 'svg' : 'png';
                    downloadEmoji(
                      getAssetUrl(currentStyleUrl),
                      `${emoji.id}_${currentSelectedStyle}.${ext}`
                    );
                  }}
                  className="w-full"
                  variant="default"
                  disabled={downloading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloading ? 'Downloading...' : `Download ${currentSelectedStyle.toUpperCase()}`}
                </Button>
              </div>
            )}

            {/* Download Section - Noto Emoji (Multiple Sizes) */}
            {selectedPlatform === 'nato' && (
              <div className="w-full">
                <h4 className="text-sm font-semibold mb-3 text-center">Download Noto Emoji</h4>
                <div className="grid grid-cols-2 gap-2">
                  {natoSizes.map((size) => (
                    <Button
                      key={size}
                      onClick={() => {
                        const filename = unicodeToNatoFilename(emoji.unicode);
                        const url = getAssetUrl(`nato-emoji/png/${size}/${filename}.png`);
                        downloadEmoji(url, `${emoji.id}_${size}px.png`);
                      }}
                      variant="outline"
                      size="sm"
                      disabled={downloading}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {size}px
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Download Section - Native Platform (if has URL) */}
            {hasDownloadableAsset && selectedPlatform === 'native' && (
              <div className="w-full">
                <h4 className="text-sm font-semibold mb-3 text-center">Download (Noto Emoji)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {natoSizes.map((size) => (
                    <Button
                      key={size}
                      onClick={() => {
                        const filename = unicodeToNatoFilename(emoji.unicode);
                        const url = getAssetUrl(`nato-emoji/png/${size}/${filename}.png`);
                        downloadEmoji(url, `${emoji.id}_${size}px.png`);
                      }}
                      variant="outline"
                      size="sm"
                      disabled={downloading}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {size}px
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t('common.details')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold mt-1">{emoji.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Glyph</label>
                  <p className="text-4xl mt-2">{emoji.glyph}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Unicode</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-lg font-mono bg-muted px-3 py-1 rounded">
                      U+{emoji.unicode.toUpperCase()}
                    </code>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('common.category')}</label>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-sm">
                      {t(`categories.${emoji.group}`)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {emoji.keywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Platform Info */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">{t('common.platform')}</h3>
              <div className="space-y-2">
                <Badge variant="secondary" className="text-sm">
                  {t(`platforms.${selectedPlatform}`)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Available in {availableStyles.length} style{availableStyles.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

