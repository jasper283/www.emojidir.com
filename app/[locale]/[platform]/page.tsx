'use client';

import EmojiGrid from '@/components/EmojiGrid';
import FilterSidebar from '@/components/FilterSidebar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Pagination from '@/components/Pagination';
import PlatformSwitcher from '@/components/PlatformSwitcher';
import SearchBar from '@/components/SearchBar';
import { Badge } from '@/components/ui/badge';
import { getEmojiDataForPlatform } from '@/lib/platforms';
import type { Emoji, EmojiIndex, PlatformType, StyleType } from '@/types/emoji';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
// 构建时导入数据
import emojiIndexData from '@/data/emoji-index.json';

// 每页显示的emoji数量
const ITEMS_PER_PAGE = 60;

export default function PlatformPage() {
  const t = useTranslations();
  const params = useParams();
  const baseEmojiData = emojiIndexData as EmojiIndex;

  // 从 URL 获取平台参数
  const platformSlug = params.platform as string;
  const selectedPlatform = platformSlug?.replace('-emoji', '') as PlatformType || 'fluent';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('3d');
  const [currentPage, setCurrentPage] = useState(1);

  // 根据选择的平台获取对应的emoji数据
  const emojiData = useMemo(() => {
    return getEmojiDataForPlatform(selectedPlatform, baseEmojiData);
  }, [selectedPlatform, baseEmojiData]);

  // 过滤和搜索 emoji
  const filteredEmojis = useMemo(() => {
    let emojis = emojiData.emojis;

    // 按分类过滤
    if (selectedCategory !== 'all') {
      emojis = emojis.filter((emoji: Emoji) => emoji.group === selectedCategory);
    }

    // 按搜索关键词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      emojis = emojis.filter((emoji: Emoji) => {
        return (
          emoji.name.toLowerCase().includes(query) ||
          emoji.keywords.some((keyword: string) => keyword.toLowerCase().includes(query)) ||
          emoji.glyph.includes(query)
        );
      });
    }

    return emojis;
  }, [emojiData, selectedCategory, searchQuery]);

  // 当过滤条件改变时，重置到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStyle]);

  // 计算总页数
  const totalPages = Math.ceil(filteredEmojis.length / ITEMS_PER_PAGE);

  // 获取当前页的emoji
  const paginatedEmojis = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEmojis.slice(startIndex, endIndex);
  }, [filteredEmojis, currentPage]);

  // 滚动到顶部
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/30 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image src="/favicon.svg" alt={t('common.appName')} width={40} height={40} className="w-10 h-10" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <PlatformSwitcher currentPlatform={selectedPlatform} />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          selectedStyle={selectedStyle}
          onStyleChange={setSelectedStyle}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={emojiData.categories}
          emojisByCategory={emojiData.emojisByCategory}
          currentPlatform={selectedPlatform}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-muted-foreground">
              {t('common.found')} <span className="font-semibold text-foreground text-lg">{filteredEmojis.length}</span> {t('common.emojis')}
            </div>
            <div className="flex items-center gap-2">
              {searchQuery && (
                <Badge variant="outline" className="text-sm">
                  {t('search.searchLabel')} {searchQuery}
                </Badge>
              )}
              <Badge variant="secondary" className="text-sm">
                {t(`platforms.${selectedPlatform}`)}
              </Badge>
            </div>
          </div>

          {/* Emoji Grid */}
          <EmojiGrid
            emojis={paginatedEmojis}
            style={selectedStyle}
          />

          {/* Pagination */}
          {filteredEmojis.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={filteredEmojis.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image src="/favicon.svg" alt={t('footer.appName')} width={20} height={20} className="w-5 h-5" />
            <p className="text-muted-foreground font-medium">{t('footer.appName')}</p>
          </div>
          <p className="text-sm text-muted-foreground/70 mb-2">
            {t('footer.supportedPlatforms')}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {t('footer.statsText', {
              count: emojiData.totalCount,
              categories: emojiData.categories.length
            })}
          </p>
        </div>
      </footer>
    </div>
  );
}

