---
name: Aanavandi Transit Assist
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#414944'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#717973'
  outline-variant: '#c0c9c2'
  surface-tint: '#3a6752'
  primary: '#002517'
  on-primary: '#ffffff'
  primary-container: '#0b3c2a'
  on-primary-container: '#78a78f'
  inverse-primary: '#a1d1b8'
  secondary: '#bb0112'
  on-secondary: '#ffffff'
  secondary-container: '#e02928'
  on-secondary-container: '#fffbff'
  tertiary: '#301b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c2e00'
  on-tertiary-container: '#db8c00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceed3'
  primary-fixed-dim: '#a1d1b8'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#214f3c'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

### Brand Personality & Emotional Voice
This design system captures the cultural warmth, democratic accessibility, and vibrant visual legacy of Kerala public transport. Rooted in the visual folklore of the iconic yellow-and-red KSRTC "Aanavandi" bus moving against emerald paddy fields and backwaters, the identity evokes reassuring familiarity, safety, and empowerment. It operates as an intuitive travel partner rather than a cold utility tool. The companion persona "ANNA" brings an inviting, patient, and assistive human dimension that demystifies public transit across generations.

### Target Audience & Inclusivity
The user base spans across wide linguistic and digital literacy levels: daily commuters, school-going children navigating local transport independently, elders who require high-legibility typographic scale and voice-assisted workflows, and interstate tourists or non-Malayalam speakers. The system guarantees multi-script parity across Malayalam, English, Hindi, Tamil, and Kannada.

### Design Movement: Tactile Transit-Modern
The design fuses modern accessibility-first utility with tactile, culturally rooted warmth. It leverages:
- Deep forest greens and warm bus-red accents grounded by soft Kerala-cream base canvas tones.
- High-contrast, tactile pill buttons and cards with organic, green-tinted ambient elevation that feels clean yet grounded in nature.
- Large physical touch targets (minimum 48px to 56px height) suited for movement, bumps on a transit ride, and varied manual dexterities.
- Pictographic clarity paired with native Indic script hierarchy to enable low-cognitive-load navigation.

## Colors

### Palette Philosophy
The palette draws direct inspiration from the Kerala landscape and public transport liveries:
- **Primary (`#0B3C2A` - Aanavandi Forest Green):** Represents confidence, state transit heritage, and environmental vitality. Used for navigation bars, core headers, critical route paths, and solid active container surfaces.
- **Secondary (`#DC2626` - Transit Crimson):** Sourced directly from the iconic bus skirt and front bumper. Used for high-priority calls-to-action (e.g., "Speak", "Scan Board", live action triggers) and urgent transit status tags.
- **Tertiary (`#F59E0B` - Kerala Ochre Gold):** Evokes the classic vehicle livery stripes and twilight coastal sunlight. Used for contextual focus states, warning indicators, bus route numbers, badges, and the cheerful visual aura of the ANNA assistant.
- **Neutral Canvas (`#FDFBF7` - Warm Cream) & Surface Light (`#F5F1E9` - Off-White Oat):** Eliminates harsh sterile white eye strain under harsh outdoor sunlight while maintaining a clean, paper-like tactile surface.

### Contrast & Semantic Utility
- **Text Primary (`#0F291E` - Deep Emerald Onyx):** Replaces pure charcoal with an ultra-dense evergreen-black, maintaining WCAG AAA contrast (minimum 12:1) over warm cream and card backgrounds.
- **Card Background (`#FFFFFF` - Pure White):** Creates sharp foreground separation against the cream backdrop.
- **Status Tints:** 
  - *Success / Online / Confirmed:* `#15803D`
  - *Alert / Route Change:* `#DC2626`
  - *Warning / Stage Delay:* `#D97706`
  - *Subtle Border Stroke:* `#E5DFD3` (soft warm sand)

## Typography

### Font Selection & Script Harmony
`Plus Jakarta Sans` is selected as the primary typographic driver for Latin characters due to its generous x-height, broad apertures, friendly curves, and legibility at transit distance. When rendering Malayalam, Hindi, Tamil, or Kannada, fonts must strictly fall back to native humanist web fonts (e.g., *Noto Sans Malayalam*, *Manjari*, or *Gayathri* for display accents) ensuring full vertical line-height balance without ascender clipping.

### Accessibility Adjustments
- **Reading Modes:** The typography engine supports three core scale presets:
  - *Standard Mode:* Follows default token scale.
  - *Senior Assist Mode:* Upscales body and label elements by +20% with explicit 600 weight minimum for microcopy.
  - *Child Mode:* Emphasizes `headline-lg` and oversized icon-paired labels, de-emphasizing compact body text.
- **Numbers & Fares:** Currency and stop counts must render with tabular figures (`tnum`) to maintain steady scanning across timetable columns.

## Layout & Spacing

### Layout Model
The layout adheres to a flexible 12-column responsive grid on desktop and tablet views, collapsing cleanly into a 4-column fluid layout on mobile devices. Because this system is frequently accessed one-handed during active commute conditions, critical journey triggers are placed within the bottom ergonomic sweep zone on mobile screens.

