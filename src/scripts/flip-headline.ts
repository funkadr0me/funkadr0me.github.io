// Split-flap hero headline: "[Verb] [Noun] / across platforms."
// Prototype: prototypes/split-flap.html, look "C · Type". At rest it reads as plain type; when a word
// changes, each letter folds about its middle like an airport departure board, passing through a few
// other letters before it lands. The verb flips first, left to right; the noun follows once it has landed.
// Each letter is a cell as wide as its glyph, snapping to each new letter's width as it lands.
// Verb and noun always share one line: the headline font size is fitted so the longest pair fits.
// It only runs while visible and un-held (loop-control.ts); a change that has begun always finishes.

import { loopGate } from './loop-control';

const HOLD_MS = 4500;        // how long each pair stays
const START_MS = 2600;       // first change, after the opening sequence
const FLAP_MS = 120;         // one flap: the top half falls, then the bottom half lands
const STAGGER_MS = 45;       // each letter starts this much after the one to its left
const NOUN_AFTER_MS = 180;   // the noun starts this long after the verb has landed
const FALL = 'cubic-bezier(0.55, 0, 1, 0.45)';
const LAND = 'cubic-bezier(0, 0.55, 0.45, 1)';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();

interface Words {
  verbs: string[];
  nouns: string[];
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function initFlipHeadline() {
  const h1 = document.querySelector<HTMLElement>('[data-flip]');
  const line = h1?.querySelector<HTMLElement>('.flip-line');
  const verbSlot = h1?.querySelector<HTMLElement>('[data-flip-verb]');
  const nounSlot = h1?.querySelector<HTMLElement>('[data-flip-noun]');
  const tail = h1?.querySelector<HTMLElement>('.flip-rest')?.textContent ?? '';
  if (!h1 || !line || !verbSlot || !nounSlot) return;

  const { verbs, nouns }: Words = JSON.parse(h1.dataset.flip ?? '{"verbs":[],"nouns":[]}');
  if (verbs.length < 2 && nouns.length < 2) return; // nothing to turn: the headline stays as written

  // Width of a letter (or a line) in the headline font, so a cell can be sized to it.
  const measurer = document.createElement('span');
  measurer.className = 'flip-measure';
  measurer.setAttribute('aria-hidden', 'true');
  h1.append(measurer);
  const widthOf = (text: string) => {
    if (text === ' ') return 0; // a blank cell takes no room
    measurer.textContent = text;
    const width = measurer.getBoundingClientRect().width;
    measurer.textContent = ''; // left empty, so the headline's text is only its sentence
    return width;
  };
  const wordWidth = (word: string) => [...word].reduce((sum, ch) => sum + widthOf(ch), 0);
  const widest = (words: string[]) => Math.max(...words.map(wordWidth));
  const fontSize = () => parseFloat(getComputedStyle(h1).fontSize);
  const columnGap = () => parseFloat(getComputedStyle(line).columnGap) || 0;

  // A cell is four layers, each showing half of a letter: the static top (the next letter), the static
  // bottom (the current one), the falling top flap (current) and the rising bottom flap (next).
  // Each word keeps as many cells as its wheel's longest word; the spare ones hold a blank.
  // A layer draws its letter from data-ch through CSS (motion.css), not as text: four text copies of
  // every letter made search engines read the headline as "SSSShhhhuuuu…". The word itself is kept
  // once, as hidden plain text (`.flip-text`), so the headline's text is always the current sentence.
  const makeCell = (ch: string) => {
    const cell = document.createElement('span');
    cell.className = 'flip-cell';
    for (const kind of ['top', 'bottom', 'flap top', 'flap bottom']) {
      const layer = document.createElement('span');
      layer.className = `flip-layer ${kind}`;
      layer.dataset.ch = ch;
      cell.append(layer);
    }
    cell.dataset.ch = ch;
    return cell;
  };
  const layersOf = (cell: HTMLElement) => [...cell.querySelectorAll<HTMLElement>('.flip-layer')];
  const cellsOf = (slot: HTMLElement) => [...slot.querySelectorAll<HTMLElement>('.flip-cell')];
  const sizeCell = (cell: HTMLElement, ch = cell.dataset.ch ?? ' ') => cell.style.setProperty('--w', `${widthOf(ch)}px`);

  const build = (slot: HTMLElement, words: string[], first: string) => {
    const word = slot.querySelector<HTMLElement>('.flip-word')!;
    const count = Math.max(...words.map((w) => w.length));
    const text = document.createElement('span');
    text.className = 'flip-text sr-only';
    text.textContent = first;
    word.replaceChildren(...Array.from({ length: count }, (_, i) => makeCell(first[i] ?? ' ')), text);
  };
  build(verbSlot, verbs, verbs[0]);
  build(nounSlot, nouns, nouns[0]);

  // Keep the longest combination on screen: shrink the headline if it wouldn't fit.
  const fit = () => {
    h1.style.fontSize = '';
    const available = h1.getBoundingClientRect().width;
    const needed = Math.max(widest(verbs) + columnGap() + widest(nouns), widthOf(tail));
    if (needed > available) h1.style.fontSize = `${(fontSize() * available * 0.98) / needed}px`;
    [...cellsOf(verbSlot), ...cellsOf(nounSlot)].forEach((cell) => sizeCell(cell));
  };

  /** One flap of one cell, from its current letter to `next`. */
  async function flap(cell: HTMLElement, next: string) {
    const [top, bottom, fallingTop, risingBottom] = layersOf(cell);
    const current = cell.dataset.ch ?? ' ';
    top.dataset.ch = next;            // uncovered as the top flap falls
    bottom.dataset.ch = current;      // covered as the bottom flap lands
    fallingTop.dataset.ch = current;
    risingBottom.dataset.ch = next;
    cell.classList.add('flipping');
    await fallingTop.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }],
      { duration: FLAP_MS / 2, easing: FALL, fill: 'forwards' }).finished;
    await risingBottom.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }],
      { duration: FLAP_MS / 2, easing: LAND, fill: 'forwards' }).finished;
    bottom.dataset.ch = next;
    cell.dataset.ch = next;
    sizeCell(cell, next);
    cell.classList.remove('flipping');
    fallingTop.getAnimations().forEach((animation) => animation.cancel());
    risingBottom.getAnimations().forEach((animation) => animation.cancel());
  }

  /** A cell passes through a few other letters before it lands; an unchanged letter stays put. */
  async function turnCell(cell: HTMLElement, target: string, index: number) {
    if (cell.dataset.ch === target) return;
    await wait(index * STAGGER_MS);
    const code = target.charCodeAt(0);
    const pool = target !== target.toLowerCase() ? UPPER : LOWER; // a capital passes through capitals
    const steps = 2 + ((index * 7 + code) % 4);
    for (let step = 0; step < steps; step++) await flap(cell, pool[(code + step * 11 + index * 5) % pool.length]);
    await flap(cell, target);
  }

  const turnWord = (slot: HTMLElement, word: string) =>
    Promise.all(cellsOf(slot).map((cell, i) => turnCell(cell, word[i] ?? ' ', i)));
  const setText = (slot: HTMLElement, word: string) => { slot.querySelector('.flip-text')!.textContent = word; };

  // The headline always reads as one sentence; the visible words are aria-hidden, the two buttons are not.
  const sentence = (verb: string, noun: string) => `${verb} ${noun} ${tail}`;
  const status = document.createElement('p');
  status.className = 'sr-only';
  status.setAttribute('role', 'status');
  h1.after(status);

  async function change(verb: string, noun: string, turnVerb: boolean, turnNoun: boolean) {
    h1!.setAttribute('aria-label', sentence(verb, noun));
    labelHits(verb, noun);
    setText(verbSlot!, verb); // the plain text says where both words are going, like the label
    setText(nounSlot!, noun);
    if (turnVerb) await turnWord(verbSlot!, verb);
    if (turnVerb && turnNoun) await wait(NOUN_AFTER_MS);
    if (turnNoun) await turnWord(nounSlot!, noun);
  }

  // One change at a time; a third click while two are waiting is ignored.
  let queue: Promise<void> = Promise.resolve();
  let pending = 0;
  const enqueue = (job: () => Promise<void>) => {
    pending++;
    queue = queue.then(job).finally(() => { pending--; });
    return queue;
  };

  // The verb and the noun are two wheels of their own length. The loop turns both; a click turns one.
  let verbIndex = 0;
  let nounIndex = 0;
  let idle = HOLD_MS; // running time since the last change; the first one waits for START_MS only

  const makeHit = (slot: HTMLElement) => {
    const hit = document.createElement('button');
    hit.type = 'button';
    hit.className = 'flip-hit';
    slot.append(hit);
    return hit;
  };
  // A wheel with one word has nothing to turn, so it gets no button.
  const verbHit = verbs.length > 1 ? makeHit(verbSlot) : null;
  const nounHit = nouns.length > 1 ? makeHit(nounSlot) : null;
  function labelHits(verb: string, noun: string) {
    verbHit?.setAttribute('aria-label', `Change the verb (now ${verb})`);
    nounHit?.setAttribute('aria-label', `Change the noun (now ${noun})`);
  }
  labelHits(verbs[0], nouns[0]);

  const turn = (which: 'verb' | 'noun') => {
    if (pending >= 2) return;
    idle = 0; // a visitor's click restarts the rest
    if (which === 'verb') verbIndex = (verbIndex + 1) % verbs.length;
    else nounIndex = (nounIndex + 1) % nouns.length;
    const verb = verbs[verbIndex];
    const noun = nouns[nounIndex];
    enqueue(() => change(verb, noun, which === 'verb', which === 'noun')).then(() => {
      status.textContent = sentence(verb, noun);
    });
  };
  verbHit?.addEventListener('click', () => turn('verb'));
  nounHit?.addEventListener('click', () => turn('noun'));

  document.fonts.ready.then(async () => {
    fit();
    h1.classList.add('flip-ready');
    addEventListener('resize', fit);

    const toggles = [...document.querySelectorAll('[data-loop-toggle]')];
    const gate = loopGate(h1, [h1, ...toggles], [h1, ...toggles]);
    await gate.rest(START_MS);
    for (;;) {
      while (idle < HOLD_MS) {
        await gate.ready();
        await wait(100);
        idle += 100;
      }
      verbIndex = (verbIndex + 1) % verbs.length;
      nounIndex = (nounIndex + 1) % nouns.length;
      const verb = verbs[verbIndex];
      const noun = nouns[nounIndex];
      await enqueue(() => change(verb, noun, verbs.length > 1, nouns.length > 1));
      idle = 0;
    }
  });
}
