# Haven Android Port Requirements Document

## 1. Document Purpose

This document defines the product requirements for porting Haven from its current Windows desktop implementation to Android. The goal is to preserve the existing core experience and privacy model while replacing Windows-specific behavior with Android-appropriate behavior.

This requirements document is based on the current repo state as of 2026-04-17. Where the repo does not provide enough information, those gaps are called out explicitly.

## 2. Source Basis

The requirements below are derived from the current application code and documentation, primarily:

- `README.txt`
- `INSTALLATION.md`
- `PRIVACY_STATEMENT.md`
- `package.json`
- `electron/main.cjs`
- `electron/preload.cjs`
- `src/App.tsx`
- `src/context/AppContext.tsx`
- `src/lib/types.ts`
- `src/lib/storage.ts`
- `src/lib/stateMachine.ts`
- `src/lib/rotation.ts`
- `src/lib/presets.ts`
- `src/lib/categoryModel.ts`
- `src/screens/*.tsx`
- `src/components/EvidenceColumn.tsx`
- `src/components/AutostartToggle.tsx`
- `src/components/CloseToTrayToggle.tsx`
- `src/components/DataManagement.tsx`

## 3. Current Product Summary

Haven is currently a private Windows desktop app for weekly reflection. It helps a user define personal values, maintain reusable focus items across three categories, choose one focus in each category for a week, collect evidence during the week, and write a reflection at the end of the cycle.

The current app is:

- Local-first
- Accountless
- Offline during normal use
- Built with React, Vite, TypeScript, and Electron
- Persisted with local storage in the renderer plus Electron-managed local preferences

## 4. Product Goals For Android

The Android port shall:

- Preserve the core weekly reflection workflow and terminology from the current app.
- Preserve the local-first privacy model.
- Preserve the current data model closely enough that feature parity is maintained.
- Replace desktop-specific behavior with Android-native equivalents or intentional omissions.
- Deliver a usable experience on Android phones without requiring a cloud backend.

The Android port shall not, for its first parity release, require any of the following unless explicitly added later:

- User accounts
- Cloud sync
- Remote API services
- Analytics or tracking
- Collaboration or multi-user features
- Desktop tray behavior
- Desktop window controls

## 5. Primary User / Persona

The primary user is a privacy-conscious individual who wants a calm, self-guided weekly reflection habit on their personal device.

This user values:

- Private on-device journaling
- Gentle structure rather than task-management pressure
- Simple weekly ritual flows
- Reusable focus areas over time
- Minimal setup friction

## 6. Scope Definition

### 6.1 In Scope For The Android MVP

- Android app that supports the full weekly reflection flow
- Local storage of all user-entered content on the Android device
- Setup and editing of values and mission items
- Weekly selection flow across Build, Shape, and Work With
- Active-week dashboard
- Evidence capture with text and image attachment from device media
- End-of-week reflection flow
- History view for completed cycles
- Export of user data
- Clear-all-data behavior

### 6.2 Explicitly Out Of Scope For The Android MVP

- Windows tray support
- Windows autostart support
- Custom title bar / minimize / maximize / fullscreen desktop window controls
- NSIS installer behavior
- Cloud backup or sync
- Cross-device sync
- Push notifications
- In-app analytics
- Social sharing
- Import of exported JSON from other devices

Notes:

- Export exists in the current repo.
- Import is not present in the current repo.
- Push notifications are not present in the current repo.

## 7. Product Principles

The Android app shall preserve these product principles from the existing app:

- Private by default
- Human-scale weekly planning rather than productivity gamification
- Calm, guided, step-based interactions
- Clear distinction between what the user can Build, Shape, and Work With
- Reflection over performance

## 8. Functional Requirements

### FR-1. Onboarding And Setup

The Android app shall provide an onboarding/setup flow equivalent to the current `SetupScreen`.

Requirements:

- The app shall guide the user through setup in discrete steps.
- The setup flow shall introduce the app and ask the user to create at least one core value.
- The setup flow shall ask the user to maintain active items in each of the three categories:
  - Build
  - Shape
  - Work With
- The app shall prevent completion of setup until:
  - At least one core value exists
  - At least one active mission item exists in each category
- The app shall offer preset starter values and preset starter mission items comparable to the current `src/lib/presets.ts`.
- The app shall allow the user to add custom values and mission items.
- The app shall allow the user to edit and delete values and mission items during setup, subject to active-cycle locking rules described later.

