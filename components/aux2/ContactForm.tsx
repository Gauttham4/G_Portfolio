'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import ContactShutdown from './ContactShutdown';
import Reveal from '@/components/motion/Reveal';

const subjects = [
  'Consulting',
  'Engineering',
  'Research',
  'MS in Forensic IT',
  'Just hi',
];

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(subjects[0]);
  const [message, setMessage] = useState('');
  const [shutdown, setShutdown] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('[contact]', { name, email, subject, message });
    setShutdown(true);
    setTimeout(() => {
      setShutdown(false);
      setSent(true);
    }, 1400);
  };

  if (sent) {
    return (
      <motion.div
        className="rounded-md border border-amber/40 bg-amber-soft px-8 py-16 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber">
          Transmission received
        </p>
        <h3 className="mt-4 font-display text-3xl text-paper md:text-4xl">
          Thanks — JARVIS will route it.
        </h3>
        <p className="mt-3 font-sans text-paper-dim">
          I read every message. Expect a reply within a couple of days.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setName('');
            setEmail('');
            setMessage('');
          }}
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-amber hover:text-paper"
        >
          Send another →
        </button>
      </motion.div>
    );
  }

  const inputCls =
    'w-full bg-transparent border-b border-rule px-0 py-3 font-sans text-base text-paper placeholder:text-paper-dim/60 focus:border-amber focus:outline-none transition-colors';
  const labelCls =
    'font-mono text-[10px] uppercase tracking-[0.3em] text-paper-dim';

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-8">
        <Reveal dir="left" delay={0}>
          <div>
            <label className={labelCls} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputCls}
            />
          </div>
        </Reveal>

        <Reveal dir="left" delay={0.08}>
          <div>
            <label className={labelCls} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className={inputCls}
            />
          </div>
        </Reveal>

        <Reveal dir="left" delay={0.16}>
          <div>
            <label className={labelCls} htmlFor="subject">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`${inputCls} appearance-none`}
            >
              {subjects.map((s) => (
                <option key={s} value={s} className="bg-ink text-paper">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </Reveal>

        <Reveal dir="left" delay={0.24}>
          <div>
            <label className={labelCls} htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are we building?"
              className={`${inputCls} resize-none`}
            />
          </div>
        </Reveal>

        <motion.button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-amber px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] text-ink shadow-lg shadow-amber/20"
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(232,184,99,0.35)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          Transmit →
        </motion.button>
      </form>

      <ContactShutdown show={shutdown} />
    </>
  );
}
