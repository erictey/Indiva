# Architecture Document
**Project Title:** Tey's Model of Individuality Web App  
**Document Type:** Technical Architecture (Rough Draft)  
**Version:** 1.0

---

## 1. Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React + Vite | Lighter than Next.js for a no-backend SPA. Fast dev, fast builds. No SSR needed. |
| Language | TypeScript | Type safety for state machine, rotation logic, and data model. |
| Styling | Tailwind CSS | Utility-first. Clean, structured output. Matches UX direction. |
| Storage | localStorage | Sufficient for this data volume. JSON serialization. Easy to inspect and debug. |
| State | React Context + useReducer | State machine pattern maps directly to cycle states. No Redux overhead. |
| IDs | crypto.randomUUID() | Built-in browser API. No dependencies. |
| Routing | State-driven (no URL router) | State machine determines which screen renders. No need for react-router. |

---

## 2. App State Machine

Core engine. Five states, strict transitions.

```
┌─────────┐     ┌──────────────────┐     ┌──────────────┐
│  SETUP  │────>│  READY_TO_SELECT │────>│  ACTIVE_WEEK │
└─────────┘     └──────────────────┘     └──────────────┘
                        ^                        │
                        │                        │ (7 days pass)
                        │                        v
                ┌───────────────┐     ┌─────────────────────┐
                │COMPLETED_CYCLE│<────│ AWAITING_REFLECTION  │
                └───────────────┘     └─────────────────────┘
                        │
                        └──> back to READY_TO_SELECT
```

### State Definitions

| State | Description | Allowed Actions |
|-------|-------------|-----------------|
| **SETUP** | First run. No values or missions defined. | Enter Core Values, add mission items. Transition when ≥1 value and ≥1 item per category exist. |
| **READY_TO_SELECT** | Pick 1 Build + 1 Shape + 1 Work With from eligible items. | Select missions, confirm selection. Edit values/items. |
| **ACTIVE_WEEK** | Locked for 7 days. Dashboard only. | View mission, view countdown, view values. No edits to mission or model. |
| **AWAITING_REFLECTION** | 7 days elapsed. Reflection required. | Write and submit reflection. View mission. |
| **COMPLETED_CYCLE** | Reflection saved. Auto-archives and transitions. | Automatic transition to READY_TO_SELECT. |

### Transition Guards

- SETUP → READY_TO_SELECT: at least 1 Core Value AND at least 1 item in each category (Build, Shape, Work With)
- READY_TO_SELECT → ACTIVE_WEEK: exactly 1 eligible item selected per category, explicit user confirmation
- ACTIVE_WEEK → AWAITING_REFLECTION: current datetime ≥ cycle end datetime
- AWAITING_REFLECTION → COMPLETED_CYCLE: reflection text submitted (non-empty)
- COMPLETED_CYCLE → READY_TO_SELECT: automatic after archiving cycle to history and updating rotation state

---

## 3. File Structure

```
src/
├── App.tsx                    # State machine orchestrator, screen routing
├── main.tsx                   # Entry point
│
├── context/
│   └── AppContext.tsx          # Global state provider: values, missions, cycle, history
│
├── hooks/
│   ├── useLocalStorage.ts     # Persist/hydrate state to localStorage
│   ├── useCycleTimer.ts       # Countdown logic, expiry detection
│   └── useRotation.ts         # Category rotation eligibility engine
│
├── lib/
│   ├── stateMachine.ts        # State transitions + guard functions
│   ├── rotation.ts            # Rotation logic: track used items, reset on exhaust
│   ├── storage.ts             # localStorage read/write/export/clear helpers
│   ├── messages.ts            # Static motivational message pool (~30 messages)
│   └── types.ts               # All TypeScript interfaces and type definitions
│
├── screens/
│   ├── SetupScreen.tsx        # Enter Core Values + mission items per category
│   ├── SelectionScreen.tsx    # Pick weekly missions (eligible items only)
│   ├── DashboardScreen.tsx    # Active mission view (primary screen)
│   ├── ReflectionScreen.tsx   # Post-week reflection prompts + text entry
│   └── HistoryScreen.tsx      # Past cycles + reflections + delete per record
│
├── components/
│   ├── CoreValuesDisplay.tsx  # Values banner — persistent governing layer
│   ├── MissionCard.tsx        # Single mission item display
│   ├── CountdownTimer.tsx     # Days/hours remaining in active week
│   ├── MotivationalMessage.tsx# Random message from pool
│   ├── CategoryList.tsx       # Editable list for Build/Shape/WorkWith
│   ├── ReflectionPrompts.tsx  # Guided writing prompts
│   └── DataManagement.tsx     # Export JSON, clear all data, delete records
│
└── styles/
    └── index.css              # Tailwind base + custom design tokens
```

---

## 4. Data Model (localStorage)

Four keys, each holding serialized JSON.

### 4.1 `tim_core_values`

```ts
type CoreValue = {
  id: string
  text: string
  createdAt: string   // ISO 8601
  updatedAt: string   // ISO 8601
}
```

### 4.2 `tim_mission_items`

```ts
type MissionItem = {
  id: string
  category: 'build' | 'shape' | 'workWith'
  text: string
  isActive: boolean
  usedInCurrentRotation: boolean
}
```

### 4.3 `tim_active_cycle`

```ts
type ActiveCycle = {
  id: string
  buildItemId: string
  shapeItemId: string
  workWithItemId: string
  startDate: string   // ISO 8601
  endDate: string     // ISO 8601
  status: 'active' | 'awaiting_reflection' | 'completed'
  reflection?: {
    text: string
    submittedAt: string  // ISO 8601
  }
} | null
```

### 4.4 `tim_history`

