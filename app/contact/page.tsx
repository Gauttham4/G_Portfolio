import SiteHeader from '@/components/nav/SiteHeader';
import HomeFooter from '@/components/home/HomeFooter';
import ContactForm from '@/components/auxiliary/ContactForm';
import Reveal from '@/components/motion/Reveal';
import AnimatedHeading from '@/components/motion/AnimatedHeading';

export const metadata = {
  title: 'Contact — Gauttham R.',
  description: 'The studio is open.',
};

const card = [
  { label: 'Email', value: 'gautthamrajasekar@gmail.com', href: 'mailto:gautthamrajasekar@gmail.com', icon: '✉' },
  { label: 'Phone', value: '+91 73975 88364', href: 'tel:+917397588364', icon: '☎' },
  { label: 'LinkedIn', value: 'gauttham-r', href: 'https://www.linkedin.com/in/gauttham-r-816ab32b4', icon: 'in' },
  { label: 'GitHub', value: 'Gauttham4', href: 'https://github.com/Gauttham4', icon: '◆' },
  { label: 'Instagram', value: 'comicalhazard_415', href: 'https://instagram.com/comicalhazard_415', icon: '◉' },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-ink text-paper">
      <SiteHeader />

      {/* Hero band */}
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-40 md:pt-52">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
            § Contact · Studio open
          </p>
        </Reveal>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-paper md:text-7xl lg:text-8xl">
          <AnimatedHeading
            as="span"
            mode="letters"
            text="Tell me what you're "
            delay={0.08}
            className="inline-block"
          />
          <AnimatedHeading
            as="span"
            mode="letters"
            text="building."
            delay={0.7}
            className="inline-block italic text-amber"
          />
        </h1>
        <AnimatedHeading
          as="p"
          mode="words"
          text="What you're building, what's broken, or what you want to learn. Either column works."
          stagger={0.04}
          delay={1.1}
          className="mt-6 max-w-xl font-sans text-base text-paper-dim md:text-lg"
        />
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 md:grid-cols-[1fr,minmax(0,360px)] md:gap-16">
        {/* Form */}
        <div>
          <ContactForm />
        </div>

        {/* Direct lines card */}
        <aside className="md:sticky md:top-32 md:self-start">
          <Reveal dir="right">
            <div className="rounded-xl glass p-6 md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
                Direct lines
              </p>
              <ul className="mt-6 space-y-px">
                {card.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-center justify-between gap-4 border-b border-rule py-3 transition-transform hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-full border border-rule font-mono text-[10px] text-amber group-hover:border-amber">
                          {c.icon}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim">
                          {c.label}
                        </span>
                      </div>
                      <span className="font-display text-sm text-paper group-hover:text-amber md:text-base">
                        {c.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </aside>
      </section>

      <HomeFooter />
    </main>
  );
}
