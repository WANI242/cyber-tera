# Self-hosting the webfont

The site currently loads Inter from Google Fonts (`<link rel="stylesheet" href="https://fonts.googleapis.com/..." />` in each page's `<head>`). That works, but adds a DNS lookup + TLS handshake on first paint.

## How to self-host (30 minutes)

1. Grab a subset of Inter from <https://fonts.google.com/specimen/Inter> or use [google-webfonts-helper](https://gwfh.mranftl.com/fonts/inter) to download just the `.woff2` files you need. For this site, the used weights are **400, 600, 700** (Latin subset only).
2. Drop the resulting files into this folder, e.g.:
    - `inter-latin-400.woff2`
    - `inter-latin-600.woff2`
    - `inter-latin-700.woff2`
3. Add an `@font-face` block near the top of `ctu/css/styles.css`:
    ```css
    @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('../fonts/inter-latin-400.woff2') format('woff2');
    }
    /* repeat for 600 and 700 */
    ```
4. Remove the three `fonts.googleapis.com` / `fonts.gstatic.com` lines from every page's `<head>` (search the repo for `fonts.googleapis.com`).
5. Optionally add `<link rel="preload" as="font" type="font/woff2" href="../fonts/inter-latin-400.woff2" crossorigin>` to the most important pages (`index.html`, `services.html`) to shave ~100ms off first render.

The CSS variable `--font-sans` in `ctu/css/styles.css` already falls back to `system-ui` if Inter fails to load, so nothing breaks in the interim.
