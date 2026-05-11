'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { categories, visibleCategories } from '@/lib/articles';
import { categoryLabelsByLang, copy, type Lang, withLang } from '@/lib/i18n';

export default function Header({ lang = 'en' }: { lang?: Lang }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const labels = categoryLabelsByLang[lang];
  const text = copy[lang];
  const pathWithoutJa = pathname.replace(/^\/ja/, '') || '/';
  const canSwitchPath =
    pathWithoutJa === '/' ||
    categories.some((category) => pathWithoutJa === `/${category}`) ||
    /^\/article\/[^/]+$/.test(pathWithoutJa);
  const switchHref = lang === 'ja' ? pathWithoutJa : canSwitchPath ? `/ja${pathname}` : '/ja';

  const scrollToNewsletter = () => {
    setIsOpen(false);
    document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-kai-navy text-white shadow-lg shadow-kai-navy/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={withLang('/', lang)} className="flex flex-col">
          <span className="text-2xl font-black tracking-tight">KAI Brief</span>
          <span className="text-xs text-white/55">{text.tagline}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {visibleCategories.map((category) => {
            const href = withLang(`/${category}`, lang);
            const isActive = pathname === href;

            return (
              <Link
                key={category}
                href={href}
                className={`border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                  isActive
                    ? 'border-kai-cyan text-kai-cyan'
                    : 'border-transparent text-white/75 hover:text-white'
                }`}
              >
                {labels[category]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={switchHref}
            className="rounded-full border border-white/20 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/75 transition hover:text-white"
          >
            {lang === 'ja' ? 'EN' : 'JP'}
          </Link>
          <button
            onClick={scrollToNewsletter}
            className="rounded-full bg-kai-cyan px-5 py-2 text-sm font-bold text-kai-navy transition hover:-translate-y-0.5 hover:bg-white"
          >
            {text.subscribe}
          </button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm md:hidden"
        >
          {text.menu}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 px-4 pb-5 md:hidden">
          <nav className="flex flex-col gap-3 pt-4">
            {visibleCategories.map((category) => (
              <Link
                key={category}
                href={withLang(`/${category}`, lang)}
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80"
              >
                {labels[category]}
              </Link>
            ))}
            <Link
              href={switchHref}
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80"
            >
              {lang === 'ja' ? 'English' : '日本語'}
            </Link>
            <button
              onClick={scrollToNewsletter}
              className="mt-2 rounded-full bg-kai-cyan px-5 py-2 text-left text-sm font-bold text-kai-navy"
            >
              {text.subscribe}
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
