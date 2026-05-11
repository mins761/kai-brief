import type { Article, Category } from '@/types';

export type Lang = 'en' | 'ja';

export const languageNames: Record<Lang, string> = {
  en: 'English',
  ja: '日本語'
};

export const categoryLabelsByLang: Record<Lang, Record<Category, string>> = {
  en: {
    economy: 'Economy',
    ai: 'AI',
    policy: 'Policy',
    market: 'Market',
    culture: 'Culture',
    beauty: 'Beauty',
    travel: 'Travel'
  },
  ja: {
    economy: '経済',
    ai: 'AI',
    policy: '政策',
    market: 'マーケット',
    culture: 'カルチャー',
    beauty: 'ビューティー',
    travel: '旅行'
  }
};

export const copy = {
  en: {
    tagline: "Korea's Culture, Beauty & Economy, Briefly Told",
    subscribe: 'Subscribe',
    menu: 'Menu',
    all: 'All',
    featured: 'Featured',
    heroKicker: "Signal over noise from Korea's AI economy.",
    category: 'Category',
    publishedBrief: 'published brief',
    publishedBriefs: 'published briefs',
    source: 'Source',
    back: 'Back to briefs',
    related: 'Related briefs',
    newsletter: 'Newsletter',
    newsletterTitle: 'The Korea AI economy, minus the fog.',
    subscribing: 'Subscribing...',
    success: "You're on the list.",
    error: 'Something went wrong. Please try again.',
    footer: "Korea's AI & Economy, Briefly Told."
  },
  ja: {
    tagline: '韓国のカルチャー、ビューティー、経済を簡潔に',
    subscribe: '登録',
    menu: 'メニュー',
    all: 'すべて',
    featured: '注目記事',
    heroKicker: '韓国のAI経済を、要点だけで読む。',
    category: 'カテゴリー',
    publishedBrief: '本の記事',
    publishedBriefs: '本の記事',
    source: '出典',
    back: '記事一覧へ戻る',
    related: '関連記事',
    newsletter: 'ニュースレター',
    newsletterTitle: '韓国AI経済の要点を、霧のない言葉で。',
    subscribing: '登録中...',
    success: '登録しました。',
    error: 'エラーが発生しました。もう一度お試しください。',
    footer: '韓国のAIと経済ニュースを簡潔に。'
  }
} as const;

export function withLang(path: string, lang: Lang) {
  if (lang === 'en') return path;
  return path === '/' ? '/ja' : `/ja${path}`;
}

export function getLocalizedArticle(article: Article, lang: Lang) {
  if (lang === 'ja') {
    return {
      title: article.title_ja || article.title_en,
      body: article.body_ja || article.body_en,
      summary: article.summary_ja || article.summary_en
    };
  }

  return {
    title: article.title_en,
    body: article.body_en,
    summary: article.summary_en
  };
}

export function formatDate(date: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en', {
    dateStyle: 'long'
  }).format(new Date(date));
}
