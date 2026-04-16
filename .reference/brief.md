# Contractor Brief: Tey’s Model of Individuality Web App

## Project Summary
I want a simple, local-first web app built around my personal self-improvement framework, **Tey’s Model of Individuality**.

The app should help me run a structured weekly cycle where I choose:
- **1 Build mission**
- **1 Shape mission**
- **1 Work With mission**

These weekly missions must be guided by my **Core Values**, which act as a personal code or non-negotiable set of principles.

The app is intended to be a practical personal discipline tool, not a social platform or productivity dashboard.

---

## Core Concept
The model has four parts:

### 1. Build
Things I can actively develop.

### 2. Shape
Things I can influence over time.

### 3. Work With
Things I cannot fully control but need to respond to well.

### 4. Core Values
My personal code. These values govern how I pursue any mission and should be visually treated as the layer that sits above the three weekly mission categories.

---

## What the App Needs to Do

### Initial Setup
The app should allow me to:
- enter and save my Core Values
- enter and save mission items under Build, Shape, and Work With
- edit, add, or delete those items before starting a weekly mission cycle

All data should be stored **locally on my device**.

---

### Weekly Mission Selection
Each week, I should be able to choose:
- 1 Build item
- 1 Shape item
- 1 Work With item

Once I confirm my weekly mission set:
- it becomes locked for **7 days**
- I cannot change it during that week
- the app records the start and end of the cycle

---

### Return Visit Experience
If I revisit the app during the week, it should:
- show me my current weekly mission clearly
- remind me of my Core Values
- show how much time is left in the week
- display a short encouraging or motivating message

This does not need to be AI-generated. Static or rule-based messages are fine.

---

### Weekly Reflection
After 7 days, the app should:
- stop the current cycle
- prompt me to write a reflection before I can begin the next one
- provide a text box for my progress notes
- include a few writing prompts to help me reflect

Example prompts:
- What did I actually do this week?
- What felt difficult?
- What improved?
- Did I act in line with my Core Values?
- What would I do differently next week?

The reflection should be saved locally and attached to that week’s mission record.

---

### Rotation Rule
A key rule of the system:

I **must not be able to select the same mission again** in a category until I have gone through all the other available options in that category.

Example:
If I have 5 Build items, I must cycle through all 5 before any of them become available again.

This rule should apply separately to:
- Build
- Shape
- Work With

Once all items in a category have been used, that category resets and becomes selectable again.

---

## Functional Requirements
The contractor should build the app so that it includes:

- a setup/edit screen
- a weekly mission selection screen
- an active mission dashboard
- a reflection screen
- a history screen for previous cycles and reflections

The app should enforce the weekly flow properly and avoid allowing the user to bypass the rules.

---

## Important Rules
- Weekly mission = exactly **1 Build + 1 Shape + 1 Work With**
- Weekly mission duration = exactly **7 days**
- Mission cannot be changed during the active week
- Reflection must be completed before next week begins
- Repeats are blocked until category rotation is exhausted
- Core Values must be visible as the governing logic of the system
- All data must persist locally between sessions

---

## UX / Design Direction
I want the app to feel:
- clean
- simple
- structured
- slightly motivating
- not cheesy
- easy to use quickly

The app should feel more like a personal operating system than a generic habit tracker.

The most important screen is the **active weekly mission dashboard**.

---

## Technical Preference
For MVP, I want this built as a **browser-based web app** with no backend required.

Preferred approach:
- React or Next.js is fine
- localStorage is acceptable for MVP
- IndexedDB is fine if you think it makes the data model cleaner

This is a **single-user app** for personal use, not a multi-user product.

---

## MVP Scope
### In Scope
- local data storage
- editable model setup
- weekly mission selection
- 7-day mission locking
- reflection flow
- category rotation logic
- history of missions and reflections
- simple motivational prompts

### Out of Scope
- user accounts
- cloud sync
- multi-device support
- admin tools
- social features
- external notifications
- AI coaching

---

## Deliverables Requested
Please provide:
1. a working MVP web app
2. clean, readable code
3. simple setup/run instructions
4. brief notes on how the mission rotation logic is handled
5. clear indication of where local data is stored

---

## Acceptance Criteria
The app is successful if:
- I can define Core Values and mission items
- I can choose one item from each category for the week
- the app locks that choice for 7 days
- I see the current mission when I return
- I receive simple encouragement or reminder text
- after 7 days I am required to reflect before continuing
- I cannot repeat items until all others in that category have been used
- I can review previous missions and reflections later

---

## One-Sentence Summary
Build a local-first personal growth web app that turns Tey’s Model of Individuality into a disciplined weekly mission system governed by Core Values, locked weekly commitments, mandatory reflection, and fair rotation across growth areas.
