import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'About',
  description: 'KAI Brief mission and coverage areas.'
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">About</p>
        <h1 className="mt-3 text-5xl font-black text-kai-navy">Clear signals from Korea.</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-700">
          KAI Brief explains Korea&apos;s artificial intelligence, economy, policy, and markets for
          global readers who need context quickly. We translate local developments into concise
          English briefs with practical global framing.
        </p>
        <h2 className="mt-10 text-2xl font-black text-kai-navy">Coverage areas</h2>
        <ul className="mt-4 space-y-3 text-zinc-700">
          <li>AI infrastructure, regulation, startups, and enterprise adoption</li>
          <li>Macroeconomic indicators, exports, monetary policy, and industry cycles</li>
          <li>Government policy affecting technology, trade, and capital markets</li>
          <li>Public companies, semiconductors, batteries, platforms, and financial markets</li>
        </ul>
        <p className="mt-10 text-zinc-700">
          Contact: <a className="font-bold underline" href="mailto:editor@kai-brief.com">editor@kai-brief.com</a>
        </p>
      </main>
      <Footer />
    </>
  );
}
