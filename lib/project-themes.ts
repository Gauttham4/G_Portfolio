// Phase 6b — Themed project pages.
// Each entry encodes the project's hero kicker, palette tokens (extracted from
// the project's framer-motion-skill/SKILL.md), 3 pull-quotes pulled verbatim
// from STORY.md, 4-6 features lifted from FEATURES.md, an architecture stack
// list, big-numbers, an outcome-quote and a signature motif preset.

import { ACTS } from './projects-manifest';
import type { MotifKey } from '@/components/work/motifs/MotifLibrary';

export type SignatureMotif =
  | 'pulse-glow'
  | 'horizontal-reveal'
  | 'parallax-photo'
  | 'scroll-zoom'
  | 'word-stagger'
  | 'image-stack';

export type GalleryImage = { src: string; caption: string; alt: string };

export type LayoutKey = 'A' | 'B' | 'C' | 'D';

export type ProjectTheme = {
  slug: string;
  title: string;
  subtitle: string;
  kicker: string;
  heroImage: string;
  palette: {
    bg: string;
    bgMid: string;
    text: string;
    dim: string;
    accent: string;
    accent2?: string;
  };
  signatureMotif: SignatureMotif;
  motifs?: { hero: MotifKey; mid: MotifKey; tertiary?: MotifKey };
  gallery?: GalleryImage[];
  /**
   * Optional layout variant for the themed page.
   * 'A' = Product Launch, 'B' = Case Study, 'C' = Editorial, 'D' = Hacker Dossier.
   * If undefined, falls back to the original same-shape composition in ThemedProjectPage.
   */
  layout?: LayoutKey;
  story: {
    quotes: { kicker: string; quote: string; context: string }[];
  };
  features: { title: string; desc: string }[];
  architecture: { layer: string; details: string }[];
  bigNumbers: { value: string; label: string }[];
  outcomeQuote: string;
};

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function kickerFor(slug: string): string {
  let count = 0;
  for (const act of ACTS) {
    for (const p of act.projects) {
      count += 1;
      if (p.slug === slug) {
        return `§ ACT ${act.numeral} · ${act.category} · ${String(count).padStart(2, '0')} / 28`;
      }
    }
  }
  return `§ ${slug.toUpperCase()}`;
}

// ---------------------------------------------------------------
// 25 themes
// ---------------------------------------------------------------

