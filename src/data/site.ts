// Site content.
// - Projects and writing are Markdown collections (src/content/projects, src/content/writing — see src/content.config.ts).
// - Site text, experience and awards are JSON files in src/content/.
// All of it is editable in Pages CMS (see .pages.yml).
import { readFileSync } from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';
import settingsJson from '../content/settings.json';
import experienceJson from '../content/experience.json';
import awardsJson from '../content/awards.json';
import logosJson from '../content/logos.json';

export type TagTone = 'claret' | 'oxford' | 'teal' | 'ink';

/** Shape the project card needs. */
export interface Project {
  client: string;
  cardRole?: string;        // a short role shown after the client on the home card
  title: string;
  summary: string;
  href: string;             // the write-up page, or the external link
  linkLabel?: string;
  secondLink?: string;      // an extra link beside the main one
  secondLinkLabel?: string;
  hasWriteUp: boolean;
  tone: TagTone;
  image?: string;
  imageAlt?: string;
  thumb?: string;           // the home row's picture: `thumb` when set, otherwise `image`
  thumbAlt?: string;
  blockText?: string;
  tags: { label: string; tone: TagTone }[];
  era: 'now' | 'earlier';   // 'earlier' work is listed on /work/advertising-and-scriptwriting/, not the home page
}

export interface Settings {
  label: string;
  location: string;
  roles: string[];
  verbs: string[];
  nouns: string[];
  headlineTail: string;
  intro: string;
  aboutLabel: string;
  about: string;
  contactHeadline: string;
  contactText: string;
  email: string;
  linkedin: string;
  resume: string;
}

export const settings = settingsJson as Settings;
export const experience: { years: string; role: string; org: string }[] = experienceJson;
export const awards: { name: string; detail: string; logo?: string }[] = awardsJson;
/**
 * A logo's display size, so wide wordmarks and compact marks carry similar visual weight:
 * each gets about the same area, within a height range. Reads a PNG's own size from public/.
 */
export function logoSize(src: string, area: number, minHeight: number, maxHeight: number) {
  let ratio = 3;
  try {
    const png = readFileSync(`public${src}`);
    ratio = png.readUInt32BE(16) / png.readUInt32BE(20); // PNG IHDR: width, height
  } catch {
    // not a readable PNG: fall back to a typical wordmark ratio
  }
  const height = Math.round(Math.min(maxHeight, Math.max(minHeight, Math.sqrt(area / ratio))));
  return { width: Math.round(height * ratio), height };
}

/** Company logos by name, for the experience rows; a company without one is shown as text. */
export const companyLogos: Record<string, string> = Object.fromEntries(
  (logosJson as { name: string; logo: string }[]).map((entry) => [entry.name, entry.logo]),
);

export const links = {
  email: settings.email,
  linkedin: settings.linkedin,
  resume: settings.resume,
};

/** An entry gets its own page when there's text below its frontmatter. */
export const hasWriteUp = (entry: { body?: string }) => Boolean(entry.body && entry.body.trim() !== '');

export const workUrl = (id: string) => `/work/${id}/`;
export const writingUrl = (id: string) => `/writing/${id}/`;

export async function getProjectEntries(): Promise<CollectionEntry<'projects'>[]> {
  const entries = await getCollection('projects', ({ data }) => !data.draft);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export async function getProjects(): Promise<Project[]> {
  return (await getProjectEntries()).map((entry) => {
    const { data } = entry;
    const writeUp = hasWriteUp(entry);
    return {
      client: data.client,
      cardRole: data.cardRole,
      title: data.title,
      summary: data.summary,
      href: writeUp ? workUrl(entry.id) : (data.link ?? '#work'),
      // With a write-up the row opens the case study; `linkLabel` then names the external link on that page.
      linkLabel: writeUp ? 'Case study' : data.linkLabel,
      secondLink: data.secondLink,
      secondLinkLabel: data.secondLinkLabel,
      hasWriteUp: writeUp,
      tone: data.tone,
      image: data.image,
      imageAlt: data.imageAlt,
      thumb: data.thumb ?? data.image,
      thumbAlt: data.thumb ? data.thumbAlt : data.imageAlt,
      blockText: data.blockText,
      tags: data.tags,
      era: data.era,
    };
  });
}

/** Writing gets its own home page section (and nav link) once there are this many pieces; fewer are
    mentioned in a line in the About band instead. */
export const WRITING_SECTION_MIN = 3;

export async function getWritingEntries(): Promise<CollectionEntry<'writing'>[]> {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  // Newest first; undated entries keep file-name order at the end.
  return entries.sort((a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0));
}

export async function getWriting() {
  return (await getWritingEntries()).map((entry) => ({
    title: entry.data.title,
    source: entry.data.source ?? '',
    href: hasWriteUp(entry) ? writingUrl(entry.id) : (entry.data.link ?? '#writing'),
  }));
}
