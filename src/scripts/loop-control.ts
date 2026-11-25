// Control for the page's text loop (the flipping headline); written so more loops could share it.
// A loop runs only while it is on screen, the tab is showing, the pointer and keyboard focus are away
// from it, and the visitor has not paused motion with the button in the hero.

type Listener = () => void;

let held = false;
const listeners = new Set<Listener>();

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface LoopGate {
  running: () => boolean;
  /** Resolves at once while the loop may run, otherwise when it next may. */
  ready: () => Promise<void>;
  /** Rests for `ms` of running time: the clock stops while the loop is held. */
  rest: (ms: number) => Promise<void>;
}

/**
 * `el` is what must be on screen; the pointer pausing and the focus pausing watch `hoverEls` and `focusEls`.
 */
export function loopGate(el: Element, hoverEls: Element[] = [], focusEls: Element[] = []): LoopGate {
  const state = { seen: false, hover: false, focus: false };
  const waiting: Listener[] = [];

  const running = () => state.seen && !state.hover && !state.focus && !held && !document.hidden;
  const wake = () => {
    if (running()) waiting.splice(0).forEach((resume) => resume());
  };

  new IntersectionObserver(([entry]) => {
    state.seen = entry.isIntersecting;
    wake();
  }).observe(el);
  hoverEls.forEach((target) => {
    target.addEventListener('pointerenter', () => { state.hover = true; });
    target.addEventListener('pointerleave', () => { state.hover = false; wake(); });
  });
  focusEls.forEach((target) => {
    // Keyboard focus pauses; a mouse click leaves focus behind, which must not stop the loop for good.
    target.addEventListener('focusin', (event) => { state.focus = (event.target as Element).matches(':focus-visible'); });
    target.addEventListener('focusout', () => { state.focus = false; wake(); });
  });
  document.addEventListener('visibilitychange', wake);
  listeners.add(wake);

  const ready = () => (running() ? Promise.resolve() : new Promise<void>((resolve) => waiting.push(resolve)));
  const rest = async (ms: number) => {
    for (let left = ms; left > 0; left -= 100) {
      await ready();
      await wait(100);
    }
  };
  return { running, ready, rest };
}

/** The pause button (an icon named "Pause motion" / "Play motion"): shown only once a loop can run, pauses every loop together. */
export function initLoopToggle() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-loop-toggle]');
  if (!toggle) return;
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    held = !held;
    const name = held ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-label', name);
    toggle.title = name;
    toggle.toggleAttribute('data-held', held);
    listeners.forEach((listener) => listener());
  });
}
