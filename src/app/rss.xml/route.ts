import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KAI Brief</title>
    <link>https://kai-brief.vercel.app</link>
    <description>Korea's AI and Economy, Briefly Told</description>
    <language>en</language>
    <atom:link href="https://kai-brief.vercel.app/rss.xml" rel="self" type="application/rss+xml"/>
    ${articles?.map(article => `
    <item>
      <title><![CDATA[${article.title_en}]]></title>
      <link>https://kai-brief.vercel.app/article/${article.slug}</link>
      <description><![CDATA[${article.summary_en}]]></description>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <guid>https://kai-brief.vercel.app/article/${article.slug}</guid>
      <category>${article.category}</category>
    </item>
    `).join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600'
    }
  })
}
