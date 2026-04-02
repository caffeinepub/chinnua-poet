# CHINNUA_POET — Major Feature Update

## Current State

A full poetry social platform with slides: Home, Poems, Gallery, Music, Messages/Inbox, About, Notes, Explore, Notifications, Settings, Admin, UserProfile, Community, Terms, Privacy. The app uses a warm cream/beige aesthetic. Backend supports poems, comments, replies, notes, user profiles, direct messages, WebRTC call signals, about content, moderation queue, and admin authentication.

Key files:
- `src/frontend/src/App.tsx` — main slide router, holds user state and theme
- `src/frontend/src/slides/SettingsSlide.tsx` — 14-section settings, stores in localStorage
- `src/frontend/src/slides/MessagesSlide.tsx` — private messaging + WebRTC calls
- `src/frontend/src/slides/AboutSlide.tsx` — poet bio, admin-editable
- `src/frontend/src/slides/FeedSlide.tsx` — feed posts, likes, comments
- `src/frontend/src/slides/NotificationsSlide.tsx` — notification list
- `src/frontend/src/components/SilentListenerChat.tsx` — AI assistant floating panel
- `src/frontend/src/data/ai-bots.ts` — 8 AI bot user definitions

## Requested Changes (Diff)

### Add
- SVG icon system to replace all emoji headings/subheadings site-wide
- Noto Emoji animated picker in Feed (functional — selecting emoji inserts it into post text)
- Image upload in feed posts (preview + stored as dataURL in localStorage)
- Save/bookmark feed posts to profile (stored per-user in localStorage)
- Save poems, gallery photos, music tracks to profile
- Gallery privacy enforcement: private profile users show a "Request Access" gate; once granted (localStorage), viewer can see gallery
- Public/private profile logic enforcement across the app:
  - Public: discoverable via Explore/search, open commenting, message requests from anyone
  - Private: follower approval required, hidden from Explore/search, commenting only for approved followers, DMs only from followed users
