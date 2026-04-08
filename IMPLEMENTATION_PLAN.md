# Trip Planner — Implementation Plan

## Overview
This document outlines the full roadmap to transform the current prototype into a complete, polished trip planning app. Items are grouped into phases by priority and dependency.

---

## Phase 1 — Bug Fixes & Foundation ✅ DONE

### 1.1 Fix `stays` Array Not Initialized ✅
- **Problem:** Trip creation doesn't include `stays: []`, causing potential null reference
- **Fix:** Add `stays: []` to the trip object in `createTrip()`
- **File:** `index.html` → `createTrip()` function

### 1.2 Fix Floating-Point Money Precision ✅
- **Problem:** Splitting $10 among 3 people yields $3.3333..., which drifts over many expenses
- **Fix:** Round all money values to 2 decimal places using `Math.round(val * 100) / 100` at calculation points
- **File:** `index.html` → `calculateBalances()` and `simplifyDebts()`

### 1.3 Fix Time Input — Replace Freeform with Proper Time Picker ✅
- **Problem:** Activity time field accepts any string ("lunchtime", "??")
- **Fix:** Change `<input type="text">` to `<input type="time">` for activity time fields
- **File:** `index.html` → `renderItinerary()` template

### 1.4 Make Overview the Default Tab ✅
- **Problem:** People tab is active on trip open — user sees an empty list, not the trip
- **Fix:** Change `openTrip()` to activate `overview` tab as default (index 1 in tab order)
- **File:** `index.html` → `openTrip()` function

---

## Phase 2 — Edit Functionality ✅ DONE
*The single biggest UX gap. Every item is currently add/delete only.*

### 2.1 Edit Trip Details ✅
- Add "Edit" (pencil) button in the trip detail header
- Opens a modal pre-filled with: destination, start date, end date, description, currency, emoji
- Saves changes and re-renders header metadata
- **New component:** `modal-edit-trip`, `openEditTripModal()`, `saveEditTrip()`

### 2.2 Edit People ✅
- Add edit icon on each person chip → inline name edit field
- Validate uniqueness on save
- **New component:** inline edit mode on `.person-chip`

### 2.3 Edit Activities & Destinations (Itinerary) ✅
- Add edit icon next to each activity and destination row
- Clicking opens an inline form with pre-filled values
- Saves in place without changing order
- **New component:** `editActivity(id)`, `editDest(id)` functions + inline edit UI

### 2.4 Edit Expenses ✅
- Add edit icon on each expense row in the expense list
- Opens a pre-filled version of the Add Expense modal
- Updates the existing record instead of creating a new one
- **New component:** `openEditExpenseModal(id)`, `saveEditExpense()`

### 2.5 Edit Stays (Accommodation) ✅
- Add edit icon on each stay card in the Stay tab
- Opens a pre-filled version of the Add Stay modal
- **New component:** `openEditStayModal(id)`, `saveEditStay()`

### 2.6 Edit Packing Items ✅
- Add inline double-click to rename a packing item
- Allow category reassignment via a small dropdown
- **New component:** inline edit on `.pack-item`

---

## Phase 3 — Core Missing Features ✅ DONE
*High-value additions that complete the core trip planning workflow.*

### 3.1 Budget Tracker ✅
- Add a "Budget" field to the trip creation/edit modal
- In the Expenses tab, add a budget meter at the top showing:
  - Total budget set
  - Total spent so far (sum of all expenses)
  - Remaining budget
  - Color-coded progress bar (green → yellow → red as budget is consumed)
- Optional: per-category budget breakdown (Food, Transport, Hotel, etc.)
- **New field:** `trip.budget: number`
- **New UI:** budget bar + summary in Expenses tab header

### 3.2 Flight & Transport Tracker Tab
- New tab: `✈️ Transport`
- Table/card view per transport segment with fields:
  - Type (Flight / Train / Bus / Ferry / Car)
  - Route (From → To)
  - Date + Departure time + Arrival time
  - Carrier (airline, company name)
  - Booking reference / confirmation #
  - Seat/coach number
  - Terminal / Gate (for flights)
  - Notes
