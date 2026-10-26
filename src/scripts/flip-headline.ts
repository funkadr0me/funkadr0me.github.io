// Flipping hero headline: "[Verb] [Noun] / across platforms."
// Prototype: prototypes/flip-headline.html ("Type + flip", layout "Flush left — noun steps away").
// The verb is deleted behind a cursor, the noun flips away, the new verb is typed from the left edge,
// then the noun flips in right after the cursor. The noun only changes place while it is hidden.
// Verb and noun always share one line: the headline font size is fitted so the longest pair fits.

const HOLD_MS = 2400;        // how long each pair stays
const START_MS = 2600;       // first change, after the opening sequence
const DELETE_MS = 38;        // per deleted letter
const TYPE_MS = 62;          // per typed letter (plus a little unevenness)
const NOUN_DELAY_MS = 500;   // noun lands this long after the verb is typed
const FLIP_MS = 800;         // full noun flip, out and in
const FLIP_OUT = 'cubic-bezier(0.55, 0, 1, 0.45)';
const FLIP_IN = 'cubic-bezier(0, 0.55, 0.45, 1)';
const CARET_EM = 0.12;       // room kept after the verb for the cursor

interface Pair {
  verb: string;
  noun: string;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function initFlipHeadline() {
  const h1 = document.querySelector<HTMLElement>('[data-flip]');
  const line = h1?.querySelector<HTMLElement>('.flip-line');
  const verbSlot = h1?.querySelector<HTMLElement>('[data-flip-verb]');
  const nounSlot = h1?.querySelector<HTMLElement>('[data-flip-noun]');
  const tail = h1?.querySelector<HTMLElement>('.flip-rest')?.textContent ?? '';
  if (!h1 || !line || !verbSlot || !nounSlot) return;

  const pairs: Pair[] = JSON.parse(h1.dataset.flip ?? '[]');
  if (pairs.length < 2) return; // one pair stays as written

  // Width of a word in the headline font, so a slot can be sized to it.
  const measurer = document.createElement('span');
  measurer.className = 'flip-measure';
  measurer.setAttribute('aria-hidden', 'true');
  h1.append(measurer);
  const widthOf = (text: string) => {
    measurer.textContent = text;
    return measurer.getBoundingClientRect().width;
  };
  const widest = (key: keyof Pair) => Math.max(...pairs.map((pair) => widthOf(pair[key])));
  const fontSize = () => parseFloat(getComputedStyle(h1).fontSize);
  const caretRoom = () => fontSize() * CARET_EM;
  const columnGap = () => parseFloat(getComputedStyle(line).columnGap) || 0;

  const verbWidth = (text: string) => widthOf(text) + caretRoom();
  const wordOf = (slot: HTMLElement) => slot.querySelector<HTMLElement>('.flip-word')!;
  const sizeSlots = () => {
    verbSlot.style.width = `${verbWidth(wordOf(verbSlot).textContent ?? '')}px`;
    nounSlot.style.width = `${widthOf(wordOf(nounSlot).textContent ?? '')}px`;
  };

  // Keep the longest combination on screen: shrink the headline if it wouldn't fit.
  const fit = () => {
    h1.style.fontSize = '';
    const available = h1.getBoundingClientRect().width;
    const needed = Math.max(widest('verb') + caretRoom() + columnGap() + widest('noun'), widthOf(tail));
    if (needed > available) h1.style.fontSize = `${(fontSize() * available * 0.98) / needed}px`;
    sizeSlots();
  };

  // The noun turns about its horizontal axis; "out" and "in" are mirror images.
  const flipOut = [{ transform: 'rotateX(0deg)', opacity: 1 }, { transform: 'rotateX(-90deg)', opacity: 0.2 }];
  const flipIn = [{ transform: 'rotateX(90deg)', opacity: 0.2 }, { transform: 'rotateX(0deg)', opacity: 1 }];

  async function change({ verb, noun }: Pair) {
    h1!.setAttribute('aria-label', `${verb} ${noun} ${tail}`);

    const verbWord = wordOf(verbSlot!);
    const txt = verbWord.querySelector<HTMLElement>('.flip-txt')!;
    const caret = verbWord.querySelector<HTMLElement>('.flip-caret')!;
    const oldNoun = wordOf(nounSlot!);
    const half = FLIP_MS / 2;
    caret.classList.add('typing'); // solid while typing, blinking when idle

    // 1. Delete the verb (its slot keeps its width, so the noun stays put)...
    await wait(250);
    let current = txt.textContent ?? '';
    while (current) {
      current = current.slice(0, -1);
      txt.textContent = current;
      await wait(DELETE_MS);
    }
    // 2. ...the noun flips away...
    await oldNoun.animate(flipOut, { duration: half, easing: FLIP_OUT, fill: 'both' }).finished;
    oldNoun.style.opacity = '0';
    // 3. ...type the new verb from the left edge (the hidden noun slot follows the cursor)...
    await wait(200);
    for (let i = 1; i <= verb.length; i++) {
      txt.textContent = verb.slice(0, i);
      verbSlot!.style.width = `${verbWidth(verb.slice(0, i))}px`;
      await wait(TYPE_MS + ((i * 37) % 5) * 9);
    }
    caret.classList.remove('typing');
    // 4. ...and the noun flips in right after it.
    await wait(NOUN_DELAY_MS);
    const next = document.createElement('span');
    next.className = 'flip-word';
    next.textContent = noun;
    nounSlot!.append(next);
    nounSlot!.style.width = `${widthOf(noun)}px`;
    oldNoun.remove();
    await next.animate(flipIn, { duration: half, easing: FLIP_IN, fill: 'both' }).finished;
    next.getAnimations().forEach((animation) => animation.cancel());
  }

  document.fonts.ready.then(async () => {
    fit();
    h1.classList.add('flip-ready');
    addEventListener('resize', fit);

    await wait(START_MS);
    for (let index = 1; ; index = (index + 1) % pairs.length) {
      await change(pairs[index]);
      await wait(HOLD_MS);
    }
  });
}