### Grid Breakpoints
- **Mobile (`< 640px`):** Single column stream or dual card pairing. Margin: `1rem` (`space-md`). Touch targets expand to minimum 52px height. Navigation docks to a thumb-friendly bottom bar.
- **Tablet (`640px - 1024px`):** 8-column layout. Margin: `1.5rem`. Split-screen support (interactive route map on the right, station listing on the left).
- **Desktop (`> 1024px`):** 12-column containerized layout with maximum content width capped at `1280px` to maintain comfortable readability lines. Margin: `2.5rem`.

### Spatial Rhythm
Padding within cards and containers operates strictly on multiples of `0.25rem` (4px baseline system):
- Internal card padding uses `space-md` (16px) or `space-lg` (24px) for prominent dashboards.
- Spacing between related input groups utilizes `space-sm` (8px).
- Generous outer breathing room prevents mis-taps between clickable stops along live progress tracks.

## Elevation & Depth

### Ambient Green-Tinted Shadows
Rather than using cold slate or neutral black drop shadows, surfaces in this design system cast a subtle, warm forest-tinted shadow. This imparts an organic, daylight-soaked Kerala ambience to elevated cards:
- **Resting Card Depth (Level 1):** `0px 4px 16px -2px rgba(11, 60, 42, 0.06), 0px 1px 3px rgba(11, 60, 42, 0.04)`. Imparts gentle separation above the warm cream ground.
- **Interactive / Floating Depth (Level 2):** `0px 10px 25px -4px rgba(11, 60, 42, 0.10), 0px 4px 10px -2px rgba(11, 60, 42, 0.05)`. Used for bottom navigation bars, voice recognition modals, and active bus stop callouts.
- **Heroic Card / Modal (Level 3):** `0px 20px 35px -6px rgba(11, 60, 42, 0.16)`. Used for popovers, camera OCR scanners, and route alert overlays.

### Border Strokes & Edge Definition
Every elevated surface pairs with a delicate, low-contrast inner border stroke (`1px solid #EAE4D7` or `1px solid rgba(11, 60, 42, 0.08)`). This preserves boundary sharpness for users browsing in harsh direct outdoor sunlight.

## Shapes

### Form Language & Curvature
A roundedness level of `2` provides balanced, welcoming geometry. The friendly character of the vehicle companion and accessibility demands necessitate soft corners that eliminate visual harshness:
- **Base Components (Inputs, Small Badges, Stop Pills):** `0.5rem` (8px).
- **Cards, Experience Panels, Modals:** `rounded-lg` (`1rem` / 16px) up to `rounded-xl` (`1.5rem` / 24px) for primary containers.
- **Action Triggers & Quick Mode Pills:** Fully rounded capsule/pill shapes (`rounded-full` / 9999px) for voice recording buttons, language pickers, and child mode avatars.
- **Route Tracking Waypoints:** Concentric circular geometries with double borders to indicate boarding and terminal stops.

## Components

### Buttons
- **Primary Action (Crimson Transit):** Solid `#DC2626` background, crisp white label, subtle inner bevel, hover/focus state `#B91C1C`. Minimum height: 48px (56px for Primary Voice/Speak buttons).
- **Secondary Action (Forest Green):** Solid `#0B3C2A` with white typography for route confirmations and timetable navigation.
- **Soft Assist Button:** Cream background (`#F5F1E9`), green border, dark emerald text with leading iconography.
- **Floating Companion Button (ANNA):** Circular pill badge combining mascot avatar with audio pulse badge.

### Route & Progress Visualizer
- **Track Line:** 6px thick solid stroke in `#0B3C2A` for traversed distance, dotted `#D1C7B7` for upcoming stops.
- **Active Bus Indicator:** Stylized micro-bus graphic oriented horizontally, floating above the path line with a glowing golden anchor dot (`#F59E0B`).
- **Station Nodes:** 16px circular rings; white center with green outline for upcoming stations, solid red ring for boarding stop, solid gold for destination.

### Language & Accessibility Pickers
- Dropdowns feature both script-native typography ("മലയാളം", "English", "हिन्दी") paired with national or regional dialect icons. Minimum tap area: 44px x 44px with a distinct 2px focus ring.

### Cards & Experience Selectors
- **Persona Mode Cards (Child / Adult / Senior):** Pure white container with 16px padding, subtle border, containing vibrant illustrated character badges. Selected state features a 2px `#0B3C2A` border and a light gold tint highlight.
- **Transit Detail Cards:** High contrast stop-to-stop card layout displaying large terminal station names, travel time badge, stage count, and estimated fare in Indian Rupees (`₹`) highlighted within a soft sand pill.

### Input Fields & Search
- Generous text entry fields (52px height) with light sand surface fill (`#FAF7F2`), rounded corners (`0.75rem`), clear placeholder copy, and an attached trailing quick-action voice or OCR button icon.