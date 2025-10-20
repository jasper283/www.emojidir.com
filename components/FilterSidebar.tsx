'use client';

import { Badge } from '@/components/ui/badge';
import { PLATFORM_CONFIGS } from '@/lib/platforms';
import { detectOS } from '@/lib/utils';
import type { PlatformType, StyleType } from '@/types/emoji';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FilterSidebarProps {
  currentPlatform: PlatformType;
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  emojisByCategory: Record<string, any[]>;
}

const PLATFORMS = Object.values(PLATFORM_CONFIGS);

const STYLES = [
  { value: '3d' as StyleType, icon: '🎨' },
  { value: 'color' as StyleType, icon: '🌈' },
  { value: 'flat' as StyleType, icon: '⬜' },
  { value: 'high-contrast' as StyleType, icon: '⚫' },
];

export default function FilterSidebar({
  currentPlatform,
  selectedStyle,
  onStyleChange,
  selectedCategory,
  onCategoryChange,
  categories,
  emojisByCategory
}: FilterSidebarProps) {
  const t = useTranslations();
  const platformConfig = PLATFORMS.find(p => p.id === currentPlatform);
  const availableStyles = platformConfig?.styles || [];
  const osInfo = detectOS();

  return (
    <div className="w-80 bg-card border-r min-h-screen p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">{t('common.search')}</h2>
      </div>

      {/* Current Platform Display */}
      {currentPlatform === 'native' && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-3 text-foreground">{t('common.platform')}</h3>
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5 flex-shrink-0">{osInfo.icon}</span>
              <div className="text-xs text-muted-foreground">
                <div className="font-medium mb-1">检测到：{osInfo.name}</div>
                {osInfo.type === 'macos' || osInfo.type === 'ios' ? (
                  <span>使用 Apple 原生 emoji</span>
                ) : osInfo.type === 'windows' ? (
                  <span>使用 Windows 原生 emoji (Segoe UI)</span>
                ) : osInfo.type === 'android' ? (
                  <span>使用 Noto Emoji (Android 原生)</span>
                ) : (
                  <span>使用 Noto Emoji 作为降级</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Style Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3 text-foreground">{t('common.style')}</h3>
        <div className="space-y-2">
          {STYLES.filter(style => availableStyles.includes(style.value)).map((style) => (
            <button
              key={style.value}
              onClick={() => onStyleChange(style.value)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${selectedStyle === style.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-card-foreground border-border hover:border-primary'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{style.icon}</span>
                <span className="font-medium text-sm">{t(`styles.${style.value}`)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3 text-foreground">{t('common.category')}</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-card-foreground border-border hover:border-primary'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{t('categories.all')}</span>
              <Badge variant="secondary" className="text-xs">
                {Object.values(emojisByCategory).flat().length}
              </Badge>
            </div>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${selectedCategory === category
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-card-foreground border-border hover:border-primary'
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{t(`categories.${category}`)}</span>
                <Badge variant="secondary" className="text-xs">
                  {emojisByCategory[category]?.length || 0}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
