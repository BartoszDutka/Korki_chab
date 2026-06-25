---
name: Academic Warmth
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#8a5100'
  on-secondary: '#ffffff'
  secondary-container: '#fe9800'
  on-secondary-container: '#643900'
  tertiary: '#381300'
  on-tertiary: '#ffffff'
  tertiary-container: '#592300'
  on-tertiary-container: '#d8885c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#ffb86f'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#693c00'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#723610'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-subtle: '#F8F8F8'
  academic-navy-deep: '#002244'
  warm-orange-hover: '#E68A00'
  text-main: '#1A1A1A'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style

The design system is built to reflect a "trusted academic partner" persona—balancing the rigor of formal education with the warmth of a local, family-oriented service. The style is **Corporate / Modern** with a distinct human touch, prioritizing clarity and accessibility to reassure both parents and students.

The visual language avoids the coldness of traditional institutional design by utilizing soft corners, generous white space, and a vibrant accent color. It focuses on creating an environment that feels organized yet approachable, encouraging a sense of progress and personalized support.

## Colors

The palette is anchored by **Academic Navy**, symbolizing stability, authority, and professionalism. This is contrasted by **Warm Orange**, which is reserved exclusively for primary calls to action and interactive accents to inject energy and optimism into the interface.

Backgrounds remain a clean, crisp white to ensure maximum readability. A light neutral gray is used for secondary surfaces and borders to maintain a structured layout without adding visual clutter. Use the deep navy variant for footers or high-contrast sections to ground the design.

## Typography

**Manrope** is used across all levels to provide a modern, highly legible sans-serif experience. Headlines use tighter letter spacing and heavier weights to convey confidence. Body text utilizes a generous line height to ensure that educational content remains easy to digest for both children and adults.

For mobile devices, display and large headline sizes scale down to prevent excessive line wrapping while maintaining their structural importance. Use the uppercase label style for small metadata or section overlines to add a layer of professional categorization.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop to ensure a curated reading experience, centering content within a 1200px container. On mobile, the layout transitions to a fluid 4-column system with 16px margins.

Spacing follows a strict 8px base unit. Section vertical padding should be generous (typically 80px or 10 julies) to create a sense of "Academic Calm," preventing the UI from feeling cramped or overwhelming. Use consistent 24px gutters between grid items (like course cards) to maintain a rhythmic visual flow.

## Elevation & Depth

Hierarchy is achieved primarily through **Tonal Layers** and extremely soft, ambient shadows. Surfaces should feel integrated rather than floating high above the background.

- **Level 0 (Background):** Pure white (#FFFFFF) for the main canvas.
- **Level 1 (Cards/Surface):** Surface-subtle (#F8F8F8) or white with a very thin 1px border (#E2E8F0).
- **Interactive State:** When hovered, cards should lift slightly using a low-opacity navy-tinted shadow (e.g., `0 10px 25px -5px rgba(0, 51, 102, 0.08)`).

Avoid heavy dropshadows or complex gradients. The goal is a flat, clean look that feels organized and reliable.

## Shapes

The shape language is defined by **Rounded** corners, specifically 16px (`rounded-lg`) for major containers like cards and content blocks. This soften the professional navy color palette, making the academic environment feel more welcoming to families.

Buttons and input fields should follow a slightly smaller 8px radius to maintain a precise, functional feel, while larger decorative elements or image containers can utilize the full 24px (`rounded-xl`) radius to emphasize the "friendly" brand pillar.

## Components

### Buttons
- **Primary:** Warm Orange (#FF9900) with white text. High contrast, bold weight. Used for "Sign Up" or "Book a Lesson."
- **Secondary:** Academic Navy (#003366) with white text. Used for "Learn More" or secondary navigation.
- **Ghost:** Navy outline with transparent background. Used for less critical actions.

### Cards
Cards are the primary container for course information and tutor profiles. They must feature a 16px corner radius, a subtle 1px border, and 24px of internal padding. On hover, apply the ambient navy shadow.

### Input Fields
Fields should be clean with a 1px neutral border. Use the Navy Blue for the focus state border and the Warm Orange for the cursor or active selection to provide clear feedback.

### Lists & Icons
Use professional, thin-line icons in Navy Blue. List items should have generous vertical spacing (12px+) to ensure they are readable for users of all ages.

### Header & Footer
- **Header:** Sticky, white background, with a clear Primary CTA button on the right.
- **Footer:** Deep Navy background with white text. Organize links into clear columns (Services, About, Contact) to reflect the structured nature of an educational center.