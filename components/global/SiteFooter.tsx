/**
 * Minimal universal site mark — sits below NextChapter on project pages.
 * Tiny mono "Built by Gauttham R." with a faint mailto link.
 */
export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-rule bg-ink py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper" style={{ opacity: 0.06 }}>
          Built by Gauttham R.
        </p>
        <a
          href="mailto:gautthamr@gmail.com"
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper-soft hover:text-amber transition-colors"
        >
          gautthamr@gmail.com
        </a>
      </div>
    </footer>
  );
}