- Add Transport button opens modal
- Transport events also appear in the Overview tab timeline column
- **New data:** `trip.transport: TransportSegment[]`

### 3.3 Packing List Templates ✅
- Add "Use Template" button in the Packing tab
- Dropdown or modal with pre-built templates:
  - 🏖 Beach Vacation (sunscreen, swimsuit, flip flops...)
  - 🏙 City Break (comfortable shoes, camera, travel adapter...)
  - ❄️ Winter Trip (warm jacket, gloves, thermal layers...)
  - 💼 Business Travel (laptop, charger, dress shoes...)
  - 🥾 Adventure / Hiking (hiking boots, first aid, water bottle...)
- User can select a template → items are added to existing packing list (no duplicates)
- **New UI:** template picker modal with checkboxes per item

### 3.4 Undo on Delete ✅
- When any item is deleted (expense, activity, destination, packing item, stay, person), show a toast with an "Undo" button for 5 seconds
- Clicking Undo restores the item to its original position
- After 5 seconds, deletion is committed
- **Implementation:** keep a `lastDeleted` state object, cancel deletion commit on undo

### 3.5 Overlap Validation for Stays
- Before saving a new stay, check if any existing stay overlaps with the new check-in/check-out range
- If overlap detected: show a warning (not a hard block — let user override)
- **New logic:** `checkStayOverlap(checkin, checkout, excludeId)` in `submitStay()`

---

## Phase 4 — Trip Management Improvements ✅ DONE

### 4.1 Trip Duplication ✅
- Add "Duplicate" button on each trip card (home page) and on the detail page
- Creates a new trip with the same: itinerary structure, packing list, stays template (dates shifted by same duration)
- Destination and dates are reset (user fills in new ones in a modal)
- **New function:** `duplicateTrip(id)`

### 4.2 Trip Archiving ✅
- Add "Archive" button alongside Delete in the trip detail header
- Archived trips are hidden from the main dashboard but accessible via "Show Archived" toggle
- Prevents the home screen from becoming cluttered with past trips
- **New field:** `trip.archived: boolean`
- **New UI:** archive filter toggle on home dashboard

### 4.3 Export / Print Trip Overview ✅
- Add an "Export" button in the trip detail header
- Options:
  - **Print Overview** — opens browser print dialog with a print-optimized stylesheet (white background, all tabs visible)
  - **Copy Summary** — copies a plain-text trip summary to clipboard
- **New CSS:** `@media print` stylesheet hiding nav, tabs, buttons; showing all sections stacked vertically

### 4.4 Trip Search & Filter (Home) ✅
- Add a search bar above the trip grid on the home page
- Filters trips by destination name as user types
- Status filter buttons: All | Upcoming | Ongoing | Past
- **New UI:** search input + filter pills above trips grid

---

## Phase 5 — Polish & UX Improvements (Partial ✅)

### 5.1 Onboarding / First-Run Experience
- When the app is opened for the first time (no trips in localStorage):
  - Show a welcome hero section with app description and key features
  - Large centered "Plan Your First Trip" button
  - 3 icon + text feature highlights (Itinerary, Expenses, Packing)
- **New UI:** `.welcome-hero` component shown only when `trips.length === 0`

### 5.2 Richer Trip Cards (Home)
- Replace solid dark banner colors with subtle gradient patterns or color schemes per emoji type
- Show a small people avatars row on each card
- Show packing progress (e.g., "12/30 packed")
- Show trip countdown ("In 14 days" / "Day 3 of 7" / "2 months ago")

### 5.3 Mobile Layout Overhaul
- Add `@media (max-width: 768px)` breakpoints
- Tabs become a horizontally scrollable row with scroll indicator arrows
- Stat cards collapse to 2×2 grid on mobile
- Detail header stacks vertically (emoji + title on top, actions below)
- Modals use full-screen bottom-sheet style on mobile
- Touch-friendly minimum tap targets (44px minimum)

### 5.4 Page Transition Animations
- Fade + slight slide when transitioning Home ↔ Detail
- Tab content fade-in on switch (replace instant swap with 150ms opacity transition)
- Card entrance animation on home page (staggered fade-in for trip cards)

