import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

export default createMiddleware({
  // 支持的语言列表
  locales,

  // 默认语言
  defaultLocale,

  // 启用浏览器语言检测
  localeDetection: true,

  // 始终显示语言前缀（包括默认语言）
  localePrefix: 'always'
});

export const config = {
  // 匹配所有路径，除了 Next.js 内部路径
  matcher: [
    // 匹配所有路径，包括平台路由
    '/((?!api|_next/static|_next/image|favicon.ico|icon|.*\\..*).*)'
  ]
};

