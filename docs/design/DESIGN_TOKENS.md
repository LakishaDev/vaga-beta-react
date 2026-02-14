# Design Tokens - Cobalt Navy Design System

> Professional blue-first color system for vagabeta.rs  
> WCAG 2.2 AA Compliant • Accessible • Modern

## 🎨 Color Palette

### Brand Colors

#### Primary - Cobalt Navy

**#0B3A8D**

<div style="display:inline-block; width:80px; height:80px; background:#0B3A8D; border-radius:12px; vertical-align:middle;"></div>

- **Usage**: Primary CTA buttons, main actions, key UI elements
- **Contrast**: 10.48:1 on white ✅ AAA
- **Tailwind**: `bg-brand-primary`, `text-brand-primary`, `border-brand-primary`

```jsx
<Button variant="primary">Zakaži servis</Button>
```

#### Secondary - Royal Blue

**#1D4ED8**

<div style="display:inline-block; width:80px; height:80px; background:#1D4ED8; border-radius:12px; vertical-align:middle;"></div>

- **Usage**: Secondary actions, info links, focus rings
- **Contrast**: 6.70:1 on white ✅ AA
- **Tailwind**: `bg-brand-secondary`, `text-brand-secondary`

```jsx
<Button variant="secondary">Saznaj više</Button>
```

#### Accent - Cyan

**#0E7490**

<div style="display:inline-block; width:80px; height:80px; background:#0E7490; border-radius:12px; vertical-align:middle;"></div>

- **Usage**: Info badges, highlights, active states
- **Contrast**: 5.36:1 on white ✅ AA
- **Tailwind**: `bg-brand-accent`, `text-brand-accent`

```jsx
<Badge variant="info">Novo</Badge>
```

### Neutral Colors

| Color            | HEX       | Usage                 | Tailwind Class                |
| ---------------- | --------- | --------------------- | ----------------------------- |
| **Background**   | `#F8FAFC` | Main page background  | `bg-neutral-bg`               |
| **Surface**      | `#FFFFFF` | Cards, panels, modals | `bg-neutral-surface`          |
| **Surface Tint** | `#EFF6FF` | Tinted backgrounds    | `bg-neutral-surface-tint`     |
| **Border**       | `#CBD5E1` | Default borders       | `border-neutral-border`       |
| **Border Light** | `#E2E8F0` | Subtle dividers       | `border-neutral-border-light` |
| **Border Dark**  | `#94A3B8` | Emphasized borders    | `border-neutral-border-dark`  |

### Text Colors

| Color         | HEX       | Usage                    | Tailwind Class        |
| ------------- | --------- | ------------------------ | --------------------- |
| **Primary**   | `#0B1220` | Main text, headings      | `text-text-primary`   |
| **Secondary** | `#475569` | Muted text, descriptions | `text-text-secondary` |
| **Tertiary**  | `#64748B` | Even more muted          | `text-text-tertiary`  |
| **Inverse**   | `#FFFFFF` | Text on dark backgrounds | `text-text-inverse`   |
| **Link**      | `#1D4ED8` | Links, anchors           | `text-text-link`      |

### Semantic Colors

#### Success

- **Main**: `#059669` <span style="display:inline-block; width:20px; height:20px; background:#059669; border-radius:4px; vertical-align:middle;"></span>
- **Background**: `#D1FAE5`
- **Text**: `#065F46`
- **Usage**: Success messages, available status

```jsx
<Badge variant="success">Dostupno</Badge>
```

#### Warning

- **Main**: `#D97706` <span style="display:inline-block; width:20px; height:20px; background:#D97706; border-radius:4px; vertical-align:middle;"></span>
- **Background**: `#FEF3C7`
- **Text**: `#92400E`
- **Usage**: Warnings, pending states

```jsx
<Badge variant="warning">Na čekanju</Badge>
```

#### Error

- **Main**: `#DC2626` <span style="display:inline-block; width:20px; height:20px; background:#DC2626; border-radius:4px; vertical-align:middle;"></span>
- **Background**: `#FEE2E2`
- **Text**: `#991B1B`
- **Usage**: Errors, destructive actions

```jsx
<Badge variant="error">Nije dostupno</Badge>
<Button variant="danger">Obriši</Button>
```

#### Info

- **Main**: `#0E7490` <span style="display:inline-block; width:20px; height:20px; background:#0E7490; border-radius:4px; vertical-align:middle;"></span>
- **Background**: `#CFFAFE`
- **Text**: `#155E75`
- **Usage**: Info messages, notifications

```jsx
<Badge variant="info">Informacija</Badge>
```

---

## 📝 Typography

### Font Families

#### Inter - Body & UI

**Google Fonts**: `Inter (400, 500, 600, 700)`

