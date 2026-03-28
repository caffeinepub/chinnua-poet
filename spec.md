# CHINNUA_POET

## Current State
A dark, minimalist poetry platform with slide-based navigation, vertical feed, user system (email/phone + password login), admin panel, notes, gallery, music player, AI poetry assistant, and translation system. Users can post in the feed, have basic profiles accessible via modal, and manage notes. Comments, reactions, and a full profile editing page do not exist.

## Requested Changes (Diff)

### Add
- Full user profile page (own profile: editable; other profiles: view-only public info)
- Profile info editing: username, bio, profile photo
- User's own poems tab: view, edit, delete poems they posted
- Poet Notes tab: manage their notes (private/public) from profile
- Likes & Reactions tab: shows all posts/poems the user has liked
- Comments system: users can comment on feed posts AND on CHINNUA_POET's poem posts
- Nested replies on comments
- Messages shortcut: link to DM inbox from profile page
- Profile accessible by clicking own avatar/username (edit mode) or another user's name (view mode)

### Modify
- Feed posts: add comment button and comment thread below each post
- Poem posts: add comment section when poem is expanded
- Navigation/header: clicking logged-in user avatar opens own profile page
- User profile modals (currently basic): replace with full profile page/slide

### Remove
- Nothing removed

## Implementation Plan
1. Create UserProfilePage component with tabs: Posts, Notes, Likes, and (for own profile) Edit Profile
2. Profile editing form: username, bio, profile photo upload
3. Posts tab: list user's own feed posts with edit/delete options (own profile only)
4. Notes tab: pull from existing notes system, allow manage from profile
5. Likes tab: show all posts/poems the user has liked
6. Comments component: comment input + comment list + nested reply thread per post
7. Wire comment button on feed posts and poem expansion view
8. Messages shortcut button on profile linking to Messages slide
9. Backend: add comment/reply data structures and API calls (stored in backend state)
10. Preserve all existing theme, fonts, and layout — profile page matches dark gold aesthetic
