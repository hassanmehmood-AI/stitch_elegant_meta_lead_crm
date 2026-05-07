---
name: Serene CRM
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad8e8'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2ff'
  surface-container: '#eeecfc'
  surface-container-high: '#e8e6f6'
  surface-container-highest: '#e3e1f0'
  on-surface: '#1a1b25'
  on-surface-variant: '#444557'
  inverse-surface: '#2f2f3b'
  inverse-on-surface: '#f1effe'
  outline: '#757589'
  outline-variant: '#c5c5da'
  surface-tint: '#2d3eff'
  primary: '#0015cd'
  on-primary: '#ffffff'
  primary-container: '#1b2efd'
  on-primary-container: '#c4c7ff'
  inverse-primary: '#bdc2ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7f1100'
  on-tertiary: '#ffffff'
  tertiary-container: '#aa1a00'
  on-tertiary-container: '#ffbbae'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000668'
  on-primary-fixed-variant: '#0018e4'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a5'
  on-tertiary-fixed: '#3e0400'
  on-tertiary-fixed-variant: '#8e1400'
  background: '#fbf8ff'
  on-background: '#1a1b25'
  surface-variant: '#e3e1f0'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  container-padding: 2.5rem
  gutter: 1.5rem
---

## Brand & Style

The design system is centered on the concept of "Cognitive Calm." It targets high-end SaaS professionals who manage complex data and requires an interface that reduces anxiety through visual softness and clarity. The brand personality is sophisticated, reliable, and effortless.

The visual style is a refined blend of **Modern Minimalism** and **Soft Glassmorphism**. By prioritizing light-wash tints and airy compositions over heavy borders or high-contrast dividers, the design system creates a sense of "floating" data. The emotional response is one of controlled professionalism—where the software feels like a high-end concierge rather than a dense utility.

## Colors

The color strategy for this design system relies on the primary blue (#1B2EFD) acting as a precise focal point against a monochromatic, cool-toned base. 

- **Primary Wash:** Extensive use of `primary-50` and 5-10% opacity overlays for large surface areas to soften the workspace.
- **Accents:** The full-strength primary color is reserved strictly for primary actions and active states.
- **Neutrals:** A slate-tinted neutral scale maintains a professional, "SaaS-native" look while avoiding the harshness of pure blacks or grays.
- **Status Colors:** These follow a "pastel-tint" logic, utilizing 10% opacity fills with 80% saturation strokes to ensure legibility without breaking the soft aesthetic.

## Typography

The design system utilizes **Manrope** for its balanced, modern geometric qualities that feel both technical and human. 

The typographic scale is characterized by medium weights (500) as the "new regular" to provide a premium feel. Headers use tighter letter-spacing for a compact, editorial look, while body text is given generous line heights to ensure readability in data-heavy CRM environments. Capitalized labels are used sparingly for metadata to create clear visual anchors.

## Layout & Spacing

This design system employs a **Fluid Grid** model built on an 8px base unit, favoring wide margins and significant vertical breathing room. 

The layout philosophy centers on "The Airy Canvas." Dashboard elements should never feel crowded. Sidebars are docked with a subtle internal margin, and main content areas use a maximum width of 1440px to prevent excessive line lengths on ultra-wide monitors. Spacing between cards (gutters) is fixed at 24px (`md`) to maintain a consistent "floating" rhythm across the UI.

## Elevation & Depth

Elevation in this design system is achieved through **Ambient Shadows** and **Tonal Layering** rather than traditional drop shadows.

- **Surface Levels:** The background uses a soft blue-tinted white. Primary cards use pure white to "lift" off the page.
- **Shadow Profile:** Shadows are extremely diffused (Blur: 40px+, Spread: -10px) with a very low opacity (3-5%) blue-tinted black. This prevents the "muddy" look of standard gray shadows.
- **Interactions:** On hover, cards should subtly lift by increasing shadow diffusion and adding a 1px border in a 10% primary tint. This creates a tactile, responsive feel without visual noise.

## Shapes

The shape language is defined by significant roundedness to reinforce the "soft and elegant" narrative. 

Standard components (buttons, inputs) utilize a **12px** radius. Larger containers and floating cards utilize a **16px** radius. This high degree of rounding removes visual tension and aligns with modern high-end SaaS trends. Interactive elements should never have sharp corners, as the system aims for a friendly, approachable geometry.

## Components

- **Cards:** The signature component of the design system. Pure white fill, 16px corner radius, and a subtle 1px border in `primary-100` (10% opacity). They should appear to float on the `primary-50` background.
- **Buttons:** 
  - *Primary:* Solid `#1B2EFD` with white text, 12px radius.
  - *Secondary:* `accent-soft` background with primary-colored text; no border.
- **Input Fields:** Soft background (`neutral-50`) that transitions to a white background with a 1px primary-colored glow on focus.
- **Status Tags:** Pill-shaped with a 20% opacity background of the status color (e.g., Green for "Closed", Blue for "Lead") and high-contrast text for accessibility.
- **Lists:** No divider lines; use vertical spacing and alternating soft-tint backgrounds on hover to define rows.
- **Additional Suggestion:** "Activity Streams" should use a thin vertical line in `primary-50` with soft-glow nodes to represent the timeline of CRM interactions.