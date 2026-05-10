'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import {
  EffectCoverflow,
  Autoplay,
  Pagination,
  Navigation,
  Keyboard,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Reveal from '@/components/motion/Reveal';

type Tile = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
};

const FEATURED: Tile[] = [
  { slug: 'jarvis',             title: 'JARVIS',             subtitle: 'A personal AI assistant that teaches itself new skills',         category: 'AI · MULTI-AGENT' },
  { slug: 'final-year-project', title: 'CrimeIntellX',       subtitle: "A detective's assistant for cases, evidence & call records",     category: 'AI · FORENSICS'   },
  { slug: 'electrobike',        title: 'ElectroBike',        subtitle: 'A smart electric bike that thinks with you',                     category: 'PRODUCT · IoT'    },
  { slug: 'spaceforge',         title: 'SpaceForge',         subtitle: 'A cinematic 3D landing page for a tech startup',                 category: 'CINEMATIC · 3D'   },
  { slug: 'viksit-ai',          title: 'Viksit.AI',          subtitle: 'An AI workspace that codes, searches & talks back',              category: 'AI · WORKSPACE'   },
  { slug: 'dhanoos-excellence', title: 'Excellence Academy', subtitle: 'Student coaching & admissions, all in one place',                category: 'PLATFORM · EDU'   },
  { slug: 'thaazhai',           title: 'THAAZHAI',           subtitle: 'Where farmers, buyers & agri-experts meet',                      category: 'COMMUNITY · AGRI' },
  { slug: 'alzhmeric',          title: 'Alzhmeric',          subtitle: "A care companion for Alzheimer's patients & their families",     category: 'COMMUNITY · CARE' },
];

export default function WorkSwiper() {
  return (
    <section className="relative w-full overflow-hidden bg-ink py-24 px-6 md:px-12 md:py-40">
      {/* kicker + heading */}
      <div className="mx-auto mb-16 max-w-7xl">
        <Reveal dir="left">
          <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-amber/70">
            §  THE WORK · 8 OF 28
          </p>
        </Reveal>
        <Reveal dir="bottom" delay={0.1}>
          <h2 className="font-display text-4xl leading-[0.95] tracking-tight text-paper md:text-7xl">
            Selected projects.
          </h2>
        </Reveal>
      </div>

      <Swiper
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation, Keyboard]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={1.4}
        breakpoints={{
          640:  { slidesPerView: 1.8 },
          1024: { slidesPerView: 2.6 },
          1440: { slidesPerView: 3.2 },
        }}
        loop
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 240,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        navigation
        className="!overflow-visible"
      >
        {FEATURED.map((p) => (
          <SwiperSlide
            key={p.slug}
            className="!w-[78vw] sm:!w-[60vw] lg:!w-[42vw] xl:!w-[34vw]"
          >
            <a
              href={`/work/${p.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-sm border border-rule"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/work/${p.slug}/thumb.jpg`}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                style={{ filter: 'grayscale(0.4) brightness(0.78)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-amber/80">
                {p.category}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="mb-3 h-px w-12 bg-amber/40" />
                <h3 className="mb-2 font-display text-2xl text-paper transition-colors duration-500 group-hover:text-amber md:text-4xl">
                  {p.title}
                </h3>
                <p className="max-w-[90%] font-sans text-sm text-paper-dim md:text-base">
                  {p.subtitle}
                </p>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-16 text-center">
        <a
          href="#acts-drilldown"
          className="font-mono text-xs uppercase tracking-[0.3em] text-amber hover:underline"
        >
          View all 28 →
        </a>
      </div>
    </section>
  );
}
