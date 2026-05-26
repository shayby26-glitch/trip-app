# Trip Planner – Claude Code Guidelines

## Auto-sync rule (always enforce)
Every user action that changes data — adding, editing, or deleting anything across **all tabs** (trips, itinerary, people, expenses, stays, packing, notes, journal, transport, destinations, budget) — must automatically sync to Firebase without requiring the user to press any button.

### How it works
- `save()` writes to `localStorage` immediately, then calls `_pushToCloud()` via an 800 ms debounce.
- `_pushToCloud()` uses the Firebase REST API (`DB` constant in `index.html`) so it works regardless of Firebase SDK auth state.
- In shared/guest mode it pushes only the current trip (`/trips/{id}.json`); in owner mode it pushes all trips (`/trips.json`).
- When the device reconnects after being offline, pending changes are flushed automatically.

### When adding new features
- Any new tab, modal, or action that mutates trip data **must** call `save()` at the end.
- Never use `tripsRef.set()` / `tripsRef.child().set()` directly for user-triggered saves — go through `save()` or `saveTripToFirebase()` (which now delegates to `save()`).
- Do not add manual "save" or "sync" buttons for individual actions; the auto-sync handles it.

## Deployment
- Hosted on Firebase: `https://trip-planner-c6bad.web.app`
- GitHub Actions deploys on every push to `master` (`.github/workflows/firebase-deploy.yml`)
- Database rules are open (`".read": true, ".write": true`) — do not add auth guards without also fixing anonymous auth
