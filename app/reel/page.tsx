import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import ReelPlayer from '@/components/reel/ReelPlayer';

export const metadata = {
  title: 'The Reel — Gauttham R.',
  description: 'The whole portfolio in 70 seconds: who I am, the cases, the work, and what is next.',
};

export default function ReelPage() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-32 md:pt-40">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">§ The reel · no scrolling required</p>
        <h1 className="mt-4 font-display text-4xl leading-[0.98] tracking-tight text-paper md:text-6xl">
          The whole portfolio, <span className="italic text-amber">in eighty seconds.</span>
        </h1>
      </section>
      <section className="pb-20">
        <ReelPlayer />
      </section>
      <HomeFooter />
    </main>
  );
}
