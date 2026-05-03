---
name: Precision Analytical
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  data-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 32px
  card-padding: 20px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

The brand personality is anchored in reliability and high-velocity utility. It serves a demographic of business owners and operators who require immediate clarity over complex datasets. The visual language evokes a sense of "quiet intelligence"—it does not compete for the user's attention but organizes it.

This design system adopts a **Corporate / Modern** style with a heavy emphasis on **Minimalism**. The interface is structured around high-density information layouts, utilizing ample whitespace between functional groups rather than decorative elements. The emotional response is one of control, efficiency, and professional rigor.

- **Visual Priority:** Data points and actionable insights are elevated; navigation and secondary controls are recessed.
- **Tone:** Objective, technical, and stable.
- **Aesthetic:** Flat surfaces with purposeful depth used only to indicate interactivity or information hierarchy.

## Colors

The color strategy centers on "Daspace Blue," a deep slate-navy used for structural permanence and primary brand touchpoints. Interaction states utilize a more vibrant secondary blue to guide the eye toward "next steps."

- **Primary (Daspace Blue):** Used for sidebar backgrounds, primary headings, and high-level navigation. It represents the "foundation" of the data.
- **Accents:** Functional colors (Green, Amber, Red) are calibrated for high legibility against white backgrounds. Their saturation is high enough to be noticed in peripheral vision during fast-paced POS operations.
- **Grayscale:** A sophisticated range of Cool Grays (Slate) is used to create a "layered" effect, separating background workspace from active card surfaces.

## Typography

The typography system prioritizes the scanability of dense numerical data. **Manrope** is used for headlines to provide a modern, slightly geometric character that distinguishes brand moments. **Inter** is the workhorse font, selected for its tall x-height and exceptional clarity in small-scale UI elements like data tables and filter labels.

- **Data Tables:** Use `data-tabular` for numerical values to ensure vertical alignment and quick comparison.
- **Hierarchy:** Use `label-caps` for section headers within sidebars or card titles to create clear visual separation without requiring large font sizes.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** with fixed margins and gutters. The layout is designed to maximize "dashboard real estate," allowing for side-by-side comparisons of charts and tables.

- **Rhythm:** An 8px linear scale (with 4px increments for tight components) governs all padding and margins. 
- **Sidebar:** A fixed-width left navigation (240px) provides a permanent anchor, while the main content area expands to fill the viewport.
- **Density:** Elements are packed with a "Compact-to-Standard" density, ensuring that users can see significant amounts of data without scrolling, while maintaining touch-targets for tablet-based POS usage.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** supplemented by **Ambient Shadows**. This design system avoids harsh borders in favor of subtle surface transitions.

- **Level 0 (Background):** Slate-50 (#F8FAFC) is the canvas.
- **Level 1 (Cards/Sidebar):** Pure white (#FFFFFF) cards or deep navy (#0F172A) sidebars.
- **Level 2 (Dropdowns/Modals):** Elements that float above the grid use a soft, multi-layered shadow (12% opacity, 15px blur) to indicate temporary prominence.
- **Interactive States:** Buttons and clickable cards use a slight translation (1px lift) and a subtle increase in shadow intensity on hover to provide tactile feedback.

## Shapes

The shape language is **Soft** and disciplined. A 4px (0.25rem) base radius is applied to standard components, striking a balance between the precision of sharp corners and the friendliness of rounded ones.

- **Small Components:** Buttons, inputs, and checkboxes use the base 4px radius.
- **Containers:** Large metric cards and data tables use an 8px (0.5rem) radius to frame information sets.
- **Search Bars:** Utilize a fully rounded (pill) shape to differentiate global search functionality from standard data inputs.

## Components

The component library is built for speed and high-frequency interaction.

- **Metric Cards:** Feature a large display-lg value, a trend indicator icon (up/down), and a label-caps title. Backgrounds are clean white with a 1px Slate-200 border.
- **Sidebar Navigation:** High-contrast Navy background with Slate-400 icons. The active state is indicated by a 3px "Daspace Blue" vertical bar on the left and a subtle white-opacity hover effect.
- **Data Tables:** Refined with no vertical borders. Use horizontal dividers (1px Slate-100). Header rows use a light gray background (#F1F5F9) to lock the context.
- **Date Pickers & Filters:** Styled as "ghost buttons" (Slate-200 border, transparent fill) to keep the header area clean until active.
- **Input Fields:** Use a 1px inset border; focus states transition to a 2px Daspace Blue border with a soft blue outer glow.
- **Status Chips:** Small, low-saturation backgrounds with high-saturation text for Success, Warning, and Error (e.g., Light Green BG with Dark Green text).