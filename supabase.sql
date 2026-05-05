CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  body_en TEXT NOT NULL,
  summary_en TEXT,
  category TEXT DEFAULT 'economy',
  source_url TEXT UNIQUE,
  source_name TEXT,
  tags TEXT[],
  slug TEXT UNIQUE,
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public email signups" ON emails;
CREATE POLICY "Allow public email signups"
  ON emails
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public contact messages" ON contacts;
CREATE POLICY "Allow public contact messages"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);
