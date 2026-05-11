export type Category = 'economy' | 'ai' | 'policy' | 'market' | 'culture' | 'beauty' | 'travel';

export type Article = {
  id: string;
  title_en: string;
  body_en: string;
  summary_en: string;
  title_ja?: string | null;
  body_ja?: string | null;
  summary_ja?: string | null;
  category: Category;
  source_url: string;
  source_name: string;
  tags: string[];
  slug: string;
  image_url?: string | null;
  published_at: string;
  is_published: boolean;
};

export type EmailSignup = {
  id?: string;
  email: string;
  created_at?: string;
};

export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
};
