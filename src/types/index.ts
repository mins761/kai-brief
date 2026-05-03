export type Category = 'economy' | 'ai' | 'policy' | 'market';

export type Article = {
  id: string;
  title_en: string;
  body_en: string;
  summary_en: string;
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