export const THEMES: Record<string, ProjectTheme> = {
  // ============ ACT I ============
  thaazhai: {
    slug: 'thaazhai',
    title: 'Thaazhai',
    subtitle: 'Where farmers, buyers and agri-experts meet.',
    kicker: kickerFor('thaazhai'),
    heroImage: '/work/thaazhai/thumb.jpg',
    palette: {
      bg: '#2C1F12',
      bgMid: '#3D2D1B',
      text: '#FAF4E8',
      dim: '#C9A05C',
      accent: '#E2A93B',
      accent2: '#9CAF88',
    },
    signatureMotif: 'parallax-photo', // Soil-to-sprout — community page
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote:
            'A tomato changes hands four to six times between the field and the dinner plate. The farmer sees roughly twenty paise of every rupee.',
          context: 'The economic compression THAAZHAI was built to undo.',
        },
        {
          kicker: 'Quote 02',
          quote:
            'The middlemen had databases. He had a notebook with smudged pencil marks.',
          context: 'My uncle, four AM at the wholesale yard. THAAZHAI started as my answer to that notebook.',
        },
        {
          kicker: 'Quote 03',
          quote:
            'When you weave enough strands together, it carries weight. That metaphor became the whole product brief.',
          context: 'Why I named it after the screw-pine my grandmother wove into market baskets.',
        },
      ],
    },
    features: [
      { title: 'Three roles, one users table', desc: 'Customer, farmer, admin separated by user_type enum.' },
      { title: 'Farmer dashboard', desc: 'Listings, visit-requests, notifications, reviews on one page.' },
      { title: 'Visit-booking flow', desc: 'Buyers pick a date and time; farmers confirm, reject or complete.' },
      { title: 'Reviews + ratings', desc: '1-to-5 with a CHECK constraint at the database level.' },
      { title: 'Image upload pipeline', desc: 'Type and size checks in includes/functions.php.' },
      { title: 'LAMP-deployable', desc: 'Runs on any cPanel host the cooperative can already afford.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'PHP server-rendered, Bootstrap grid, custom soil-to-sprout CSS.' },
      { layer: 'Database', details: 'MySQL — 7 tables: users, farmer_details, categories, products, farm_visits, notifications, reviews.' },
      { layer: 'Auth', details: 'Session-based with password_hash / password_verify, role guard in includes/header.php.' },
      { layer: 'Storage', details: '/uploads/products with server-side validation.' },
    ],
    bigNumbers: [
      { value: '7', label: 'tables' },
      { value: '3', label: 'roles' },
      { value: '14', label: 'farmers, one block' },
      { value: '1', label: 'retired notebook' },
    ],
    outcomeQuote:
      'The notebook with the smudged pencil marks is finally retired.',
  },

  'agri-tech-website': {
    slug: 'agri-tech-website',
    title: 'Farm Direct',
    subtitle: 'A marketplace that wants to be read first, then shopped.',
    kicker: kickerFor('agri-tech-website'),
    heroImage: '/work/agri-tech-website/thumb.jpg',
    palette: {
      bg: '#241710',
      bgMid: '#3A2615',
      text: '#F4E8CE',
      dim: '#C9A05C',
      accent: '#F4B860',
      accent2: '#4F6D3A',
    },
    signatureMotif: 'parallax-photo',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'I started Farm Direct with one rule: the homepage cannot look like a checkout page. It has to read.',
          context: 'The single rule that decided every typographic choice on the site.',
        },
        {
          kicker: 'Quote 02',
          quote: 'Without a framework, I had to write every interaction by hand, which forced me to ask whether each one was earning its place.',
          context: 'Why the entire site is vanilla HTML, CSS and JavaScript.',
        },
        {
          kicker: 'Quote 03',
          quote: 'It is a schema that admits the world it lives in.',
          context: 'Two role tables hanging off one users table; OAuth-ready, OTP-backed, designed for the actual users.',
        },
      ],
    },
    features: [
      { title: 'Editorial home page', desc: '"Grow Smarter / Grow Greener" split headline, services strip, featured farmers.' },
      { title: 'Services + products', desc: 'Six service cards, full produce catalogue with category filtering.' },
      { title: 'Two-role registration', desc: 'Branched profile tables for farm_details / customer_details.' },
      { title: 'OAuth-ready', desc: 'Google login wired against an oauth_credentials table.' },
      { title: 'Phone OTP reset', desc: 'otp_verifications table with expiry and verified flags.' },
      { title: 'IntersectionObserver reveals', desc: 'Hand-rolled scroll animation, no AOS dependency.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'Vanilla HTML, CSS, JavaScript — eight content pages.' },
      { layer: 'Database', details: 'MySQL — users, farm_details, customer_details, oauth_credentials, otp_verifications.' },
      { layer: 'Bridge', details: 'Thin PHP / Node layer between auth forms and the database.' },
      { layer: 'Assets', details: '40+ optimised hero images, hand-sampled palette from a single Coimbatore sunrise.' },
    ],
    bigNumbers: [
      { value: '8', label: 'content pages' },
      { value: '40', label: 'hero images' },
      { value: '0', label: 'frameworks' },
      { value: '3', label: 'parallax layers' },
    ],
    outcomeQuote:
      'It does not look like a marketplace. That is the point.',
  },

  'ea-tuition-app': {
    slug: 'ea-tuition-app',
    title: 'EA Fees',
    subtitle: "A coaching center's pocket fee manager.",
    kicker: kickerFor('ea-tuition-app'),
    heroImage: '/work/ea-tuition-app/thumb.jpg',
    palette: {
      bg: '#1E3A5F',
      bgMid: '#2F5687',
      text: '#FAF6EC',
      dim: '#C8AA70',
      accent: '#E8A33D',
      accent2: '#F1E9D2',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'The receipt book is full and the carbon paper smudges; can you make it a phone?',
          context: 'The brief, in one sentence. Office above a stationery shop, three rooms, fifteen-minute lookups.',
        },
        {
          kicker: 'Quote 02',
          quote: "PDF receipts were the moment the project clicked. Two seconds, no carbon paper, no smudge.",
          context: 'Take payment, tap Print, phone opens the receipt, parent screenshots it. That is the loop.',
        },
        {
          kicker: 'Quote 03',
          quote: 'I wanted the app to feel like a small object the staff enjoyed picking up, not a database front end.',
          context: 'Why the orb-painter background and the receipt-roll animation earn their pixels.',
        },
      ],
    },
    features: [
      { title: 'Sub-minute student onboarding', desc: 'Add a student, assign syllabus and standard, off you go.' },
      { title: 'Discount-aware fee maths', desc: 'Term fees calculated on the spot, including the user-facing label.' },
      { title: 'PDF receipt printer', desc: 'Generate, save, and immediately open via open_file. Parent leaves with proof.' },
      { title: 'Puducherry school dropdown', desc: 'Fixed-ish list, autocomplete, one-line to add a new school.' },
      { title: 'Audit log collection', desc: 'Every mutation leaves a fingerprint regardless of the caller.' },
      { title: 'Cross-device build', desc: 'One Flutter codebase ships to the staff tablet and the office laptop.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter mobile + tablet, Provider for state, flutter_animate for the receipt roll.' },
      { layer: 'Data', details: 'Cloud Firestore with rules-only security, validation in providers before writes.' },
      { layer: 'Auth', details: 'Firebase Auth (email + password planned), session router on launch.' },
      { layer: 'PDF', details: 'pdf package, local save then open_file; parent screenshots or shares.' },
    ],
    bigNumbers: [
      { value: '15', label: 'min lookups → 2 sec' },
      { value: '3', label: 'school boards' },
      { value: '0', label: 'carbon copies' },
      { value: '2', label: 'devices, one app' },
    ],
    outcomeQuote:
      'Take payment, tap Print, phone opens the receipt. Two seconds, no carbon paper, no smudge.',
  },

  mindora: {
    slug: 'mindora',
    title: 'Mindora',
    subtitle: 'Small check-ins. Honest charts. A calmer next week.',
    kicker: kickerFor('mindora'),
    heroImage: '/work/mindora/thumb.jpg',
    palette: {
      bg: '#FAF7F2',
      bgMid: '#F2EDE5',
      text: '#2C2540',
      dim: '#5A506E',
      accent: '#5742C4',
      accent2: '#4F7B4F',
    },
    signatureMotif: 'parallax-photo',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'Something quiet. Something that doesn\'t make my students feel they\'re being graded. And something I can show a doctor in 30 seconds.',
          context: 'The Coimbatore teacher whose paper-notebook check-ins became the brief.',
        },
        {
          kicker: 'Quote 02',
          quote: 'Three users, one app, one mood. The information hierarchy would change; the room would not.',
          context: 'Why students, parents and clinicians share the same lavender, sage and cream.',
        },
        {
          kicker: 'Quote 03',
          quote: 'No streaks, no badges, no mascots. Mindora had to be a place you came back to because you wanted to.',
          context: 'A wellness app should not punish the worst weeks.',
        },
      ],
    },
    features: [
      { title: 'Three-role workspace', desc: 'Student, parent, clinician — same calm, different hierarchy.' },
      { title: 'Twin assessment engines', desc: 'assessmentService + specialAssessmentService, identical shape, different pools.' },
      { title: 'Watercolor charts', desc: 'Recharts with linearGradient SVG fills, never geometric.' },
      { title: 'Quiet by default', desc: 'No notifications-by-default; the app waits for you.' },
      { title: 'RoleSelection home', desc: 'Three cards, two lines each. Two days of design, the rest inherits its tone.' },
      { title: 'Mood-aware visuals', desc: 'Lavender, sage and cream. Same room across every dashboard.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'React 19 + Vite 7 + Tailwind 4 (CSS-first config).' },
      { layer: 'Charts', details: 'Recharts with SVG linearGradient washes for watercolor effect.' },
      { layer: 'Domain', details: 'Twin assessment services, shared result-shape, one rendering component.' },
      { layer: 'Tone', details: 'No badges, no streaks, no mascots, no default notifications.' },
    ],
    bigNumbers: [
      { value: '3', label: 'roles, one mood' },
      { value: '0', label: 'streaks' },
      { value: '2', label: 'days on RoleSelection' },
      { value: '1', label: 'shared room' },
    ],
    outcomeQuote:
      'A place you come back to because you wanted to, not because the app was guilting you.',
  },

  alzhmeric: {
    slug: 'alzhmeric',
    title: 'Alzhmeric',
    subtitle: "A care companion for Alzheimer's families.",
    kicker: kickerFor('alzhmeric'),
    heroImage: '/work/alzhmeric/thumb.jpg',
    palette: {
      bg: '#F4D9D7',
      bgMid: '#E8E2DA',
      text: '#4A463F',
      dim: '#A6C5D6',
      accent: '#D9A8A4',
      accent2: '#A6C5D6',
    },
    signatureMotif: 'parallax-photo',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'It should feel like an old photo album. Soft edges. Family photographs front and centre. A timeline that breathed instead of scrolled.',
          context: 'After my mother told me the first build "looked like the hospital portal."',
        },
        {
          kicker: 'Quote 02',
          quote: 'Hold the pieces together when the person at the centre cannot.',
          context: 'The memory-pieces motif — jigsaw fragments assembling on scroll. A quiet metaphor for the work of caregiving.',
        },
        {
          kicker: 'Quote 03',
          quote: 'I wanted to be a notebook the whole family could write in.',
          context: 'Why the data model is small and the role separation is strict.',
        },
      ],
    },
    features: [
      { title: 'Three-role data wall', desc: 'Patient, caregiver, doctor — three apps, one codebase, one shared truth.' },
      { title: 'Memory album', desc: 'Soft-edge photo-album view with scroll-driven jigsaw motif.' },
      { title: 'Cognitive quiz module', desc: 'Voice-input quiz built on react-speech-recognition + mic-recorder-to-mp3.' },
      { title: 'Medication reminders', desc: 'Family-shared log; missed doses appear without anyone re-typing.' },
      { title: 'Patient-query inbox', desc: 'Doctor sees only what they need; caregiver sees only the alerts.' },
      { title: 'Render-deployed', desc: 'Live at alzheimeric-webapp.onrender.com against MongoDB Atlas.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'Create React App + Tailwind CSS; soft-edge photo-album styling.' },
      { layer: 'Backend', details: 'Express + Node, JWT auth, bcryptjs, Multer for uploads.' },
      { layer: 'Database', details: 'MongoDB Atlas with Mongoose models — User, PatientQuerry, Quiz.' },
      { layer: 'Deploy', details: 'Render web service hitting Atlas cluster, public URL for the family.' },
    ],
    bigNumbers: [
      { value: '3', label: 'roles, one truth' },
      { value: '6', label: 'weeks, not one' },
      { value: '1', label: 'doctor nodded' },
      { value: '0', label: 'paper notebooks left' },
    ],
    outcomeQuote:
      'It would have helped a year ago. That sentence is the only review of this project I have ever cared about.',
  },

  'fee-management': {
    slug: 'fee-management',
    title: 'FeeFlow',
    subtitle: 'Auto-reminder fee collection for schools.',
    kicker: kickerFor('fee-management'),
    heroImage: '/work/fee-management/thumb.jpg',
    palette: {
      bg: '#F4F6F8',
      bgMid: '#FFFFFF',
      text: '#1A2330',
      dim: '#5A6478',
      accent: '#2B6CB0',
      accent2: '#2F855A',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'Tell me who hasn\'t paid. Send them a proper invoice with my centre\'s name on it. Do it without me having to log in if I forget.',
          context: 'My mother\'s three asks. Dashboard first, PDF second, cron third.',
        },
        {
          kicker: 'Quote 02',
          quote: 'I wanted the invoice to look like paper. Hand-laid type, ruled lines, a real header band.',
          context: 'Why PDFKit, generating imperatively, beat any templating engine.',
        },
        {
          kicker: 'Quote 03',
          quote: 'FeeFlow is invisible. The parent should never know I exist.',
          context: 'The cron email signs off with the centre\'s name, not the platform.',
        },
      ],
    },
    features: [
      { title: 'Pending-dues dashboard', desc: 'One view of who has paid, who has not, this cycle.' },
      { title: 'Branded PDF invoices', desc: 'PDFKit imperative generation, the centre\'s 2008 fonts intact.' },
      { title: 'Cron-scheduled reminders', desc: 'Bulk emails on the first of each month, no manual login.' },
      { title: 'Excel import / export', desc: 'Whole student roster round-trips to a single .xlsx.' },
      { title: 'Firestore-backed', desc: 'Free-tier coverage; no IT person required at the centre.' },
      { title: 'Plain-language email body', desc: 'Rewritten four times until it sounded like the principal would write it.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'React + React-Bootstrap dashboard.' },
      { layer: 'Backend', details: 'Express server hosting the cron and the PDFKit pipeline.' },
      { layer: 'Data', details: 'Firebase Firestore — managed, billed-by-use, schema-flexible.' },
      { layer: 'Email', details: 'Nodemailer transport with the per-month cron template.' },
    ],
    bigNumbers: [
      { value: '15', label: 'years done by hand' },
      { value: '1', label: 'cron, one of the month' },
      { value: '4', label: 'rewrites of the email' },
      { value: '0', label: 'phone calls left' },
    ],
    outcomeQuote:
      'On the first of the month, the cron just did the thing. She called and said, "It worked."',
  },

  voyagr: {
    slug: 'voyagr',
    title: 'Voyagr',
    subtitle: 'An AI travel planner that books like a friend, not a form.',
    kicker: kickerFor('voyagr'),
    heroImage: '/work/voyagr/thumb.jpg',
    palette: {
      bg: '#101A3B',
      bgMid: '#1F2D5C',
      text: '#F2E7D3',
      dim: '#586187',
      accent: '#E9B872',
      accent2: '#2DB6B0',
    },
    signatureMotif: 'pulse-glow',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'I missed a train once because nobody told me the bus before it had been delayed by 40 minutes. The buffer was 35.',
          context: 'A single miss is the entire reason this app exists.',
        },
        {
          kicker: 'Quote 02',
          quote: 'I wanted a thing that thought of the trip as one object. Not a list of bookings — a journey.',
          context: 'Connected, risk-aware, weather-aware, group-aware.',
        },
        {
          kicker: 'Quote 03',
          quote: 'You are forbidden from generating mock data.',
          context: 'A strict policy at the top of the system prompt. APIs that fail must error, not invent.',
        },
      ],
    },
    features: [
      { title: 'One-conversation planner', desc: '"I want to go to Jaunpur from Pondicherry." Plans, prices, scores, stitches.' },
      { title: 'Multi-modal A* routing', desc: 'Flights, trains, buses, cabs, autos, Rapido bikes — every edge real.' },
      { title: 'Weather-aware risk score', desc: 'OpenWeather feeds risk into every transit edge.' },
      { title: 'Group-aware split', desc: 'Group chats with Chat mode and Prompt mode over shared context.' },
      { title: 'Real-data discipline', desc: 'Every edge carries source_api and retrieved_at, no exceptions.' },
      { title: 'Live SOS', desc: 'Always-on safety channel underneath the planner.' },
    ],
    architecture: [
      { layer: 'Agent', details: 'Manual orchestrator over LangGraph node names, plain-text LLM, Python tool calls.' },
      { layer: 'Data', details: 'Amadeus, OpenRouteService, OpenWeather, Tavily web extraction (RedBus, IRCTC, Uber).' },
      { layer: 'App', details: 'Flutter chat-first Gemini-style UI; sidebar of plans and groups.' },
      { layer: 'Policy', details: 'skills/real_data_policy.md read first by every agent step.' },
    ],
    bigNumbers: [
      { value: '7', label: 'graph nodes' },
      { value: '6', label: 'transit modes' },
      { value: '1', label: 'system prompt rule' },
      { value: '0', label: 'mocked edges' },
    ],
    outcomeQuote:
      'Real data or it errors. The graph is the journey. The conversation is the surface.',
  },

  // ============ ACT II ============
  'dhanoos-excellence': {
    slug: 'dhanoos-excellence',
    title: 'Excellence Academy',
    subtitle: 'A coaching institute, in navy and gold.',
    kicker: kickerFor('dhanoos-excellence'),
    heroImage: '/work/dhanoos-excellence/thumb.jpg',
    palette: {
      bg: '#0B1736',
      bgMid: '#142552',
      text: '#F7F1E1',
      dim: '#9AA8C8',
      accent: '#D4AF37',
      accent2: '#A1331E',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'This is the database, he said, with a smile that was half-pride, half-surrender.',
          context: 'The principal opening a steel cupboard of admission forms tied with rubber bands.',
        },
        {
          kicker: 'Quote 02',
          quote: 'The motion language ties three codebases into one product. Without it, this is software. With it, it is a brand.',
          context: 'Page-turn, certificate stamp, sparkle on the top three. Why the transitions matter.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The cupboard is still there. But it\'s empty now.',
          context: 'A public site, an admin tool, an API — the part that does the actual work.',
        },
      ],
    },
    features: [
      { title: 'Online admissions', desc: 'Application form generates a PDF and uploads to per-class Drive folders.' },
      { title: 'Top-performer wall', desc: 'Live cards backed by /api/top-performers, no more drawer photos.' },
      { title: 'Academic-year toggle', desc: 'One Firestore doc, one POST, repartitions the entire app.' },
      { title: 'Admin dashboard', desc: 'Separate Vite app; auth via authorized-persons collection.' },
      { title: 'School autocomplete', desc: '60+ schools, no two parents spell the name three different ways.' },
      { title: 'Certificate stamp UX', desc: 'Every success state ships with the academy\'s seal.' },
    ],
    architecture: [
      { layer: 'Public site', details: 'React, single App.jsx, GSAP marquee, word-cloud hero.' },
      { layer: 'Admin', details: 'Separate Vite SPA, adminemail header, verifyAdmin middleware.' },
      { layer: 'API', details: '/api/submit-application, /api/top-performers, Drive + Firestore round trip.' },
      { layer: 'Auth', details: 'Google OAuth flow, token.json baked into env-var pipeline.' },
    ],
    bigNumbers: [
      { value: '10', label: 'years of toppers' },
      { value: '60', label: 'schools listed' },
      { value: '4', label: 'years of paper retired' },
      { value: '1', label: 'cupboard, now empty' },
    ],
    outcomeQuote:
      'A small operating system. A public site, a back office, a vault that does not lose a single document.',
  },

  'student-portal': {
    slug: 'student-portal',
    title: 'My Campus',
    subtitle: "A student's window into marks, records and transcripts.",
    kicker: kickerFor('student-portal'),
    heroImage: '/work/student-portal/thumb.jpg',
    palette: {
      bg: '#1F3328',
      bgMid: '#2F4A3A',
      text: '#F5F1E6',
      dim: '#E6DFCC',
      accent: '#C9962B',
      accent2: '#E0B65A',
    },
    signatureMotif: 'scroll-zoom',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'Build the smallest possible thing that lets a student own their record once and stop re-filling it.',
          context: 'The brief, after a friend lost her admission category form for the third time.',
        },
        {
          kicker: 'Quote 02',
          quote: 'A portal should feel like a window — you look through it, you do not live inside it.',
          context: 'Why there is no chat, no notifications, no streak.',
        },
        {
          kicker: 'Quote 03',
          quote: 'I had to count spaces between PUDUCHERRY and TECHNOLOGICAL three times to get the kerning right.',
          context: 'TCPDF is a museum, but it is the museum that runs everywhere.',
        },
      ],
    },
    features: [
      { title: 'OTP-only sign-in', desc: 'Roll number + 15-minute code to @ptuniv.edu.in. No passwords.' },
      { title: 'Profile book', desc: 'Every paper-form checkbox as a MySQL ENUM. Boring won.' },
      { title: 'Eight-semester GPA chart', desc: 'CHECK constraint 0–10, inline trajectory chart.' },
      { title: 'Pixel-perfect PDF transcript', desc: 'TCPDF letterhead matches the printed original.' },
      { title: 'Family + accommodation tabs', desc: 'One source of truth the student themselves owns.' },
      { title: 'Foreign-key cascades', desc: 'Withdrawn students leave no orphan rows.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'PHP server-rendered + Bootstrap 5; survives ancient lab Chrome.' },
      { layer: 'Database', details: 'MySQL with ENUM-heavy profile schema, FK cascades.' },
      { layer: 'Auth', details: 'OTP via PHPMailer, 15-minute window, no password storage.' },
      { layer: 'PDF', details: 'TCPDF, hand-tuned letterhead, kerning verified by hand.' },
    ],
    bigNumbers: [
      { value: '15', label: 'min OTP window' },
      { value: '8', label: 'semesters charted' },
      { value: '9', label: 'admission ENUMs' },
      { value: '0', label: 'paper trails left' },
    ],
    outcomeQuote:
      'Roll number in, transcript out, paper trail abolished.',
  },

  'teacher-portal': {
    slug: 'teacher-portal',
    title: 'TeachDesk',
    subtitle: "A teacher's toolkit to manage classes and reports.",
    kicker: kickerFor('teacher-portal'),
    heroImage: '/work/teacher-portal/thumb.jpg',
    palette: {
      bg: '#3A2410',
      bgMid: '#5A3A1F',
      text: '#F4ECD8',
      dim: '#A89070',
      accent: '#722F37',
      accent2: '#8E4047',
    },
    signatureMotif: 'scroll-zoom',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'A student portal without a faculty side is a half-bridge.',
          context: 'Why I built TeachDesk and My Campus the same week, on the same schema.',
        },
        {
          kicker: 'Quote 02',
          quote: 'A teacher\'s desk is paper, leather, brass: a ledger you stamp, not a board you wipe.',
          context: 'Why the palette shifted from chalkboard to walnut and burgundy.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The friction is the feature.',
          context: 'A paged list with per-row exclude got "I trust this" reactions. The five-name preview did not.',
        },
      ],
    },
    features: [
      { title: 'Five-role guard', desc: 'Class Advisor, HOD, Dean, Counselor, Placement — same data, scoped views.' },
      { title: 'Forwarding chain', desc: 'CLASS_ADVISOR → HOD → DEAN, enforced in PHP for human errors.' },
      { title: 'Batch operations', desc: 'Paged confirmation list with per-row exclude. The friction is the feature.' },
      { title: 'Reports for each role', desc: 'Batch-wise % for HOD, department-wise for Dean.' },
      { title: 'Marker-stroke dividers', desc: 'Section transitions that respect a thirty-year signing habit.' },
      { title: 'Shared schema with My Campus', desc: 'Approval columns belong to faculty; profile fields to the student.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'PHP + Bootstrap, walnut and burgundy palette, paper-grain cards.' },
      { layer: 'Database', details: 'Same MySQL as My Campus; role + scope WHERE on every list query.' },
      { layer: 'Policy', details: 'Per-page guard at the top: redirect if your role cannot do this.' },
      { layer: 'Reports', details: 'Role-specific report pages; counselor uses search instead.' },
    ],
    bigNumbers: [
      { value: '5', label: 'roles' },
      { value: '3', label: 'rebuilds of confirm' },
      { value: '1', label: 'shared schema' },
      { value: '0', label: 'orphan rows' },
    ],
    outcomeQuote:
      'A desk for the teacher, a window for the student, a single MySQL database holding the truth between them.',
  },

  'invoice-system': {
    slug: 'invoice-system',
    title: 'ApprovePay',
    subtitle: 'Multi-level invoice approvals for finance teams.',
    kicker: kickerFor('invoice-system'),
    heroImage: '/work/invoice-system/thumb.jpg',
    palette: {
      bg: '#0F1A33',
      bgMid: '#1B2A4E',
      text: '#FBF8F1',
      dim: '#8A98B8',
      accent: '#C0392B',
      accent2: '#E07368',
    },
    signatureMotif: 'horizontal-reveal',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'A clear approval chain, a place where the documents lived, and a log of who did what when.',
          context: 'My friend\'s three asks at 11 PM on a Tuesday. Most engineering decisions trace back to that sticky note.',
        },
        {
          kicker: 'Quote 02',
          quote: 'The history of an invoice is the product. The form fields are how you write that history.',
          context: 'Every state-changing action writes a row. The audit log is append-only.',
        },
        {
          kicker: 'Quote 03',
          quote: 'It looks like an old ledger. People who do this work for a living open the page and recognise the medium.',
          context: 'Pinstripe-navy hairlines on paper-white. Audit-red held back for rejection only.',
        },
      ],
    },
    features: [
      { title: 'Four-role pipeline', desc: 'Clerk → Finance → Auditor → Admin. Not interchangeable.' },
      { title: 'Append-only audit log', desc: 'Every state change written. IP captured. Cited in two disputes since.' },
      { title: 'Document vault', desc: 'Uploads outside the document root, controller-gated download.' },
      { title: 'Server-rendered HTML', desc: 'Sessions, prepared statements, no SPA, no build pipeline.' },
      { title: 'Stamp-on-scroll case study', desc: 'Paper recoils, dust comes off, settles. The metaphor is the medium.' },
      { title: 'PHP + MySQL deploy', desc: '`git pull` is the deploy step. The IT person thanked me.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'PHP server-rendered, prepared statements, no SPA.' },
      { layer: 'Database', details: 'MySQL 8 with append-only audit_log, role-aware queries.' },
      { layer: 'Storage', details: 'Uploads outside document root, every download re-checks role.' },
      { layer: 'Deploy', details: 'Single LAMP box, intranet-style, git pull deploys.' },
    ],
    bigNumbers: [
      { value: '4', label: 'roles in the chain' },
      { value: '14', label: 'tab spreadsheet retired' },
      { value: '12', label: 'days waiting → minutes' },
      { value: '0', label: 'silent bypasses' },
    ],
    outcomeQuote:
      'Pinstripe-navy hairlines on paper-white. The history of an invoice is the product.',
  },

  'hotel-app': {
    slug: 'hotel-app',
    title: 'StayEasy',
    subtitle: 'Hotel bookings, walk-ins and billing in one app.',
    kicker: kickerFor('hotel-app'),
    heroImage: '/work/hotel-app/thumb.jpg',
    palette: {
      bg: '#0A3744',
      bgMid: '#0F4C5C',
      text: '#FAF3E7',
      dim: '#B98A4F',
      accent: '#D4A567',
      accent2: '#B98A4F',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'The night audit took her until 1 a.m. and I knew, before I had even opened a code editor, that the only honest fix was a single source of truth.',
          context: 'Saturday night, three walk-ins, two agent vouchers, one website booking nobody had told her about.',
        },
        {
          kicker: 'Quote 02',
          quote: 'Every status change is an event, not a poll.',
          context: 'Why Socket.io was the first thing I designed. Two managers can\'t silently overwrite each other.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The whole hotel runs on one screen. That was the brief.',
          context: 'Three booking channels, one inbox, one truth.',
        },
      ],
    },
    features: [
      { title: 'Three sources, one inbox', desc: 'Website, walk-in, agent — one booking model with a source enum.' },
      { title: 'Real-time room turnover', desc: 'Socket.io events on every status change, receptionist phone buzzes.' },
      { title: 'computeInvoice', desc: 'Single function for partial nights, extra beds, taxes, room service.' },
      { title: 'Travel-agent block uploads', desc: 'Agent uploads on their laptop; front desk sees it instantly.' },
      { title: 'Manager mobile dashboard', desc: 'Last weekend\'s revenue without opening four programs.' },
      { title: 'Hospitality palette', desc: 'Warm cream + brass + deep teal. Soft, never sharp.' },
    ],
    architecture: [
      { layer: 'Backend', details: 'Node.js + Express, Socket.io channels per status change.' },
      { layer: 'Staff app', details: 'Flutter — one codebase for Android and iOS receptionists.' },
      { layer: 'Guest site', details: 'React, thin and fast, feeds the same backend.' },
      { layer: 'Database', details: 'MongoDB + Mongoose; bookings, customers, rooms.' },
    ],
    bigNumbers: [
      { value: '3', label: 'channels, one inbox' },
      { value: '1', label: 'computeInvoice fn' },
      { value: '0', label: 'oversells' },
      { value: '1', label: 'screen runs the hotel' },
    ],
    outcomeQuote:
      'StayEasy is not a flashy product. It is a quiet one. The whole hotel runs on one screen.',
  },

  'jewelry-pos': {
    slug: 'jewelry-pos',
    title: 'GemPoint',
    subtitle: 'A smart billing counter for jewelry stores.',
    kicker: kickerFor('jewelry-pos'),
    heroImage: '/work/jewelry-pos/thumb.jpg',
    palette: {
      bg: '#0A1410',
      bgMid: '#0B3A2E',
      text: '#F8F2E4',
      dim: '#9BAA9F',
      accent: '#E7C792',
      accent2: '#2DBF8F',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'Let me scan, let me bill, let me see what sold today.',
          context: 'Disarmingly simple. That sentence became the brief.',
        },
        {
          kicker: 'Quote 02',
          quote: 'Once Zod owned the truth, react-hook-form became a thin shell over it, and field errors surfaced inline without the dreaded submit-and-pray pattern.',
          context: 'Get one weight wrong and the customer either overpays or the shop loses a thousand rupees.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Forty seconds. He grinned. That was the deliverable.',
          context: 'Scan a chain, see the customer, type the rate once, hit Print.',
        },
      ],
    },
    features: [
      { title: 'Quagga2 scanner', desc: 'Concurrent rendering keeps the rest of the UI responsive while the camera decodes.' },
      { title: 'Zod-first form layer', desc: 'Every entity validated before a single component existed.' },
      { title: 'Barcode workshop', desc: 'SKU + weight + purity → Code-128 SVG → printable sheet.' },
      { title: 'Domain-split modules', desc: 'Sales, Purchase, Masters, Barcode — three months later you know which folder.' },
      { title: 'Daily-rate maths', desc: 'Gross / stone / net weight, making mode, wastage, GST. Inline.' },
      { title: 'Thermal-printer invoices', desc: 'Tweaked dozens of times against a real printer in the back office.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'React 19 (concurrent rendering for the scanner) + Vite.' },
      { layer: 'Forms', details: 'Zod + react-hook-form, inline errors, no submit-and-pray.' },
      { layer: 'API', details: 'Single Axios instance with interceptors; offline-tolerant retries on key calls.' },
      { layer: 'Style', details: 'Tailwind 4, deep emerald + champagne gold + cream.' },
    ],
    bigNumbers: [
      { value: '40', label: 'sec per bill' },
      { value: '12', label: 'interlocking fields' },
      { value: '4', label: 'domain modules' },
      { value: '0', label: 'submit-and-pray' },
    ],
    outcomeQuote:
      'It is a counter tool. It loads fast, scans cleanly, validates ruthlessly, and prints a bill that belongs in a jewelry store.',
  },

  'market-pulse': {
    slug: 'market-pulse',
    title: 'MarketPulse',
    subtitle: 'Live stock charts and alerts in your pocket.',
    kicker: kickerFor('market-pulse'),
    heroImage: '/work/market-pulse/thumb.jpg',
    palette: {
      bg: '#0B0E12',
      bgMid: '#11161D',
      text: '#E5EDF7',
      dim: '#7C8AA0',
      accent: '#22C55E',
      accent2: '#EF4444',
    },
    signatureMotif: 'scroll-zoom',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'I lost a trade I should not have lost. The level broke while I was on the metro.',
          context: 'That evening I wrote down what I actually wanted: one screen, fingers on the chart, alert before screen-timeout.',
        },
        {
          kicker: 'Quote 02',
          quote: 'I tuned the curve until it stopped feeling like an alert and started feeling like a heartbeat.',
          context: 'The 220ms tick flash is when the app earned its name.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Traders read price columns. Decimals must align. Green up, red down, no cognitive translation.',
          context: 'Why the glass-morphism prototype was rebuilt as a carbon-black terminal.',
        },
      ],
    },
    features: [
      { title: 'Live tick chart', desc: 'candlesticks package wrapped in a thin controller; redraws on every tick.' },
      { title: 'Local alert engine', desc: 'No backend. Polls evaluate thresholds. One-shot disable available.' },
      { title: 'Tick flash heartbeat', desc: '220ms breath — green or red — back to neutral. Not an alert, a pulse.' },
      { title: 'Watchlists', desc: 'Compressed monospace; one-pass scan of a column.' },
      { title: 'News without paywall', desc: 'No subscription on the second tap.' },
      { title: 'http + dio split', desc: 'http for the hot tick path, dio for cancellation and retries.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter 3.6, single codebase for Android and iOS.' },
      { layer: 'Charts', details: 'candlesticks package + custom controller, externally-driven feed.' },
      { layer: 'Alerts', details: 'Local notifications, no account system.' },
      { layer: 'Type', details: 'Monospace numerals, narrow accent face. Bloomberg sub-header energy.' },
    ],
    bigNumbers: [
      { value: '220', label: 'ms tick flash' },
      { value: '2', label: 'http clients' },
      { value: '0', label: 'paywalled candles' },
      { value: '1', label: 'watching tool' },
    ],
    outcomeQuote:
      'A watching tool. It does the watching well, and it leaves the deciding to the trader.',
  },

  // ============ ACT III ============
  'viksit-ai': {
    slug: 'viksit-ai',
    title: 'Viksit.AI',
    subtitle: 'An AI workspace that codes, searches and talks back.',
    kicker: kickerFor('viksit-ai'),
    heroImage: '/work/viksit-ai/thumb.jpg',
    palette: {
      bg: '#0A0F1A',
      bgMid: '#0F1626',
      text: '#E5E7EB',
      dim: '#7B85A0',
      accent: '#8B5CF6',
      accent2: '#3B82F6',
    },
    signatureMotif: 'pulse-glow',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'I had eleven tabs open. That afternoon Viksit.AI started.',
          context: 'A private bet that one tab could replace eleven if I did the integration work the vendors decided was out of scope.',
        },
        {
          kicker: 'Quote 02',
          quote: 'An AI workspace is a UX problem, not a model problem.',
          context: 'Groq, JDoodle, GitHub, Sarvam — all of them already exist. The place to use them together did not.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The cognitive cost of context-switching across tabs erased every productivity gain the individual tools claimed.',
          context: 'Why one tab, one identity, four capabilities.',
        },
      ],
    },
    features: [
      { title: 'Groq chatbot', desc: 'Sub-300ms first token; the typing reveal feels like a person, not a spinner.' },
      { title: 'JDoodle code sandbox', desc: 'Type print("hello"), hit run, terminal pane prints hello. The product.' },
      { title: 'GitHub explorer', desc: 'Paste a repo URL, get a one-paragraph "what this is" and where to start reading.' },
      { title: 'Google CSE wrapper', desc: 'Programmable Search inline, no tab swap.' },
      { title: 'Sarvam voice channel', desc: 'Indic-language STT → Groq → TTS in one chunked-response endpoint.' },
      { title: 'Streamlit operator panel', desc: 'See model input + output side by side without redeploying prompts.' },
    ],
    architecture: [
      { layer: 'Backend', details: 'Django + DRF, single github_app with ten verbs.' },
      { layer: 'Model layer', details: 'langchain_groq.ChatGroq (text), raw Groq SDK (vision).' },
      { layer: 'Frontend', details: 'React + Monaco editor, ReadableStream for the voice channel.' },
      { layer: 'Operator', details: 'Streamlit on :8501 for prompt iteration without a redeploy.' },
    ],
    bigNumbers: [
      { value: '11', label: 'tabs collapsed' },
      { value: '4', label: 'integrations welded' },
      { value: '300', label: 'ms first token' },
      { value: '1', label: 'tab, one identity' },
    ],
    outcomeQuote:
      'An AI workspace is a UX problem, not a model problem.',
  },

  careervisionx: {
    slug: 'careervisionx',
    title: 'CareerVisionX',
    subtitle: 'An AI mentor that helps students pick the right career.',
    kicker: kickerFor('careervisionx'),
    heroImage: '/work/careervisionx/thumb.jpg',
    palette: {
      bg: '#1A1208',
      bgMid: '#3F2A14',
      text: '#FFF8EE',
      dim: '#B89770',
      accent: '#F97316',
      accent2: '#0EA5E9',
    },
    signatureMotif: 'pulse-glow',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'CareerVisionX is for the floor-lookers.',
          context: 'Sixteen of twenty-three said engineer or doctor. Four said something interesting, then "but my parents."',
        },
        {
          kicker: 'Quote 02',
          quote: 'Every reply has to land with a next step the student can take this week. Concrete is the load-bearing word.',
          context: 'Why the Groq prompt rejects abstract advice at the prompt level.',
        },
        {
          kicker: 'Quote 03',
          quote: 'A career app for high schoolers is a tone problem first, a technology problem second.',
          context: 'Voice, Lottie, sunrise palette. The rest is engineering.',
        },
      ],
    },
    features: [
      { title: 'Sunrise splash', desc: '1.4-second Lottie of a path drawing itself. The product is the path.' },
      { title: 'Categorical scorer', desc: 'Five categories, 0–1 scores, ≥0.7 is strength, <0.5 is improvement area.' },
      { title: 'Voice loop', desc: 'speech_to_text + flutter_tts with a per-locale voice resolver, never the OEM default.' },
      { title: 'Drawing roadmap', desc: 'CustomPainter draws connecting lines as the student scrolls.' },
      { title: 'Earned confetti', desc: 'Rare, intentional. We celebrate milestones, not taps.' },
      { title: 'Hopeful empty states', desc: 'Every empty state ships with a Lottie sunrise.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter, 2GB Android budget device first, iOS second.' },
      { layer: 'Model', details: 'Groq mentor — patient, curious, concrete. Audited by prompt, not by code.' },
      { layer: 'Voice', details: 'tts_voice_resolver picks the friendliest installed voice for the locale.' },
      { layer: 'Data', details: 'firebase_auth + cloud_firestore for the durable layer.' },
    ],
    bigNumbers: [
      { value: '23', label: 'students interviewed' },
      { value: '5', label: 'aptitude categories' },
      { value: '11', label: 'words per slide' },
      { value: '1', label: 'path on screen one' },
    ],
    outcomeQuote:
      'Sunrise, horizon, and a path drawing itself. The rest is engineering.',
  },

  darkwatch: {
    slug: 'darkwatch',
    title: 'DarkWatch',
    subtitle: 'A pocket-sized dark-web detective.',
    kicker: kickerFor('darkwatch'),
    heroImage: '/work/darkwatch/thumb.jpg',
    palette: {
      bg: '#0A0A0B',
      bgMid: '#111317',
      text: '#E0E5EC',
      dim: '#8A8F98',
      accent: '#00FF66',
      accent2: '#FF003C',
    },
    signatureMotif: 'pulse-glow',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'The people who most need to know about breaches are the least likely to ever find out.',
          context: 'After a friend\'s leaked LinkedIn password sat next to his banking credentials in plaintext.',
        },
        {
          kicker: 'Quote 02',
          quote: 'I wanted something he\'d actually open. The cool hacker scene from a movie — but on his side, working for him.',
          context: 'Why the napkin sketch is three screens, big severity badges, plain-English next steps.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The architecture was honest from day one. SHA-1, take the first 5 chars, hit the range API, never send the full hash.',
          context: 'k-anonymity by default. The mock fixture set let me iterate without burning quota.',
        },
      ],
    },
    features: [
      { title: 'Terminal boot splash', desc: 'Character-by-character reveal; the OK fires only when Firebase actually connects.' },
      { title: 'Animated radar pulse', desc: 'On every breach scan; calm when clean, urgent when not.' },
      { title: 'Severity badges', desc: 'High / medium / low with colorblind-safe accents.' },
      { title: 'Custom-painted graph', desc: 'Line segments draw left-to-right via AnimationController.' },
      { title: 'k-anonymity HIBP path', desc: 'SHA-1 prefix range API; full hash never leaves the device.' },
      { title: 'Mock fixtures', desc: 'LinkedIn 2021, Adobe 2013, MySpace 2013 — for offline iteration.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter — Android, iOS and Web from one codebase.' },
      { layer: 'Effects', details: 'flutter_animate + animated_text_kit for typewriter and glitch.' },
      { layer: 'Backend', details: 'Firebase auth + Firestore + Cloud Messaging.' },
      { layer: 'Detector', details: 'BreachDetector service, mock + real path behind a feature flag.' },
    ],
    bigNumbers: [
      { value: '5', label: 'mock breach fixtures' },
      { value: '5', label: 'char SHA-1 prefix' },
      { value: '3', label: 'screens, big badges' },
      { value: '0', label: 'full hashes leaked' },
    ],
    outcomeQuote:
      'Scan once. Sleep better. Your inbox shouldn\'t be a black market.',
  },

  // ============ ACT IV ============
  spaceforge: {
    slug: 'spaceforge',
    title: 'SpaceForge',
    subtitle: 'A cinematic 3D landing for a tech studio.',
    kicker: kickerFor('spaceforge'),
    heroImage: '/work/spaceforge/thumb.jpg',
    palette: {
      bg: '#0B0F1A',
      bgMid: '#13182A',
      text: '#E8EAF2',
      dim: '#A7A9BE',
      accent: '#6E00FF',
      accent2: '#00FFE0',
    },
    signatureMotif: 'horizontal-reveal',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'You opened a black browser tab and a small spaceship drifted past.',
          context: 'The pitch in my head before I wrote a line of JSX. Most of the painful decisions came down to protecting it.',
        },
        {
          kicker: 'Quote 02',
          quote: 'Designer-tooling for the centerpiece, code for the texture around it.',
          context: 'Spline for the hero scene; R3F for the 3,000-point procedural starfield.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Cinematic does not mean expensive. It means committed.',
          context: 'One headline font, one camera move, one palette, executed with patience.',
        },
      ],
    },
    features: [
      { title: 'Spline hero scene', desc: '3D logo orbiting at center; designer-tooling on the centerpiece.' },
      { title: 'Procedural starfield', desc: '3,000 points sampled from a Y-biased disc; rotates as one Points object.' },
      { title: 'Three italic faces', desc: 'Syne / Antonio / Orbitron — sequenced, not simultaneous.' },
      { title: 'AOS-Framer seam fix', desc: 'Matched easing curves so the fold transition disappeared.' },
      { title: 'Reduced-motion fallback', desc: 'Flat hero, starfield disabled, no jitter.' },
      { title: '60fps mid-range laptop', desc: 'Static Vite build, every interaction screenshot-worthy.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'React 19 + TypeScript + Vite, Tailwind v4.' },
      { layer: '3D', details: 'React-Three-Fiber + Three.js for the starfield, @splinetool/react-spline for hero.' },
      { layer: 'Motion', details: 'Framer Motion 12 for hero, AOS (ease-out-cubic, 1200ms) for the rest.' },
      { layer: 'Type', details: 'Syne italic / Antonio italic / Orbitron italic — three voices, one title sequence.' },
    ],
    bigNumbers: [
      { value: '3000', label: 'starfield points' },
      { value: '3', label: 'italic faces' },
      { value: '1', label: 'camera move' },
      { value: '60', label: 'fps mid-range' },
    ],
    outcomeQuote:
      'Cinematic does not mean expensive. It means committed.',
  },

  'vkmg-landing': {
    slug: 'vkmg-landing',
    title: 'VKMG',
    subtitle: 'A cinematic landing page for an IT consultancy.',
    kicker: kickerFor('vkmg-landing'),
    heroImage: '/work/vkmg-landing/thumb.jpg',
    palette: {
      bg: '#0D1117',
      bgMid: '#1A1E24',
      text: '#AAEEFF',
      dim: '#5A7A8C',
      accent: '#00AAFF',
      accent2: '#00FFAA',
    },
    signatureMotif: 'horizontal-reveal',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'The difference between cinematic and theatrical.',
          context: 'A consultancy needed authority, not a startup launch sequence. Every motion idea re-tuned downward.',
        },
        {
          kicker: 'Quote 02',
          quote: 'We build the workstation, not the planet.',
          context: 'Why the textured Earth got scrapped for a wireframe workstation scene. Half the GPU cost.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Cinematic is sometimes the absence of motion as much as the presence of it.',
          context: 'I cut the parallax. Only the blueprint grid moves at 0.2x. The page feels grounded.',
        },
      ],
    },
    features: [
      { title: 'Wireframe workstation', desc: 'R3F line-geometry desk + monitor + keyboard, slow auto-rotate.' },
      { title: 'Blueprint grid background', desc: 'Translates at 0.2x; everything else fixed in place.' },
      { title: 'Tick-ring + scan-line + status', desc: 'Eight circuit shapes, twelve lines — all loops drift independently.' },
      { title: 'Typewriter sub-tagline', desc: 'Framer Motion driven, types like the firm announcing its name.' },
      { title: 'styled-components + Tailwind', desc: 'Hero is prop-driven primitives; sections are layout. One palette source.' },
      { title: 'Pair-tokens with vkmg-report-app', desc: 'Public face and operator face from one design system.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'React 18, Vite static build, Suspense-loaded R3F scene.' },
      { layer: '3D', details: 'Three.js + R3F + drei wireframe glTF.' },
      { layer: 'Motion', details: 'Framer Motion 10 for entrance, hover, typewriter.' },
      { layer: 'Style', details: 'styled-components for hero primitives; Tailwind for layout. One theme file.' },
    ],
    bigNumbers: [
      { value: '8', label: 'circuit shapes drifting' },
      { value: '12', label: 'circuit lines' },
      { value: '0.2', label: 'x parallax (only)' },
      { value: '3', label: 'palette colors' },
    ],
    outcomeQuote:
      'Cinematic is sometimes the absence of motion as much as the presence of it.',
  },

  'vkmg-report-app': {
    slug: 'vkmg-report-app',
    title: 'VKMG ReportLog',
    subtitle: 'Field-team reports that work even offline.',
    kicker: kickerFor('vkmg-report-app'),
    heroImage: '/work/vkmg-report-app/thumb.jpg',
    palette: {
      bg: '#1F1F1F',
      bgMid: '#2C2C2C',
      text: '#F4EFE7',
      dim: '#A89070',
      accent: '#F2A93B',
      accent2: '#3D6A8F',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'He had been writing on paper again.',
          context: 'A site engineer, on a no-signal site, lost a submission. That is when offline-first stopped being a buzzword.',
        },
        {
          kicker: 'Quote 02',
          quote: 'The network became a sync target, not a save target.',
          context: 'A report saves locally first, every time. The user has never seen the queue.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Visibility was the actual feature. Make the absence of work visible, not just the presence of it.',
          context: 'The Owner found a day with no dot and asked why. That is the calendar, doing its job.',
        },
      ],
    },
    features: [
      { title: 'Hive-backed offline-first', desc: 'Embedded local DB; network is a nice-to-have, not a precondition.' },
      { title: 'Opportunistic sync queue', desc: 'connectivity_plus drives the drain; user never sees it.' },
      { title: 'Image downscale on capture', desc: '1600px max; eight-second saves became 700ms.' },
      { title: 'Calendar of dots', desc: 'table_calendar with per-day count; "Why is there no dot here?" is the feature.' },
      { title: 'Three-time reminder loop', desc: '5 PM, 7:30 PM, 9 AM. Filing rates 60% → 92% in week one.' },
      { title: 'Honeycomb load state', desc: 'Hive metaphor literalised; cells fill in.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter; Hive for local storage; provider for state.' },
      { layer: 'Sync', details: 'connectivity_plus + opportunistic queue drain; resumable.' },
      { layer: 'Notifications', details: 'flutter_local_notifications, three scheduled triggers per day.' },
      { layer: 'Owner side', details: 'table_calendar, PDF + Excel export.' },
    ],
    bigNumbers: [
      { value: '92', label: 'percent filing rate' },
      { value: '700', label: 'ms image save' },
      { value: '3', label: 'reminders/day' },
      { value: '0', label: 'paper reports left' },
    ],
    outcomeQuote:
      'A report saves locally first, every time. The network is a sync target, not a save target.',
  },

  zyntra: {
    slug: 'zyntra',
    title: 'Zyntra',
    subtitle: 'A digital agency website that sells its own vibe.',
    kicker: kickerFor('zyntra'),
    heroImage: '/work/zyntra/thumb.jpg',
    palette: {
      bg: '#0A0A0A',
      bgMid: '#1A0F18',
      text: '#FFFFFF',
      dim: '#B0B0B0',
      accent: '#FF0099',
      accent2: '#FFEE00',
    },
    signatureMotif: 'horizontal-reveal',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'Zyntra is the project where I stopped reaching for React on reflex.',
          context: 'PHP partials, MySQL, Bootstrap, custom CSS, vanilla JS. The constraint sharpened every decision.',
        },
        {
          kicker: 'Quote 02',
          quote: 'When the section label is louder than the content, the page reads as a reel rather than a brochure.',
          context: 'The marquee letters at 14vw became the page. Smaller hero copy slid into a supporting role.',
        },
        {
          kicker: 'Quote 03',
          quote: 'One element, four visual identities.',
          context: 'mix-blend-mode: difference is the trick. The cursor blob inverts whatever it sits over.',
        },
      ],
    },
    features: [
      { title: 'Marquee letters at 14vw', desc: 'Massive type carries the agency-reel feel; the H1 stays still.' },
      { title: 'Color-block scene swaps', desc: 'Magenta → yellow → magenta → black. 0.6s ease-out-cubic.' },
      { title: 'mix-blend cursor blob', desc: '60px, difference blend; one element, four palettes.' },
      { title: 'Z-Y-N-T-R-A loading screen', desc: 'Letter-by-letter spell-out before the page fades in.' },
      { title: 'Touch-only scroll-snap', desc: 'Scoped to (pointer: coarse); desktop trackpads stay free.' },
      { title: 'Three-file PHP backend', desc: 'Contact-form + DB + mail config. One afternoon.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'PHP partials + Bootstrap + custom CSS + vanilla JS. No build step.' },
      { layer: 'Motion', details: 'GSAP + ScrollTrigger from CDN; main.js, animations.js, parallax.js.' },
      { layer: 'Backend', details: 'PHP + MySQL contact form, server-side validation, SMTP email.' },
      { layer: 'Type', details: 'Raleway body, Space Grotesk marquee 10–18vw.' },
    ],
    bigNumbers: [
      { value: '14', label: 'vw marquee letters' },
      { value: '4', label: 'scene palettes' },
      { value: '60', label: 'px cursor blob' },
      { value: '0', label: 'frameworks' },
    ],
    outcomeQuote:
      'Restraint is the agency vibe too — knowing when to not animate.',
  },

  divyadrishti: {
    slug: 'divyadrishti',
    title: 'DivyaDrishti',
    subtitle: 'A safety app that watches over women in real time.',
    kicker: kickerFor('divyadrishti'),
    heroImage: '/work/divyadrishti/thumb.jpg',
    palette: {
      bg: '#1A1530',
      bgMid: '#2A2050',
      text: '#FAF7F2',
      dim: '#9A8FB8',
      accent: '#7C5CFF',
      accent2: '#FF2D4F',
    },
    signatureMotif: 'pulse-glow',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'What\'s the point of a safety app you can\'t use when you\'re scared?',
          context: 'A girl forgot the four-digit PIN twenty minutes into a Bangalore Uber. The app was useless.',
        },
        {
          kicker: 'Quote 02',
          quote: 'I wanted to design backwards from the moment of fear.',
          context: 'Three things, in order: location, social signal, evidence. Everything else waits.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The aesthetic loss was worth the reliability win.',
          context: 'Three of five users misfired in the first ten minutes. The 1.2-second hold-to-confirm dropped misfires to zero.',
        },
      ],
    },
    features: [
      { title: 'Hold-to-confirm SOS', desc: '1.2s long press with a visual ring. Misfire rate dropped to zero.' },
      { title: 'Sub-3s SOS pipeline', desc: 'GPS fix → camera frame → Firestore alert → FCM fan-out.' },
      { title: 'GPS-radar map', desc: 'Pulse on the map, circle of trusted contacts.' },
      { title: 'Evidence capture', desc: 'Camera frame the moment SOS fires; uploaded with the alert.' },
      { title: 'No PIN, no menu', desc: 'One press. Everything else waits.' },
      { title: 'Hive offline queue', desc: 'Alerts queue locally if there is no signal; drained when reconnected.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter — Android + iOS, geolocator, camera, permission_handler.' },
      { layer: 'Push', details: 'firebase_messaging + flutter_local_notifications + awesome_notifications.' },
      { layer: 'Storage', details: 'Hive for offline queue, Firestore for the live alert stream.' },
      { layer: 'Trust circle', details: 'Contact graph; FCM fan-out targets only opted-in trusted contacts.' },
    ],
    bigNumbers: [
      { value: '3', label: 's end-to-end SOS' },
      { value: '1.2', label: 's hold-to-confirm' },
      { value: '0', label: 'misfires after fix' },
      { value: '3', label: 'things, in order' },
    ],
    outcomeQuote:
      'A pulse on the map. A circle of people. A response that doesn\'t wait.',
  },

  // ============ FOUNDATIONS ============
  'cloud-provisioning': {
    slug: 'cloud-provisioning',
    title: 'CloudDesk',
    subtitle: 'A self-service dashboard to rent cloud resources.',
    kicker: kickerFor('cloud-provisioning'),
    heroImage: '/work/cloud-provisioning/thumb.jpg',
    palette: {
      bg: '#1A2330',
      bgMid: '#0F1A2E',
      text: '#E9F1FF',
      dim: '#7A8BAA',
      accent: '#0B5FFF',
      accent2: '#22E3FF',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'Without a framework, every state change is an explicit DOM mutation.',
          context: 'I learned more about the browser in this project than in any React build I have shipped.',
        },
        {
          kicker: 'Quote 02',
          quote: 'I wanted a "what if the whole thing was one screen" mock.',
          context: 'After a frustrating week of using a real cloud provider\'s console.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Open it in DevTools, no bundle, no framework, just a person who knows the browser well enough to make it sing.',
          context: 'The kind of project I can point at when asked to do front-end without React doing it.',
        },
      ],
    },
    features: [
      { title: 'Four hand-written pages', desc: 'Landing, admin, free-tier dashboard, VIP — all vanilla.' },
      { title: 'SVG storage gauges', desc: 'Hand-rolled, no library. The historical line and a predictive arc on one canvas.' },
      { title: 'localStorage state', desc: 'Round-trips on real navigation; no router.' },
      { title: 'Particle landing', desc: 'Adds life without distraction. Auth-redirect through real page loads.' },
      { title: 'Chart.js plugin work', desc: 'Custom shadow-blur plugin for the predictive arc glow.' },
      { title: 'No bundler, no build step', desc: '"Wait, this is just HTML?" said every reviewer.' },
    ],
    architecture: [
      { layer: 'Stack', details: 'Vanilla HTML, CSS, JavaScript — four files, no framework, no bundler.' },
      { layer: 'Charts', details: 'Chart.js with a custom plugin for the VIP predictive-arc glow.' },
      { layer: 'State', details: 'localStorage round-trips; navigation triggers real page reloads.' },
      { layer: 'Visual', details: 'Hand-rolled SVG gauges, particle background, datacenter blue + accent aqua.' },
    ],
    bigNumbers: [
      { value: '4', label: 'pages, vanilla' },
      { value: '0', label: 'frameworks' },
      { value: '70', label: 'KB admin HTML' },
      { value: '1', label: 'plugin for the arc' },
    ],
    outcomeQuote:
      'No bundle, no framework — just a person who knows the browser well enough to make it sing.',
  },

  tvk: {
    slug: 'tvk',
    title: 'TVK Connect',
    subtitle: 'One-tap phone login for mobile apps.',
    kicker: kickerFor('tvk'),
    heroImage: '/work/tvk/thumb.jpg',
    palette: {
      bg: '#0F1A2E',
      bgMid: '#1A2A4A',
      text: '#EAF1FB',
      dim: '#7A8BA8',
      accent: '#FFC23C',
      accent2: '#1763E5',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'TVK Connect is a small project. The rest of this story only works if I am honest about scope.',
          context: 'Three real screens, two role-based dashboards, a thin Firebase wiring underneath.',
        },
        {
          kicker: 'Quote 02',
          quote: 'The auth has to feel as polished as the apps the users compare it against. Not 80% as polished. As polished.',
          context: 'A week of evenings, one constraint: phone OTP done right.',
        },
        {
          kicker: 'Quote 03',
          quote: 'Every screen earns its place. Every dependency earns its place.',
          context: 'The reason this small project sits in the portfolio.',
        },
      ],
    },
    features: [
      { title: 'Phone-first sign-in', desc: 'Country code, OTP, done. Default +91, region-aware validation.' },
      { title: 'Auto-retrieval handling', desc: 'Three of four Firebase callbacks can fire; the OTP screen subscribes to auth state.' },
      { title: '30-second resend timer', desc: 'Cures the triple-tap that burns through SMS quota.' },
      { title: 'Memoized country list', desc: 'Stops the 240 flags re-rendering on every keystroke.' },
      { title: 'Two-role gate', desc: 'Candidate vs Volunteer dashboards behind one auth.' },
      { title: 'Splash → router', desc: 'Detects existing session on launch and routes accordingly.' },
    ],
    architecture: [
      { layer: 'App', details: 'Flutter — three screens, two role dashboards, splash router.' },
      { layer: 'Auth', details: 'Firebase phone auth; subscribed auth-state stream avoids flicker.' },
      { layer: 'UI', details: 'intl_phone_field with memoized country list; visible 30s resend countdown.' },
      { layer: 'Storage', details: 'shared_preferences for now; flutter_secure_storage planned.' },
    ],
    bigNumbers: [
      { value: '30', label: 's resend lockout' },
      { value: '240', label: 'flags, memoized' },
      { value: '4', label: 'callbacks handled' },
      { value: '0', label: 'passwords stored' },
    ],
    outcomeQuote:
      'Country code, OTP, done. The whole authentication flow is the product.',
  },

  'medicine-search': {
    slug: 'medicine-search',
    title: 'MediFind',
    subtitle: 'Search any medicine, know what it does.',
    kicker: kickerFor('medicine-search'),
    heroImage: '/work/medicine-search/thumb.jpg',
    palette: {
      bg: '#0F2A23',
      bgMid: '#143832',
      text: '#E8F5F0',
      dim: 'rgba(232,245,240,0.65)',
      accent: '#0FBF9F',
      accent2: '#5BD6B6',
    },
    signatureMotif: 'word-stagger',
    story: {
      quotes: [
        {
          kicker: 'Quote 01',
          quote: 'The interesting question was: can you design a prompt that returns the same shape every time?',
          context: 'The React surface is incidental. The prompt was the product.',
        },
        {
          kicker: 'Quote 02',
          quote: 'The parser became forgiving where the prompt was strict. That was the unlock.',
          context: 'A numbered four-section spec without insisting on literal headings; a tolerant regex per section.',
        },
        {
          kicker: 'Quote 03',
          quote: 'The model gets things wrong. The user deserves to know.',
          context: 'Why every result card carries an AI-information disclaimer at the bottom.',
        },
      ],
    },
    features: [
      { title: 'Single-input search', desc: 'Type a drug, hit Enter. No tabs.' },
      { title: 'Four-section parsed card', desc: 'Description, dosage, precautions, side effects — every time.' },
      { title: 'Tolerant regex parser', desc: 'Strips "1. Brief description:" preambles per section.' },
      { title: '"This can take a moment" microcopy', desc: 'Made the strongest difference. Annoyance → expectation.' },
      { title: 'Non-blocking spinner', desc: 'Inside the search button; rest of the page stays interactive.' },
      { title: 'Honest disclaimer', desc: '"Information from AI" on every card. Not legal cover — honesty.' },
    ],
    architecture: [
      { layer: 'Frontend', details: 'Single-page React app, one component carrying the prompt.' },
      { layer: 'Model', details: 'Google Gemini 1.5 Pro with a tightly-scoped four-section prompt.' },
      { layer: 'Parser', details: 'Split on double-newlines + per-section tolerant regex.' },
      { layer: 'UX', details: 'In-button spinner, expectation microcopy, disclaimer footer.' },
    ],
    bigNumbers: [
      { value: '4', label: 'sections, every time' },
      { value: '1', label: 'prompt, the product' },
      { value: '8', label: 's max wait' },
      { value: '1', label: 'honest disclaimer' },
    ],
    outcomeQuote:
      'A clear case study of the smallest possible LLM-backed product done with care.',
  },
};

