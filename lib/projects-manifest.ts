// Phase 5 — Project gallery manifest.
// Five acts × project slugs. Editorial monochrome shell (post Iron-Man refactor).
// All 28 known slugs accounted for.

export type ActId = 'I' | 'II' | 'III' | 'IV' | 'V';

export type ActProject = {
  slug: string;
  title: string;
};

export type Act = {
  id: ActId;
  numeral: string;          // "01" .. "05"
  label: string;            // "ACT I · COMMUNITY-ROOTED PROJECTS"
  name: string;             // "Neighbors."
  tagline: string;          // short caption
  pullQuote: string;        // italic title-card line
  category: string;         // one-word, used in row meta (e.g. "COMMUNITY", "AI")
  bgImage: string;          // legacy field — left for backward compat, unused on shell
  projects: ActProject[];
};

function t(slug: string, title: string): ActProject {
  return { slug, title };
}

export const ACTS: readonly Act[] = [
  {
    id: 'I',
    numeral: '01',
    label: 'ACT I · COMMUNITY-ROOTED PROJECTS',
    name: 'Neighbors.',
    tagline: 'Community-rooted projects',
    pullQuote: 'Built for the people I see every day.',
    category: 'COMMUNITY',
    bgImage: '',
    projects: [
      t('thaazhai', 'Thaazhai'),
      t('agri-tech-website', 'Agri-Tech Website'),
      t('ea-tuition-app', 'EA Tuition App'),
      t('mindora', 'Mindora'),
      t('alzhmeric', 'Alzhmeric'),
      t('fee-management', 'Fee Management'),
      t('voyagr', 'Voyagr'),
    ],
  },
  {
    id: 'II',
    numeral: '02',
    label: 'ACT II · PRODUCTION PLATFORMS',
    name: 'Institutions.',
    tagline: 'Production platforms',
    pullQuote: 'Real systems. Real users. Audit logs and all.',
    category: 'PLATFORM',
    bgImage: '',
    projects: [
      t('dhanoos-excellence', 'Excellence Academy'),
      t('student-portal', 'Student Portal'),
      t('teacher-portal', 'Teacher Portal'),
      t('invoice-system', 'Invoice System'),
      t('hotel-app', 'Hotel App'),
      t('jewelry-pos', 'Jewelry POS'),
      t('market-pulse', 'Market Pulse'),
    ],
  },
  {
    id: 'III',
    numeral: '03',
    label: 'ACT III · AI · RAG · MULTI-AGENT',
    name: 'Frontier.',
    tagline: 'AI · RAG · multi-agent',
    pullQuote: 'Where the work gets weirder — and better.',
    category: 'AI',
    bgImage: '',
    projects: [
      t('jarvis', 'JARVIS'),
      t('final-year-project', 'CrimeIntellX'),
      t('viksit-ai', 'Viksit AI'),
      t('careervisionx', 'CareerVisionX'),
      t('darkwatch', 'DarkWatch'),
    ],
  },
  {
    id: 'IV',
    numeral: '04',
    label: 'ACT IV · CINEMATIC + 3D + EDGE OF CRAFT',
    name: 'Showpieces.',
    tagline: 'Cinematic · 3D · edge of craft',
    pullQuote: 'Where the camera moves.',
    category: 'CINEMATIC',
    bgImage: '',
    projects: [
      t('spaceforge', 'Spaceforge'),
      t('vkmg-landing', 'VKMG Landing'),
      t('vkmg-report-app', 'VKMG Report App'),
      t('zyntra', 'Zyntra'),
      t('electrobike', 'Electrobike'),
      t('divyadrishti', 'Divyadrishti'),
    ],
  },
  {
    id: 'V',
    numeral: '05',
    label: 'CODA · SMALL · TASTEFUL · HONEST ABOUT SCOPE',
    name: 'Foundations.',
    tagline: 'Coda · small, tasteful, honest about scope',
    pullQuote: 'The footnotes that hold the whole record together.',
    category: 'CODA',
    bgImage: '',
    projects: [
      t('cloud-provisioning', 'Cloud Provisioning'),
      t('tvk', 'TVK'),
      t('medicine-search', 'Medicine Search'),
    ],
  },
] as const;

export const TOTAL_PROJECTS = ACTS.reduce((n, a) => n + a.projects.length, 0); // 28
