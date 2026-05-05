'use client';

import { FormEvent, useState } from 'react';

export default function Newsletter() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
          Newsletter
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
          The Korea AI economy, minus the fog.
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
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'success' ? (
          <p className="mt-4 text-sm text-kai-cyan">You&apos;re on the list.</p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-4 text-sm text-red-200">Something went wrong. Please try again.</p>
        ) : null}
      </div>
    </section>
  );
}
