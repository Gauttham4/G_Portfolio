'use client';

import type { Act } from '@/lib/projects-manifest';
import ProjectRow from './ProjectRow';

type Props = {
  act: Act;
};

export default function ProjectList({ act }: Props) {
  return (
    <section
      aria-label={`${act.name} projects`}
      data-act-list={act.id}
      className="relative w-full bg-ink py-8 md:py-16"
    >
      <div>
        {act.projects.map((p, i) => (
          <ProjectRow
            key={p.slug}
            index={i + 1}
            total={act.projects.length}
            slug={p.slug}
            title={p.title}
            category={act.category}
            actNumeral={act.numeral}
            isLast={i === act.projects.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
