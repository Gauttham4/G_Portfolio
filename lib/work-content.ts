// Static content lifted from /Projects/Projects List/<slug>/description/*.md
// Hand-curated, NOT MDX — kept as TS so we can render directly with JSX.

export type FeatureGroup = {
  heading: string;
  items: { title: string; description: string }[];
};

export type ArchitectureBlock = {
  label: string;
  body: string;
};

// =====================================================================
// JARVIS
// =====================================================================

export const JARVIS = {
  kicker: 'ACT III · FRONTIER',
  title: 'JARVIS',
  subtitle: 'A personal AI assistant that teaches itself new skills.',
  tagline:
    'A Stark-grade personal AI built on a 3-child self-evolving architecture — talk to it, and it grows new capabilities on its own.',

  story: {
    title: 'The story',
    paragraphs: [
      `I had eleven Claude tabs open, three terminals, two notebooks, and a sticky note that just said "context??". I was supposed to be building an assistant. Instead I was being one — for myself.`,
      `Late one night, halfway through wiring a sixth tool into yet another LangChain agent, I stopped and asked the obvious question: why am I writing the orchestrator at all? Every agent I'd shipped that year had the same skeleton. Plan. Implement. Test. Reflect. The work that actually mattered — the new capability — was a 5% change buried under 95% boilerplate.`,
      `That same week I'd watched Iron Man for the seventeenth time. Tony doesn't write JARVIS. He talks to it, and it grows. That's the affordance I wanted. Not "another framework." A thing that listens, learns, and patches itself in.`,
      `If the Claude Code session is already capable of editing files, running tools, and reading traces, then the session itself is the meta-runtime. I don't need a Python orchestrator. I need a contract.`,
      `So I drew the 3-child architecture on a whiteboard: Brain (LangGraph, :5002) — the thing that thinks. Chatbot (Flask, :5001) — the mouth and ears. Guardian (regression) — the conscience. One contract.json between them. HTTP only. No shared imports. Each child has its own .claude/ and can be evolved alone.`,
      `Then the moment of truth. I typed /self-evolve "add a VS Code skill". The plan came back. The spec went into the right node folder. The implement step edited chatbot/ to add intent routing. The regression step ran the existing 11 scenarios. The gap-finder noticed I hadn't covered "open a workspace folder", wrote a 12th scenario, and the runner re-greened. I hadn't touched a single file.`,
      `Twelve scenarios green. Three children evolving independently. Fifteen minutes from "I want a new skill" to a merged, tested, traced capability. It's not Tony's JARVIS. There's no holographic Pepper. But when I say "I want you to also handle Y", the thing actually figures out how. That's enough. That's the whole point.`,
    ],
  },

  features: [
    {
      heading: 'Core assistant',
      items: [
        {
          title: 'Conversational front door',
          description:
            'A Flask web UI at port 5001 — the single command surface to the entire system. Type or speak; the page dispatches.',
        },
        {
          title: 'Intent routing',
          description:
            'Every message is classified into shell, file, web_search, vscode, system_info, conversation, claude_plan, or parallel. The router is itself a regression-tested LangGraph node.',
        },
        {
          title: 'Multi-step planning',
          description:
            'Long requests like "set up a new Python project, scaffold tests, install deps, open in VS Code" are decomposed by the claude_plan intent into ordered tool calls.',
        },
        {
          title: 'Safety gate',
          description:
            'A dedicated jarvis_safety scenario blocks destructive shell commands (rm -rf /, fork bombs, unbounded curl | sh) before they reach the runner.',
        },
        {
          title: 'Parallel execution',
          description:
            'When two steps are independent the brain dispatches them concurrently — verified by the jarvis_parallel scenario.',
        },
      ],
    },
    {
      heading: 'Self-evolution loop',
      items: [
        {
          title: '/self-evolve "<requirement>"',
          description:
            'A single slash-command kicks off plan -> spec_propose -> implement -> regression -> gap_finder -> report.',
        },
        {
          title: 'Plan & spec proposal',
          description:
            'Drafts a structured spec for the new capability and writes it under nodes/<node>/.',
        },
        {
          title: 'Implementation agent',
          description:
            'Edits the relevant child (product/, chatbot/, regression/) using Claude Code\'s native tools — no subprocess shell-out.',
        },
        {
          title: 'Regression-locked',
          description:
            'Every evolution must pass the existing 12 scenarios before merging; judge.py runs Claude-as-judge on each scenario transcript.',
        },
        {
          title: 'Gap-finder',
          description:
            'A reflection step looking for missing edges — timeouts, malformed JSON, permission errors — feeding them back as new scenarios.',
        },
        {
          title: 'Per-child evolution',
          description:
            'Each of product/, chatbot/, regression/ has its own .claude/ and can be evolved in isolation: cd product && claude && /self-evolve "...".',
        },
      ],
    },
    {
      heading: 'Skills (tool layer)',
      items: [
        { title: 'Shell skill', description: 'Sandboxed command execution with timeout caps, output truncation, and the jarvis_safety denylist.' },
        { title: 'File skill', description: 'Reads, writes, edits with explicit path normalisation and BOM-safe writes for Windows.' },
        { title: 'Web search skill', description: 'Fetch, summarise, cite. Verified by jarvis_web_search.md.' },
        { title: 'VS Code skill', description: 'Opens projects, runs tasks, jumps to symbols via the LSP bridge.' },
        { title: 'System info skill', description: 'Host stats, env, running processes (read-only) — validated by jarvis_system_info.md.' },
      ],
    },
  ] as FeatureGroup[],

  architecture: [
    {
      label: 'Brain — LangGraph, :5002',
      body:
        'product/execute/engine/workflow.py with explicit state.py schema and per-node steps in steps.py. REST API at api.py. Children communicate via HTTP only — never direct Python imports — so each child can be deployed separately.',
    },
    {
      label: 'Chatbot — Flask, :5001',
      body:
        'chatbot/execute/engine/server.py classifies intent before dispatch. The router is itself a small LangGraph node so it can be regression-tested in isolation.',
    },
    {
      label: 'Guardian — regression, headless',
      body:
        'Twelve .md scenario files under regression/scenarios/. runner.py drives prompts through the chatbot router and captures the trace. judge.py reads the trace and renders structured pass/fail with rationale per scenario.',
    },
    {
      label: 'Cytoscape Studio IDE',
      body:
        '/graph opens a live in-browser visualisation of the running graph: nodes light up as they execute, with HITL approval and time-travel debugging via /checkpoints/{id}. Trace server on port 9000 streams SSE.',
    },
    {
      label: 'No subprocess orchestrator',
      body:
        'The Claude Code session itself is the meta-runtime; plan/implement/regression/gap-find run as native steps via EnterPlanMode and Agent. This was a deliberate removal — the system got more powerful, not less.',
    },
  ] as ArchitectureBlock[],

  outcomes: [
    '12 production scenarios green on every evolve cycle',
    'Three children evolving independently through one contract.json',
    'Zero subprocess orchestrator — the Claude Code session IS the runtime',
    '~15 minutes from "I want a new skill" to a merged, tested, traced capability',
  ],
};

