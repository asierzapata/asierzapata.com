---
title: First, build the brain - My experience learning Rust with AI in the mix
slug: first-build-the-brain-my-experience-learning-rust-with-ai-in-the-mix
description: I wanted to learn Rust from scratch. AI wanted to write it for me. This is what I learned about learning when the machine already knows the answer.
date: 2026-01-29
draft: true
tags:
  - Software Engineering
  - AI
---

A few months ago, I found myself with the itch of learning something new. Something that would push me outside my comfort zone as an engineer. I wanted to pick something I had zero experience with, as far from web development as I could get. After weighing my options, the Rust evangelism won me over. I became a believer. Time to learn a systems language.

Rust is a hard language, no doubt. Coming from JavaScript, it's like going from an automatic car to an airplane. So many knobs and switches. Just what I wanted.

## The devil of the thousand whispers

When I started, I had zero knowledge about Rust, so I figured I would learn the way I always have: by building something. That's how I learned JavaScript and web development in the first place. Just start a project and figure things out along the way.

But something was different this time. Copilot was whispering things to me. Always. And I had zero idea what it was whispering. The temptation was real. Just press Tab and move on. Code appears, the file grows, it feels like progress. But I couldn't tell good suggestions from garbage. This was hard at first, since my muscle memory was too accustomed to tabbing away lots of things, things in my daily work that I mastered long ago. But with this, I had to pull the brakes, fight my muscle memory, and disable Copilot entirely.

It felt a bit weird. It felt like I was leaving a powerful tool on the table. But it was obvious: I wasn't learning, I was just accepting. That's when it first hit me: how the hell does a junior developer learn these days?

## The instinct AI can't give you

So I stepped back and asked myself a more fundamental question: how can I develop good judgment about what AI generates? How do I build the instinct that tells me "this is solid" or "this is garbage"?

I thought about it and realized something. I have general experience in software development. I know how to think about programs. But what I'm missing is deep knowledge of Rust specifically. Its idioms, its patterns, its sharp edges. And that's the thing: good judgment about AI output comes from deeply understanding the domain you're working in. Without that understanding, you can't evaluate what the AI is telling you. You're just along for the ride.

There's a framing I really like (and find funny to be honest) from [Dan Hockenmaier](https://x.com/danhockenmaier/status/2021617680525172840) that maps this out. He describes four types of people working with AI:

- **Turbo Brains** — good judgment + uses AI = 10x better
- **Slop Cannons** — no judgment + uses AI = 10x worse
- **Steady Hands** — good judgment + no AI = solid, but leaving things on the table
- **Dead Weight** — no judgment + no AI = well...

The goal is obvious. Be a Turbo Brain, not a Slop Cannon. But the key insight is that you _first_ need the good judgment. The AI amplifies what you already are. It doesn't create the judgment for you.

So the real question became: how do I build deep Rust knowledge when I can't yet write a single line of Rust confidently?

## Teaching the AI to teach me

I needed a different approach. For Rust, there's something called [Rustlings](https://github.com/rust-lang/rustlings), a set of 90+ small exercises where you get code that doesn't compile and you have to fix it. No autocomplete, no AI whispering. Just you, the compiler errors, and the documentation. This forced me to develop the habit of sitting with not-knowing, then going to the docs and reading until I understood.

But I also had Claude Code available, and I didn't want to just ignore it. The question at that moment was: how do I use AI _for_ learning, not _instead of_ learning?

Here's what I found works for me so far (to be honest I'm not even sure it's a good way of using it). AI always wants to help you. That's its nature. It's built to solve problems for you. So I had to actively guide it away from giving me answers. The best approach I discovered was to make Claude roleplay as a Socratic teacher. An expert in Rust who only asks questions and never gives solutions. From those questions, I would reason my way to the answer myself.

I also used it to explain concepts I didn't fully grasp. Not as a tutor that walks me through a solution, but as a teacher that builds my intuition. For example, Rust lifetimes were giving me headaches. I asked Claude to explain them with simple metaphors and a tiny code snippet. No big solution, just the concept in plain terms and in a contained scope. And it clicked.

Was it perfect? No. Sometimes it asked too many questions, and I needed to nudge it to narrow the scope. Sometimes the problem was more "you know it or you don't" than "you can reason your way to it." But it was easily adjustable. The key was that _I_ was in control of the learning loop, not the AI.

## Too helpful for your own good

Here's what I reflected on after a few weeks of this: I was guiding the AI to teach me, because the AI on its own is terrible at teaching. It's not designed for it. It's designed to solve problems. And solving problems for someone is often the opposite of teaching them.

Real learning happens when you find yourself stuck. When you don't know how to continue and you have to wrestle with it. That friction, that struggle of not-knowing, is what builds the mental circuitry that makes knowledge stick. A recent [study from Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills) backs this up: developers using AI scored roughly 17% lower on comprehension tests compared to those who coded manually. The biggest gap? Debugging skills. The very skill that requires you to sit with a problem and reason through it.

But here's the thing: the study also found that developers who used AI as a learning tool (asking follow-up questions, requesting explanations) retained significantly more than those who just delegated the coding. How you use AI matters enormously. It's the difference between becoming a Turbo Brain and a Slop Cannon.

## Born with a shortcut

This is what stuck with me the most after this whole experience. I was able to guide AI to help me learn _because I already knew what learning feels like_. I've learned things from scratch before, in a world without AI. I know what it's like to be stuck for hours, to read documentation until it clicks, to build that understanding brick by brick. So when AI threatened to shortcut that process, I recognized it and course-corrected.

But what about someone who's never experienced that? Someone born into a world where AI is just... there? They have something that can solve most problems for them, which means there's always a shortcut available. And shortcuts, by definition, skip the parts where the real learning happens.

This genuinely worries me. I don't have a clean answer for it.

What I do think is that the figure of the teacher becomes more important than ever. Not the AI teacher. The human teacher. The person who can guide _how_ to use AI well. Who can create the space for struggle and not-knowing. Who can say "don't press Tab yet, sit with this for a moment."

And for those of us learning on our own, without a teacher, the critical skill becomes this: teaching the AI to teach you. Knowing how to steer it away from giving you answers and toward helping you find them yourself.

## First, build the brain

I think one of the most important skills going forward, for us and for the younger generations we teach, is learning how to learn _with_ AI. Not through AI. Not by AI. With it.

That means understanding when to let AI accelerate you and when to slow down and build the foundations yourself. It means being intentional about how we use these tools, because the default mode will quietly erode the very skills that make us effective.

Be a Turbo Brain. But first, build the brain.

Thanks for reading.
