# CHINNUA_POET — Version 44

## Current State
A large slide-based poetry social platform with 16 slides (AboutSlide, FeedSlide, PoemsSlide, GallerySlide, MusicSlide, MessagesSlide, NotesSlide, InboxSlide, AdminSlide, SettingsSlide, UserProfileSlide, TermsSlide, PrivacySlide, HomeSlide, ContactSlide, CommunitySlide). Backend has `getAboutContent()` and `saveAboutContent()` (camelCase). Warm cream/beige design theme.

## Requested Changes (Diff)

### Add
- Hash-based URL routing so each slide is accessible via URL hash (e.g., `#feed`, `#about`, `#poems`) and persists on refresh
- Message privacy controls in settings: who can message (everyone/followers/no one), message requests inbox, user blocking system
- Structured feed post creation box with topic input, textarea, photo/emoji buttons, who-can-reply dropdown, review-replies toggle
- Explore page slide with trending posts in grid layout and search bar for users/poems
- Notifications slide tracking likes, comments, follows, messages
- Search functionality across users and poems
- Message Requests inbox section (separate from main messages)
- Blocking system: blocked users cannot message, interact with posts, or view profiles

### Modify
- **AboutSlide.tsx (CRITICAL FIX)**: Replace all hardcoded bio/story text in the display section with `{aboutFields.bio}` and `{aboutFields.story}` state values. Remove `(actor as any)` cast and use properly-typed `actor.getAboutContent()`. Add safe useEffect guard: `if (!actor || typeof actor.getAboutContent !== 'function') return;`. Add `.catch(() => {})`. Ensure fallback default values always populate fields so the section never appears blank.
- FeedSlide: Redesign post creation box with topic input, "What's new?" textarea, emoji/photo buttons, who-can-reply dropdown, review-replies toggle. Integrate Silent Guardian moderation check before posting.
- MessagesSlide: Add message requests tab, respect privacy settings from localStorage, add block/unblock option
- SettingsSlide: Add message privacy section (who can message me), notes privacy defaults, add block list management
- All slides: Fix any low-contrast text (replace `rgba(x,x,x,0.3)` colors with at minimum 0.6+ opacity on cream background)
- App.tsx: Add hash-based URL routing (`window.location.hash` read on mount, update on nav click)
- All feed/comment interactions: Check block list before rendering user content

### Remove
- Hardcoded bio/story text that bypasses `aboutFields` state in AboutSlide display section
- `(actor as any)` unsafe casts for `getAboutContent` and `saveAboutContent`

## Implementation Plan
1. Fix AboutSlide.tsx: make display use `aboutFields` state, safe actor call, proper fallbacks
2. Add hash routing in App.tsx (read hash on mount, update hash on slide change)
3. Add Explore slide (new file ExploreSlide.tsx) with search + trending grid
4. Add Notifications slide (new file NotificationsSlide.tsx)
5. Improve MessagesSlide: add message requests tab + block system
6. Improve FeedSlide post creation box
7. Improve SettingsSlide: add privacy/messaging/block controls
8. Fix low-contrast text across all slides
9. Store notifications, blocks, message requests in localStorage
10. Wire new slides into App.tsx nav
