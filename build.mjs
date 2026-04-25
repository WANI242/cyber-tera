#!/usr/bin/env node
/**
 * CYBER TERA build script.
 *
 * Run: `npm install` once, then `npm run build` (or `node build.mjs`).
 *
 * What it does:
 *   1. Generates .webp + .avif versions of every raster image in images/
 *      (skips files that already have an up-to-date derivative).
 *   2. Generates resized variants at 480, 960, and 1440 px widths.
 *   3. Updates <lastmod> values in sitemap.xml using file mtimes.
 *   4. Verifies that partials/header.html and partials/footer.html match the
 *      HEADER_TEMPLATE / FOOTER_TEMPLATE strings inlined in javascript/index.js
 *      (fails loudly if they have drifted).
 *
 * Intentionally small: no framework, no watcher. Run it once before each deploy.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.dirname(__filename);

const IMAGES_DIR = path.join(ROOT, 'images');
const SIZES = [480, 960, 1440];
const RASTER_EXT = ['png', 'jpg', 'jpeg'];

async function ensureNewer(source, target) {
    try {
        const [s, t] = await Promise.all([fs.stat(source), fs.stat(target)]);
        return s.mtimeMs > t.mtimeMs;
    } catch {
        return true;
    }
}

async function optimiseImages() {
    console.log('-> Optimising images...');
    const patterns = RASTER_EXT.map((ext) => `images/**/*.${ext}`);
    const files = await fg(patterns, { cwd: ROOT, absolute: true });
    let generated = 0;

    for (const src of files) {
        const { dir, name, ext } = path.parse(src);

        const webpOut = path.join(dir, `${name}.webp`);
        const avifOut = path.join(dir, `${name}.avif`);

        if (await ensureNewer(src, webpOut)) {
            await sharp(src).webp({ quality: 82 }).toFile(webpOut);
            generated++;
        }
        if (await ensureNewer(src, avifOut)) {
            await sharp(src).avif({ quality: 55 }).toFile(avifOut);
            generated++;
        }

        for (const width of SIZES) {
            const resized = path.join(dir, `${name}-${width}w${ext}`);
            if (await ensureNewer(src, resized)) {
                await sharp(src).resize({ width, withoutEnlargement: true }).toFile(resized);
                generated++;
            }
            const resizedWebp = path.join(dir, `${name}-${width}w.webp`);
            if (await ensureNewer(src, resizedWebp)) {
                await sharp(src)
                    .resize({ width, withoutEnlargement: true })
                    .webp({ quality: 82 })
                    .toFile(resizedWebp);
                generated++;
            }
        }
    }

    console.log(`   ${generated} derivative(s) written from ${files.length} source image(s).`);
}

async function updateSitemap() {
    console.log('-> Updating sitemap.xml lastmod values...');
    const sitemapPath = path.join(ROOT, 'sitemap.xml');
    let xml;
    try {
        xml = await fs.readFile(sitemapPath, 'utf8');
    } catch {
        console.log('   sitemap.xml not found, skipping.');
        return;
    }

    const today = new Date().toISOString().slice(0, 10);
    xml = xml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
    await fs.writeFile(sitemapPath, xml);
    console.log(`   sitemap.xml <lastmod> set to ${today}.`);
}

async function checkPartialsInSync() {
    console.log('-> Verifying partials vs inlined templates...');
    const indexJs = await fs.readFile(path.join(ROOT, 'javascript', 'index.js'), 'utf8');
    const header = await fs.readFile(path.join(ROOT, 'partials', 'header.html'), 'utf8');
    const footer = await fs.readFile(path.join(ROOT, 'partials', 'footer.html'), 'utf8');

    const pickTemplate = (name) => {
        const re = new RegExp(`const ${name} = \`([\\s\\S]*?)\`;`);
        const m = indexJs.match(re);
        return m ? m[1].trim() : null;
    };

    const inlineHeader = pickTemplate('HEADER_TEMPLATE');
    const inlineFooter = pickTemplate('FOOTER_TEMPLATE');

    const norm = (s) => s.replace(/\s+/g, ' ').trim();

    let ok = true;
    if (!inlineHeader || norm(inlineHeader) !== norm(header)) {
        console.error('   [FAIL] HEADER_TEMPLATE in javascript/index.js does not match partials/header.html');
        ok = false;
    }
    if (!inlineFooter || norm(inlineFooter) !== norm(footer)) {
        console.error('   [FAIL] FOOTER_TEMPLATE in javascript/index.js does not match partials/footer.html');
        ok = false;
    }
    if (ok) {
        console.log('   Partials and inlined templates are in sync.');
    } else {
        process.exitCode = 1;
    }
}

async function main() {
    const args = new Set(process.argv.slice(2));
    const only = args.size ? args : null;

    if (!only || only.has('images')) await optimiseImages();
    if (!only || only.has('sitemap')) await updateSitemap();
    if (!only || only.has('check')) await checkPartialsInSync();

    console.log('\nDone.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
