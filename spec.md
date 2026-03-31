# CHINNUA_POET

## Current State
A warm-themed poetry social platform with slide-based navigation. Current nav items: Home, Feed, Poems, Gallery, Music, Messages, Explore, About, Notes, Notifications, Inbox, Profile, Settings. Messages are stored only in localStorage — other users never receive them. The site uses emojis throughout. Some nav items duplicate/overlap in purpose.

## Requested Changes (Diff)

### Add
- Backend message storage: send_message, get_messages, get_conversation, get_conversations functions so messages are real and received by other users across browsers
- Feed as a sub-section/tab within the Home page (tab: Home | Feed)
- Gallery and Music as sub-tabs within the Poems page (tabs: Poems | Gallery | Music)
- Inbox merged as a tab within the Messages page (tabs: Chat | Inbox/Letters)

### Modify
- Navigation: Remove Feed, Gallery, Music, Inbox as separate nav items. Keep: Home, Poems, Messages, About, Explore, Notes, Notifications, Profile, Settings
- All website colors: Use WARM_BG (#FFF8EE) consistently as background everywhere, WARM_TEXT (#3D2B1F) as font color, WARM_BROWN (#8B6F47) for accents
- Replace all emoji icons throughout the entire site with clean text labels or minimal SVG icons — no emoji characters anywhere
- Wire MessagesSlide to use backend message APIs instead of localStorage
- All interactive features (likes, comments, notes, messages) must actually work and persist

### Remove
- Feed as standalone nav item
- Gallery as standalone nav item  
- Music as standalone nav item
- Inbox as standalone nav item
- All emoji usage in UI labels, buttons, headers, and content areas

## Implementation Plan
1. Add Motoko types and functions for direct messages: Message type, sendMessage, getConversations, getMessages
2. Update App.tsx: remove Feed/Gallery/Music/Inbox from navItems, update slide routing
3. Update HomeSlide.tsx: add tabs for Home content | Feed (embed FeedSection)
4. Update PoemsSlide.tsx: add tabs for Poems | Gallery | Music
5. Update MessagesSlide.tsx: add Inbox tab, wire to backend message APIs
6. Apply WARM_BG + WARM_TEXT colors consistently across ALL slide components
7. Do a sweep of all components to remove emoji characters, replace with text/SVG
8. Validate, build, deploy