```ts
type HistoryCycle = {
  id: string
  buildItemId: string
  shapeItemId: string
  workWithItemId: string
  buildText: string       // Snapshot at time of cycle
  shapeText: string       // Snapshot at time of cycle
  workWithText: string    // Snapshot at time of cycle
  startDate: string
  endDate: string
  reflection: {
    text: string
    submittedAt: string
  }
}
```

Text snapshots in history records ensure editing or deleting mission items does not corrupt past records.

---

## 5. Rotation Engine

### Algorithm

```
For each category (build, shape, workWith):
  1. Get all items where category matches AND isActive === true
  2. Filter to items where usedInCurrentRotation === false
  3. If filtered list is empty:
     → Reset all items in category: set usedInCurrentRotation = false
     → Return full list
  4. Return filtered list as eligible options
```

### On Mission Confirm

```
Mark each selected item's usedInCurrentRotation = true
```

### Properties

- Separate rotation tracking per category
- Deterministic: no randomness, no edge cases
- Full category reset only when all items exhausted
- Adding a new item mid-rotation: it enters as `usedInCurrentRotation = false`, so it's immediately eligible
- Deleting an item mid-rotation: removed from pool. If that was the last unused item, category resets on next selection

---

## 6. Screen Routing

State machine drives rendering. No URL router.

| App State | Screen Rendered |
|-----------|----------------|
| No values or items defined | SetupScreen |
| READY_TO_SELECT | SelectionScreen |
| ACTIVE_WEEK | DashboardScreen |
| AWAITING_REFLECTION | ReflectionScreen |
| COMPLETED_CYCLE | Auto-transition → READY_TO_SELECT |

### Always Accessible

- **HistoryScreen** — accessible from navigation at any state
- **SetupScreen (edit mode)** — accessible when NOT in ACTIVE_WEEK or AWAITING_REFLECTION

### Edit Guards

- During ACTIVE_WEEK: editing Core Values and mission items is disabled
- During AWAITING_REFLECTION: editing disabled until reflection submitted
- Rationale: prevents user from changing the system mid-commitment

---

## 7. Data Management

### 7.1 Delete Individual History Records

- Each record on HistoryScreen has a delete button
- Confirmation dialog before deletion
- Removes single entry from `tim_history`

### 7.2 Export Data as JSON

- Settings/data area provides "Export All Data" button
- Downloads a single JSON file containing all four localStorage keys
- Filename format: `tim-export-YYYY-MM-DD.json`
- User can back up before any destructive action

### 7.3 Clear All Data

- Settings area provides "Clear All Data" button
- Two-step confirmation: "Are you sure?" → "This will delete everything. Type RESET to confirm."
- Wipes all four localStorage keys
- Returns app to SETUP state

### 7.4 Storage Budget

- Each cycle record ≈ 500 bytes
- 52 cycles/year ≈ 26KB/year
- localStorage limit ≈ 5-10MB depending on browser
- Practical limit: decades of use before any concern
- Export + selective delete provides user control regardless

---

## 8. UX Architecture

### Core Values as Governing Layer

Core Values displayed as persistent banner/header on DashboardScreen and SelectionScreen. Visually positioned above mission content to communicate that values govern how missions are pursued.

### Dashboard as Primary Screen

DashboardScreen is the hero. Layout priorities:
1. Core Values banner (top)
2. Active mission cards — Build, Shape, Work With (center, large)
3. Countdown timer — days and hours remaining
4. Motivational message — randomly selected from pool
5. Quick link to history

### Motivational Messages

- Pool of ~30 static messages
- Categorized: encouragement, discipline, values-alignment, consistency
- One message shown per visit, rotated daily or randomly on load
- No AI generation. Rule-based selection.

### Responsive Design

- Mobile-first layout
- Dashboard optimized for quick phone check-ins
- Touch-friendly selection on SelectionScreen
- Readable reflection entry on mobile

---

## 9. Validation Rules

### Mission Selection

The system must not allow confirmation unless:
- Exactly 1 item selected from Build
- Exactly 1 item selected from Shape
- Exactly 1 item selected from Work With
- All selected items are currently eligible (not used in current rotation, unless category reset)
- No active cycle exists
- Previous reflection completed (if applicable)

### Item Deletion Guards

- Cannot delete an item that is part of the active cycle
- Can delete items that are in history (history holds text snapshots)
- Deleting last item in a category while in READY_TO_SELECT: block selection until new item added

### Core Value Editing

- Free to edit/add/delete when no active cycle
- Blocked during ACTIVE_WEEK and AWAITING_REFLECTION

---

## 10. Future-Proofing Notes

Architecture decisions made with potential future enhancements in mind, without building for them now:

- **localStorage → IndexedDB migration**: storage.ts abstraction layer means swapping storage backend requires changes in one file only
- **Export format**: JSON export is structured enough to support future import functionality
- **State machine**: adding new states (e.g., `paused`, `skipped`) requires adding transitions, not rewriting logic
- **Message pool**: stored in dedicated module, easy to expand or make configurable later
- **Component structure**: screens and components separated, making it straightforward to add theming or new screens

---

## 11. Design Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| React + Vite over Next.js | Vite | No backend, no SSR needed. Simpler, faster. |
| localStorage over IndexedDB | localStorage | Data volume is tiny. Easier to debug. Migrate later if needed. |
| No URL router | State-driven rendering | State machine already determines what to show. Router adds complexity without value. |
| Text snapshots in history | Denormalized | Editing/deleting items must not corrupt historical records. |
| Block edits during active week | Strict | Matches the discipline philosophy of the model. No mid-week renegotiation. |
| Static motivational messages | No AI | MVP scope. Rule-based is reliable and fast. |
| Two-step confirm for data clear | Strict | Irreversible action. Must be deliberate. |
