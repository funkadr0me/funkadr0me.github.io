// Motion behaviours that CSS can't do alone:
// - reveal sections as they scroll into view
// - frost the nav once you scroll past the hero
// - type out the roles in the hero label
// - flip the hero headline's verb and noun (flip-headline.ts)
// The `motion` class on <html> (set in BaseLayout) is the on-switch; with reduced motion it's never set.

import { initFlipHeadline } from './flip-headline';
import { initLoopToggle, loopGate } from './loop-control';

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

// Typing roles -------------------------------------------------------------------
// Runs while the line is on screen and motion is not paused (loop-control.ts); a role change always finishes.
const typing = document.querySelector<HTMLElement>('[data-typing]');
const typed = typing?.querySelector<HTMLElement>('.typing-text');
if (motionOn && typing && typed) {
  const roles: string[] = JSON.parse(typing.dataset.typing ?? '[]');
  const TYPE_MS = 70;
  const DELETE_MS = 35;
  const HOLD_MS = 2800;
  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  if (roles.length > 1) {
    const gate = loopGate(typing.closest('.roles') ?? typing);
    (async () => {
      let roleIndex = 0; // the first role starts fully written
      for (;;) {
        typing.classList.add('is-holding'); // the cursor blinks a few beats, then rests
        await gate.rest(HOLD_MS);
        await gate.ready();
        typing.classList.remove('is-holding');
        for (let n = roles[roleIndex].length - 1; n >= 0; n--) {
          typed.textContent = roles[roleIndex].slice(0, n);
          await sleep(DELETE_MS);
        }
        roleIndex = (roleIndex + 1) % roles.length;
        for (let n = 1; n <= roles[roleIndex].length; n++) {
          typed.textContent = roles[roleIndex].slice(0, n);
          await sleep(TYPE_MS);
        }
      }
    })();
  }
}
