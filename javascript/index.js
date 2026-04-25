// CYBER TERA shared client script
// Responsibilities:
//   1. Inject shared header + footer into every page (templates inlined
//      below so the site also works from file:// without a local server;
//      partials/*.html are kept in the repo as a human-readable copy).
//   2. Inject persistent UI: floating WhatsApp + mobile "Get a quote"
//      button, scroll-to-top button.
//   3. Initialise the hamburger menu after the header is in the DOM.
//   4. Mark the active nav link and dispatch `partialsLoaded`.

const BASE = document.documentElement.dataset.base || '';
const CONTACT_WHATSAPP = 'https://wa.me/256705271978';
const QUOTE_PATH = 'pages/gaq.html';

const HEADER_TEMPLATE = `
<div class="logo">
    <a href="{{BASE}}index.html" aria-label="CYBER TERA Uganda home">
        <img src="{{BASE}}images/web_logo.svg" alt="CYBER TERA Uganda" width="72" height="72">
    </a>
</div>
<nav class="menu-links" aria-label="Primary">
    <p><a href="{{BASE}}index.html">HOME</a></p>
    <p><a href="{{BASE}}pages/services.html">SERVICES</a></p>
    <p><a href="{{BASE}}pages/case-scenarios.html">CASE SCENARIOS</a></p>
    <p><a href="{{BASE}}pages/about.html">ABOUT US</a></p>
    <p><a href="{{BASE}}blog/index.html">BLOG</a></p>
    <p><a href="{{BASE}}pages/faq.html">FAQ</a></p>
</nav>
<div class="btn">
    <a class="btn-cta" href="{{BASE}}pages/gaq.html">GET A QUOTE</a>
</div>
<button class="hamburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-menu">
    <span></span>
    <span></span>
    <span></span>
</button>
`;

const FOOTER_TEMPLATE = `
<div class="footer-section links">
    <h3>Quick Links</h3>
    <ul>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#home"/></svg><a href="{{BASE}}index.html">Home</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#cogs"/></svg><a href="{{BASE}}pages/services.html">Services</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#briefcase"/></svg><a href="{{BASE}}pages/case-scenarios.html">Case Scenarios</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#info-circle"/></svg><a href="{{BASE}}pages/about.html">About</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#file-signature"/></svg><a href="{{BASE}}blog/index.html">Blog</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#envelope"/></svg><a href="{{BASE}}pages/gaq.html#contact">Contact</a></li>
    </ul>
</div>
<div class="footer-section contact">
    <h3>Contact</h3>
    <ul class="contact-info">
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#envelope"/></svg> <a href="mailto:cyberteraug@gmail.com">cyberteraug@gmail.com</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#phone"/></svg> <a href="tel:+256705271978">+256 705 271 978</a></li>
        <li><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#map-marker"/></svg> The Innovation Village, Plot 5 Main Street, Jinja City</li>
    </ul>
</div>
<div class="footer-section">
    <h3>Follow Us</h3>
    <div class="footer-social">
        <a href="https://facebook.com/REPLACE_ME" aria-label="Facebook" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#facebook"/></svg></a>
        <a href="https://twitter.com/REPLACE_ME" aria-label="Twitter / X" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#twitter"/></svg></a>
        <a href="https://instagram.com/REPLACE_ME" aria-label="Instagram" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#instagram"/></svg></a>
        <a href="https://linkedin.com/company/REPLACE_ME" aria-label="LinkedIn" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="{{BASE}}images/icons.svg#linkedin"/></svg></a>
    </div>
</div>
<div class="footer-section faq">
    <a href="{{BASE}}pages/faq.html">
        <h3>FAQ</h3>
        <p>Have questions about our services? You'll find answers to some of the most common inquiries on our FAQ page. If you don't see what you're looking for, please don't hesitate to contact us directly!</p>
    </a>
</div>
<div class="footer-bottom">
    &copy; 2026 CYBER TERA UGANDA LIMITED. All rights reserved. &middot; <a href="{{BASE}}privacy.html">Privacy Policy</a>
</div>
`;

function renderTemplate(template) {
    return template.replace(/\{\{BASE\}\}/g, BASE);
}

function injectPartial(id, template) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = renderTemplate(template);
}

function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const menuLinks = document.querySelector('.menu-links');
    if (!hamburger || !menuLinks) return;

    const toggleMenu = () => {
        const isOpen = menuLinks.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    const closeMenu = () => {
        menuLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
    };

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', toggleMenu);

    menuLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
}

function markActiveNav() {
    const here = window.location.pathname.replace(/\/index\.html$/, '/').toLowerCase();
    document.querySelectorAll('.menu-links a').forEach((link) => {
        const target = new URL(link.href, window.location.href).pathname.toLowerCase();
        if (target === here || (target.endsWith('/') && here.endsWith(target))) {
            link.setAttribute('aria-current', 'page');
        }
    });
}

function injectFloaters() {
    if (document.querySelector('.site-floaters')) return;

    const onQuotePage = /gaq\.html$/.test(window.location.pathname);
    const quoteHref = BASE + QUOTE_PATH;

    const wrapper = document.createElement('div');
    wrapper.className = 'site-floaters';
    wrapper.innerHTML = `
        ${onQuotePage ? '' : `
        <a class="floater floater--quote" href="${quoteHref}" aria-label="Get a quote">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v6h6M9 14h6M9 18h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Get a quote</span>
        </a>`}
        <a class="floater floater--whatsapp" href="${CONTACT_WHATSAPP}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.846 2.722.846.989 0 2.116-.76 2.415-1.832.074-.3.13-.61.13-.916 0-.158-.041-.259-.157-.358-.241-.18-2.235-.934-2.435-.934zM16.002 4C9.373 4 4 9.373 4 16c0 2.355.682 4.554 1.86 6.403L4 28.95l6.668-2.134A11.98 11.98 0 0 0 16.002 28C22.628 28 28 22.627 28 16c0-6.625-5.372-12-12-12z"/></svg>
            <span>WhatsApp</span>
        </a>
    `;
    document.body.appendChild(wrapper);
}

function injectScrollToTop() {
    if (document.querySelector('.scroll-top')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.hidden = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    const onScroll = () => {
        btn.hidden = window.scrollY < 500;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function loadAnalytics() {
    const s = document.createElement('script');
    s.defer = true;
    s.src = BASE + 'javascript/analytics.js';
    document.head.appendChild(s);
}

function boot() {
    injectPartial('site-header', HEADER_TEMPLATE);
    injectPartial('site-footer', FOOTER_TEMPLATE);
    initHamburger();
    markActiveNav();
    injectFloaters();
    injectScrollToTop();
    loadAnalytics();
    document.dispatchEvent(new CustomEvent('partialsLoaded'));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
