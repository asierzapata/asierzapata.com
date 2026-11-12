---
title: AI Product Engineering - Part 1 - How to Think as a Team
slug: ai-product-engineering-part-1-how-to-think-as-a-team
description: In this first part of the series, I share the mindset shift that helped my team ship our first AI features to production. We explore how to think about non-determinism, the importance of evaluation, and how to reframe conversations to move from paralysis to problem-solving.
date: 2026-02-18
draft: false
tags:
  - AI
  - Leadership
---

Hi! This is the first in a series about what I've learned developing AI features over the past year. We'll explore the challenges compared to traditional software, the team changes needed to embrace AI Engineering, and how to actually ship these features to production. I hope you find something useful here! And hey, if you want to talk about this stuff, reach out! I'd love to hear what you're working on.

## What is AI Engineering?

First, let's define what I mean by AI Engineering. AI Product Engineering is different from traditional ML engineering.

Traditional ML engineering involves developing and deploying ML models. By **AI Product Engineering**, or just **AI Engineering**, I mean leveraging existing models to develop AI features. For example, instead of building a custom language model from scratch, you might use a foundational model like Claude Sonnet to create features such as summarization tools, automated question generators, or chatbots.

Lately, this AI Engineering movement has gained significant momentum thanks to the incredible models AI frontier labs are releasing. I'll call those models **Foundational Models**. We call them that because they are the foundation on which we build all our features. The reality is that we no longer need to create custom models for every AI feature we can think of; instead, we can use those immensely powerful models and adapt them to our specific needs in many ways.

### Full Stack Development and AI Engineering

There are many parallels between full-stack engineering and AI engineering. They both take a holistic look at the product and implement features end-to-end. If full-stack brought together backend and frontend development to improve feature outcomes, AI Engineering brings the product closer to AI development, thanks to not having to spend vast amounts of time and resources on model development.

## Why This Series?

A few months ago, we shipped the first AI features at Edpuzzle. And honestly? Everything that usually worked in my team when developing a product quickly fell apart.

The rules had changed. The conversations around the feature had changed. Even what "done" meant had changed.

Let's start with the biggest mindset shift we had to do: how to think about non-determinism.

## The Shift That Changes Everything

Here's the first thing: **traditional software is deterministic**. You write code, it runs, and given the same inputs, you get the same outputs. **Always**. This predictability is the foundation of everything: tests, deployments, and user expectations.

**AI breaks this.**

You're no longer building something that "does X." You're building something that "does X about Y% of the time." And that single shift changes every conversation you'll have as a team.

### When Uncertainty Becomes a Blocker

When I first introduced this to my team, I saw a pattern emerge. Someone would ask:

*"But what if it doesn't do X?"*

Valid question. But it became a blocker. We'd go in circles trying to guarantee behavior we couldn't guarantee.

One of the first things I learned was to reframe these conversations with the team into two separate questions:

1. **How can we make it as deterministic as possible?** Can we break one complex prompt into smaller, more predictable steps?
2. **How can we design the UX to minimize pain when it goes wrong?** If we accept that occasional failures are inevitable, how do we make recovery graceful?

This reframe moves the team from paralysis to problem-solving. Instead of chasing impossible guarantees, you're reducing uncertainty and building resilience together.

## The Evaluate-Build-Observe Cycle

After several iterations, I landed on a three-step cycle that became the secret sauce for communicating to the rest of the engineers how to ship AI features:

**EVALUATE → BUILD → OBSERVE → (repeat)**

The order matters. **Evaluate comes first** before writing a single line of code.

Let me explain why.

## Evaluate

### What do we mean by evaluate

This step refers to the things we will do to understand how non-deterministic our AI feature is. Or, in other words, we'll evaluate how well our AI feature performs against metrics we define ourselves that will capture this non-determinism.

Without this information, we will never deploy a feature with confidence, not the first time nor with subsequent changes to it.

### Why Evaluate First?

You might think, how will we evaluate something we haven't even built? Starting with evaluation forces conversations that would otherwise bite you later.

**1. What do we actually expect this feature to do?**

**AI's novelty attracts vague requirements**. One of our early features was "Make a question harder/easier." Sounds simple, right? But what makes a question "harder"? If you think about it, it depends on factors like students' grade level, the subject taught, the question type, and cultural context...

Having this conversation *before* building saved us weeks of misguided iteration. I can't stress this enough—bring these questions to light as soon as possible.

**2. What inputs will this feature handle?**

