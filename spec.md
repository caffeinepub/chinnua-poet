# CHINNUA_POET

## Current State
The app uses a warm beige theme (WARM_BG=#FFF8EE, WARM_PAPER=#F5ECD7, WARM_GOLD=#D4A853, WARM_MOCHA=#5C3D2E, WARM_BROWN=#8B6F47, WARM_TEXT=#3D2B1F). However:
- `AboutSlide.tsx` still uses old dark theme colors (rgba(26,20,16), #F5E6D3, rgba(200,169,106)) causing dark content on light background — effectively invisible/broken
- `FeedSlide.tsx` still uses dark theme colors (rgba(16,24,38,0.85) card backgrounds, #F5E6D3 text) — feed cards appear dark on light page
- `SettingsSlide.tsx` exists but needs complete redesign as emotional 'Your Space' with all new sections
- No 'The Silent Listener' AI chat UI exists (the PoetryAssistant component exists but is different)

## Requested Changes (Diff)

### Add
- Full 'Your Space' Settings page with sections: Profile, Privacy, Notifications, Appearance, Writing Preferences, AI Assistant (The Silent Listener), Messaging, Content Preferences, Language & Translator, Notes Settings, Help Centre, Security, Email & Notifications, Account Controls
- 'The Silent Listener' floating AI chat component: gold quill ✒️ button (bottom-left), tooltip 'The Silent Listener is here…', slide-in chat panel with suggestion chips, settings-aware behavior
- Settings page header: title 'Your Space', subtitle 'You don't need to be seen by everyone… just understood by the right ones.'
- Smooth toggle components for notification/AI/messaging settings
- AI mode selector: Soft Emotional / Deep Philosophical / Minimal
- Voice settings: Male/Female voice, Slow/Normal/Expressive speed
- Delete Account confirmation popup

### Modify
- AboutSlide.tsx: Replace ALL dark theme colors with warm theme colors (WARM_BG, WARM_PAPER, WARM_BROWN, WARM_MOCHA, WARM_GOLD, WARM_TEXT). Keep all content/logic intact.
- FeedSlide.tsx: Replace ALL dark theme colors with warm theme colors. Feed cards should use warm paper background (#F5ECD7), warm text (#3D2B1F), gold accents (#D4A853). Keep all functionality.
- SettingsSlide.tsx: Complete redesign as described, replacing current dark-themed settings

### Remove
- Dark theme color values from AboutSlide and FeedSlide

## Implementation Plan
1. Fix AboutSlide.tsx - replace all dark colors with warm theme equivalents, keep all content and logic
2. Fix FeedSlide.tsx - replace all dark colors with warm theme equivalents, keep all functionality
3. Rewrite SettingsSlide.tsx as the full 'Your Space' emotional settings page with all sections
4. Create new SilentListenerChat.tsx component (floating quill button + chat panel)
5. Add SilentListenerChat to App.tsx alongside PoetryAssistant
6. Validate build

## Warm Theme Constants (use throughout)
- BG: #FFF8EE
- Paper: #F5ECD7
- Brown: #8B6F47
- Mocha: #5C3D2E
- Gold: #D4A853
- Text: #3D2B1F
- Muted: rgba(92,61,46,0.5)
- Border: rgba(139,111,71,0.25)
- Fonts: Playfair Display (headings), Lora / Libre Baskerville (body)
