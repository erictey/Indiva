# Requirements Document
**Project Title:** Tey’s Model of Individuality Web App  
**Document Type:** Product Requirements Document  
**Version:** 1.0

## 1. Purpose

The purpose of this web app is to help the user apply **Tey’s Model of Individuality** in a structured weekly cycle.

The app should allow the user to:
- define their personal model categories and mission options
- select a weekly mission set
- stay locked into that mission set for the week
- receive reminders, encouragement, and prompts when revisiting the app
- record weekly reflections and progress
- rotate through missions fairly so the same items cannot be repeatedly chosen until all options in a category have been used

The app is intended as a **self-improvement and discipline tool**, not just a note-taking app.

## 2. Product Vision

The app should feel like a personal system for self-development.

Each week, the user selects:
- **1 Build mission**
- **1 Shape mission**
- **1 Work With mission**

These missions must be pursued in a way that does **not compromise the user’s Core Values**.

The app should act like:
- a weekly commitment tracker
- a reflection journal
- a motivational check-in system
- a rules-based rotation engine

## 3. Scope

### In Scope
The app must:
- collect and store the user’s mission options locally
- collect and store the user’s core values locally
- allow weekly mission selection
- lock mission changes during the active week
- display the active weekly mission on app visit
- show encouraging and motivating guidance
- prompt the user for progress reflection after 7 days
- require the user to complete the current cycle before choosing the next week’s missions
- prevent mission repetition until all available items in a category have been used

### Out of Scope for MVP
The first version does not need:
- user accounts
- cloud sync
- multi-device support
- social sharing
- analytics dashboards
- push notifications outside the website
- AI-generated coaching
- advanced habit scoring
- admin features

## 4. Users

### Primary User
A single end user using the app for personal self-improvement.

### User Characteristics
The user:
- wants structure and discipline
- values reflection and progress tracking
- wants encouragement without fluff
- wants a system that protects commitment
- does not want to constantly renegotiate weekly goals

## 5. Core Concepts

### 5.1 Model Categories
The app will use three core mission categories:
- **Build**: things the user can actively develop
- **Shape**: things the user can influence over time
- **Work With**: conditions the user cannot fully control but must respond to well

### 5.2 Core Values
The user will define a set of **Core Values** that function as a personal code.

These values:
- represent principles the user is proud of
- define what the user will not compromise
- act as a filter for how missions are pursued

The app must visually position Core Values as the governing layer above weekly mission selection.

### 5.3 Weekly Mission
A weekly mission is a set of exactly:
- 1 Build item
- 1 Shape item
- 1 Work With item

This set remains active for 7 days once confirmed.

## 6. Functional Requirements

### 6.1 Initial Setup
The system must allow the user to:
- enter and save their Core Values
- enter and save mission options under Build, Shape, and Work With
- edit these lists before a weekly mission is started

The system should allow:
- adding new items
- deleting items
- rewording items
- viewing all configured items by category

### 6.2 Local Storage
The system must save all data locally on the user’s device.

This includes:
- Core Values
- mission options
- active weekly mission
- mission start date
- mission end date
- mission history
- progress reflections
- used/unavailable mission status

Preferred storage methods:
- `localStorage` for simple MVP
- `IndexedDB` if more structured persistence is needed later

### 6.3 Weekly Mission Selection
The system must allow the user to choose:
- 1 Build mission
- 1 Shape mission
- 1 Work With mission

The system must display the selected set clearly before confirmation.

The system must require explicit confirmation before the weekly cycle begins.

Once confirmed:
- the mission set becomes locked
- the start date/time is recorded
- the end date/time is calculated as 7 days later

### 6.4 Mission Locking
The system must prevent the user from changing the active weekly mission during the 7-day active period.

The user may view the mission, but not edit or replace it.

The interface should clearly communicate:
- mission is active
- how many days remain
- when reflection becomes available

### 6.5 Return Visit Experience
When the user revisits the site during an active week, the app must:
- display the active weekly mission prominently
- show the remaining time in the cycle
- display a short motivational or encouraging message
- optionally show tips relevant to consistency, effort, reflection, or values alignment

These messages can be rule-based, static, or randomly chosen from a predefined list.

### 6.6 Reflection After 7 Days
After 7 days have passed, the app must:
- unlock the reflection stage
- prompt the user to record progress before starting a new mission
- provide a text input area for freeform reflection

The app should also provide prompts such as:
- What did I actually do this week?
- What felt difficult?
- What improved?
- Where did I avoid discomfort?
- Did I act in line with my Core Values?
- What would I do differently next week?

The system must save the reflection locally.

### 6.7 Next Week Selection
After the user submits the weekly reflection, the system must:
- allow selection of a new weekly mission
- archive the previous mission set and reflection into history

The system should present the new week as a clean next-cycle workflow.

### 6.8 No Repeat Rule
The system must prevent the user from selecting the same mission item again until all other available items in that same category have been used.

This rule applies separately to:
- Build
- Shape
- Work With

Example:  
If there are 5 Build items, the user must cycle through all 5 before any Build item becomes available again.

Once all items in a category have been used:
- that category’s used-state resets
- all items in that category become available again

