// Structured data (schema.org JSON-LD): facts for search engines and AI assistants, invisible on the page.
// BaseLayout puts one graph in every indexable page: the website, Purna, and the page itself. Each page
// says what kind it is (a profile, a case study, a collection); everything is built from the content
// files, so a Pages CMS edit carries over, and from `site` in astro.config.mjs, so the domain does too.
import { settings, experience, resume } from './site';

type Node = Record<string, unknown>;

const absolute = (path: string, site: URL) => new URL(path, site).href;

export const ids = (site: URL) => ({
  website: absolute('/#website', site),
  person: absolute('/#person', site),
});

// The roles line ("UX writer", "content designer"...) as crafts ("UX writing", "Content design"...),
// then the resume's skills that aren't among them.
const crafts = settings.roles.map((role) => {
  const craft = role.replace(/writer$/, 'writing').replace(/designer$/, 'design').replace(/strategist$/, 'strategy');
  return craft.charAt(0).toUpperCase() + craft.slice(1);
});
const knowsAbout = [...crafts, ...resume.skills.filter((skill) => !crafts.some((craft) => craft.toLowerCase() === skill.toLowerCase()))];

const languageCodes: Record<string, string> = { 'Bahasa Indonesia': 'id', English: 'en' };

function person(site: URL): Node {
  const current = experience[0];
  const school = resume.education[0];
  return {
    '@type': 'Person',
    '@id': ids(site).person,
    name: resume.name,
    url: absolute('/', site),
    ...(settings.portrait && { image: absolute(settings.portrait, site) }),
    description: resume.summary, // in the third person, unlike the site's own lines
    ...(current && { jobTitle: current.role, worksFor: { '@type': 'Organization', name: current.org } }),
    address: { '@type': 'PostalAddress', addressLocality: settings.location, addressCountry: 'ID' },
    knowsAbout,
    knowsLanguage: resume.languages.map((language) => languageCodes[language.name] ?? language.name),
    ...(school && { alumniOf: { '@type': 'CollegeOrUniversity', name: school.school } }),
    sameAs: [settings.linkedin].filter(Boolean),
  };
}

function website(site: URL): Node {
  return {
    '@type': 'WebSite',
    '@id': ids(site).website,
    url: absolute('/', site),
    name: resume.name,
    inLanguage: 'en',
    publisher: { '@id': ids(site).person },
  };
}

// What a page is. `type` is the schema.org type; `extra` adds that type's own facts.
export interface PageSchema {
  type: 'ProfilePage' | 'Article' | 'CollectionPage' | 'WebPage';
  extra?: Node;
}

export function graph(site: URL, page: { url: string; title: string; description: string; image: string }, schema: PageSchema = { type: 'WebPage' }) {
  const { website: websiteId, person: personId } = ids(site);
  const node: Node = {
    '@type': schema.type,
    '@id': `${page.url}#page`,
    url: page.url,
    isPartOf: { '@id': websiteId },
    inLanguage: 'en',
  };
  if (schema.type === 'Article') {
    // A case study or a piece of writing, written by Purna.
    Object.assign(node, { headline: page.title, author: { '@id': personId }, publisher: { '@id': personId }, mainEntityOfPage: page.url });
  } else {
    Object.assign(node, { name: page.title });
  }
  if (schema.type === 'ProfilePage') node.mainEntity = { '@id': personId };
  if (schema.type === 'CollectionPage') node.author = { '@id': personId };
  Object.assign(node, { description: page.description, image: page.image }, schema.extra);
  return { '@context': 'https://schema.org', '@graph': [website(site), person(site), node] };
}
