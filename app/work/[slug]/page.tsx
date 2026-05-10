import JarvisPage from '@/components/work/JarvisPage';
import CrimeLensPage from '@/components/work/CrimeLensPage';
import ElectroBikePage from '@/components/work/ElectroBikePage';
import ThemedProjectPage from '@/components/work/ThemedProjectPage';
import { THEMES } from '@/lib/project-themes';
import { ACTS } from '@/lib/projects-manifest';

const RENDERERS: Record<string, () => React.ReactElement> = {
  jarvis: () => <JarvisPage />,
  'final-year-project': () => <CrimeLensPage />,
  electrobike: () => <ElectroBikePage />,
};

// Register every themed slug
for (const slug of Object.keys(THEMES)) {
  if (RENDERERS[slug]) continue;
  RENDERERS[slug] = () => <ThemedProjectPage theme={THEMES[slug]} />;
}

const TITLES: Record<string, string> = Object.fromEntries(
  ACTS.flatMap((a) => a.projects.map((p) => [p.slug, p.title] as const)),
);

type Props = { params: Promise<{ slug: string }> };

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const Renderer = RENDERERS[slug];

  if (Renderer) {
    return <Renderer />;
  }

  const title = TITLES[slug] ?? slug;
  return (
    <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <p className="font-mono uppercase text-amber/70 text-xs tracking-[0.3em] mb-6">
          Coming soon
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
          {title}
        </h1>
        <p className="font-sans text-paper-dim mt-6">
          This chapter is in production. The case file opens later.
        </p>
        <a
          href="/"
          className="inline-block mt-10 font-mono uppercase text-xs tracking-[0.25em] text-paper-dim hover:text-amber transition-colors"
        >
          ← back to the index
        </a>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  const slugs = ACTS.flatMap((a) => a.projects.map((p) => ({ slug: p.slug })));
  return slugs;
}

export const dynamicParams = false;
