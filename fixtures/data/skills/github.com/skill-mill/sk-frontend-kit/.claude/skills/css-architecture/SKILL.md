---
name: css-architecture
description: "Design scalable CSS architecture using BEM, CSS Modules, or utility-first approaches. Use when structuring styles for large-scale web applications."
metadata:
  tags: css, architecture, frontend, styling, bem
---

When choosing a CSS methodology, consider the project's scale and team familiarity. For component-based frameworks like React or Vue, CSS Modules provide natural scoping and eliminate naming collisions without requiring strict naming conventions. BEM (Block, Element, Modifier) remains an excellent choice for server-rendered applications or projects where global stylesheets are preferred, as its explicit naming pattern (`block__element--modifier`) makes the DOM relationship immediately clear. Utility-first frameworks like Tailwind CSS work best when rapid prototyping speed is critical and the team is comfortable with longer class lists in templates.

Organize stylesheets in a layered folder structure: `base/` for resets and typography, `components/` for reusable UI elements, `layouts/` for page-level structures, and `utilities/` for helper classes. Each component's styles should live alongside its template file when using CSS Modules. Define design tokens (colors, spacing, breakpoints, font sizes) as CSS custom properties or preprocessor variables in a single `tokens/` directory, ensuring consistency and enabling theme switching. Never use magic numbers; every value should trace back to a token.

For responsive design, adopt a mobile-first approach with `min-width` media queries defined at consistent breakpoints (e.g., 640px, 768px, 1024px, 1280px). Use `clamp()` for fluid typography and spacing to reduce the number of breakpoints needed. Avoid deep nesting beyond three levels, and prefer composing small utility classes over writing overly specific selectors. Run `stylelint` in CI to enforce these conventions automatically, and document any project-specific deviations in the team's style guide.
