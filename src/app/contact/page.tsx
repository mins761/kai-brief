import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'Contact',
  description: 'Contact KAI Brief.'
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-kai-cyan">Contact</p>
        <h1 className="mt-3 text-5xl font-black text-kai-navy">Send a note.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-700">
          For tips, corrections, partnerships, or reader feedback, use the form below.
        </p>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
