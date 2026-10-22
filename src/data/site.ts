// Site content.
// - Projects and writing are Markdown collections (src/content/projects, src/content/writing — see src/content.config.ts).
// - Site text, experience and awards are JSON files in src/content/.
// All of it is editable in Pages CMS (see .pages.yml).
import { getCollection, type CollectionEntry } from 'astro:content';
import settingsJson from '../content/settings.json';
import experienceJson from '../content/experience.json';
import awardsJson from '../content/awards.json';

export type TagTone = 'claret' | 'oxford' | 'teal' | 'ink';

/** Shape the project card needs. */
export interface Project {
  client: string;
  title: string;
  summary: string;
  href: string;             // the write-up page, or the external link
  linkLabel?: string;
  hasWriteUp: boolean;
  tone: TagTone;
  image?: string;
  imageAlt?: string;
  blockText?: string;
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

export const settings = settingsJson as Settings;
export const experience: { years: string; role: string; org: string }[] = experienceJson;
export const awards: { name: string; detail: string }[] = awardsJson;

export const links = {
  email: settings.email,
  linkedin: settings.linkedin,
  twitter: settings.twitter,
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
      title: data.title,
      summary: data.summary,
      href: writeUp ? workUrl(entry.id) : (data.link ?? '#work'),
      linkLabel: data.linkLabel ?? (writeUp ? 'Read the case study' : undefined),
      hasWriteUp: writeUp,
      tone: data.tone,
      image: data.image,
      imageAlt: data.imageAlt,
      blockText: data.blockText,
      tags: data.tags,
    };
  });
}

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
