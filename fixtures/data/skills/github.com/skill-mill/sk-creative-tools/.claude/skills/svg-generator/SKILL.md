---
name: svg-generator
description: "Create and optimize SVG graphics programmatically. Use when generating icons, illustrations, or data visualizations as SVG."
metadata:
  tags: svg, graphics, visualization, icons, creative
---

When generating SVG, always set an explicit `viewBox` attribute and omit fixed `width`/`height` to allow the graphic to scale responsively within its container. Use semantic grouping with `<g>` elements and assign meaningful `id` attributes for layers that may need JavaScript interaction or CSS styling. Prefer `<path>` over multiple basic shapes when the output will be static, as consolidated paths reduce DOM node count. For icons, design on a consistent grid (typically 24x24 or 16x16) and align strokes to pixel boundaries to ensure crisp rendering at small sizes.

Run SVGO as a post-processing step with a configuration that preserves `viewBox`, `aria-*` attributes, and `<title>`/`<desc>` elements while removing editor metadata, empty groups, and redundant attributes. Set `convertPathData` precision to 2 decimal places for icons and 1 for large illustrations to minimize file size without visible quality loss. Avoid embedding raster images (`<image href="data:image/png...">`) inside SVGs intended for icon systems — if a raster fallback is needed, provide it as a separate file and reference it through CSS.

For accessibility, include a `<title>` element as the first child of the root `<svg>` with a concise description, and add `role="img"` along with `aria-labelledby` pointing to the title's `id`. Use `aria-hidden="true"` for purely decorative SVGs that convey no information. When creating data visualizations, supplement visual encoding with `<desc>` elements containing a text summary of the data, and ensure color is never the sole differentiator — pair it with patterns, labels, or shape variations. Test generated SVGs across browsers and verify that `currentColor` inheritance works correctly when the graphic is used inline.