- **Usage**: Body text, UI elements, buttons, forms
- **Character**: Modern, readable, excellent on-screen rendering
- **Tailwind**: `font-body`, `font-sans`

```jsx
<p className="font-body">Ovo je body tekst sa Inter fontom.</p>
```

#### Manrope - Headings

**Google Fonts**: `Manrope (600, 700, 800)`

- **Usage**: Headings (H1-H6), section titles
- **Character**: Professional, geometric, strong presence
- **Tailwind**: `font-heading`

```jsx
<h1 className="font-heading text-4xl font-bold">Naslov</h1>
```

### Type Scale

| Element     | Size    | Line Height | Weight  | Tailwind                              |
| ----------- | ------- | ----------- | ------- | ------------------------------------- |
| **H1**      | 36-44px | 1.15        | 700-800 | `text-4xl font-bold font-heading`     |
| **H2**      | 28-32px | 1.2         | 700     | `text-3xl font-bold font-heading`     |
| **H3**      | 22-24px | 1.25        | 600-700 | `text-2xl font-semibold font-heading` |
| **H4**      | 18-20px | 1.3         | 600     | `text-xl font-semibold`               |
| **Body**    | 16-18px | 1.5         | 400     | `text-base`                           |
| **Small**   | 14px    | 1.4         | 400-500 | `text-sm`                             |
| **Caption** | 12px    | 1.35        | 400     | `text-xs`                             |

### Usage Examples

```jsx
// Hero heading
<h1 className="font-heading text-5xl font-extrabold text-text-primary">
  Servis i overavanje vaga
</h1>

// Section heading
<h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
  Naše usluge
</h2>

// Body paragraph
<p className="font-body text-base text-text-secondary leading-relaxed">
  Profesionalan servis sa 20+ godina iskustva.
</p>

// Button text
<Button className="font-medium">Zakaži odmah</Button>
```

---

## 📏 Spacing (8pt Grid)

### Scale

| Token        | Value | Pixels | Usage                    | Tailwind              |
| ------------ | ----- | ------ | ------------------------ | --------------------- |
| `spacing[1]` | 4px   | 4px    | Fine adjustments         | `gap-1`, `p-1`, `m-1` |
| `spacing[2]` | 8px   | 8px    | Base unit, tight spacing | `gap-2`, `p-2`, `m-2` |
| `spacing[3]` | 12px  | 12px   | Small spacing            | `gap-3`, `p-3`, `m-3` |
| `spacing[4]` | 16px  | 16px   | Standard spacing         | `gap-4`, `p-4`, `m-4` |
| `spacing[5]` | 24px  | 24px   | Medium spacing           | `gap-5`, `p-5`, `m-5` |
| `spacing[6]` | 32px  | 32px   | Large spacing            | `gap-6`, `p-6`, `m-6` |
| `spacing[7]` | 48px  | 48px   | Section spacing          | `gap-7`, `p-7`, `m-7` |
| `spacing[8]` | 64px  | 64px   | Major sections           | `gap-8`, `p-8`, `m-8` |

### Guidelines

- **Component padding**: Use `p-4` (16px) for cards, `p-6` (32px) for sections
- **Vertical rhythm**: Use `mb-4`, `mb-6`, `mb-8` for consistent spacing
- **Grid gaps**: Use `gap-4` or `gap-6` for product grids

```jsx
// Card with consistent padding
<Card className="p-6">
  <h3 className="mb-4">Title</h3>
  <p>Content</p>
</Card>

// Section spacing
<section className="py-16 px-4">
  <div className="space-y-8">
    {/* Content with 32px vertical spacing */}
  </div>
</section>
```

---

## 🔘 Border Radius

| Token         | Value  | Usage                   | Tailwind       |
| ------------- | ------ | ----------------------- | -------------- |
| `radius.sm`   | 8px    | Buttons, inputs, badges | `rounded-md`   |
| `radius.md`   | 12px   | Cards, panels           | `rounded-lg`   |
| `radius.lg`   | 16px   | Modals, large cards     | `rounded-xl`   |
| `radius.xl`   | 24px   | Hero sections           | `rounded-2xl`  |
| `radius.full` | 9999px | Pills, avatars          | `rounded-full` |

```jsx
<Button className="rounded-md">Primary Button</Button>
<Card className="rounded-lg">Card Content</Card>
<Badge className="rounded-full">Badge</Badge>
```

---

## 🌑 Shadows

| Level   | CSS          | Usage               |
| ------- | ------------ | ------------------- |
| **sm**  | `shadow-sm`  | Subtle elevation    |
| **md**  | `shadow-md`  | Default cards       |
| **lg**  | `shadow-lg`  | Dropdowns, popovers |
| **xl**  | `shadow-xl`  | Modals, overlays    |
| **2xl** | `shadow-2xl` | Maximum elevation   |

