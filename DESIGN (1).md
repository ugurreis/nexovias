---
name: Kinetic Cybernetics
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#37393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#b9cbc1'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#83958c'
  outline-variant: '#3a4a43'
  surface-tint: '#00e1ab'
  primary: '#fbfffa'
  on-primary: '#003828'
  primary-container: '#00ffc2'
  on-primary-container: '#007255'
  inverse-primary: '#006c50'
  secondary: '#a6e6ff'
  on-secondary: '#003543'
  secondary-container: '#14d1ff'
  on-secondary-container: '#00566b'
  tertiary: '#fdffff'
  on-tertiary: '#313030'
  tertiary-container: '#e4e1e0'
  on-tertiary-container: '#656363'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#36ffc4'
  primary-fixed-dim: '#00e1ab'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513c'
  secondary-fixed: '#b7eaff'
  secondary-fixed-dim: '#4cd6ff'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  stack-unit: 8px
---

## Brand & Style

The design system is built for a high-performance AI agency, evoking an atmosphere of velocity, precision, and futuristic intelligence. The aesthetic leans heavily into **Modern Minimalism** infused with **Cyberpunk** elements, characterized by deep pitch-black backgrounds and vibrant, neon-gas accents. 

The brand personality is authoritative yet innovative. It uses "Digital Grain" and "Dot Matrix" patterns to provide texture to the void, ensuring the dark interface feels physical and structured rather than empty. The emotional response should be one of "controlled power"—sophisticated, premium, and undeniably technical.

## Colors

This design system utilizes a high-contrast dark palette to maximize the vibrance of its accent colors. 

- **Primary (#00FFC2):** A hyper-vibrant "Spring Green" used for primary actions, success states, and key brand highlighting.
- **Secondary (#00D1FF):** A "Neon Cyan" used for secondary information, interactive accents, and data visualization.
- **Backgrounds:** The primary surface is a pure black (#000000) to ensure the OLED-ready depth. Secondary surfaces use a deep charcoal (#080808) to create subtle container separation.
- **Typography:** White (#FFFFFF) is used for maximum legibility on dark backgrounds, with 70% and 40% opacity variants for secondary and tertiary text.

## Typography

The typographic hierarchy balances modern approachability with technical precision. 

**Plus Jakarta Sans** provides a clean, geometric feel for headlines, maintaining a "friendly-tech" vibe. **Hanken Grotesk** is the workhorse for body copy, chosen for its exceptional readability in dark mode environments. **Geist** is utilized for labels, metadata, and "code-like" UI elements, reinforcing the developer-centric, high-tech nature of the agency. 

Use tracking (letter spacing) sparingly: tighter for large headlines to increase impact, and wider for monospaced labels to increase scanability.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **The Grid:** High-precision alignment is key. Elements should feel like they are "snapped" into a technical blueprint. 
- **Rhythm:** An 8px linear scale (8, 16, 24, 32, 48, 64, 80, 128) governs all padding and margins. 
- **Sectioning:** Large vertical breathing room (minimum 128px on desktop) is required between major content sections to maintain a premium, editorial feel. 
- **Dot Pattern:** A subtle 24px-step dot matrix background should be aligned with the grid to act as a visual guide for the user.

## Elevation & Depth

In a pure black environment, traditional shadows are replaced by **Tonal Layering** and **Luminescence**.

- **Surface Tiers:** Background is #000000. Cards and containers use a subtle #080808 fill.
- **Glow Effects:** High-priority elements (like active CTA buttons) utilize a "Neon Bloom" shadow—a diffused, low-opacity glow using the Primary color (#00FFC2) with a 20-40px blur.
- **Borders:** Depth is primarily defined by 1px solid borders. Use `rgba(255, 255, 255, 0.1)` for standard containers and the Primary color for active or "hovered" states.
- **Glassmorphism:** Use backdrop-blur (20px) on navigation bars and overlays to create a sense of stacked, translucent glass.

## Shapes

The shape language is "Soft-Tech." While the grid is rigid, UI elements use a subtle 4px (`0.25rem`) corner radius. This prevents the design from feeling too aggressive or "brutalist," maintaining a professional agency polish.

- **Standard Elements:** 4px radius (Buttons, Input Fields).
- **Large Containers:** 8px radius (Cards, Modals).
- **Full Rounding:** Only used for tags, chips, or toggle switches to differentiate them from functional inputs.

## Components

### Buttons
- **Primary:** Solid #00FFC2 fill with black text. On hover, apply a subtle cyan glow.
- **Secondary:** Transparent background with a 1px #00FFC2 border and white text.
- **Ghost:** No border or fill; text only with primary color on hover.

### Cards
Cards should feel like "Modules." Use a #080808 background with a 1px border. For featured "Pro" tiers or highlighted case studies, use a subtle radial gradient of #00FFC2 at 5% opacity in the corner to draw the eye.

### Input Fields
Dark backgrounds with a subtle bottom-border or 1px outline. Focus states must trigger the Primary green border and a slight inner glow to simulate "powering on."

### Chips & Tags
Small, all-caps Geist labels with high letter-spacing. Use a secondary cyan (#00D1FF) at 10% opacity for the background fill to create distinction without competing with primary buttons.

### Visual Accents
- **Progress Bars:** Use a gradient from Secondary to Primary color.
- **Icons:** Thin-stroke (1.5px) linear icons, preferably matching the typography's weight.