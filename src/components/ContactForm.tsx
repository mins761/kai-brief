'use client';

import { FormEvent, useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('Please try again.');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('Please try again.');

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || '')
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.error || 'Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      event.currentTarget.reset();
    } catch {
      setErrorMessage('Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <input
        required
        name="name"
        placeholder="Name"
        className="w-full rounded-xl border border-kai-border px-4 py-3 outline-none focus:border-kai-cyan"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        className="w-full rounded-xl border border-kai-border px-4 py-3 outline-none focus:border-kai-cyan"
      />
      <textarea
        required
        name="message"
        placeholder="Message"
        rows={6}
        className="w-full rounded-xl border border-kai-border px-4 py-3 outline-none focus:border-kai-cyan"
      />
      <button
        disabled={status === 'loading'}
        className="rounded-full bg-kai-navy px-6 py-3 font-black text-white transition hover:bg-kai-dark disabled:opacity-70"
      >
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </button>
      {status === 'success' ? <p className="text-sm font-bold text-green-700">Message sent.</p> : null}
      {status === 'error' ? <p className="text-sm font-bold text-red-700">{errorMessage}</p> : null}
    </form>
  );
}
