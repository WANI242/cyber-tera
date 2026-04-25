# Open Graph / Twitter Card images

This folder is referenced by per-page `og:image` and `twitter:image` meta tags
across the site (e.g. `og-home.jpg`, `og-services.jpg`, `cctv-jinja.jpg`, ...).

## What to create

For each page, create a **1200 x 630 px** JPEG (or PNG):

| Filename                   | Page                              |
|----------------------------|-----------------------------------|
| `og-home.jpg`              | `/index.html`                     |
| `og-services.jpg`          | `/pages/services.html`            |
| `og-cctv.jpg`              | `/pages/cctv.html`                |
| `og-elec.jpg`              | `/pages/elec.html`                |
| `og-network.jpg`           | `/pages/network.html`             |
| `og-about.jpg`             | `/pages/about.html`               |
| `og-case-scenarios.jpg`    | `/pages/case-scenarios.html`      |
| `og-faq.jpg`               | `/pages/faq.html`                 |
| `og-gaq.jpg`               | `/pages/gaq.html`                 |
| `cctv-jinja.jpg`           | `/pages/cctv-jinja.html`          |
| `cctv-kampala.jpg`         | `/pages/cctv-kampala.html`        |
| `electrical-kampala.jpg`   | `/pages/electrical-kampala.html`  |
| `blog.jpg`                 | `/blog/index.html`                |
| `first-post.jpg`           | `/blog/first-post.html`           |

## Design guidance

- Brand background colour: `#03152d` (dark navy)
- Accent: `#f2b544` (gold)
- Heading text: `#e7f0fa` (off-white)
- Include the CYBER TERA logo (top-left), the page title (large, centred),
  a short subtitle, and a visual element (photo or icon).
- Keep safe margins of ~60px on all sides so social platforms don't crop text.

## Tooling

Easiest workflow: create one 1200x630 template in Figma / Canva / Photoshop,
duplicate it, change the heading for each page, export as JPEG at ~80% quality
(target ~150KB).

The Phase 5 `build.mjs` script can generate `.webp` versions of these
automatically once it's in place.

## Status

**PLACEHOLDER** &mdash; no images currently exist in this folder. Until you add
them, social-share previews will fall back to the site-wide logo.
