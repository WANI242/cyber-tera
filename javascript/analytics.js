// Privacy-friendly analytics loader.
//
// Pick ONE of the options below by uncommenting it. Both are privacy-friendly
// (no cookies, no personal data, no consent banner required under GDPR):
//
//   1. Cloudflare Web Analytics  - free, tied to your Cloudflare account.
//   2. Plausible                 - paid (~$9/mo), open-source, EU-hosted.
//
// Once enabled, drop <script src="javascript/analytics.js" defer></script>
// into the <head> of every page OR include it from index.js.

(function () {
    'use strict';

    // --- Option 1: Cloudflare Web Analytics ---------------------------------
    // Get your token at https://dash.cloudflare.com/?to=/:account/web-analytics
    const CLOUDFLARE_TOKEN = 'REPLACE_ME_CF_TOKEN';
    if (CLOUDFLARE_TOKEN && !CLOUDFLARE_TOKEN.includes('REPLACE_ME')) {
        const s = document.createElement('script');
        s.defer = true;
        s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
        s.setAttribute('data-cf-beacon', JSON.stringify({ token: CLOUDFLARE_TOKEN }));
        document.head.appendChild(s);
        return;
    }

    // --- Option 2: Plausible ------------------------------------------------
    // const PLAUSIBLE_DOMAIN = 'REPLACE_ME_YOURDOMAIN.example';
    // if (PLAUSIBLE_DOMAIN && !PLAUSIBLE_DOMAIN.includes('REPLACE_ME')) {
    //     const s = document.createElement('script');
    //     s.defer = true;
    //     s.src = 'https://plausible.io/js/script.js';
    //     s.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    //     document.head.appendChild(s);
    //     return;
    // }
})();
