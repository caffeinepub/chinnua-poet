# CHINNUA_POET

## Current State
- UserProfileSlide exists with tabs: posts, notes, likes, messages
- Profile is only accessible by clicking usernames — NOT a dedicated nav slide
- Comments exist on feed posts but NOT on poem posts in PoemsSlide
- Profile editing supports bio, photo, and username

## Requested Changes (Diff)

### Add
- A dedicated "Profile" nav item for logged-in users
- Comments and replies on poem posts in PoemsSlide

### Modify
- App.tsx: Add Profile to nav for logged-in users; clicking it shows current user's own profile
- PoemsSlide: Add CommentThread to expanded poem view using same backend calls

### Remove
- Nothing

## Implementation Plan
1. App.tsx: Add Profile nav item for logged-in users that calls handleViewProfile(currentUser.username)
2. PoemsSlide: Import and wire CommentThread using poem.id as postId
3. Validate and deploy
