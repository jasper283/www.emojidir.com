export interface WebsiteStructuredDataProps {
  locale: string;
}

export function WebsiteStructuredData({ locale }: WebsiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Emoji Directory',
    description: 'Browse and search emoji collections from Fluent Emoji, Noto Emoji, and native platforms',
    url: `https://emojidir.com/${locale}`,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://emojidir.com/${locale}/fluent-emoji?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export interface CollectionPageStructuredDataProps {
  locale: string;
  platform: string;
  platformName: string;
  platformDescription: string;
  totalEmojis: number;
}

export function CollectionPageStructuredData({
  locale,
  platform,
  platformName,
  platformDescription,
  totalEmojis,
}: CollectionPageStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${platformName} - Emoji Directory`,
    description: platformDescription,
    url: `https://emojidir.com/${locale}/${platform}`,
    inLanguage: locale,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://emojidir.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: platformName,
          item: `https://emojidir.com/${locale}/${platform}`,
        },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalEmojis,
      itemListElement: [],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export interface EmojiDetailStructuredDataProps {
  locale: string;
  platform: string;
  platformName: string;
  emoji: {
    name: string;
    glyph: string;
    unicode: string;
    group: string;
    keywords: string[];
  };
  imageUrl?: string;
}

export function EmojiDetailStructuredData({
  locale,
  platform,
  platformName,
  emoji,
  imageUrl,
}: EmojiDetailStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: `${emoji.name} emoji`,
    description: `${emoji.name} emoji (${emoji.glyph}) from ${platformName}. Unicode: U+${emoji.unicode.toUpperCase()}`,
    contentUrl: imageUrl || `https://emojidir.com/favicon.svg`,
    url: `https://emojidir.com/${locale}/${platform}/${emoji.unicode}`,
    inLanguage: locale,
    keywords: emoji.keywords.join(', '),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://emojidir.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: platformName,
          item: `https://emojidir.com/${locale}/${platform}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: emoji.name,
          item: `https://emojidir.com/${locale}/${platform}/${emoji.unicode}`,
        },
      ],
    },
    about: {
      '@type': 'Thing',
      name: emoji.name,
      description: `${emoji.group} emoji`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

