# CHINNUA_POET

## Current State
- Hero image in HomeSlide and AboutSlide both reference `/assets/generated/chinnua-profile-hero.dim_600x800.png` — already replaced with the new uploaded image.
- MessagesSlide has: basic text messaging, voice/video calls (WebRTC), conversation sidebar, screenshot watermark warning, and a `!currentUser` gate that shows Join/Sign In buttons.
- CommunitySlide has a dark-theme banner and a `!currentUser` gate that calls `onJoin`.
- App.tsx loads `chinnua_user` from localStorage on mount and restores `currentUser` automatically — meaning the app skips the login screen on page reload.
- LoginGate requires email/phone + password for login.

## Requested Changes (Diff)

### Add
- **MessagesSlide — file/media attach toolbar**: Paperclip (file), mic (audio record), camera/gallery (photo/video), GIF/sticker picker, Spotify music link sender buttons above or beside the text input.
- **MessagesSlide — group chat**: New Conversation modal with option to add multiple participants (username search), creating a named group.
- **MessagesSlide — screenshot prevention banner**: Already has a warning; ensure it is always visible at the top of the chat area.
- **MessagesSlide — Spotify music sharing**: Button to paste a Spotify URL which renders a Spotify link card in the chat. Recipients can tap to open + save to their music.
- **MessagesSlide — user-to-user messaging**: Add a "New Message" button that lets users search all registered usernames (from `chinnua_users` localStorage) and start a conversation.
- **CommunitySlide — username-only login**: When `!currentUser` and user clicks Join, show an inline light-themed form that accepts just a username (no password), looks up `chinnua_users` localStorage, and logs in if the username exists; or creates a guest account.

### Modify
- **App.tsx login gate**: On mount, do NOT auto-restore `currentUser` from localStorage unless user explicitly interacts. Instead, show the initial "Join / Sign In" state (no currentUser) so the login prompt is always the first screen. The stored user should only be loaded after the user clicks Sign In.
- **MessagesSlide — background**: Change message bubbles and chat background to light pink (`#FFF0F3`) with dark text (`#3D2B1F`). Own messages: `#FFD6E0` background. Other messages: `#FFF0F3`.
- **CommunitySlide — join page**: Change the join/login section background from dark to light (`#FFF8EE` background, `#3D2B1F` text, `rgba(200,169,106,0.3)` border) so it is fully readable.
- **MessagesSlide — message input area**: Add attachment icon buttons (file, audio, image/camera, GIF, music/Spotify) beside the text input.

### Remove
- Nothing removed.

## Implementation Plan
1. **App.tsx**: Remove the `useEffect` that auto-loads `chinnua_user` from localStorage. Add a separate "restore session" button or keep `currentUser` null on load. Users must click Sign In to reload their session.
2. **MessagesSlide**: 
   - Change `WARM_BG` for chat area to `#FFF0F3`, own bubble bg to `#FFD6E0`, other bubble bg to `#FFF0F3` with slight border.
   - Add attachment toolbar row above text input with icons: Paperclip (file), Mic (record audio), Image (gallery/camera), GIF (sticker), Music (Spotify link).
   - Wire each button to hidden `<input type="file">` elements; on select, add a message with `type: 'file'|'audio'|'image'|'gif'` and render preview in chat.
   - Add "New Message" button in conversation sidebar that opens a modal to type a username and start conversation.
   - Add "Create Group" button in sidebar that opens a modal, lets user add multiple usernames, choose a group name, creates a group conversation key.
   - Ensure screenshot prevention banner is always shown at top of chat.
   - Spotify link: when user pastes a Spotify URL in text input, detect it and render as a music card with play icon and "Save to Music" button.
3. **CommunitySlide**:
   - Change the `!currentUser` join section to a light-themed card (`#FFF8EE`, dark text).
   - Add an inline username-only login form: input field + "Enter" button. On submit, check `chinnua_users` localStorage for matching username; if found, log in; if not, create a new guest user with that username and no password.
