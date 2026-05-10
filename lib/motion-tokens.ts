export const palette = {
  // Editorial monochrome
  ink:        '#0A0A0A',
  paper:      '#FAFAFA',
  paperDim:   'rgba(250,250,250,0.55)',
  paperSoft:  'rgba(250,250,250,0.12)',
  amber:      '#E8B863',
  amberSoft:  'rgba(232,184,99,0.18)',
  rule:       'rgba(250,250,250,0.08)',

  // Legacy aliases
  bgDeep:  '#0A0A0A',
  gold:    '#E8B863',
  crimson: '#C8102E',
  nano:    '#4FC3F7',
  hudLine: 'rgba(250,250,250,0.08)',
} as const;

export const easing = {
  suitEject:      [0.22, 1, 0.36, 1] as const,
  repulsorCharge: [0.83, 0, 0.17, 1] as const,
} as const;

export const durations = {
  fast:    0.18,
  base:    0.32,
  slow:    0.6,
  curtain: 1.4,
  boot:    3.4,
} as const;