### 5.5 Light Mode / Theme Toggle ✅
- Add a sun/moon icon button in the navbar
- Toggle between dark (current) and light theme
- Store preference in localStorage
- Light theme: white surfaces, dark text, same accent colors
- **New CSS:** `.light-mode` class overriding CSS variables on `:root`

### 5.6 Favicon ✅ (PWA manifest — pending)
- Add `<link rel="icon">` with the ✈️ emoji as SVG favicon
- Add `manifest.json` for PWA installability (Add to Home Screen support)
- Add `<meta theme-color>` for mobile browser chrome color

---

## Phase 6 — Advanced Features (Nice to Have)

### 6.1 Day-by-Day Photo / Link Attachments
- Each itinerary day can have attached URLs (Google Maps links, booking pages, restaurant links)
- Stored as `{url, label}` pairs per day
- Rendered as clickable link chips in both the Itinerary tab and the Overview table
- **New data:** `destinations[].links[]` and `itinerary[].links[]`

### 6.2 Currency Converter Helper
- In the Expenses tab, add a small "Converter" widget
- Enter an amount in local currency → see conversion in trip currency (and vice versa)
- Uses a manual exchange rate input (no API dependency)
- **New UI:** collapsible converter panel in Expenses tab

### 6.3 Collaborator Mode (Simulated)
- Export trip data as a JSON file
- Import a trip JSON file shared by someone else
- "Merge" mode: combine two copies of the same trip (resolve expense conflicts by timestamp)
- **New functions:** `exportTripJSON(id)`, `importTripJSON(file)`

### 6.4 Visual Timeline View
- Add a "Timeline" view toggle on the Overview tab
- Horizontal swimlane view showing: flights, hotel check-ins, activities, meals across the days
- Blocks sized proportionally to duration
- Color-coded by category

### 6.5 Weather Integration
- On the Overview tab, show a weather icon per day
- Use a free weather API (e.g., Open-Meteo, no key required) based on the destination city
- For future dates: show forecast. For past dates: show historical averages.
- Graceful fallback if API is unavailable

---

## Data Model Changes Summary

| Field | Current | Change |
|-------|---------|--------|
| `trip.stays` | Missing from init | Add `stays: []` to `createTrip()` |
| `trip.budget` | Missing | Add `budget: 0` (Phase 3.1) |
| `trip.transport` | Missing | Add `transport: []` (Phase 3.2) |
| `trip.archived` | Missing | Add `archived: false` (Phase 4.2) |
| `activity.time` | Freeform string | Validate as HH:MM (Phase 1.3) |
| `expense.category` | Missing | Add `category` for budget breakdown (Phase 3.1) |

---

## Component Inventory — New Modals & UI Needed

| Component ID | Purpose | Phase |
|-------------|---------|-------|
| `modal-edit-trip` | Edit trip details | 2.1 |
| `modal-edit-expense` | Edit existing expense | 2.4 |
| `modal-edit-stay` | Edit existing accommodation | 2.5 |
| `modal-transport` | Add/edit transport segment | 3.2 |
| `modal-pack-template` | Choose packing template | 3.3 |
| `modal-duplicate-trip` | Set new dates when duplicating | 4.1 |
| `.welcome-hero` | First-run onboarding | 5.1 |
| `.budget-meter` | Budget progress bar in Expenses | 3.1 |
| `tab-transport` | Transport tracker tab | 3.2 |
| `.undo-toast` | Delete undo notification | 3.4 |
| `.theme-toggle` | Light/dark mode button | 5.5 |
| `.search-bar` | Home page trip search | 4.4 |

---

## Suggested Implementation Order

```
Phase 1 (Bug Fixes)     → ~1 session,  low risk
Phase 2 (Edit)          → ~2 sessions, medium complexity
Phase 3 (Core Missing)  → ~2 sessions, high value
Phase 4 (Trip Mgmt)     → ~1 session,  medium value
Phase 5 (Polish)        → ~2 sessions, high impact on feel
Phase 6 (Advanced)      → ongoing,     optional
```

**Total to reach "production ready": Phases 1–5**

---

*Generated: 2026-04-06*