### FR-2. Values Management

The Android app shall support management of core values.

Requirements:

- The user shall be able to add a core value.
- The user shall be able to edit an existing core value.
- The user shall be able to delete an existing core value.
- Each value shall persist locally with an identifier, creation timestamp, and updated timestamp, matching current data semantics.

### FR-3. Mission Item Management

The Android app shall support management of mission items across the three categories.

Requirements:

- The user shall be able to add a mission item in a specific category.
- The user shall be able to edit a mission item.
- The user shall be able to enable or disable a mission item.
- The user shall be able to delete a mission item if it is not locked by an active cycle.
- Each mission item shall store:
  - Unique identifier
  - Category
  - User-entered text
  - Active/inactive status
  - Rotation flag indicating whether it has been used in the current rotation

### FR-4. Weekly Selection Flow

The Android app shall support the same weekly cycle selection flow as the current `SelectionScreen`.

Requirements:

- Once setup is complete and no active cycle exists, the user shall be able to start a new weekly cycle.
- The app shall require the user to choose exactly one active focus in each category:
  - Build
  - Shape
  - Work With
- The app shall enforce current selection eligibility rules based on rotation logic.
- The app shall support a "choose for me" or equivalent random selection action per category.
- The app shall allow the user to enter an optional intention for each chosen item.
- The app shall validate that all three categories have valid selections before starting a cycle.
- When a cycle starts, the app shall:
  - Mark setup as completed
  - Create an active cycle record
  - Assign start date and end date
  - Save intentions
  - Initialize empty evidence lists for each category
  - Update rotation usage flags

### FR-5. Weekly State Logic

The Android app shall preserve the current application state model defined in `src/lib/stateMachine.ts`.

Supported states shall include:

- `setup`
- `ready_to_select`
- `active_week`
- `awaiting_reflection`
- `completed_cycle`

Requirements:

- The app shall derive the visible experience from current data state.
- The app shall automatically transition an active cycle to awaiting reflection when the cycle end date has passed.
- The app shall not allow a new cycle to start while another cycle is active or awaiting reflection.
- The app shall allow framework editing only when equivalent current-state rules permit it.

### FR-6. Active Week Dashboard

The Android app shall provide a dashboard equivalent in function to the current `DashboardScreen`.

Requirements:

- The dashboard shall display the current week's date range.
- The dashboard shall display the selected Build, Shape, and Work With items.
- The dashboard shall display the user's saved intention for each selected item when present.
- The dashboard shall display the user's core values when present.
- The dashboard shall display guidance or category explanations comparable to the current category detail content.
- The dashboard shall display the remaining time in the current cycle.
- The dashboard shall display a motivational message or equivalent weekly message derived from date-based logic.
- The dashboard shall provide access to evidence capture and evidence review for all three categories.

The Android version does not need to visually match the current desktop observatory theme exactly, but it shall preserve the information hierarchy and reflective tone.

### FR-7. Evidence And Journal Capture

The Android app shall support journal/evidence entry for the active cycle.

Requirements:

- The user shall be able to create an evidence entry in each category during an active cycle.
- An evidence entry may contain:
  - Text only
  - Image only
  - Text and image together
- The user shall be able to delete an evidence entry during the active cycle.
- Each evidence entry shall record:
  - Unique identifier
  - Created timestamp
  - Optional text
  - Optional image data or image reference
- The user shall be able to view evidence entries grouped by category.
- The Android app shall support attaching an image from device media using an Android-appropriate picker.

Android-specific parity note:

- The current desktop app stores images as data URLs in app storage.
- The Android implementation may store image content differently internally for performance reasons, but exported data must remain deterministic and documented.

### FR-8. End-Of-Week Reflection

The Android app shall support the reflection flow equivalent to the current `ReflectionScreen`.

Requirements:

- When a cycle has ended, the app shall present a reflection flow before allowing the next cycle to start.
- The reflection flow shall show the week's selected Build, Shape, and Work With items.
- The reflection flow shall provide reflection prompts equivalent in intent to the current app.
- The user shall be required to enter non-empty reflection text before submission.
- On submission, the app shall:
  - Remove the active cycle
  - Create a history record
  - Preserve the selected items' text at the time of completion
  - Preserve intentions
  - Preserve evidence
  - Preserve reflection text and submission timestamp

### FR-9. History

The Android app shall provide a history view equivalent in function to the current `HistoryScreen`.

