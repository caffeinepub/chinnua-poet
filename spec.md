# CHINNUA_POET

## Current State
- AdminSlide.tsx has tabs: poems, feed, users, gallery, settings, rules, guardian, letters, replies, ai-users, music, inbox, about
- Users tab shows username + bio only (missing name, email, phone)
- Music tab (MusicManagementTab) supports adding tracks by title/artist/mood/Spotify URL — no audio file upload
- AdminInboxTab reads localStorage conversations but is read-only (no reply/compose from admin)
- No "Admin Info" display section showing admin account details
- No formal Admin User account object stored/displayed
- Admin is not automatically added to all users' following lists
- config.ts passes both `agent` and `agentOptions` to createActor, triggering console.warn — FIXED already

## Requested Changes (Diff)

### Add
- **Admin Info tab**: Display admin account info (username: CHINNUA_POET, name, password masked, email, joined date, website stats summary)
- **Admin User account object**: Save admin profile info to localStorage (`chinnua_admin_profile`) including username, display name, password (masked), email, bio, profile photo path, and website metadata
- **Users tab enhancement**: Show full user info — Username, Display Name, Email, Phone Number, Join Date, account status; load from `chinnua_users` which already stores user objects
- **Admin Inbox with full messaging**: Upgrade AdminInboxTab to allow admin to compose and send messages to any user; show full conversation threads grouped by user; reply directly from inbox; include daily refresh indicator
- **Auto-follow admin**: When any user registers or on app load, ensure CHINNUA_POET is in their following list (`chinnua_following_{username}` in localStorage)
- **Music audio upload**: In MusicManagementTab, add an audio file upload input (`<input type="file" accept="audio/*">`); store audio as base64 or blob URL in localStorage; play in music section

### Modify
- **Users tab**: Replace minimal username+bio display with full table showing Username, Name, Email, Phone, Joined Date, Delete button
- **Admin settings tab**: Add "Admin Profile" card at the top showing saved admin info with edit capability
- **MusicManagementTab**: Add audio file upload alongside the existing Spotify URL field; uploaded audio files stored as `chinnua_audio_{id}` in localStorage
- **AdminInboxTab**: Full two-way messaging — list of users on left, conversation on right, compose new message button

### Remove
- Nothing removed

## Implementation Plan
1. Add new `AdminInfoTab` component showing admin profile card with all fields, editable, saved to localStorage
2. Add `chinnua_admin_profile` localStorage key initialized with defaults on first load
3. Upgrade `Users` tab to read full user objects from `chinnua_users` and display Username, Name/DisplayName, Email, Phone, Joined columns in a table
4. Upgrade `AdminInboxTab` to full two-way inbox: left sidebar lists all users who have conversations, right panel shows thread + compose input; admin reply saved back to `chinnua_conv_{username}_CHINNUA_POET`
5. Add auto-follow logic: utility function `ensureAdminFollowed(username)` that adds CHINNUA_POET to user's following list; call on user login/register via localStorage event or at app init
6. Add audio file upload to `MusicManagementTab`: file input stores base64 audio; track object gets `audioData` field; MusicSlide reads and plays it
7. Add new tab `"admin-info"` to the tab list
8. Keep all existing tabs and functionality intact
