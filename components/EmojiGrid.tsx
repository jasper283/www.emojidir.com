'use client';

import { Card } from '@/components/ui/card';
import type { Emoji, StyleType } from '@/types/emoji';
import { SearchX } from 'lucide-react';
import EmojiCard from './EmojiCard';

interface EmojiGridProps {
  emojis: Emoji[];
  style: StyleType;
}

export default function EmojiGrid({ emojis, style }: EmojiGridProps) {
  if (emojis.length === 0) {
    return (
      <Card className="p-20">
        <div className="text-center flex flex-col items-center gap-4">
          <SearchX className="w-16 h-16 text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold mb-2">没有找到匹配的表情</h3>
            <p className="text-muted-foreground">尝试使用不同的搜索词或选择其他分类</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 md:gap-4">
      {emojis.map((emoji) => (
        <EmojiCard key={emoji.id} emoji={emoji} style={style} />
      ))}
    </div>
  );
}