### 6.9 Validation of Selection Rules
The system must not allow the user to confirm a weekly mission unless:
- one item is selected from each category
- each selected item is currently eligible
- no active mission already exists
- the previous week’s reflection has been completed, if required

## 7. User Stories

- As a user, I want to define my own Core Values so the app reflects who I am.
- As a user, I want to define my own Build, Shape, and Work With options so the system matches my self-improvement model.
- As a user, I want to choose one mission from each category each week so I can focus on balanced growth.
- As a user, I want my weekly mission locked once selected so I cannot back out or keep changing it.
- As a user, I want the app to remind me of my mission when I return so I stay mentally connected to it.
- As a user, I want encouragement and useful prompts so the app feels supportive rather than dead.
- As a user, I want to reflect after 7 days so I can track real progress.
- As a user, I want the system to block repeated mission choices until all options are used so I do not hide inside my comfort zone.
- As a user, I want to review previous missions and reflections so I can see patterns over time.

## 8. Business Rules

1. A weekly cycle lasts exactly 7 days from confirmation.
2. A weekly cycle must contain exactly 3 missions:
   - 1 Build
   - 1 Shape
   - 1 Work With
3. Missions cannot be edited during an active week.
4. Reflection must be completed before a new weekly mission can begin.
5. Missions cannot repeat within a category until all other items in that category have been used.
6. Core Values do not change automatically and must be manually edited by the user.
7. All app data is stored locally unless a future version adds sync.

## 9. Data Requirements

The app should store at minimum the following data structures:

### Core Values
- `id`
- `text`
- `created_date`
- `updated_date`

### Mission Item
- `id`
- `category` (Build / Shape / Work With)
- `text`
- `is_active`
- `is_used_in_current_rotation`

### Weekly Mission
- `id`
- `build_item_id`
- `shape_item_id`
- `work_with_item_id`
- `start_datetime`
- `end_datetime`
- `status` (active / awaiting_reflection / completed)

### Weekly Reflection
- `id`
- `weekly_mission_id`
- `reflection_text`
- `submitted_datetime`

### Motivational Messages
- `id`
- `text`
- `type` (encouragement / reminder / values prompt / discipline prompt)

## 10. Interface Requirements

### 10.1 Main Screens

#### A. Setup / Edit Model
- enter Core Values
- enter Build items
- enter Shape items
- enter Work With items

#### B. Active Mission Dashboard
- current weekly mission
- countdown or days remaining
- encouraging message
- reminder of Core Values

#### C. Reflection Screen
- progress entry text box
- guided reflection prompts
- submit button

#### D. Next Week Selection Screen
- available items only
- unavailable items visually disabled or hidden
- confirm next weekly mission

#### E. History Screen
- previous weekly missions
- reflections
- completed cycles

### 10.2 UX Expectations
The app should feel:
- simple
- clean
- focused
- slightly motivating
- not cluttered
- easy to navigate quickly

The active mission should be the main visual focus.

## 11. Non-Functional Requirements

- The app must work as a simple browser-based web app.
- The app should be responsive for desktop and mobile use.
- The app should load quickly with minimal dependencies.
- The app must function without requiring a backend for MVP.
- The app must preserve data between sessions on the same browser/device.
- The app should be understandable without onboarding complexity.

## 12. Acceptance Criteria

The product will be considered successful for MVP if:

1. The user can create and store Core Values and mission options locally.
2. The user can choose exactly one mission from each category.
3. The system locks those choices for 7 days.
4. The dashboard shows the user the active weekly mission on revisit.
5. The app displays supportive text on return visits.
6. After 7 days, the app prompts the user to write a reflection.
7. The user cannot start a new week until reflection is completed.
8. Previously used mission items are blocked until all items in that category have been used.
9. Once all items in a category are exhausted, that category resets correctly.
10. The user can review past mission cycles and reflections.

## 13. Suggested MVP Flow

1. User opens app first time.
2. User enters Core Values.
3. User enters Build, Shape, and Work With mission options.
4. User selects one item from each category.
5. User confirms weekly mission.
6. For 7 days, app shows mission dashboard only.
7. After 7 days, app requests reflection.
8. User submits reflection.
9. App unlocks next week selection.
10. App prevents reuse of exhausted items until full category rotation is complete.

## 14. Future Enhancements

Possible later additions:
- optional streak tracking
- printable weekly summary
- theme customization
- export/import data
- calendar view
- browser notifications
- AI-generated coaching prompts
- tags such as social / career / health / romance
- progress scoring by consistency or confidence
- optional private password lock

## 15. Recommended Build Approach

For a simple MVP, recommended stack:
- **Frontend:** React, Next.js, or plain HTML/CSS/JS if you want it ultra-light
- **Storage:** `localStorage` first, `IndexedDB` if you want cleaner scaling
- **State model:** weekly cycle state machine with statuses:
  - `setup`
  - `ready_to_select`
  - `active_week`
  - `awaiting_reflection`
  - `completed_cycle`

This will keep the logic clean and prevent state-handling spaghetti.

## 16. One-Sentence Product Summary

A local-first self-improvement web app that turns Tey’s Model of Individuality into a disciplined weekly mission system governed by Core Values, locked commitments, reflection, and fair mission rotation.