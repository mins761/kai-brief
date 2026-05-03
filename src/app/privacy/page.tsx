import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'Privacy Policy',
  description: 'KAI Brief privacy, cookies, and advertising disclosure.'
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-5xl font-black text-kai-navy">Privacy Policy</h1>
        <div className="mt-8 space-y-6 leading-8 text-zinc-700">
          <p>
            KAI Brief collects only the information needed to operate the site, respond to contact
            messages, and send newsletter updates when readers subscribe.
          </p>
          <p>
            We may use cookies and analytics tools to understand aggregate readership patterns and
            improve the service. Advertising placements may use third-party scripts such as Google
            AdSense, which can set cookies according to their own policies.
          </p>
          <p>
            Newsletter emails and contact messages are stored in Supabase. Readers may request
            removal by contacting editor@kai-brief.com.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
