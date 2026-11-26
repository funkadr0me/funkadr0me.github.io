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

## Kiss and tell, or better not to?

Have you ever pasted a work document into a public chatbot? Plenty of Telkom employees used one for daily work, without a second thought about where the data went.

When I joined the GenAI work in June 2025, it was a small research project. Then management moved it to the front: Telkom's own AI assistant, on a model hosted in-house, able to handle daily tasks and to draw on the company's latest documents. The message was data sovereignty: company data stays in the company.

I came in to design the interface. Then I read what the model was saying.

## Teaching our ABCs

The model was still raw. It carried the habits of the foundation model underneath, and its Bahasa Indonesia sounded robotic, as if translated from another language. (Think of the machine-translated seller chats you still find on marketplaces.)

Nobody owned how it talked, so I offered to take that on along with the screens. It was a step up.

## The colleague at the next cubicle

I joined our researcher in interviewing Telkom employees about how they used GenAI, and turned what we heard into insights for the persona and the conversation. The product team brought its positioning from a workshop, where data security came out on top.

The persona we landed on is a friendly Telkom colleague, the one at the next cubicle you can always ask. The interface mostly stays corporate, and the conversation stays casual. The assistant calls you "kamu" (the casual "you") and says "saya" (I). The interface says "kami" (we), because what it shows comes from more than the chat: the knowledge base, the documents, and the other tools behind it.

Then I wrote the system prompt for that colleague.

## Prompt, test, repeat

Our AI Engineer wrote Python scripts to drill every version of the system prompt. We checked whether the model followed it, answered consistently and made things up less.

I wrote the reasons people could pick when they rated an answer. The most common beta complaint was about answer quality, and the fix was connecting the right sources. The persona was only the messenger.

Each round of feedback, and each new feature, meant another pass at the prompt.

When an answer leans on an unverified source, like the internet, instead of the company's own documents, the assistant says so, and suggests checking with whoever is in charge of the matter.

## Still thinking, out loud

I wrote every word around the chat, too. The sign-in page calls people what they call each other: "Telkomers, ayo buka potensimu!" (Telkomers, come unlock your potential!). Inside, the greeting asks "Halo! Apa yang dapat kami bantu?" (Hi! How can we help?). Below it, prompt guides turn common chores into fill-in-the-blank starters, from an official memo to the rules for taking leave.

Reading internal documents takes time, and a silent wait feels longer. So while it works, the assistant tells you what it's doing, one step at a time: "Memahami permintaanmu" (Understanding your request), "Menganalisis kompleksitas pertanyaan" (Weighing how complex the question is), "Menghimpun sumber informasi" (Gathering sources). The idea: you see it getting there, so you wait. And until it's done, it asks you to hold on: "Tunggu sampai kami selesai menjawab, ya." (Hang on till we finish answering, okay?)

<figure>
  <img src="/images/work/telkomgpt/thinking.jpg" alt="A question about taking annual leave, with the line Menganalisis kompleksitas pertanyaan under it while TelkomGPT works" loading="lazy" />
  <figcaption>One of the thinking lines, while TelkomGPT works on a question.</figcaption>
</figure>

## Someone to rely on

In its first month, 964 people used TelkomGPT, more than the roughly 830 people in the IT Digital directorate it launched for. People in regional offices tell me they use it. And as of November 2026, it still talks like that colleague.

Ask it to write a note to your manager about leaving early for a family matter, and it offers a few drafts. Before showing them, it adds what a colleague would: send it soon, so your manager can rearrange the day.

<figure>
  <img src="/images/work/telkomgpt/leave-note.jpg" alt="TelkomGPT answering a request for a short note to a manager about leaving early: it offers to draft polite options, suggests sending it soon so the manager can rearrange the schedule, then gives a formal option" loading="lazy" />
  <figcaption>A note for leaving early, with a colleague's tip on top.</figcaption>
</figure>
