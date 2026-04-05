# CHINNUA_POET

## Current State
- MessagesSlide has a basic emoji picker with only 8 static emojis (💫🌸🌙✨🎭🦋📖🕊️) rendered as text characters, not animated Noto Emoji
- EmojiPicker.tsx component exists with full Noto animated emoji support and is used in FeedSlide, but NOT imported in MessagesSlide
- AboutSlide displays Poet's Note as read-only — this is correct — but has no admin-facing toggle management; the admin panel's About tab has bio/story editing but no toggle add/edit, no photo upload, no document upload that auto-fills About page
- UserProfileSlide has a SavedItemsTab that shows saved feeds/poems/music with a public/private toggle — this already exists but the display uses generic card layout, not poetic line format
- AdminSlide's DailyLettersTab only has generic Morning/Night letter buckets with a few placeholder messages. No "Evening" type, no sequential send logic, and the 80 provided poetic messages are not yet pre-loaded

## Requested Changes (Diff)

### Add
- Messages emoji section: replace 8-static-emoji picker with the full EmojiPicker component (animated Noto Emojis, all categories, search)
- About page: admin-only toggle management — admin can add/edit/delete collapsible toggles (title + content) that appear on the About page below Poet's Note; stored in localStorage as `chinnua_about_toggles`
- Admin Panel → About tab: add document upload field (parses text from .txt/.doc and fills bio/story); add photo upload for profile photo; add toggle management UI (add title+content, edit, delete, reorder)
- Admin Panel → Letters tab: add "Evening" as a third message type alongside Morning and Night; pre-load all 80 provided Good Morning (40), Good Evening (40), and Good Night (30) poetic messages into their respective buckets; add "Send to All Users" button for each type that marks the message as sent with a timestamp; add sequential auto-send logic that cycles Morning → Evening → Night → repeat, with send buttons per round and a "Start Sequence" control

### Modify
- MessagesSlide emoji button: replace the simple 8-emoji popover with `<EmojiPicker onSelect={...} onClose={...} />` (same component used in FeedSlide)
- AboutSlide: render admin-added toggles from `chinnua_about_toggles` localStorage below Poet's Note as collapsible buttons
- Admin Panel Letters tab: expand DailyLettersTab to support three types (morning/evening/night), add sequential send controls, pre-load all poems
- UserProfileSlide SavedItemsTab: improve saved items display with poetic line formatting (italic serif, soft separator lines between items, each item title displayed as a verse line)

### Remove
- Nothing removed — all changes are additive

## Implementation Plan
1. **MessagesSlide.tsx**: Import EmojiPicker component; replace the 8-emoji static popover with the full EmojiPicker component; wire `onSelect` to append emoji to text input
2. **AboutSlide.tsx**: Add useEffect to read `chinnua_about_toggles` from localStorage; render admin-added toggles below Poet's Note section as collapsible expand/collapse buttons (same style as existing toggles); keep all existing content unchanged
3. **AdminSlide.tsx** (About tab): Add photo upload field that saves to `chinnua_about_photo`; add document upload (.txt) that auto-parses content into bio field; add toggle management section (add title+content, list with edit/delete buttons, saves to `chinnua_about_toggles`)
4. **AdminSlide.tsx** (DailyLettersTab): Expand to 3 types: morning/evening/night; pre-populate with all 80 provided poems as default state; add "Send All" button per type with timestamp; add sequential send queue UI (Morning → Evening → Night cycle)
5. **UserProfileSlide.tsx** (SavedItemsTab): Update saved item card rendering to use italic serif poetic line style, soft gold border-left accent, poem-like line display
