# Iffy Design Contract

## Scene

A buyer compares agents on a phone after a long day, while warm late-afternoon light falls across stone and blue glass. The interface should feel clear enough for a financial decision and human enough to invite a direct conversation.

## Voice

Assured, perceptive, human. Copy is plain-spoken and specific. It never creates false urgency, invents proof, or claims a message or appointment has been confirmed.

## Colour strategy

The strategy is committed rather than decorative. Warm ink and limestone provide the main light and dark fields; Gulf blue and sea glass carry active moments; sand is a quiet credential accent.

```css
--ink: oklch(0.18 0.012 75);
--ink-soft: oklch(0.28 0.014 75);
--limestone: oklch(0.955 0.015 82);
--limestone-deep: oklch(0.9 0.018 82);
--paper: oklch(0.985 0.008 82);
--gulf: oklch(0.5 0.09 215);
--sea-glass: oklch(0.78 0.055 190);
--sand: oklch(0.72 0.07 78);
--danger: oklch(0.52 0.18 28);
```

Purple, pure black, pure white, gradient text, and category-default black-and-gold styling are excluded.

## Type

Geist remains the single family because it is already part of the Iffy identity. Self-hosted files are preferred when licensed files are available. Until then, the stack is `Geist, Arial, Helvetica, sans-serif` with no runtime font request.

- Display: `clamp(3.25rem, 12vw, 10rem)`, weight 500, tight tracking.
- Page title: `clamp(2.5rem, 7vw, 5.75rem)`, weight 500.
- Section title: `clamp(2rem, 5vw, 4.25rem)`, weight 500.
- Body: `clamp(1rem, 1.4vw, 1.125rem)`, maximum 68 characters per line.
- Small legal copy: 0.8125rem minimum.

Hierarchy comes from scale, weight, and space. Repeated uppercase kickers and eyebrow labels are not part of the system.

## Layout and rhythm

- Content width: `min(100% - 2rem, 82rem)` with a 1rem mobile gutter.
- Long-form width: 68ch.
- Section space: `clamp(4.5rem, 10vw, 9rem)`.
- Tight related space: `clamp(1rem, 2vw, 1.75rem)`.
- Layout is asymmetric where media and narrative benefit, never a generic centered stack.
- Content groups use whitespace, type, and image fields. They do not use repeated bordered cards.

## Surfaces and controls

- Normal controls are solid ink or quiet text links with a minimum 44px target.
- Liquid glass is reserved for the hero, consultation action, and at most one mobile navigation control.
- Glass always has a solid high-contrast fallback and never changes layout on hover.
- Form controls may retain borders because the boundary is functional, not decorative.
- Focus uses a 2px Gulf-blue outline with at least 3px offset.

## Imagery

Only repository media may ship. Images should use stable intrinsic dimensions, meaningful alt text, and deliberate crops. Iffy is the primary human subject. Guest photographs must not be positioned as testimonial evidence without verified context.

## Motion

- Use `motion/react` only.
- Prefer transform and opacity with quart or quint ease-out curves.
- The SVG arc path is the single bounded geometry-animation exception.
- Content exists in its final state before animation code opts in.
- Reduced motion, storage failure, hydration interruption, short landscape, and missing browser APIs must all resolve to a complete static page.
- Motion never blocks controls beyond 1.8 seconds and never creates blank scroll regions.

## Accessibility

Target WCAG 2.2 AA. Semantic controls, visible focus, logical headings, labelled forms, 44px touch targets, usable 200% text zoom, forced-colour legibility, and complete keyboard paths are release requirements.

## Absolute exclusions

- Bordered content-card grids or nested cards.
- Repeated eyebrow labels.
- Gradient text, purple glow, decorative glass panels, and generic icon tiles.
- Invented listings, awards, metrics, testimonials, or availability.
- Hidden base content that depends on JavaScript, scrolling, or animation completion.
- Visible em dashes or en dashes in newly written interface copy.