// =====================================================================
// CRIMELENS AI (final-year-project)
// =====================================================================

export const CRIMELENS = {
  kicker: 'ACT III · FRONTIER',
  title: 'CrimeIntellX',
  subtitle: "A detective's assistant for cases, evidence & call records.",
  tagline:
    'A forensic-grade workbench that turns case files, photos, and call detail records into a single searchable investigation surface.',

  story: {
    title: 'The story',
    paragraphs: [
      `The first time I sat in on a real case-review meeting, the senior officer didn't open a computer once. He opened a manila folder. Then another. Then a Bisleri box of CDs. And then he asked his constable, who had been there for fourteen years, "remember that number we kept seeing in 2019?"`,
      `That's when I knew what I wanted to build.`,
      `For my final year, I had a vague idea — something AI, something forensic. Then a relative who is an officer told me the actual problem: it's not that there isn't enough data, it's that there's too much, and none of it talks to itself. FIRs sit in one register. Evidence photos sit on a constable's phone. CDRs come on a CD-R from the carrier. Three weeks into a case, you've forgotten what you saw on day two.`,
      `The shape clicked: a workbench, not a model. The AI is plumbing. The win is finding things you didn't know you had.`,
      `Three pillars. Encrypted evidence store. Vector-searchable everything. CDR graph analysis. The detective uses one search bar and one map; the system does the joining.`,
      `Backend first — FastAPI, SQLite for the demo, MinIO for blobs, Pinecone for vectors. I wrote crypto_utils.py early because I refused to ship anything that stored evidence in plaintext, even for a college submission. Then document_processor.py — the unglamorous heart of the project — that takes any blob and produces (text, entities, embedding, metadata) regardless of whether the blob is a scan, a born-digital PDF, a Word doc, or a phone photo.`,
      `The day the bulk-hybrid evidence pipeline first ran end-to-end, I uploaded a 240-file folder — mixed photos, PDFs, two audio recordings, three video stills. Two minutes later I typed "any mention of the white SUV" into the search bar. It surfaced a frame from one of the videos, a sentence from a witness statement, and a photo of a number plate I'd forgotten was even in the bundle.`,
      `That's when CrimeLens stopped being a project and started being a tool.`,
    ],
  },

  features: [
    {
      heading: 'Investigator workbench',
      items: [
        { title: 'Single-pane case workspace', description: 'Every case has its FIRs, suspects, victims, evidence, and CDRs on one Flutter screen — no folder-hunting.' },
        { title: 'Ask-anything search', description: 'A natural-language query bar runs against the Pinecone vector index built from every ingested document.' },
        { title: 'Magnifying-glass preview', description: 'Hover any thumbnail to see entity-extracted highlights painted on the document itself.' },
        { title: 'Bulk register cases & criminals', description: 'bulk_register_criminals.py and populate_50_cases.py seed the database with realistic Indian-context cases, suspects, and FIRs in one command.' },
        { title: 'Mugshot grid + dossier', description: 'Each criminal profile aggregates aliases, prior cases, last-known location, and linked evidence.' },
      ],
    },
    {
      heading: 'AI layer (Groq + RAG)',
      items: [
        { title: 'Document processor pipeline', description: 'Ingests PDFs, DOCX, images, and audio. PyPDF2 + pytesseract for OCR; python-docx for Word; everything normalised to plain text with a metadata sidecar.' },
        { title: 'Embedding & indexing', description: 'sentence-transformers produces dense vectors upserted into Pinecone with case-scoped namespaces.' },
        { title: 'RAG retrieval', description: 'Queries hit Pinecone for top-k chunks; chunks plus metadata pass to Groq for grounded synthesis with citations.' },
        { title: 'Web augmentation (Tavily)', description: 'Open-source intelligence enrichment when the case is whitelisted for it.' },
        { title: 'Dark-web monitoring', description: 'dark_web_monitor.py + ahmia_service.py watch curated indices for case-relevant strings — aliases, stolen-goods serials.' },
      ],
    },
    {
      heading: 'Evidence management',
      items: [
        { title: 'Encrypted at rest', description: 'crypto_utils.py uses Fernet on top of cryptography==44.0.0 with a per-installation master key derived on first run.' },
        { title: 'MinIO blob store', description: 'Large evidence files live in MinIO; only ciphertext leaves the host.' },
        { title: 'Bulk hybrid pipeline', description: 'bulk_upload_hybrid_evidence.py accepts mixed photo / PDF / audio bundles and routes each artefact to the right OCR / transcription path before indexing.' },
        { title: 'Evidence-gap detection', description: 'Compares declared FIR claims against indexed evidence and lists the missing pieces.' },
        { title: 'Chain-of-custody log', description: 'Every read, every download, every share is appended to an immutable audit table.' },
      ],
    },
    {
      heading: 'CDR analysis',
      items: [
        { title: 'Indian-format ingest', description: 'enhance_real_cdr.py and generate_indian_cdr.py understand the column variants used by major Indian carriers and normalise them.' },
        { title: 'Top-contact summary', description: 'Top 10 numbers by frequency and total minutes per suspect.' },
        { title: 'Odd-hour detection', description: 'Highlights calls between 11pm and 5am with above-baseline frequency.' },
        { title: 'Common-contact graph', description: 'When two or more suspects are loaded, the engine surfaces shared numbers — "X and Y both called Z 14 times last week".' },
        { title: 'Tower-collocation', description: 'Computes which suspects pinged the same cell tower within plus or minus 5 minutes.' },
        { title: 'Visual call graph', description: 'D3-rendered force-directed graph in the Flutter web view with edges weighted by call frequency.' },
      ],
    },
  ] as FeatureGroup[],

  architecture: [
    { label: 'Backend', body: 'FastAPI + ~30 services under BACKEND/. SQLite for the demo, MinIO for blobs, Pinecone for vectors. Celery + Redis for OCR, transcription, indexing, bulk upload jobs.' },
    { label: 'AI service layer', body: 'ai_service.py is the single chokepoint for all model traffic — retries, rate-limits via slowapi, structured prompt template per task (summarise, link, hypothesise).' },
    { label: 'Encryption', body: 'crypto_utils.py wraps Fernet/cryptography. Per-tenant master-key bootstrap on first run. master_key.bin never persisted in plaintext.' },
    { label: 'Frontend', body: 'Flutter 3.9+ — Android, iOS, Windows, Web. Glassmorphic dark theme with manila-folder card surfaces. fl_chart for analytics; D3 via webview_windows for the call-graph.' },
    { label: 'Auth', body: 'JWT via python-jose, password hashing with bcrypt (passlib). Firebase Auth fallback for non-departmental users in training mode.' },
  ] as ArchitectureBlock[],

  outcomes: [
    '50+ pre-populated cases with realistic FIRs, evidence, and CDRs',
    'Vector-indexed evidence search at single-digit-second latency on a desktop',
    'AES-grade encryption of every evidence blob, master key never persisted plaintext',
    'CDR graph analysis from raw CSV in one click',
  ],
};