For example, we did a feature to generate quizzes from PDFs. What the team needed was to understand what kinds of PDFs teachers actually use. This helped us define success: "These N types of PDFs should work well before we ship."

**Without this, you're not prioritizing correctly when building**, since you either pick a narrow subset or try to handle all possible cases, which leads to non-determinism and a team going in circles trying to make that edge case work.

**3. What does a good outcome look like, and how do we measure it?**

We had another feature for importing PDFs by analyzing their structure and text to generate a quiz from them, so the ideal outcome was a quiz where every generated question matched the original PDF word-for-word. So we measured textual similarity.

In some cases, measuring the outcome is easy and clear, but in others **it's a *bet***. For question generation, we hypothesized that *clarity*, *tone*, and *accuracy* would make a "good" question. I'd suggest validating this later with real usage since they are just bets.

**4. What's the ultimate metric, and what's the quality bar?**

For content generation, we tracked the percentage of questions teachers kept without editing or deleting. This became the north star. The quality bar told us how many iterations we'd need.

**This step has to be collaborative between Engineering and Product Managers.** PMs have domain knowledge that makes evaluations great, and their involvement is the difference between a good and a bad AI feature. Here are a few practical ways to work together: set up joint evaluation sessions where engineers and PMs can review feature outputs side by side, use shared docs or dashboards to capture evaluation results and comments as you test, and hold regular check-ins to discuss new findings and adjust quality bars as real data comes in. By making evaluation a hands-on, shared activity, both sides gain context and confidence as you move forward.

> [!IMPORTANT]
> **Until the feature is in users' hands, you won't know for sure if it works**. All of this is designed to reduce uncertainty before that moment.

### Post-Deploy: When You Finally Get Real Data

Once you deploy, you have something you didn't have before: **usage**.

Usage answers two questions:

1. **Do my evaluation measurements correlate with my success metric?** My question generation measurements (*clarity, tone, accuracy*) were independent of the metric I cared about (% of questions kept unedited). They might not correlate. If they don't, I've been optimizing for the wrong thing.
2. **Is my dataset representative of real use cases?** Users will surprise you. They might use your feature in ways you never imagined.

This is why **you should deploy AI features as early as possible**. Real data removes uncertainty faster than any amount of internal testing.

## Build

There are different patterns for building AI features: agents, workflows, prompt chaining, RAG, and more. I won't go deep here. The point is: **it's a creative endeavor**. What to use and when comes from experimentation.

What I will say is this: give **Eval-Driven Development (EDD)** a try.

By the time you're building, you should have clarity on what to evaluate and how to evaluate it. Implement the evaluation harness first. Then iterate on the AI system while watching the evaluation measurements. It's that simple!

Here's where I learned an expensive lesson: **bring PMs in early**.

In traditional development, PMs define a spec and review those features once most of the work is complete. For AI features, this is too late. As soon as you have a working piece of code with its evaluation, bring the PM in to start testing and get a feel for the feature.

The iteration cycle must be short. AI development is about ***understanding what to build***, which is different from the usual execution focus we might have as engineers.

> [!IMPORTANT]
> Here's the uncomfortable truth: with high confidence, **you will have to modify or scrap the feature you're building**. That's normal. **Traditional waterfall deadlines don't work here**. Set milestones around "understanding" rather than deliverables.

## Observe

With confidence in our feature, after doing the previous two steps, we deploy. But deployment isn't the end, it's a transition.

**This is when we observe whether our assumptions were true**. Did users behave as expected? Do our evaluation measurements actually predict success?

Gather new information and feed it back into the Evaluate step. Then repeat.

One thing to note: AI features can be iterated indefinitely. Each percentage point of improvement gets harder than the last. Your quality bar is what tells you when to stop.

## Mistakes I've Made (So You Don't Have To)

I made plenty of mistakes. Here are the three biggest:

1. **Building without evaluation clarity** — We delayed evaluation decisions, thinking it would be easier later. It wasn't. Define how you'll measure success before you start.
2. **Waiting too long for PM involvement** — We waited until the UI was done. Way too late. Bring them in as soon as the core AI is testable.
3. **Ignoring input diversity** — At first, we didn't understand the types of inputs we'd encounter. The evaluation dataset didn't reflect reality. Segment your dataset by input type to track progress across different use cases.

## What's Next

In Part 2, I'll dive into the practical tooling for AI evaluation—how to build datasets, design scoring functions, and create feedback loops that actually improve your features.

Thanks so much for reading! If you're building AI features with your team, I hope this gives you a useful mental model. It's a wild ride, but once you embrace the uncertainty, it gets a lot more fun.