// ---------------------------------------------------------------
// Phase 6b v2 — Per-project motif assignments + image galleries.
// Each gallery references /work/<slug>/gallery-1.jpg .. gallery-6.jpg
// (downloaded from Unsplash thematic buckets per portfolio plan).
// ---------------------------------------------------------------

type MotifsAndGallery = { motifs: { hero: MotifKey; mid: MotifKey }; gallery: GalleryImage[] };

function gal(slug: string, captions: string[]): GalleryImage[] {
  return captions.map((caption, i) => ({
    src: `/work/${slug}/gallery-${i + 1}.jpg`,
    caption,
    alt: `${slug} reference image ${i + 1}`,
  }));
}

const MOTIFS_AND_GALLERY: Record<string, MotifsAndGallery> = {
  // ============ ACT I ============
  thaazhai: {
    motifs: { hero: 'soil-sprout', mid: 'leaf-fall' },
    gallery: gal('thaazhai', ['SUNRISE · CROP', 'MARKET · TRADE', 'GREENHOUSE · GROW', 'HANDS · SOIL', 'TRACTOR · FIELD', 'HARVEST · ROW']),
  },
  'agri-tech-website': {
    motifs: { hero: 'soil-sprout', mid: 'leaf-fall' },
    gallery: gal('agri-tech-website', ['CORN · ROWS', 'ORGANIC · YIELD', 'FARMER · LAND', 'TRACTOR · DUSK', 'GREENHOUSE · ROW', 'HARVEST · BASKET']),
  },
  'ea-tuition-app': {
    motifs: { hero: 'chalk-stroke', mid: 'receipt-roll' },
    gallery: gal('ea-tuition-app', ['CLASSROOM · CHALK', 'STUDENT · NOTES', 'STUDY · LAMP', 'DESK · BOOKS', 'LECTURE · HALL', 'WRITING · PAPER']),
  },
  mindora: {
    motifs: { hero: 'breathing-glow', mid: 'watercolor' },
    gallery: gal('mindora', ['MEDITATION · DUSK', 'YOGA · LIGHT', 'FOREST · PATH', 'ZEN · STONES', 'CALM · WATER', 'POSE · BREATH']),
  },
  alzhmeric: {
    motifs: { hero: 'memory-echo', mid: 'watercolor' },
    gallery: gal('alzhmeric', ['HANDS · GENERATIONS', 'COUPLE · MEMORY', 'GRANDPARENT · CHILD', 'PORTRAIT · CARING', 'TABLET · ELDER', 'KEEPSAKES · DRAWER']),
  },
  'fee-management': {
    motifs: { hero: 'chalk-stroke', mid: 'receipt-roll' },
    gallery: gal('fee-management', ['LEDGER · STAMP', 'STUDENT · DESK', 'NOTES · LAMP', 'PAPER · STACK', 'CLASS · ROW', 'WRITE · PEN']),
  },
  voyagr: {
    motifs: { hero: 'departure-board', mid: 'route-draw' },
    gallery: gal('voyagr', ['PASSPORT · GATE', 'WINDOW · SEAT', 'AIRPORT · HALL', 'LUGGAGE · HOLD', 'MAP · PLAN', 'BOARDING · STAMP']),
  },
  // ============ ACT II ============
  'dhanoos-excellence': {
    motifs: { hero: 'chalk-stroke', mid: 'sparkle-edge' },
    gallery: gal('dhanoos-excellence', ['LECTURE · HALL', 'STUDENT · CERT', 'CHALKBOARD · WRITING', 'CLASSROOM · ROWS', 'CAMPUS · DUSK', 'NOTES · LAMP']),
  },
  'student-portal': {
    motifs: { hero: 'chalk-stroke', mid: 'receipt-roll' },
    gallery: gal('student-portal', ['CHALKBOARD · LESSON', 'STUDY · GROUP', 'LAPTOP · NOTES', 'DESK · OPEN', 'CAMPUS · WALK', 'WRITING · TASK']),
  },
  'teacher-portal': {
    motifs: { hero: 'chalk-stroke', mid: 'receipt-roll' },
    gallery: gal('teacher-portal', ['CLASSROOM · CHALK', 'GRADING · DESK', 'BOARD · WRITING', 'STUDENTS · ROW', 'LECTURE · HALL', 'NOTES · PAGE']),
  },
  'invoice-system': {
    motifs: { hero: 'stamp-drop', mid: 'receipt-roll' },
    gallery: gal('invoice-system', ['SIGNING · INK', 'CALCULATOR · FORMS', 'INVOICE · STACK', 'HANDSHAKE · DEAL', 'DASHBOARD · DATA', 'PAPERWORK · DESK']),
  },
  'hotel-app': {
    motifs: { hero: 'soft-reveal', mid: 'key-card' },
    gallery: gal('hotel-app', ['POOL · DUSK', 'RECEPTION · MARBLE', 'ROOM · LUXURY', 'SUITE · LIGHT', 'RESORT · BEACH', 'LOBBY · ATRIUM']),
  },
  'jewelry-pos': {
    motifs: { hero: 'gold-sweep', mid: 'sparkle-edge' },
    gallery: gal('jewelry-pos', ['PEARL · CHAIN', 'GOLD · RINGS', 'DISPLAY · CASE', 'NECKLACE · LIGHT', 'SHOP · COUNTER', 'GEM · CLOSE']),
  },
  'market-pulse': {
    motifs: { hero: 'candlestick', mid: 'ticker-strip' },
    gallery: gal('market-pulse', ['CHART · CANDLE', 'TRADING · DESK', 'DATA · GREEN-RED', 'GRAPH · LINE', 'PATTERN · CHART', 'MOBILE · TRADE']),
  },
  // ============ ACT III ============
  'viksit-ai': {
    motifs: { hero: 'prompt-typing', mid: 'chat-bubble' },
    gallery: gal('viksit-ai', ['ABSTRACT · AI', 'NEURAL · NET', 'DATA · VIZ', 'SERVER · ROW', 'BRAIN · GLOW', 'DEV · NIGHT']),
  },
  careervisionx: {
    motifs: { hero: 'path-branch', mid: 'chat-bubble' },
    gallery: gal('careervisionx', ['NEURAL · NET', 'PATH · CHOICE', 'CAREER · DESK', 'COMPASS · SWEEP', 'AI · ABSTRACT', 'DEV · NIGHT']),
  },
  darkwatch: {
    motifs: { hero: 'terminal-boot', mid: 'threat-radar' },
    gallery: gal('darkwatch', ['CYBER · CODE', 'CIRCUIT · BOARD', 'DATA · ABSTRACT', 'BINARY · GLITCH', 'SERVER · RACK', 'MATRIX · GLOW']),
  },
  // ============ ACT IV ============
  spaceforge: {
    motifs: { hero: 'star-constellation', mid: 'cosmic-ray' },
    gallery: gal('spaceforge', ['NEBULA · WIDE', 'PURPLE · 3D', 'FUTURE · UI', '3D · ABSTRACT', 'GALAXY · SWEEP', 'STARS · FIELD']),
  },
  'vkmg-landing': {
    motifs: { hero: 'color-block', mid: 'marquee-strip' },
    gallery: gal('vkmg-landing', ['INTERIOR · MODERN', 'DESIGN · COLOR', 'DEV · NIGHT', 'AGENCY · CRAFT', 'WORKSPACE · CRE', 'PALETTE · COLOR']),
  },
  'vkmg-report-app': {
    motifs: { hero: 'field-grid', mid: 'cloud-grid' },
    gallery: gal('vkmg-report-app', ['SKETCHING · PLAN', 'FIELD · WORKER', 'ENGINEER · SITE', 'WORKER · TABLET', 'CLIPBOARD · LIST', 'CONSTRUCT · SITE']),
  },
  zyntra: {
    motifs: { hero: 'color-block', mid: 'marquee-strip' },
    gallery: gal('zyntra', ['INTERIOR · BOLD', 'COLOR · DESIGN', 'DEV · NIGHT', 'AGENCY · CRAFT', 'WORKSPACE · CRE', 'PALETTE · COLOR']),
  },
  divyadrishti: {
    motifs: { hero: 'guardian-halo', mid: 'threat-radar' },
    gallery: gal('divyadrishti', ['PORTRAIT · WOMAN', 'URBAN · NIGHT', 'WALKING · DUSK', 'PHONE · ALERT', 'SILHOUETTE · STREET', 'CITY · LIGHTS']),
  },
  // ============ FOUNDATIONS ============
  'cloud-provisioning': {
    motifs: { hero: 'cloud-grid', mid: 'terminal-boot' as MotifKey },
    gallery: gal('cloud-provisioning', ['SERVER · RACK', 'DATA · CENTER', 'LIGHTS · ROW', 'MULTI · MONITOR', 'ARCH · DIAGRAM', 'CLOUD · ABSTRACT']),
  },
  tvk: {
    motifs: { hero: 'phone-otp', mid: 'soft-reveal' as MotifKey },
    gallery: gal('tvk', ['PHONE · HAND', 'OTP · SCREEN', 'PHONE · CLOSE', 'APPS · GRID', 'NOTIFY · CARD', 'TEXT · UI']),
  },
  'medicine-search': {
    motifs: { hero: 'capsule-pulse', mid: 'chat-bubble' as MotifKey },
    gallery: gal('medicine-search', ['PILL · PACK', 'PHARMACY · SHELF', 'CAPSULE · ROW', 'PILLS · WHITE', 'PRESCRIPTION · NOTE', 'BOTTLES · LINEUP']),
  },
};

