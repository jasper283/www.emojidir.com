'use client';

import { Card } from '@/components/ui/card';
import { getAssetUrl } from '@/config/cdn';
import type { Emoji, StyleType } from '@/types/emoji';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface EmojiCardProps {
  emoji: Emoji;
  style: StyleType;
}

export default function EmojiCard({ emoji, style }: EmojiCardProps) {
  const [imageError, setImageError] = useState(false);
  const [useDefaultTheme, setUseDefaultTheme] = useState(false);
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();

  // 获取当前选择的样式的图片路径，支持深浅色主题
  const getImagePath = () => {
    // 首先尝试获取标准路径
    let imagePath = emoji.styles[style] || emoji.styles['3d'] || emoji.styles['color'] || emoji.styles['flat'] || '';

    // 如果标准路径不存在或加载失败，尝试深浅色主题路径
    if (!imagePath || useDefaultTheme) {
      // 首先尝试从数据中获取default路径
      const defaultStyleKey = `${style}-default`;
      imagePath = emoji.styles[defaultStyleKey] || '';

      // 如果数据中没有default路径，则动态构建
      if (!imagePath) {
        // 构建深浅色主题路径：assets/[emoji-name]/default/[style]/xxx.png
        const emojiName = emoji.name.toLowerCase().replace(/\s+/g, '-');
        const styleMap = {
          '3d': '3d',
          'color': 'color',
          'flat': 'flat',
          'high-contrast': 'high-contrast'
        };
        const styleFolder = styleMap[style] || '3d';

        // 构建文件名：emoji_name_style_default.png
        const fileName = `${emojiName.replace(/-/g, '_')}_${styleFolder}_default.${style === '3d' ? 'png' : 'svg'}`;
        imagePath = `assets/${emojiName}/default/${styleFolder}/${fileName}`;
      }
    }

    return imagePath;
  };

  const imagePath = getImagePath();
  const imageUrl = imagePath ? getAssetUrl(imagePath) : '';

  const handleImageError = () => {
    console.warn(`图片加载失败: ${imageUrl} (${emoji.name})`);

    // 如果标准路径失败，尝试深浅色主题路径
    if (!useDefaultTheme) {
      setUseDefaultTheme(true);
      setImageError(false); // 重置错误状态，尝试新路径
    } else {
      setImageError(true);
    }
  };

  const handleClick = () => {
    const platform = params.platform as string;
    router.push(`/${locale}/${platform}/${encodeURIComponent(emoji.unicode)}`);
  };

  return (
    <Card
      className="hover:shadow-lg transition-all duration-200 cursor-pointer relative group hover:scale-105 border-2 hover:border-primary"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="aspect-square flex items-center justify-center mb-2 bg-muted/50 rounded-md">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={emoji.name}
              width={128}
              height={128}
              className="w-full h-full object-contain"
              onError={handleImageError}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            />
          ) : (
            <div className="text-5xl">{emoji.glyph}</div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground truncate" title={emoji.name}>
            {emoji.name}
          </p>
        </div>
      </div>
    </Card>
  );
}