Requirements:

- The user shall be able to view completed weekly cycles in reverse chronological order.
- Each history record shall display:
  - Week date range
  - Build item text
  - Shape item text
  - Work With item text
  - Reflection text
  - Reflection timestamp
- When present, each history record shall display associated evidence entries by category.
- The user shall be able to delete an individual history record.
- Deleting a history record shall remove only that record and its associated stored evidence.

### FR-10. Data Export And Data Reset

The Android app shall support user-controlled data export and clear-all-data behavior.

Requirements:

- The user shall be able to export all app data from within the app.
- The exported data shall include the same logical entities exported today:
  - Setup completion state
  - Core values
  - Mission items
  - Active cycle
  - History
- Export format shall be JSON or another documented, structured format with no loss of user content.
- The user shall be able to clear all local data after explicit confirmation.
- Clearing all data shall reset the app to an empty initial state.

Android-specific behavior:

- The current desktop app downloads a JSON file.
- The Android port shall replace this with an Android-appropriate export/share/save flow.

### FR-11. Settings

The Android app shall provide a settings area for supported preferences and data actions.

Requirements:

- The settings area shall expose:
  - Data export
  - Clear all data
- The settings area may expose additional Android-specific preferences only if they do not conflict with the current privacy model.

The following desktop settings shall not be required for Android parity:

- Close to tray
- Quit application action
- Windows launch on startup

### FR-12. About / Framework Education

The Android app shall preserve educational content explaining the Haven framework.

Requirements:

- The app shall provide an About or equivalent screen.
- The screen shall explain:
  - What Build means
  - What Shape means
  - What Work With means
  - The reflective framework inspiration
- The explanatory content may be adapted for mobile layout, but its meaning shall remain consistent with the current app.

## 9. Android Platform Requirements

### AR-1. Device Support

Assumption for MVP:

- The app shall support Android phones running a currently supported Android release.

Repo gap:

- Minimum Android SDK version: Not found in repo.
- Exact target device classes: Not found in repo.
- Tablet-specific requirements: Not found in repo.

Recommendation for scope control:

- Phone support is required.
- Tablet optimization is desirable but not required for the first parity release unless specifically added.

### AR-2. Navigation

The Android app shall use Android-appropriate navigation patterns.

Requirements:

- The app shall provide clear access to the primary sections:
  - Workflow
  - History
  - About
  - Settings
- The app shall replace desktop tab/header interaction with mobile-native navigation.
- The Android back action shall behave predictably within step flows and top-level navigation.

### AR-3. App Lifecycle

The Android app shall handle app backgrounding and process recreation safely.

Requirements:

- In-progress user-entered content shall not be lost unexpectedly during normal app lifecycle events.
- Persisted state shall be reloaded correctly after app restart.
- The app shall not require a persistent background service for core behavior.

### AR-4. Local Storage

The Android app shall store all core data locally on-device.

Requirements:

- The storage mechanism shall be suitable for structured local persistence on Android.
- Data shall survive normal app restarts and device reboots.
- Sensitive user content shall not require transmission to external services.
- The chosen storage layer shall preserve current data semantics defined in `src/lib/types.ts`.

### AR-5. Media Access

The Android app shall use Android-compatible media selection for evidence images.

Requirements:

- The user shall be able to attach an image from device media.
- Permission use shall be minimized and aligned with modern Android APIs.
- The app shall handle image size constraints and storage safely.

Repo gap:

- Camera capture is not present in the current repo.
- Therefore camera capture is not a parity requirement for the MVP.

### AR-6. Visual Design

The Android app shall adapt the current experience for smaller touch screens.

Requirements:

- The app shall remain calm, readable, and step-oriented.
- Touch targets shall be sized appropriately for mobile use.
- Text entry, list management, and evidence review shall be comfortable on a phone.
- The app shall not depend on desktop-like hover interactions.

Repo gap:

- Mobile design system and Android UI specification: Not found in repo.

## 10. Data Model Requirements

The Android implementation shall preserve the current logical data model unless there is a documented migration reason to change it.

Minimum logical entities:

- `CoreValue`
- `MissionItem`
- `EvidenceEntry`
- `ActiveCycle`
- `HistoryCycle`
- `AppData`

Required logical fields include at minimum:

- Core values:
  - `id`
  - `text`
  - `createdAt`
  - `updatedAt`