// Apply overrides
for (const slug of Object.keys(MOTIFS_AND_GALLERY)) {
  const t = THEMES[slug];
  if (t) {
    t.motifs = MOTIFS_AND_GALLERY[slug].motifs;
    t.gallery = MOTIFS_AND_GALLERY[slug].gallery;
  }
}

// ---------------------------------------------------------------
// Phase 9 — Per-project layout-variant assignment.
// A · Product Launch   — alternating image/text rows + bento stats
// B · Case Study       — pinned 3-step + film strip
// C · Editorial        — drop-cap, pull-quotes, sidebar metadata
// D · Hacker Dossier   — terminal hero, spec table, feature checklist
// ---------------------------------------------------------------
const LAYOUT_ASSIGNMENTS: Record<string, LayoutKey> = {
  // A · Product Launch
  spaceforge: 'A',
  'vkmg-landing': 'A',
  zyntra: 'A',
  voyagr: 'A',
  'hotel-app': 'A',
  'jewelry-pos': 'A',
  // B · Case Study
  thaazhai: 'B',
  'agri-tech-website': 'B',
  mindora: 'B',
  alzhmeric: 'B',
  'dhanoos-excellence': 'B',
  divyadrishti: 'B',
  'fee-management': 'B',
  'ea-tuition-app': 'B',
  // C · Editorial
  'student-portal': 'C',
  'teacher-portal': 'C',
  // careervisionx → Product Launch (A) so the AI mentor app gets Apple-style treatment
  careervisionx: 'A',
  'vkmg-report-app': 'C',
  'market-pulse': 'C',
  'medicine-search': 'C',
  tvk: 'C',
  // D · Hacker Dossier
  'viksit-ai': 'D',
  darkwatch: 'D',
  'cloud-provisioning': 'D',
  'invoice-system': 'D',
};

for (const slug of Object.keys(LAYOUT_ASSIGNMENTS)) {
  const t = THEMES[slug];
  if (t) t.layout = LAYOUT_ASSIGNMENTS[slug];
}

export function getTheme(slug: string): ProjectTheme | undefined {
  return THEMES[slug];
}