- Messages: file attachment button (accepts any file, shows filename), audio recording (MediaRecorder API), photo/video from device/camera, screenshot watermark overlay + banner "Screenshots not permitted", group chat creation (multi-user conversations in localStorage), GIF picker (Giphy-style placeholder grid of animated GIFs), sticker picker, Spotify music sharing (paste Spotify link → embedded preview card), login gate before messages interface (if not logged in, show login prompt first), username-only community join (logged-in users can enter a community room by username only, no extra password)
- Clickable notifications with full detail view modal/panel
- Admin-only Poet Note editing (remove edit icon for non-admin users)
- Admin-only toggle below Poet Note in About section
- Document upload in admin panel → parse text content → auto-populate About page fields
- Profile saved items column: saved feeds, poems, music displayed; visibility toggle ("Show saved items to others")
- 6 working themes: warm-cream, midnight, forest, ocean, rose, ink — applied as CSS custom properties on the root element (switching actually changes all colors)
- Writing modes: Free Verse (no line restrictions, open textarea) and Structured (template with stanza breaks, line counter) — usable in Notes and Feed
- AI Auto-suggest in Notes section: ghost text suggestion appears while typing
- AI Writing Suggestions in Notes + Feed: a panel shows 3 suggestions based on current text
- AI Image Generation in Notes, Poem, Gallery, Feed, Messages: a button opens a prompt → generates a placeholder gradient image with the prompt text overlaid (no external API)
- AI Audio Generation in Notes, Poem, Messages: text-to-speech using Web Speech API, respects selected voice (male/female) and playback speed, reads the current text aloud
- AI Translation: applies to whole site using LibreTranslate (already partially built, ensure it's wired to all slides)
- AI Mode, Default Voice, Playback Speed — saved to user settings and used by audio gen and chat
- 8 AI bot users with generated portrait images: Luna_Verse, SilentInk, VelvetWords, PoetryMuse, sophiam, eliverse, emilyrivers, aethersoul — with periodic simulated posts/messages in localStorage
- Admin panel AI Users tab: list all 8 bots with name, username, bio, password (changeable)
- Admin panel Users section: show username, name, email, phone, account creation date from localStorage
- Admin inbox: all user↔admin interactions panel, updated on load
- Admin auto-added to all users' following lists on account creation
- Good Morning/Good Evening/Good Night messages: admin panel Letters tab shows 3 sequential slots; messages sent to all users' inboxes in order (GM→GE→GN→repeat)
- Music section: admin upload audio file button → stores as dataURL in localStorage → appears in music player playlist
- "An Unread Chapter — Part 3" poem content added to poems-data.ts
- Voice/video call UI improvements for WebRTC (already has signaling, ensure UI is clean)

### Modify
- `SilentListenerChat.tsx`: change AI message bubble background to light pink (#FFF0F3), text to dark brown (#3D2B1F)
- `MessagesSlide.tsx`: change message area background to light pink (#FFF0F3), text to dark brown
- `CommunitySlide.tsx` (Join Community): change to light background (#FFF8EE), dark text
- `NotificationsSlide.tsx`: make each notification clickable, opening a detail modal with full content
- `AboutSlide.tsx`: Poet Note edit pencil only visible to admin; add admin-only toggle control below Poet Note; add document upload in admin panel About tab
- `App.tsx`: theme switching applies CSS variables to document root; theme changes propagate site-wide
- `SettingsSlide.tsx`: theme switcher buttons actually apply theme to document; writing mode selector functional; AI feature toggles properly enable/disable their respective features site-wide via localStorage flags
- `FeedSlide.tsx`: add emoji picker (Noto emoji grid), image upload, save button on posts
- `UserProfileSlide.tsx`: add saved items column with visibility toggle

### Remove
- Emoji characters used as section/heading icons — replaced with inline SVG icons
- Edit Poet Note ability from non-admin users

## Implementation Plan

1. Create a `src/frontend/src/utils/theme.ts` with 6 theme definitions (CSS variable maps) and a `applyTheme(name)` function
2. Create `src/frontend/src/utils/aiFeatures.ts` with helpers for: text-to-speech (AI Audio Gen), writing suggestions (rule-based), image generation (gradient placeholder), auto-suggest
3. Create `src/frontend/src/components/EmojiPicker.tsx` using a static Noto Emoji grid (common emojis with animated style)
4. Create `src/frontend/src/components/GifStickerPicker.tsx` with placeholder animated GIF grid
5. Update `src/frontend/src/components/SilentListenerChat.tsx` — light pink bubbles for AI messages
6. Update `src/frontend/src/slides/MessagesSlide.tsx` — light pink bg, file/audio/photo attachments, group chat, GIFs/stickers, Spotify sharing, screenshot watermark, login gate, username community join
7. Update `src/frontend/src/slides/FeedSlide.tsx` — emoji picker integration, image upload, save/bookmark
8. Update `src/frontend/src/slides/AboutSlide.tsx` — admin-only Poet Note edit, admin toggle, document upload support
9. Update `src/frontend/src/slides/NotificationsSlide.tsx` — clickable notifications with detail modal
10. Update `src/frontend/src/slides/SettingsSlide.tsx` — 6 working themes (call applyTheme), writing modes functional, all AI toggles saving flags used by features
11. Update `src/frontend/src/slides/AdminSlide.tsx` — AI Users tab, Users with account info, inbox, letters (GM/GE/GN), music upload, document upload for About, admin info display
12. Update `src/frontend/src/slides/UserProfileSlide.tsx` — saved items column with visibility toggle
13. Update `src/frontend/src/slides/GallerySlide.tsx` — private profile gallery access gating
14. Update `src/frontend/src/slides/NotesSlide.tsx` — AI auto-suggest, writing suggestions, audio gen, image gen, writing mode awareness
15. Update `src/frontend/src/slides/PoemsSlide.tsx` — save poem to profile, AI features on poem pages
16. Update `src/frontend/src/slides/MusicSlide.tsx` — save tracks, admin-uploaded tracks
17. Update `src/frontend/src/slides/CommunitySlide.tsx` — light background, dark text, username-only join for logged-in users
18. Update `src/frontend/src/data/ai-bots.ts` — add portrait image paths
19. Update `src/frontend/src/poems-data.ts` — add Part 3 of "An Unread Chapter"
20. Update `src/frontend/src/App.tsx` — theme application on load/change, public/private profile enforcement props
21. Replace emoji section icons with SVG throughout all slides/components
22. Validate and fix all TypeScript errors
