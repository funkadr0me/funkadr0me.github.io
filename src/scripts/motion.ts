// Motion behaviours that CSS can't do alone:
// - reveal sections as they scroll into view
// - frost the nav once you scroll past the hero
// - type out the roles in the hero label
// The `motion` class on <html> (set in BaseLayout) is the on-switch; with reduced motion it's never set.

const root = document.documentElement;
const motionOn = root.classList.contains('motion');

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
const typing = document.querySelector<HTMLElement>('[data-typing]');
const typed = typing?.querySelector<HTMLElement>('.typing-text');
if (motionOn && typing && typed) {
  const roles: string[] = JSON.parse(typing.dataset.typing ?? '[]');
  const TYPE_MS = 70;
  const DELETE_MS = 35;
  const HOLD_MS = 1800;
  let roleIndex = 0;
  let charIndex = roles[0]?.length ?? 0; // first role starts fully written
  let deleting = true;

  const tick = () => {
    const role = roles[roleIndex];
    if (deleting) {
      charIndex -= 1;
      typed.textContent = role.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, DELETE_MS);
    } else {
      const next = roles[roleIndex];
      charIndex += 1;
      typed.textContent = next.slice(0, charIndex);
      if (charIndex === next.length) {
        deleting = true;
        setTimeout(tick, HOLD_MS);
      } else {
        setTimeout(tick, TYPE_MS);
      }
    }
  };

  if (roles.length > 1) setTimeout(tick, 2600); // start after the opening sequence
}
