// Motion behaviours that CSS can't do alone:
// - reveal sections as they scroll into view
// - frost the nav once you scroll past the hero
// - flip the hero headline's verb and noun (flip-headline.ts)
// The `motion` class on <html> (set in BaseLayout) is the on-switch; with reduced motion it's never set.

import { initFlipHeadline } from './flip-headline';
import { initLoopToggle } from './loop-control';

const root = document.documentElement;
const motionOn = root.classList.contains('motion');

// Flipping headline ------------------------------------------------------------
if (motionOn) {
  initLoopToggle();
  initFlipHeadline();
}

// Scroll reveals (also drives the claret band's wipe) -------------------------
const revealTargets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-wipe]');
if (motionOn && 'IntersectionObserver' in window) {
  const revealer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', '');
          revealer.unobserve(entry.target); // reveal once
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  revealTargets.forEach((el) => revealer.observe(el));
} else {
  revealTargets.forEach((el) => el.setAttribute('data-revealed', ''));
}

// Frosted nav past the hero ----------------------------------------------------
const header = document.querySelector<HTMLElement>('.site-header');
const hero = document.querySelector<HTMLElement>('.hero');
if (header && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([entry]) => header.toggleAttribute('data-past-hero', !entry.isIntersecting),
    { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
  ).observe(hero);
}
