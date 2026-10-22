// Page content comes from the JSON files in src/content/.
// Edit them in Pages CMS (see .pages.yml) or by hand — this file only adds types and tidies empty fields.
import settingsJson from '../content/settings.json';
import projectsJson from '../content/projects.json';
import writingJson from '../content/writing.json';
import experienceJson from '../content/experience.json';
import awardsJson from '../content/awards.json';

export type TagTone = 'claret' | 'oxford' | 'teal' | 'ink';

export interface Project {
  client: string;
  title: string;
  summary: string;
  href: string;
  linkLabel?: string;
  tone: TagTone;            // colour of the image block when there's no image
  image?: string;           // e.g. '/images/bukalapak-tone.jpg' (uploaded via the CMS into public/images)
  imageAlt?: string;
  blockText?: string;       // large text shown on the block instead of an image
  tags: { label: string; tone: TagTone }[];
}

export interface Settings {
  label: string;
  location: string;
  roles: string[];
  headline: string;
  intro: string;
  aboutLabel: string;
  about: string;
  contactHeadline: string;
  contactText: string;
  email: string;
  linkedin: string;
  twitter: string;
  resume: string;
}

const tones: TagTone[] = ['claret', 'oxford', 'teal', 'ink'];
const tone = (value: unknown): TagTone => (tones.includes(value as TagTone) ? (value as TagTone) : 'ink');
// The CMS saves cleared fields as "" — treat those as "not set".
const optional = (value: unknown) => (typeof value === 'string' && value.trim() !== '' ? value : undefined);

export const settings = settingsJson as Settings;

export const projects: Project[] = projectsJson.map((p) => ({
  client: p.client,
  title: p.title,
  summary: p.summary,
  href: optional(p.href) ?? '#work',
  linkLabel: optional(p.linkLabel),
  tone: tone(p.tone),
  image: optional(p.image),
  imageAlt: optional(p.imageAlt),
  blockText: optional(p.blockText),
  tags: (p.tags ?? []).map((t) => ({ label: t.label, tone: tone(t.tone) })),
}));

export const writing: { title: string; source: string; href: string }[] = writingJson;
export const experience: { years: string; role: string; org: string }[] = experienceJson;
export const awards: { name: string; detail: string }[] = awardsJson;

export const links = {
  email: settings.email,
  linkedin: settings.linkedin,
  twitter: settings.twitter,
  resume: settings.resume,
};
