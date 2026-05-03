'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { categories, categoryLabels } from '@/lib/articles';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToNewsletter = () => {
    setIsOpen(false);
    document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-kai-navy text-white shadow-lg shadow-kai-navy/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-black tracking-tight">KAI Brief</span>
          <span className="text-xs text-white/55">Korea&apos;s AI & Economy, Briefly Told</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {categories.map((category) => {
            const href = `/${category}`;
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
                {categoryLabels[category]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={scrollToNewsletter}
            className="rounded-full bg-kai-cyan px-5 py-2 text-sm font-bold text-kai-navy transition hover:-translate-y-0.5 hover:bg-white"
          >
            Subscribe
          </button>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setIsOpen((value) => !value)}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm md:hidden"
        >
          Menu
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 px-4 pb-5 md:hidden">
          <nav className="flex flex-col gap-3 pt-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/${category}`}
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80"
              >
                {categoryLabels[category]}
              </Link>
            ))}
            <button
              onClick={scrollToNewsletter}
              className="mt-2 rounded-full bg-kai-cyan px-5 py-2 text-left text-sm font-bold text-kai-navy"
            >
              Subscribe
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