// =====================================================================
// ELECTROBIKE
// =====================================================================

export const ELECTROBIKE = {
  kicker: 'ACT IV · CINEMATIC',
  title: 'ElectroBike',
  subtitle: 'A smart electric bike that thinks with you.',
  tagline:
    'A smartphone-only AI co-pilot for electric two-wheelers — paired with a voice-powered test-drive booking site that calls customers back.',

  story: {
    title: 'The story',
    paragraphs: [
      `I rode an electric scooter to college every day for two years and learned three things. One — the experience is genuinely better than petrol. Two — when something goes wrong, you're entirely on your own. Three — buying the bike was the worst part of owning it.`,
      `Two specific moments triggered this. A friend nearly crashed on a flyover at 11pm because he was nodding off on a 25-minute commute home. He didn't, but only because his phone slipped and the buzz woke him up. Riding back, we both knew there's no DMS for two-wheelers — the kind of camera-and-AI driver-monitoring that's now standard in cars simply doesn't exist on the bikes 50 million Indians actually ride.`,
      `Second: my cousin spent four Saturdays trying to test-ride three different electric models. Showroom one didn't have the bike. Showroom two had it but no one was free. Showroom three confirmed the slot on phone, then forgot. He bought a petrol scooter.`,
      `I wanted to build the answer to both. Two deliverables under one product.`,
      `The app would assume nothing about the bike. No CAN-bus, no extra sensors, no installation. Just the phone in your pocket. Camera for damage. Accelerometer + gyro for drowsiness. GPS for theft. The whole stack rides on what every rider already has.`,
      `The booking site would be honest. If a slot is full, say so. If the customer books one, call them — actually call them, in their language, with their bike's specs in the AI's mouth — to confirm.`,
      `The day VAPI made its first real call — to my own number — I almost dropped the phone. The AI introduced itself, used my name, asked if Tuesday at 4pm still worked for the test ride of the model I'd "selected", quoted the range and charging time when I asked, and offered to reschedule when I said I was busy. It hung up cleanly with a thank-you in three languages.`,
      `The whole point of ElectroBike is that the smartest part of your bike is already in your pocket — you just had to write the software for it.`,
    ],
  },

  features: [
    {
      heading: 'App — riding intelligence',
      items: [
        { title: 'AI damage detection', description: "Photo of a scratch, dent, or crack goes to Groq's LLaMA Vision 90B which returns affected components, severity, an INR repair estimate, and a prioritised fix list." },
        { title: 'Real-time drowsiness detection', description: "Accelerometer + gyroscope + GPS streams scored for irregular speed deltas, wobble, and reaction lag. Drowsy patterns trigger a loud audio alert and an SMS / WhatsApp to the rider's emergency contact with location." },
        { title: 'Crash detection', description: 'Sudden impact + post-impact stillness escalates the drowsiness alert into a full emergency protocol with a 30-second cancel window.' },
        { title: 'Predictive maintenance', description: 'Per-component health scores (battery, tyres, brake pads, chain, motor) computed from charge cycles, temperature, vibration, and distance.' },
        { title: 'Smart theft prevention', description: 'Real-time GPS tracking, customisable safe-zone geofencing, vibration-based unauthorised-movement detection, instant push notifications.' },
        { title: 'Eco-driving coach', description: 'A 0-100 eco-score updated live during the ride; tracks CO2 saved (~120kg/yr/rider) and surfaces personalised efficiency tips.' },
      ],
    },
    {
      heading: 'Site — discovery & booking',
      items: [
        { title: 'Bike catalogue', description: 'Live from Firestore — every bike has range, top speed, motor power, charging time, braking, lights, tyre type, weight, frame, warranty, colours.' },
        { title: 'Live slot availability', description: 'Server-enforced cap of 5 bookings per slot; the UI subscribes to the slot doc and updates as others book.' },
        { title: 'Bike-purchase order flow', description: 'Delivery-date selection; the order is queued for admin approval.' },
        { title: 'Learning hub', description: 'For first-time EV buyers — charging basics, range maths, maintenance tips.' },
        { title: 'Savings calculator', description: 'Compares petrol vs electric over a configurable horizon.' },
      ],
    },
    {
      heading: 'Site — AI & voice',
      items: [
        { title: 'VAPI-driven AI phone call', description: "Triggered on every booking. Per-customer prompt with their name, bike name, model, booking ID, location, preferred date, and the bike's specs. Press 1 / 2 / 3 for English / Tamil / Hindi." },
        { title: 'Function-call tools', description: 'Two tools exposed to the model: schedule_appointment(date, time, action) and transfer_to_human(reason).' },
        { title: 'ElectroAssistant chatbot', description: 'Groq-powered LLaMA 3 70B answers spec / pricing / battery / range questions on the site.' },
        { title: 'Multilingual voice chatbot', description: '9 Indian languages via Sarvam AI, querying the live Firebase inventory at run-time.' },
      ],
    },
  ] as FeatureGroup[],

  architecture: [
    { label: 'Mobile app', body: 'Flutter — Android, iOS, Windows desktop from one codebase. provider 6.1.2 for state, dio 5.7.0 for AI calls, geolocator 13.0.2 for high-accuracy GPS, fl_chart for analytics.' },
    { label: 'Booking site frontend', body: 'React 19 + Vite + Tailwind 4. Framer Motion 12 for hero transitions, Lottie loops for empty-states, D3 7.9 charts on the admin analytics dashboard.' },
    { label: 'Booking site backend', body: 'Express endpoint fans out to VAPI + Nodemailer on every booking. server/vapiAssistant.js builds the per-customer prompt; Nodemailer ships the HTML email. Firebase Firestore is the single source of truth.' },
    { label: 'AI integrations', body: 'Groq LLaMA Vision 90B for damage detection. Groq LLaMA 3 70B for the chatbot. VAPI for the outbound phone call. Sarvam AI for 9 Indian languages.' },
    { label: 'Cross-cutting', body: 'Firebase 12 as the shared real-time DB across app + site + admin. A booking made on the site appears in the admin dashboard, in the customer\'s phone push, and in the AI call\'s prompt — within seconds.' },
  ] as ArchitectureBlock[],

  outcomes: [
    '29 functional Flutter screens across the smart-riding app',
    'Zero-hardware safety — drowsiness, crash, tilt all use only phone sensors',
    'Real AI phone calls in English / Tamil / Hindi with bike specs preloaded',
    'Live slot availability with hard cap of 5, enforced server-side',
  ],
};
