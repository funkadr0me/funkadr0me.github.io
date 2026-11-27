---
title: Designing GenAI interaction
client: Telkom Indonesia
summary: Telkom built its own AI assistant so company data would stay in the company. I gave it a voice, from the persona and the system prompt to every word around the chat.
order: 5
tone: teal
role: Conversation designer and UX writer
cardRole: Conversation designer, UX writer
tags:
- label: Conversation design
  tone: oxford
- label: UX writing
  tone: teal
image: /images/work/telkomgpt/cover.jpg
imageAlt: The TelkomGPT home page, with the greeting Halo! Apa yang dapat kami bantu? above the chat box and four prompt guide cards below
thumb: /images/work/telkomgpt/thumb.jpg
thumbAlt: An ink-and-wash drawing of an open-plan office, where two smiling colleagues lean over a low cubicle partition and one points at a chat page on a laptop, while two others sit at the desk
---

## Not everything in the pantry is shareable

Have you ever pasted a work document into a public chatbot? Plenty of Telkom employees used one for daily work, without a second thought about where the data went.

<figure style="max-width: 420px">
  <img src="/images/work/telkomgpt/ai-tools.jpg" alt="A survey table of AI tools Telkom employees used: ChatGPT 34.65 percent, Google Gemini 22.66, Microsoft Copilot 14.36, then Canva AI, others, Claude, Perplexity, DeepSeek and internal tools" loading="lazy" />
  <figcaption>The public AI tools employees said they used, from the research survey.</figcaption>
</figure>

When I joined the GenAI work in June 2025, it was a small research project. Then management moved it to the front: Telkom's own AI assistant, on a model hosted in-house, able to handle daily tasks and to draw on the company's latest documents. The message was data sovereignty: company data stays in the company.

<figure style="max-width: 560px">
  <img src="/images/work/telkomgpt/waspada.jpg" alt="A red launch banner with a padlock and the words Waspada! Data perusahaan bisa bocor di AI Chatbot eksternal" loading="lazy" />
  <figcaption>The launch banner: "Waspada! Data perusahaan bisa bocor di AI Chatbot eksternal" (Beware! Company data can leak through outside AI chatbots).</figcaption>
</figure>

I joined a team of designers, researchers, engineers, product owners and AI specialists, and came in to design the interface. Then I read what the model was saying.

## Talk the walk

The model was still raw. It carried the habits of the foundation model underneath, and its Bahasa Indonesia sounded robotic, as if translated from another language. (Think of the machine-translated seller chats you still find on marketplaces.)

Nobody owned how it talked, so I offered to take that on along with the screens. It was a step up.

## The colleague at the next cubicle

I joined our researcher in interviewing Telkom employees about how they used GenAI, and turned what we heard into insights for the persona and the conversation. The product team brought its positioning from a workshop, where data security came out on top.

<div class="shots even">
  <figure style="--ratio: 1.333">
    <img src="/images/work/telkomgpt/interview-1.jpg" alt="Two researchers at laptops in a meeting room, interviewing an employee who joins on the screen at the far end" loading="lazy" />
    <figcaption>An interview, with the employee on the screen.</figcaption>
  </figure>
  <figure style="--ratio: 1.744">
    <img src="/images/work/telkomgpt/interview-2.jpg" alt="A group of about twenty employees with laptops around a long table in a meeting room with a red-striped wall" loading="lazy" />
    <figcaption>A group session.</figcaption>
  </figure>
</div>

The persona we landed on is a friendly Telkom colleague, the one at the next cubicle you can always ask.

## Behind the cubicle wall

Then I wrote the system prompt for that colleague. What's in it stays inside the company, but its shape doesn't have to: the persona, the main instructions, the guardrails, and the guides for reaching the tools behind it.

The persona even picks the pronouns. The interface mostly stays corporate, and the conversation stays casual.

<figure>
  <ol class="card principles">
    <li><span class="card-name">The interface</span><span>"Kami" (we). What it shows comes from more than the chat: the knowledge base, the documents and the other tools behind it.</span></li>
    <li><span class="card-name">The assistant</span><span>"Saya" (I) for itself, and "kamu" (the casual "you") for you. It's the colleague at the next cubicle.</span></li>
  </ol>
</figure>

## Prompt, test, repeat

Our AI Engineer wrote Python scripts to drill every version of the system prompt. We checked whether the model followed it, answered consistently and made things up less.

