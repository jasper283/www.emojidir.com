'use client';

import { defaultLocale, locales } from '@/i18n/config';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 客户端语言检测和重定向
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // 检测浏览器语言
    const browserLang = navigator.language;

    // 尝试匹配浏览器语言到支持的语言
    let targetLocale = defaultLocale;

    // 精确匹配（如 zh-CN）
    if (locales.includes(browserLang as any)) {
      targetLocale = browserLang as any;
    }
    // 匹配语言代码前缀（如 zh）
    else {
      const langPrefix = browserLang.split('-')[0];
      const matchedLocale = locales.find(locale => locale.startsWith(langPrefix));
      if (matchedLocale) {
        targetLocale = matchedLocale;
      }
    }

    // 重定向到检测到的语言
    router.replace(`/${targetLocale}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

