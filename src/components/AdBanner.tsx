export default function AdBanner({ id = 'ad-slot-1' }: { id?: string }) {
  return (
    <div
      id={id}
      className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-kai-border bg-kai-gray text-sm font-bold uppercase tracking-[0.24em] text-zinc-400"
    >
      Advertisement
    </div>
  );
}
