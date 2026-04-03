# CHINNUA_POET

## Current State
- All slides use emoji characters for section headings, subheadings, and sub-subheadings (e.g. 👤 Profile Settings, 🔒 Privacy, 🔔 Notifications, etc.)
- The `SilentListenerChat.tsx` AI assistant renders AI messages with a dark background (`#FFF0F3` for user, but with dark overlay styling that makes them unreadable on dark devices); `PoetryAssistant.tsx` also renders assistant messages with `background: "#1A1410"` (nearly black) and `color: "#5C3D2E"` making them hard to read
- `backend.ts` `createActor` function uses old pattern: logs a warn and creates agent regardless

## Requested Changes (Diff)

### Add
- SVG icon components to replace all emoji characters used in headings/subheadings across all slides

### Modify
- All slide files: replace emoji strings in heading/section labels with inline minimalist SVG icons (Lucide icons already imported, use those)
- `SilentListenerChat.tsx`: AI message bubbles — change background to light pink (`#FFF0F3`) and text to dark brown (`#3D2B1F`); ensure readability
- `PoetryAssistant.tsx`: assistant message bubbles — change `background: "#1A1410"` to `#FFE8F0` (light pink) and `color` to `#3D2B1F` (dark brown)
- `backend.ts`: replace `createActor` function body with cleaner version that avoids the `console.warn` by checking `options.agent` first

### Remove
- All emoji string literals used as section/heading icons (👤 🔒 🔔 🎨 ✍️ 🤖 💬 🖼️ 🌐 ❓ 🔐 📩 🚪 etc.)

## Implementation Plan
1. In `SettingsSlide.tsx`: replace all emoji strings in `SECTIONS` array and `SectionCard` `icon` props with Lucide SVG icon components (User, Lock, Bell, Palette, PenTool, Bot, MessageCircle, Image, Globe, HelpCircle, Shield, Mail, LogOut)
2. In `TermsSlide.tsx` and `PrivacySlide.tsx`: replace `emoji` field values with SVG inline or Lucide icons
3. In `AboutSlide.tsx`, `AdminSlide.tsx`, `FeedSlide.tsx`, `PoemsSlide.tsx`, `NotesSlide.tsx`, `InboxSlide.tsx`, `MessagesSlide.tsx`, `NotificationsSlide.tsx`, `ExploreSlide.tsx`, `MusicSlide.tsx`, `GallerySlide.tsx`: replace any emoji heading text with SVG icons
4. In `SilentListenerChat.tsx`: change AI message bubble background from `#FFF0F3` / dark to `#FFE8F0` light pink, text to `#3D2B1F`
5. In `PoetryAssistant.tsx`: change assistant message background from `#1A1410` to `#FFE8F0`, color from `#5C3D2E` to `#3D2B1F`
6. In `backend.ts`: replace `createActor` function with the updated version that avoids the console.warn
