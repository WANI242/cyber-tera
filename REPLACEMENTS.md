# What to replace before going live (CYBER TERA site)

Use this as a go-live checklist. After each item, search the project for the string or file listed so nothing is missed.

---

## 1. Production site URL (highest impact)

**Replace:** `https://REPLACE_ME.example`  
**With:** Your real public origin, e.g. `https://cybertera.ug` (use **HTTPS**, no trailing slash in canonical tags).

| Where to update |
| --- |
| `robots.txt` &mdash; `Sitemap:` line |
| `sitemap.xml` &mdash; every `<loc>` entry |
| All `*.html` files &mdash; `rel="canonical"`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `url` / `item` / `mainEntityOfPage` fields |

**Tip:** A single find-and-replace in your editor (whole project, `ctu/`) is fine as long as you don’t break unrelated strings.

**Related:** The **LocalBusiness** `sameAs` and social links below use a different pattern (`facebook.com/REPLACE_ME` &mdash; see section 4).

---

## 2. Formspree (quote form)

**File:** `javascript/quote.js`  
**Replace:** `https://formspree.io/f/REPLACE_ME_FORMSPREE_ID`  
**With:** Your form endpoint from [formspree.io](https://formspree.io) (e.g. `https://formspree.io/f/xayzqwer`).

Until this is set, the form shows an error in the console and the submit handler will fail the configured check.

---

## 3. Analytics (optional but recommended)

**File:** `javascript/analytics.js`

| Option | What to set |
| --- | --- |
| **Cloudflare Web Analytics** (default in code) | `REPLACE_ME_CF_TOKEN` &rarr; token from [Cloudflare &rarr; Web Analytics](https://dash.cloudflare.com) |
| **Plausible** (alternative) | Uncomment the Plausible block and set `REPLACE_ME_YOURDOMAIN.example` to your site hostname; you can remove or leave the Cloudflare block |

If you leave the Cloudflare token as `REPLACE_ME_…`, the script does nothing (no extra requests).

---

## 4. Social profile URLs (footer + JSON-LD)

**Replace in both places** so links and `sameAs` match:

- `javascript/index.js` &mdash; `FOOTER_TEMPLATE` (social `<a href="…">` links)
- `partials/footer.html` &mdash; same four links (must stay in sync with the template; run `npm run check` from `ctu/`)

**Pattern:**

| Placeholder | Example real value |
| --- | --- |
| `https://facebook.com/REPLACE_ME` | Your public Facebook page URL |
| `https://twitter.com/REPLACE_ME` | X/Twitter profile URL |
| `https://instagram.com/REPLACE_ME` | Instagram profile URL |
| `https://linkedin.com/company/REPLACE_ME` | LinkedIn company page URL |

**File:** `index.html` &mdash; **LocalBusiness** JSON-LD `sameAs` array (same four URLs).

---

## 5. Google Business Profile

**File:** `pages/gaq.html`  
**Replace:** `REPLACE_ME_GBP_URL` in the "View us on Google" button `href`  
**With:** The share / maps URL for your [Google Business Profile](https://business.google.com) listing.

You can remove or shorten the nearby placeholder note in the same section once the link is real.

---

## 6. Open Graph & Twitter images (1200×630)

**Folder:** `images/og/`

**Replace:** Missing image files. Meta tags already point to paths like `https://YOUR_DOMAIN/images/og/og-home.jpg`.

See `images/og/README.md` for the full filename list. Until these JPEGs exist, social previews may 404 or show a broken image.

| Filenames (examples) |
| --- |
| `og-home.jpg`, `og-services.jpg`, `og-cctv.jpg`, `og-elec.jpg`, `og-network.jpg`, `og-about.jpg`, `og-case-scenarios.jpg`, `og-faq.jpg`, `og-gaq.jpg` |
| `cctv-jinja.jpg`, `cctv-kampala.jpg`, `electrical-kampala.jpg` |
| `blog.jpg`, `first-post.jpg` |

---

## 7. Google Maps iframes (optional accuracy pass)

**Files:** `pages/gaq.html` (contact section), `pages/cctv-jinja.html`, and other service-area pages with `.map-embed` iframes.

**Replace:** Generic `google.com/maps?q=…&output=embed` URLs  
**With:** "Share &rarr; Embed a map" URL for your **exact** business pin, once you are happy with the location.

---

## 8. PWA / touch icon (optional)

The plan called for a 180×180 `apple-touch-icon.png`. The site may still reference `favicon.svg` in some `<head>` blocks. If you add `apple-touch-icon.png`, add `<link rel="apple-touch-icon" href="…">` in each page or keep SVG-only for simplicity.

**File to check:** `site.webmanifest` (icons) &mdash; update if you add PNG icons.

---

## 9. Content marked as placeholder (not search strings)

Swap real copy, photos, and names when you have them:

- **Home** &mdash; testimonials, trust row, any "PLACEHOLDER" client labels
- **Case Scenarios** &mdash; featured case studies and `PLACEHOLDER_PROJECT_*.jpg` / similar
- **About** &mdash; team section (placeholder avatars and bios)
- **Blog** &mdash; second post slot on `blog/index.html`

---

## 10. After you edit `partials/*.html`

Header/footer live in **`javascript/index.js`** as `HEADER_TEMPLATE` / `FOOTER_TEMPLATE`. If you only edit `partials/header.html` or `partials/footer.html`, copy the same HTML into `index.js` or the site will not match on `file://` and production.

**Verify:** from the `ctu` folder, run `npm run check` (after `npm install` once).

---

## 11. Build / deploy (optional but recommended)

From `ctu/`:

```bash
npm install
npm run build
```

This refreshes `sitemap.xml` dates, optimises images, and checks template sync. Tighten `_headers` **Content-Security-Policy** in `_headers` if you add new third-party scripts (e.g. another analytics provider).

---

## Quick search cheat sheet

| Search for | What it is |
| --- | --- |
| `REPLACE_ME.example` | Production URL |
| `REPLACE_ME_FORMSPREE_ID` | Formspree form ID |
| `REPLACE_ME_CF_TOKEN` | Cloudflare Web Analytics |
| `REPLACE_ME_GBP_URL` | Google Business Profile link |
| `facebook.com/REPLACE_ME` (and twitter / instagram / linkedin) | Social URLs |
| `PLACEHOLDER` | Content still to be written (grep is noisy; use page-by-page) |