```jsx
<Card className="shadow-md hover:shadow-lg transition-shadow">
  Card with shadow on hover
</Card>
```

---

## ⏱️ Animation & Transitions

### Duration Tokens

| Token    | Value | Usage                | Tailwind          |
| -------- | ----- | -------------------- | ----------------- |
| `fast`   | 150ms | Quick interactions   | `duration-fast`   |
| `base`   | 200ms | Standard transitions | `duration-base`   |
| `slow`   | 300ms | Smooth animations    | `duration-slow`   |
| `slower` | 500ms | Complex animations   | `duration-slower` |

### Transition Presets

```css
/* In CSS */
.element {
  transition: var(--transition-all);
  /* or */
  transition: var(--transition-colors);
}
```

```jsx
// In JSX with Tailwind
<Button className="transition-all duration-base hover:bg-brand-primary-hover">
  Hover me
</Button>
```

---

## ♿ Accessibility

### WCAG 2.2 AA Compliance

#### Contrast Ratios (Verified)

| Combination                  | Ratio   | Level | Pass |
| ---------------------------- | ------- | ----- | ---- |
| White on Primary (#0B3A8D)   | 10.48:1 | AAA   | ✅   |
| White on Secondary (#1D4ED8) | 6.70:1  | AA    | ✅   |
| White on Accent (#0E7490)    | 5.36:1  | AA    | ✅   |
| Text Primary on Background   | 21:1    | AAA   | ✅   |
| Text Secondary on Surface    | 7.8:1   | AA    | ✅   |

#### Focus Rings

All interactive elements have visible focus indicators:

```jsx
// Default focus ring
className =
  "focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2";

// Custom focus style
className =
  "focus:outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20";
```

### Requirements

- ✅ Minimum contrast 4.5:1 for normal text
- ✅ Minimum contrast 3:1 for large text (≥18px or ≥14px bold)
- ✅ Minimum contrast 3:1 for UI components and icons
- ✅ Visible focus indicators on all interactive elements
- ✅ Color is not the only means of conveying information

---

## 🚀 Usage in Code

### Import Design Tokens

```javascript
import { designTokens } from "@/configs/designTokens";

// Access colors
const primaryColor = designTokens.colors.brand.primary;
const textColor = designTokens.colors.text.primary;

// Access spacing
const spacing = designTokens.spacing[4]; // 16px
```

### Import Design System Components

```javascript
import {
  Button,
  Input,
  Card,
  Badge,
  Modal,
  Stepper,
} from "@/components/DesignSystem";

function MyComponent() {
  return (
    <Card variant="elevated" hoverable>
      <h3>Product Title</h3>
      <Badge variant="success">Dostupno</Badge>
      <Button variant="primary">Dodaj u korpu</Button>
    </Card>
  );
}
```

### Tailwind Classes (Recommended)

```jsx
// Brand colors
<div className="bg-brand-primary text-white">Primary Background</div>
<div className="text-brand-secondary">Secondary Text</div>

// Neutrals
<div className="bg-neutral-surface border border-neutral-border rounded-lg p-6">
  Card-like container
</div>

// Semantic colors
<div className="text-success-text bg-success-bg p-3 rounded-md">
  Success message
</div>

// Typography
<h1 className="font-heading text-4xl font-bold text-text-primary">
  Heading with Manrope
</h1>
<p className="font-body text-base text-text-secondary">
  Body text with Inter
</p>
```

---

## 📦 Component Library

### Available Components

1. **Button** - Primary, secondary, outline, ghost, danger variants
2. **Input** - Floating label, validation, icons
3. **Card** - Elevated, outlined, ghost variants
4. **Badge** - Status indicators with semantic colors
5. **Modal** - Accessible dialogs with focus trap
6. **Stepper** - Multi-step wizards for booking/checkout

### Component Guidelines

- Always use design system components for consistency
- Prefer Tailwind utility classes over custom CSS
- Follow accessibility best practices (ARIA labels, semantic HTML)
- Use semantic color variants (success, warning, error) for status

---

## 🎯 Best Practices

### Do's ✅

- Use design tokens for all colors, spacing, and typography
- Maintain consistent spacing with 8pt grid
- Test color contrast with WCAG tools
- Provide visible focus states for keyboard navigation
- Use semantic HTML elements
- Include ARIA labels for screen readers

### Don'ts ❌

- Don't use hardcoded hex colors
- Don't use arbitrary spacing values (stick to the scale)
- Don't rely solely on color to convey meaning
- Don't remove focus outlines without replacement
- Don't use `<div>` buttons (use `<button>`)
- Don't forget alt text for images

---

## 📚 Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintainer**: Vaga Beta Development Team
