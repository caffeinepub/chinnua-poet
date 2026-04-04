# CHINNUA_POET — About Admin-Only Editing & Messaging Enhancements

## Current State
- `AboutSlide.tsx`: The Poet's Note edit button (pencil icon) and the About section edit button are both already gated behind `isAdmin` (checked via `localStorage.getItem('chinnua_admin_authed') === 'true'`). However, there is still inline editing directly on the About page — the goal is to ensure ZERO edit capability exists outside the Admin Panel, and that the Admin Panel is the single place for all About/bio/photo/poet-note editing.
- `MessagesSlide.tsx`: Has a `MessagesLoginGate` component that shows a sign-in form when `currentUser` is null. The current flow already gates messages behind login, but the gate only shows when `currentUser` is null as passed from App.tsx. The message background uses cream tones. No file/audio/photo/GIF/sticker/group chat/Spotify-music-sharing UI exists in the input area. User-to-user messaging exists but conversation creation requires knowing a username — there is no user discovery/search to start a new conversation.
- `CommunitySlide.tsx`: Has a "Join the Community" button that calls `onJoin()` (opens the global UserSetupModal). No embedded username-only login form exists in the community page itself.
- `AdminSlide.tsx`: Has an About tab with fields to edit bio/story/photo. Poet's Note editing exists in AboutSlide inline (gated by isAdmin). Admin panel does not currently have a dedicated Poet's Note editor field.

## Requested Changes (Diff)

### Add
- **MessagesSlide**: Attachment toolbar in the chat input area with buttons for: file attach, audio record/send, photo/video from gallery (file input), camera capture, GIF/sticker picker (basic emoji-style), Spotify music link sharing, group chat creation button
- **MessagesSlide**: Screenshot prevention CSS (`user-select: none`, `-webkit-user-drag: none`) on the chat area + existing watermark already present
- **MessagesSlide**: "New Conversation" button/input in the sidebar to start messaging any registered user by username
- **MessagesSlide**: Light pink message background for received messages (`#FFE4EC`) and slightly different for sent (`#FFF0F5`), dark text
- **MessagesSlide**: Group chat creation modal — user enters group name + selects participants from known conversations
- **CommunitySlide**: Embedded username-only login form (no password required) with light background (`#FFFFFF` / `#FFF8EE`) and dark text — this is a simplified "join" that creates a guest session by username
- **AdminSlide**: Poet's Note editor field in the About tab so admin can edit it from the admin panel

### Modify
- **AboutSlide**: Remove all inline edit UI (pencil buttons, edit forms, `aboutEditing` state, `editing` state for Poet's Note) — the page becomes purely read-only for all users. The `isAdmin` checks and edit buttons are stripped out.
- **MessagesSlide**: `MessagesLoginGate` — ensure it always shows regardless of whether the user is logged into the site. The gate should check its own local auth state independently (already does when `currentUser` is null from props — ensure App.tsx passes null to MessagesSlide always on first load so the gate is always shown first). Change the login gate subtitle for the community join login to light background with dark text.
- **CommunitySlide**: Replace the plain `onJoin()` button with an embedded lightweight username login form (light background, dark text). No password needed — user just enters username to join the community feed as a named participant.
- **MessagesSlide**: Message bubble background: received messages → `#FFE4EC` (light pink), sent messages → `rgba(212,168,83,0.2)` (existing warm gold), all text dark `#3D2B1F`.

### Remove
- **AboutSlide**: All edit-related state (`editing`, `editValue`, `aboutEditing`, `aboutFields` local editing UI, save functions triggered from AboutSlide). The page only reads and displays content — never modifies it.
- **AboutSlide**: Pencil/edit button imports and JSX for Poet's Note and About section editing inline.

## Implementation Plan

1. **AboutSlide.tsx** — Strip all edit state and UI. Keep read-only display of poetName, bio, story, poetryFragments (loaded from backend/localStorage). Remove: `editing`, `editValue`, `aboutEditing`, `aboutFields` setter UI, `saveAboutContent`, `startEdit`, `cancelEdit`, `saveNote`, pencil button JSX, `Edit2`/`Pencil` imports. Keep `isAdmin` check only if needed for any remaining admin-indicator (but no edit buttons).

2. **AdminSlide.tsx** — In the About tab, add a "Poet's Note" textarea field alongside the existing bio/story/photo fields. On save, write the note to `localStorage('chinnua_poets_note')` and the saved-at timestamp. This is the only place the Poet's Note can now be edited.

3. **MessagesSlide.tsx**:
   - Change `WARM_BG` to `#FFF0F5` (light pink), message receive bubble to `#FFE4EC`
   - Add an attachment toolbar row above/below the text input with icon buttons: 📎 file, 🎵 audio, 🖼️ photo/video, 📷 camera, 😄 GIF/sticker, 🎸 Spotify link, 👥 group
   - Add file/audio/image input refs (`<input type="file">`) triggered by their buttons
   - Add "Start New Chat" input in the sidebar: text input + button to add a username to conversations list
   - Add group chat creation modal: group name input + checkboxes for existing conversations
   - Message bubbles: received = `#FFE4EC` pink with `#3D2B1F` text; sent = existing warm gold
   - Add `user-select: none` and `-webkit-user-drag: none` CSS to message area for screenshot deterrence
   - Spotify share: opens a small inline input to paste a Spotify URL, sends it as a special message with a Spotify link preview card

4. **CommunitySlide.tsx** — Replace `onJoin()` button with an inline form: text input for username, "Join Community" submit button. On submit, create/lookup a user by that username in localStorage and set `chinnua_user`. Style with white/cream background and dark `#3D2B1F` text.

5. **App.tsx** — Ensure `MessagesSlide` always receives `currentUser={null}` on initial render (before any login), so the gate always appears first. Check if App already clears currentUser on mount — if there is a session restore that pre-fills currentUser, we need to keep the message gate independent.
