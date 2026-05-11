'use client';

import { FormEvent, useState } from 'react';
import { copy, type Lang } from '@/lib/i18n';

export default function Newsletter({ lang = 'en' }: { lang?: Lang }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const text = copy[lang];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '');

    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    setStatus(response.ok ? 'success' : 'error');
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <section id="newsletter" className="bg-kai-navy px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">
          {text.newsletter}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
          {text.newsletterTitle}
        </h2>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            required
            type="email"
            name="email"
            placeholder="you@example.com"
            className="min-h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-kai-dark outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="min-h-12 rounded-full bg-kai-cyan px-7 font-black text-kai-navy transition hover:bg-white disabled:opacity-70"
          >
            {status === 'loading' ? text.subscribing : text.subscribe}
          </button>
        </form>
        {status === 'success' ? (
          <p className="mt-4 text-sm text-kai-cyan">{text.success}</p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-4 text-sm text-red-200">{text.error}</p>
        ) : null}
      </div>
    </section>
  );
}