One round caught it making up recent events. The web search tool behind it was still being built, so the model filled the gap on its own. I added a guardrail: it tells you its knowledge only goes up to a certain date, so you may want to check the answer elsewhere.

And when a source comes back empty, it says so instead of guessing.

<figure>
  <img src="/images/work/telkomgpt/wont-guess.jpg" alt="TelkomGPT answering the question Siapa juara Piala Dunia 2026? by saying the internet search returned nothing usable, so it won't answer from general knowledge or assumptions" loading="lazy" />
  <figcaption>Asked who won the 2026 World Cup, it says the search came back empty and won't answer from general knowledge or assumptions.</figcaption>
</figure>

I wrote the reasons people could pick when they rated an answer. The most common beta complaint was about answer quality, and the fix was connecting the right sources. The persona was only the messenger.

<figure>
  <img src="/images/work/telkomgpt/feedback.jpg" alt="A pie chart of thumbs feedback, 60 percent up and 40 percent down, beside a table of ratings with reasons such as Jawaban ambigu, Akurat, Rujukan lengkap, Tidak akurat, Sesuai data terbaru and Membantu" loading="lazy" />
  <figcaption>Ratings from the first month, with the reasons people picked.</figcaption>
</figure>

Each round of feedback, and each new feature, meant another pass at the prompt.

When an answer leans on an unverified source, like the internet, instead of the company's own documents, the assistant says so, and suggests checking with whoever is in charge of the matter.

## Still thinking, out loud

I wrote every word around the chat, too. The sign-in page calls people what they call each other: "Telkomers, ayo buka potensimu!" (Telkomers, come unlock your potential!). Inside, the greeting asks "Halo! Apa yang dapat kami bantu?" (Hi! How can we help?). Below it, prompt guides turn common chores into fill-in-the-blank starters, from an official memo to the rules for taking leave.

<figure>
  <img src="/images/work/telkomgpt/login.jpg" alt="The TelkomGPT sign-in dialog over the dimmed home page, with the line Telkomers, ayo buka potensimu! above a red button to sign in with a Telkom email" loading="lazy" />
  <figcaption>The sign-in screen, designed by Alwan Thio Hartoyo.</figcaption>
</figure>

Reading internal documents takes time, and a silent wait feels longer. So while it works, the assistant tells you what it's doing, one step at a time: "Memahami permintaanmu" (Understanding your request), "Menganalisis kompleksitas pertanyaan" (Weighing how complex the question is), "Menghimpun sumber informasi" (Gathering sources). The idea: you see it getting there, so you wait. And until it's done, it asks you to hold on: "Tunggu sampai kami selesai menjawab, ya." (Hang on till we finish answering, okay?)

<figure>
  <img src="/images/work/telkomgpt/thinking.jpg" alt="A question about taking annual leave, with the line Menganalisis kompleksitas pertanyaan under it while TelkomGPT works" loading="lazy" />
  <figcaption>One of the thinking lines, while TelkomGPT works on a question.</figcaption>
</figure>

## Someone to rely on

It went live around Indonesia's Independence Day, August 17, 2025. In its first month, 964 people used TelkomGPT, more than the roughly 830 people in the IT Digital directorate it launched for. People in regional offices tell me they use it. And as of November 2026, it still talks like that colleague.

<div class="shots even">
  <figure style="--ratio: 1.778">
    <img src="/images/work/telkomgpt/launch.jpg" alt="A speaker on stage at the launch, beside a big screen showing a TelkomGPT answer that addresses the reader as kamu" loading="lazy" />
    <figcaption>At the launch, with a TelkomGPT answer on the big screen.</figcaption>
  </figure>
  <figure style="--ratio: 1.875">
    <img src="/images/work/telkomgpt/users.jpg" alt="A dashboard panel showing 964 unique users, with sessions split between new and returning users" loading="lazy" />
    <figcaption>964 people in the first month.</figcaption>
  </figure>
</div>

Ask it to write a note to your manager about leaving early for a family matter, and it offers a few drafts. Before showing them, it adds what a colleague would: send it soon, so your manager can rearrange the day.

<figure>
  <img src="/images/work/telkomgpt/leave-note.jpg" alt="TelkomGPT answering a request for a short note to a manager about leaving early: it offers to draft polite options, suggests sending it soon so the manager can rearrange the schedule, then gives a formal option" loading="lazy" />
  <figcaption>A note for leaving early, with a colleague's tip on top.</figcaption>
</figure>
