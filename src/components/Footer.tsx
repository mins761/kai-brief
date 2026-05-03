import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-kai-border bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-zinc-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-black text-kai-navy">KAI Brief</p>
          <p>Korea&apos;s AI & Economy, Briefly Told.</p>
        </div>
        <nav className="flex gap-5">
          <Link href="/about" className="hover:text-kai-navy">
            About
          </Link>
          <Link href="/privacy" className="hover:text-kai-navy">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-kai-navy">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
