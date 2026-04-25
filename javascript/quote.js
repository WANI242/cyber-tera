// Quote form submission handler for CYBER TERA.
// Submits to Formspree via fetch(); protects against basic abuse with a
// honeypot + 60s rate limit. Surfaces validation errors inline per field
// rather than one banner.
//
// To wire up Formspree:
//   1. Create a form at https://formspree.io/forms
//   2. Copy the form ID (looks like "xayzqwer") into FORMSPREE_ENDPOINT below.
//   3. No further setup needed - responses will arrive in your Formspree inbox
//      and can be forwarded to any email address.
//
// If you prefer to stay with EmailJS, the previous implementation is preserved
// in git history.

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME_FORMSPREE_ID';
const RATE_LIMIT_MS = 60 * 1000;
const RATE_LIMIT_KEY = 'ctu:lastQuoteSubmit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s().-]{6,}$/;

function showBanner(banner, kind, message) {
    if (!banner) return;
    banner.textContent = message;
    banner.className = 'form-banner ' + kind;
    banner.hidden = false;
    banner.setAttribute('role', kind === 'error' ? 'alert' : 'status');
}

function hideBanner(banner) {
    if (!banner) return;
    banner.hidden = true;
    banner.textContent = '';
}

function rateLimited() {
    try {
        const last = Number(localStorage.getItem(RATE_LIMIT_KEY) || 0);
        return last && (Date.now() - last) < RATE_LIMIT_MS;
    } catch (_) {
        return false;
    }
}

function stampSubmitted() {
    try {
        localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    } catch (_) {
        /* storage unavailable; best effort only */
    }
}

function setFieldError(field, message) {
    if (!field) return;
    const errId = field.getAttribute('aria-describedby');
    const errEl = errId ? document.getElementById(errId) : null;
    if (message) {
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('is-invalid');
        if (errEl) errEl.textContent = message;
    } else {
        field.removeAttribute('aria-invalid');
        field.classList.remove('is-invalid');
        if (errEl) errEl.textContent = '';
    }
}

function validateField(field) {
    if (!field) return true;
    const name = field.name;
    const value = (field.value || '').trim();

    if (name === 'consent') {
        if (!field.checked) {
            setFieldError(field, 'Please accept the privacy policy to continue.');
            return false;
        }
        setFieldError(field, '');
        return true;
    }

    if (field.required && !value) {
        setFieldError(field, 'This field is required.');
        return false;
    }
    if (name === 'email' && value && !EMAIL_RE.test(value)) {
        setFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    if (name === 'phone' && value && !PHONE_RE.test(value)) {
        setFieldError(field, 'Please enter a valid phone number.');
        return false;
    }
    if (name === 'description' && value.length < 10) {
        setFieldError(field, 'Please give us a little more detail (at least 10 characters).');
        return false;
    }

    setFieldError(field, '');
    return true;
}

function validateAll(form) {
    const fields = [
        form.elements.name,
        form.elements.email,
        form.elements.phone,
        form.elements.service,
        form.elements.description,
        form.elements['contact-method'],
        form.elements.location,
        form.elements.consent,
    ];
    let firstInvalid = null;
    fields.forEach((f) => {
        const ok = validateField(f);
        if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus();
    }
    return !firstInvalid;
}

function attachLiveValidation(form) {
    const validators = ['name', 'email', 'phone', 'service', 'description', 'contact-method', 'location'];
    validators.forEach((n) => {
        const field = form.elements[n];
        if (!field) return;
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) validateField(field);
        });
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', () => validateField(field));
        }
    });
    const consent = form.elements.consent;
    if (consent) {
        consent.addEventListener('change', () => validateField(consent));
    }
}

function initQuoteForm() {
    const form = document.getElementById('quoteForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const banner = document.getElementById('form-banner');
    const submitDefaultText = submitBtn ? submitBtn.textContent : 'Submit';

    attachLiveValidation(form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideBanner(banner);

        if (form.elements.website && form.elements.website.value) {
            stampSubmitted();
            showBanner(banner, 'success', "Thanks! We'll get back to you soon.");
            form.reset();
            return;
        }

        if (!validateAll(form)) {
            showBanner(banner, 'error', 'Please fix the highlighted fields and try again.');
            return;
        }

        if (rateLimited()) {
            showBanner(banner, 'error', 'You just submitted a request. Please wait a minute before sending another.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        const payload = {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            phone: form.elements.phone.value.trim(),
            service: form.elements.service.value,
            description: form.elements.description.value.trim(),
            contact_method: form.elements['contact-method'].value,
            location: form.elements.location.value.trim(),
            _subject: `New quote request from ${form.elements.name.value.trim()}`,
        };

        try {
            if (FORMSPREE_ENDPOINT.includes('REPLACE_ME')) {
                throw new Error('Formspree endpoint not configured. Edit javascript/quote.js and set FORMSPREE_ENDPOINT.');
            }
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || `Formspree responded with ${response.status}`);
            }
            stampSubmitted();
            showBanner(banner, 'success', "Thank you! Your quote request has been sent. We'll get back to you within 24 hours.");
            form.reset();
        } catch (err) {
            console.error('Quote submission error:', err);
            showBanner(banner, 'error', 'Sorry, we could not send your request. Please try again, or email us directly at cyberteraug@gmail.com.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitDefaultText;
            }
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuoteForm);
} else {
    initQuoteForm();
}
