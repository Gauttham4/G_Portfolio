/**
 * Tiny event channel between the portfolio videos and the background music.
 * A video announces `playing: true` when it starts and `playing: false` when it pauses, ends or is skipped.
 * BackgroundMusic listens: it pauses while a video is playing and resumes (if the visitor wants music) afterwards.
 */
export const VIDEO_EVENT = 'portfolio-video';
export const PRELOADER_DONE = 'preloader-done';
export const REPLAY_HERO = 'replay-hero-video';

export function announceVideo(playing: boolean) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(VIDEO_EVENT, { detail: { playing } }));
}