- Mission items:
  - `id`
  - `category`
  - `text`
  - `isActive`
  - `usedInCurrentRotation`
- Evidence entries:
  - `id`
  - `createdAt`
  - optional text
  - optional image
- Active cycle:
  - `id`
  - selected item ids for each category
  - intentions per category
  - `startDate`
  - `endDate`
  - status
  - evidence by category
- History cycle:
  - cycle identifiers
  - stored item text snapshots
  - intentions
  - date range
  - evidence
  - reflection text and timestamp

## 11. Privacy, Security, And Compliance Requirements

The Android port shall preserve the current privacy model described in `PRIVACY_STATEMENT.md`.

Requirements:

- The app shall not require an account.
- The app shall not send user reflection data to remote services during normal use.
- The app shall not include analytics or tracking in the parity release.
- User content shall remain stored locally unless the user explicitly exports or shares it.
- Exported content shall be initiated by the user.

Repo gap:

- Encryption-at-rest requirements: Not found in repo.
- Regulatory/compliance requirements: Not found in repo.

Unless new business requirements are introduced, the Android parity release should not invent cloud dependencies that weaken the current privacy posture.

## 12. Non-Functional Requirements

### NFR-1. Performance

- App launch shall feel responsive on target Android devices.
- Core navigation between top-level screens shall not block for noticeable periods during normal data sizes.
- Typical user interactions such as adding evidence, saving reflections, and switching sections shall complete reliably without visible hangs.

### NFR-2. Reliability

- Persisted data shall not be lost during normal use.
- App restarts shall restore previously saved state.
- Invalid or partially corrupted local data should fail safely where practical.

### NFR-3. Accessibility

- Interactive controls shall be usable with touch and screen-reader semantics.
- Text shall remain readable on typical phone screens.
- The app shall support standard Android accessibility expectations for labels, focus order, and actionable controls.

### NFR-4. Offline Operation

- Core reflection workflows shall work fully offline after install.

### NFR-5. Maintainability

- Business rules for cycle state, rotation, and validation should remain testable outside platform UI code.
- Android-specific platform code should be isolated from core reflection logic.

## 13. Migration And Compatibility Requirements

### 13.1 Behavioral Compatibility

The Android app shall preserve the current business behavior for:

- Setup completion rules
- Weekly state transitions
- Rotation eligibility
- Reflection completion behavior
- History preservation
- Local-only usage model

### 13.2 Data Compatibility

The following requirement is desirable but not mandatory for parity unless approved as scope:

- Ability to import data exported from the current desktop app

Reason:

- Export exists in the current repo.
- Import does not exist in the current repo.
- Adding import expands scope beyond strict platform port parity.

## 14. Acceptance Criteria

The Android parity release shall be considered functionally complete when all of the following are true:

1. A new user can install the Android app and complete setup.
2. The user can add at least one core value and at least one active mission item in each category.
3. The user can start a weekly cycle by selecting one Build, one Shape, and one Work With item.
4. The app enforces selection validation and rotation rules.
5. The user can add text evidence and image evidence during the active week.
6. The dashboard shows current focuses, intentions, and week context.
7. After the end date passes, the app requires a reflection before allowing the next cycle.
8. Submitting a reflection moves the completed cycle into history with evidence preserved.
9. The user can review and delete history records.
10. The user can export all data.
11. The user can clear all data and return the app to the initial empty state.
12. The app works without login, cloud sync, analytics, or a required network connection.

## 15. Open Questions And Repo Gaps

The following items are not answered by the current repo and should be resolved before implementation begins:

- Minimum Android SDK version: Not found in repo.
- Target phone/tablet support matrix: Not found in repo.
- Whether landscape mode must be supported: Not found in repo.
- Whether the Android release should support tablet-optimized layouts: Not found in repo.
- Whether data import from desktop export is required in scope: Not found in repo.
- Whether local data should be encrypted at rest on Android: Not found in repo.
- Whether app icon, branding, and observatory visual system should be kept exactly or reinterpreted for mobile: Not found in repo.
- Whether reminders/notifications should be added on Android: Not found in repo.
- Whether camera capture should be added in addition to gallery/file image picking: Not found in repo.

## 16. Recommended Delivery Framing

For implementation planning, treat this as a parity-first Android port with deliberate platform adaptations:

- Preserve core flows and data model.
- Replace desktop-only behavior with Android-native behavior.
- Keep the app local-first and accountless.
- Defer new platform features unless they are explicitly approved.
