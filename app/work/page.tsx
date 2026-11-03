import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import WorksByDomain from '@/components/home/WorksByDomain';

export const metadata = {
  title: 'All work — Gauttham R.',
  description: 'All thirty-one projects, grouped by domain: AI, forensics, edtech, finance, safety and field operations.',
};

export default function WorkIndexPage() {
  return (
    <main className="bg-ink text-paper">
      <SiteHeader />
      <div className="pt-16 md:pt-20">
        <WorksByDomain />
      </div>
      <HomeFooter />
    </main>
  );
}
