export default function HomeFooter() {
  const links: { label: string; href: string }[] = [
    { label: 'Email', href: 'mailto:hello@gauttham.dev' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'Instagram', href: 'https://instagram.com/' },
  ];

  return (
    <footer className="w-full bg-ink px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper-dim">
        Gauttham R  ·  Puducherry  ·  2026
      </p>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-paper-dim">
        Engineer at THEELABS  ·  Incoming MS — University of Portsmouth
      </p>

      <div className="mt-20 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="font-mono text-xs uppercase tracking-[0.3em] text-paper-dim transition-colors duration-300 hover:text-amber"
          >
            {l.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
