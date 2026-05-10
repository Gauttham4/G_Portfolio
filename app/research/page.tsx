import ResearchClient from './ResearchClient';
import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';

export const metadata = {
  title: 'Research — CrimeIntellX (IJIRE)',
  description:
    'Published research on AI-augmented forensic case-management, RAG over evidence, and CDR analytics. IJIRE Vol 7 Issue 3, 2025.',
};

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <SiteHeader />
      <ResearchClient />
      <HomeFooter />
    </main>
  );
}
