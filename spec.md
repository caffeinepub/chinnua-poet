# CHINNUA_POET — Social Chat Features Enhancement

## Current State
This is a full poetry social platform (CHINNUA_POET) with slides for Home, Feed, Poems, Gallery, Music, Inbox, Messages, Notes, Explore, Notifications, Settings, About, Admin, and Profile. The Explore page shows trending posts and users in a grid but profile/post pages are not navigable directly from it. The Messages slide has real-time chat but needs fuller social networking features (online/offline status on dashboard, clickable user profiles, chat history loading).

## Requested Changes (Diff)

### Add
- User online/offline status tracking: store last-seen timestamp in localStorage; show green dot (online) / grey dot (offline) on user cards in Explore and Messages
- Dashboard-style user list in Messages sidebar showing all registered users with online/offline indicators — clicking a user opens their chat directly (no ID entry)
- Explore page: each user card and post card is fully clickable/navigable — clicking a user opens their full UserProfileSlide modal, clicking a post opens its full detail view
- Chat history auto-load: when opening a conversation, previous messages are loaded from backend immediately
- New message notifications: unread badge on Messages nav icon when new messages arrive while user is on another slide
- Real-time message delivery indicator (sent/delivered)
- "Start Chat" button on UserProfileSlide that navigates to Messages slide with that user pre-selected

### Modify
- ExploreSlide: user cards show online status dot; clicking user name/avatar opens profile modal; clicking post opens post detail modal with full content
- MessagesSlide: sidebar lists all users (not just conversations), shows online status, allows clicking any user to start/open chat
- UserProfileSlide: add "Send Message" button that opens MessagesSlide with that user pre-selected
- NotificationsSlide: new-message notifications are clickable and navigate to that conversation

### Remove
- Nothing removed; all existing features preserved

## Implementation Plan
1. Add online presence utility: write/read `chinnua_online_[username]` timestamp to localStorage on activity; helper `isOnline(username)` checks if timestamp < 5 min old
2. Update ExploreSlide: add OnlineDot component, wire user card clicks to open ProfileModal, wire post cards to open PostDetailModal
3. Update MessagesSlide: replace sidebar with AllUsersList that pulls all registered users + bots, shows online status, auto-selects user on click; load chat history on conversation open
4. Add unread message badge system in App.tsx nav bar
5. Add "Send Message" button to UserProfileSlide that emits a custom event / sets localStorage key to pre-select user in Messages
6. Wire notifications for new messages to navigate to Messages slide
