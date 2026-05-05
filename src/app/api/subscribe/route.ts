import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  const subscriberEmail = email.trim().toLowerCase();

  const { error: supabaseError } = await supabase.from('emails').insert({
    email: subscriberEmail
  });

  if (supabaseError) {
    if (supabaseError.code === '23505') {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    console.error('Subscribe Supabase error:', supabaseError);
    return NextResponse.json({ error: supabaseError.message }, { status: 500 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('Subscribe Resend error: RESEND_API_KEY is missing.');
    return NextResponse.json({ ok: true, emailSent: false });
  }

  const resend = new Resend(resendApiKey);

  const { error: resendError } = await resend.emails.send({
    from: 'KAI Brief <noreply@kaibrief.com>',
    to: subscriberEmail,
    subject: 'Welcome to KAI Brief!',
    text: "Thanks for subscribing to KAI Brief.\nKorea's Culture, Beauty & Economy, Briefly Told."
  });

  if (resendError) {
    console.error('Subscribe Resend error:', resendError);
    return NextResponse.json({ ok: true, emailSent: false });
  }

  return NextResponse.json({ ok: true, emailSent: true });
}
